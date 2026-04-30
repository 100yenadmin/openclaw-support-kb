#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  canonicalSourceDir,
  compareSemver,
  GBRAIN_SOURCE_ID,
  GBRAIN_VERIFY_QUERIES,
  isLegacyPreGitBackupName,
  meaningfulGitStatusLines,
  readGbrainSourceInfo,
  pathExists,
  readJsonIfExists,
  resolveGbrainCommand,
  validateGbrainSearchOutput,
} from "./lib/openclaw-support-kb.mjs";

const EXPECTED_SKILLS = [
  "openclaw-support-kb",
  "openclaw-config-repair",
  "openclaw-skill-discovery",
  "openclaw-support-escalation",
];

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printUsage();
  process.exit(0);
}

const targetDir = process.env.OPENCLAW_SUPPORT_KB_DIR || canonicalSourceDir();
const home = os.homedir();
const stateDir = process.env.OPENCLAW_SUPPORT_KB_STATE_DIR || path.join(home, ".gbrain", "state");
const lockDir = process.env.OPENCLAW_SUPPORT_KB_LOCK_DIR || path.join(home, ".gbrain", "locks");
const statusPath = process.env.OPENCLAW_SUPPORT_KB_STATUS_FILE || path.join(stateDir, "openclaw-support-kb-update.json");
const checkpointPath =
  process.env.OPENCLAW_SUPPORT_KB_IMPORT_CHECKPOINT_FILE || path.join(home, ".gbrain", "import-checkpoint.json");
const lockPath = path.join(lockDir, "openclaw-support-kb-update.lock");
const lockOwnerPath = path.join(lockPath, "owner.json");
const staleCheckpointMs = Number(process.env.OPENCLAW_SUPPORT_KB_CHECKPOINT_STALE_MS || 30 * 60 * 1000);
const skillsDir = process.env.OPENCLAW_SKILLS_DIR || path.join(home, ".openclaw", "skills");
const skipSearch = process.env.OPENCLAW_SUPPORT_KB_STATUS_SKIP_SEARCH === "1";

function printUsage() {
  console.log(`Usage: node scripts/status.mjs [options]

Options:
  --json              Print machine-readable install status.
  --watch             Refresh until interrupted.
  --interval-ms N     Watch refresh interval. Defaults to 5000.
  -h, --help          Show this help.
`);
}

function parseArgs(argv) {
  const parsed = { json: false, watch: false, intervalMs: 5000, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      parsed.json = true;
      continue;
    }
    if (arg === "--watch") {
      parsed.watch = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--interval-ms") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value <= 0) {
        console.error("Missing or invalid value for --interval-ms.");
        process.exit(2);
      }
      parsed.intervalMs = value;
      index += 1;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    printUsage();
    process.exit(2);
  }
  return parsed;
}

function captureNoExit(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, { encoding: "utf8", ...options });
  if (result.error?.code === "ENOENT") return { missing: true };
  return { status: result.status ?? 1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function processIsRunning(pid) {
  const parsed = Number(pid);
  if (!Number.isInteger(parsed) || parsed <= 0) return false;
  try {
    process.kill(parsed, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

async function readJsonFile(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function fileAgeMs(filePath) {
  try {
    const info = await stat(filePath);
    return Date.now() - info.mtimeMs;
  } catch {
    return null;
  }
}

async function readLock() {
  if (!(await pathExists(lockPath))) return { exists: false, active: false, stale: false };
  const owner = await readJsonFile(lockOwnerPath);
  const active = processIsRunning(owner?.pid);
  const ageMs = owner?.startedAt ? Date.now() - Date.parse(owner.startedAt) : await fileAgeMs(lockPath);
  const stale = !active && Number.isFinite(ageMs) && ageMs > staleCheckpointMs;
  return { exists: true, active, stale, owner: owner ?? null, ageMs };
}

async function readCheckpoint(lock) {
  const checkpoint = await readJsonFile(checkpointPath);
  if (!checkpoint) return { exists: false, stale: false };
  const relevant = path.resolve(checkpoint.dir || "") === path.resolve(targetDir);
  const totalFiles = Number(checkpoint.totalFiles || 0);
  const completedFiles = Number(checkpoint.completedFiles ?? checkpoint.processedIndex ?? 0);
  const incomplete = relevant && totalFiles > 0 && completedFiles < totalFiles;
  const timestampAgeMs = checkpoint.timestamp ? Date.now() - Date.parse(checkpoint.timestamp) : null;
  const mtimeAgeMs = await fileAgeMs(checkpointPath);
  const ageMs = Number.isFinite(timestampAgeMs) ? timestampAgeMs : mtimeAgeMs;
  const stale = incomplete && !lock.active && Number.isFinite(ageMs) && ageMs > staleCheckpointMs;
  return {
    exists: true,
    path: checkpointPath,
    relevant,
    incomplete,
    stale,
    ageMs,
    totalFiles,
    completedFiles,
    raw: checkpoint,
  };
}

async function installedSkills() {
  const entries = [];
  for (const skill of EXPECTED_SKILLS) {
    const skillPath = path.join(skillsDir, skill, "SKILL.md");
    entries.push({ id: skill, installed: await pathExists(skillPath), path: skillPath });
  }
  return entries;
}

function readGbrain(minGbrainVersion) {
  const resolved = resolveGbrainCommand({ captureNoExit });
  const versionText = `${resolved.check?.stdout ?? ""} ${resolved.check?.stderr ?? ""}`.trim();
  const versionCompare =
    minGbrainVersion && resolved.check?.status === 0 ? compareSemver(versionText, minGbrainVersion) : null;
  return {
    command: resolved.command,
    missing: Boolean(resolved.check?.missing),
    versionStatus: resolved.check?.status ?? null,
    versionText,
    minGbrainVersion: minGbrainVersion ?? null,
    tooOld: versionCompare === -1,
  };
}

function readSourceRegistry(gbrain) {
  if (gbrain.missing || gbrain.versionStatus !== 0) return { checked: false, reason: "gbrain unavailable" };
  const info = readGbrainSourceInfo({ captureNoExit, gbrainCommand: gbrain.command, sourceId: GBRAIN_SOURCE_ID });
  if (info.result?.missing) return { checked: false, reason: "gbrain unavailable" };
  if (!info.ok) {
    return {
      checked: true,
      supported: false,
      status: info.result?.status ?? 1,
      output: `${info.result?.stdout ?? ""}\n${info.result?.stderr ?? ""}`.trim(),
    };
  }
  const source = info.source;
  return {
    checked: true,
    supported: true,
    found: source.found,
    pageCount: source.pageCount,
    localPath: source.localPath,
    localPathKnown: Boolean(source.localPathKnown),
    pathMatchesTarget: source.found && source.localPathKnown ? path.resolve(source.localPath || "") === path.resolve(targetDir) : null,
    line: source.line,
  };
}

function readSearch(gbrain) {
  if (skipSearch) return { checked: false, skipped: true };
  if (gbrain.missing || gbrain.versionStatus !== 0 || gbrain.tooOld) {
    return { checked: false, reason: "gbrain unavailable" };
  }

  const checks = [];
  for (const item of GBRAIN_VERIFY_QUERIES) {
    const result = captureNoExit(gbrain.command, ["search", item.query, "--source", GBRAIN_SOURCE_ID]);
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    const verified =
      result.status === 0
        ? validateGbrainSearchOutput(output, { strictPatterns: item.strictPatterns })
        : { ok: false, reason: `gbrain search exited ${result.status ?? 1}` };
    checks.push({
      label: item.label,
      ok: verified.ok,
      reason: verified.reason ?? "",
    });
  }
  return { checked: true, checks };
}

function readCrontab() {
  const result = captureNoExit("crontab", ["-l"]);
  if (result.missing) return { checked: false, installed: false, reason: "crontab unavailable" };
  if (result.status !== 0) return { checked: true, installed: false, reason: result.stderr.trim() || "no crontab" };
  return {
    checked: true,
    installed: /openclaw-support-kb:auto-update/.test(result.stdout),
  };
}

function readSourceGitStatus(sourceIsGit) {
  if (!sourceIsGit) return { checked: false, dirty: false, files: [] };
  const result = captureNoExit("git", ["-C", targetDir, "status", "--porcelain"]);
  if (result.status !== 0) {
    return { checked: true, dirty: true, error: `${result.stdout}\n${result.stderr}`.trim(), files: [] };
  }
  const files = meaningfulGitStatusLines(result.stdout);
  return { checked: true, dirty: files.length > 0, files };
}

async function readLegacySourceBackups() {
  const sourcesDir = path.dirname(targetDir);
  let entries = [];
  try {
    entries = await readdir(sourcesDir, { withFileTypes: true });
  } catch {
    return { checked: false, sourcesDir, entries: [] };
  }
  const backups = entries
    .filter((entry) => entry.isDirectory() && isLegacyPreGitBackupName(entry.name, targetDir))
    .map((entry) => path.join(sourcesDir, entry.name));
  return { checked: true, sourcesDir, entries: backups };
}

async function collectStatus() {
  const sourceExists = await pathExists(targetDir);
  const sourceIsGit = await pathExists(path.join(targetDir, ".git"));
  const sourceGitStatus = readSourceGitStatus(sourceIsGit);
  const manifest = (await readJsonIfExists(path.join(targetDir, "kb-manifest.json"))) ?? null;
  const skills = await installedSkills();
  const lock = await readLock();
  const checkpoint = await readCheckpoint(lock);
  const legacyBackups = await readLegacySourceBackups();
  const gbrain = readGbrain(manifest?.minGbrainVersion);
  const sourceRegistry = readSourceRegistry(gbrain);
  const search = readSearch(gbrain);
  const crontab = readCrontab();

  const problems = [];
  if (!lock.active) {
    if (!sourceExists) problems.push("support KB source directory is missing");
    else if (!sourceIsGit) problems.push("support KB source directory is not a git checkout");
    else if (sourceGitStatus.dirty) problems.push("support KB source checkout has local changes");
    if (!manifest) problems.push("kb-manifest.json is missing or unreadable");
    for (const skill of skills) {
      if (!skill.installed) problems.push(`missing support skill ${skill.id}`);
    }
    if (gbrain.missing) problems.push("gbrain command is missing");
    else if (gbrain.versionStatus !== 0) problems.push("gbrain --version failed");
    else if (gbrain.tooOld) problems.push(`gbrain is older than required ${gbrain.minGbrainVersion}`);
    if (checkpoint.stale) problems.push("GBrain import checkpoint is stale and incomplete");
    if (legacyBackups.entries.length > 0) {
      problems.push("legacy pre-git support KB backup directories remain under GBrain sources");
    }
    if (sourceRegistry.supported && !sourceRegistry.found) problems.push(`${GBRAIN_SOURCE_ID} source is not registered`);
    if (sourceRegistry.supported && sourceRegistry.found && sourceRegistry.pathMatchesTarget === false) {
      problems.push(`${GBRAIN_SOURCE_ID} source points at ${sourceRegistry.localPath || "no path"} instead of ${targetDir}`);
    }
    if (sourceRegistry.supported && sourceRegistry.pageCount === 0) {
      problems.push(`${GBRAIN_SOURCE_ID} source has 0 indexed pages`);
    }
    if (search.checked) {
      for (const item of search.checks) {
        if (!item.ok) problems.push(`search verification failed: ${item.label}`);
      }
    }
  }

  const status = lock.active ? "running" : problems.length === 0 ? "healthy" : "repair-needed";
  return {
    ok: status === "healthy" || status === "running",
    status,
    targetDir,
    source: { exists: sourceExists, isGit: sourceIsGit, gitStatus: sourceGitStatus },
    manifest,
    skillsDir,
    skills,
    lock,
    checkpoint,
    legacyBackups,
    gbrain,
    sourceRegistry,
    search,
    crontab,
    problems,
    checkedAt: new Date().toISOString(),
  };
}

function printHuman(status) {
  console.log(`OpenClaw Support KB: ${status.status}`);
  console.log(`Source: ${status.targetDir}`);
  if (status.manifest) {
    console.log(
      `Manifest: ${status.manifest.channel ?? "unknown"} ${status.manifest.openclawReleaseTag ?? "unknown"} (${status.manifest.sourceCount ?? "unknown"} sources)`,
    );
  }
  if (status.gbrain.versionText) console.log(`GBrain: ${status.gbrain.command} ${status.gbrain.versionText}`);
  if (status.sourceRegistry.supported) {
    console.log(`GBrain source pages: ${status.sourceRegistry.pageCount ?? "unknown"}`);
    if (status.sourceRegistry.localPath) console.log(`GBrain source path: ${status.sourceRegistry.localPath}`);
  }
  if (status.legacyBackups?.entries?.length) console.log(`Legacy source backups: ${status.legacyBackups.entries.length}`);
  if (status.lock.active) console.log("Update runner: active");
  if (status.checkpoint.exists && status.checkpoint.incomplete) {
    console.log(`Import checkpoint: ${status.checkpoint.completedFiles}/${status.checkpoint.totalFiles}`);
  }
  if (status.problems.length) {
    console.log("Problems:");
    for (const problem of status.problems) console.log(`- ${problem}`);
  }
}

async function printOnce() {
  const status = await collectStatus();
  if (args.json) console.log(JSON.stringify(status, null, 2));
  else printHuman(status);
  process.exitCode = status.ok ? 0 : 1;
  return status;
}

if (!args.watch) {
  await printOnce();
} else {
  for (;;) {
    const status = await collectStatus();
    if (args.json) console.log(JSON.stringify(status, null, 2));
    else printHuman(status);
    await new Promise((resolve) => setTimeout(resolve, args.intervalMs));
  }
}
