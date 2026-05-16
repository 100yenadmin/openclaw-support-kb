#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  compareSemver,
  CANONICAL_REPO_URL,
  canonicalSourceDir,
  ensureGbrainSource,
  gbrainSyncArgs,
  GBRAIN_VERIFY_QUERIES,
  isFullCommitSha,
  isOfficialRepoUrl,
  loadGbrainEnvFile,
  managedPreGitBackupDir,
  meaningfulGitStatusLines,
  normalizeRepoUrl,
  pathExists,
  readJsonIfExists,
  repoRootFromImportMeta,
  resolveGbrainCommand,
  SOURCE_MARKER_FILE,
  validateGbrainSearchOutput,
  verifyNamedGbrainSource,
  gbrainUpgradeHint,
  gbrainEmbedStaleArgs,
} from "./lib/openclaw-support-kb.mjs";

const DEFAULT_REPO_URL = CANONICAL_REPO_URL;
const repoRoot = repoRootFromImportMeta(import.meta.url);
const targetDir =
  process.env.OPENCLAW_SUPPORT_KB_DIR ||
  canonicalSourceDir();
const repoUrl =
  process.env.OPENCLAW_SUPPORT_KB_REPO ||
  (path.resolve(repoRoot) === path.resolve(targetDir) ? "" : DEFAULT_REPO_URL);
const branch = process.env.OPENCLAW_SUPPORT_KB_BRANCH || "main";
const allowNoGbrain = process.env.OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN === "1";
const allowUntrustedRepo = process.env.OPENCLAW_SUPPORT_KB_ALLOW_UNTRUSTED_REPO === "1";
const allowDevBuildSource = process.env.OPENCLAW_SUPPORT_KB_DEV_BUILD_SOURCE === "1";
const pinnedRef = process.env.OPENCLAW_SUPPORT_KB_PINNED_REF || "";
let gbrainCommand = "gbrain";

await loadGbrainEnvFile();

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.error?.code === "ENOENT") return { missing: true };
  if (result.status !== 0) process.exit(result.status ?? 1);
  return { ok: true };
}

function capture(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.error?.code === "ENOENT") return { missing: true };
  if (result.status !== 0) process.exit(result.status ?? 1);
  return { ok: true, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function captureNoExit(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.error?.code === "ENOENT") return { missing: true };
  return { status: result.status ?? 1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function failGbrainSourceRegistration(error) {
  console.error(error.message);
  if (error.stdout) console.error(error.stdout.trim());
  if (error.stderr) console.error(error.stderr.trim());
  process.exit(error.status ?? 1);
}

function verifyGbrainSearch() {
  if (process.env.OPENCLAW_SUPPORT_KB_SKIP_SEARCH_VERIFY === "1") {
    console.warn("Skipping GBrain search verification because OPENCLAW_SUPPORT_KB_SKIP_SEARCH_VERIFY=1 is set.");
    return;
  }
  const loose = process.env.OPENCLAW_SUPPORT_KB_LOOSE_SEARCH_VERIFY === "1";
  for (const item of GBRAIN_VERIFY_QUERIES) {
    const search = capture(gbrainCommand, ["search", item.query]);
    const output = `${search.stdout}\n${search.stderr}`;
    const verified = validateGbrainSearchOutput(output, {
      strictPatterns: loose ? [] : item.strictPatterns,
    });
    if (!verified.ok) {
      console.error(`GBrain search verification failed for ${item.label}: ${verified.reason}.`);
      console.error(`Query: ${item.query}`);
      console.error("Search output preview:");
      console.error(output.trim().slice(0, 4000) || "[empty]");
      process.exit(2);
    }
    if (loose) console.warn(`Loose GBrain search verification passed for ${item.label}.`);
  }
}

function ensureRepoTrust() {
  if (!repoUrl) return;
  if (isOfficialRepoUrl(repoUrl)) return;
  if (!allowUntrustedRepo) {
    console.error(
      `Refusing untrusted OPENCLAW_SUPPORT_KB_REPO=${repoUrl}. Use the official repo or set OPENCLAW_SUPPORT_KB_ALLOW_UNTRUSTED_REPO=1 with OPENCLAW_SUPPORT_KB_PINNED_REF for development.`,
    );
    process.exit(3);
  }
  if (!pinnedRef) {
    console.error("Refusing untrusted repo without OPENCLAW_SUPPORT_KB_PINNED_REF.");
    process.exit(3);
  }
  if (!isFullCommitSha(pinnedRef)) {
    console.error("Refusing untrusted repo: OPENCLAW_SUPPORT_KB_PINNED_REF must be a full 40-character commit SHA.");
    process.exit(3);
  }
}

function warnIfLocalCheckoutOriginIsUnexpected() {
  if (repoUrl || allowUntrustedRepo) return;
  const origin = captureNoExit("git", ["-C", repoRoot, "remote", "get-url", "origin"]);
  const originUrl = origin.stdout?.trim();
  if (origin.status === 0 && originUrl && !isOfficialRepoUrl(originUrl)) {
    console.warn(
      `Warning: local checkout origin is not the official repo (${originUrl}). The official repo is https://github.com/electricsheephq/openclaw-support-kb.git.`,
    );
  }
}

function ensureExistingTargetOriginMatchesTrustPolicy() {
  const origin = captureNoExit("git", ["-C", targetDir, "config", "--get", "remote.origin.url"]);
  if (origin.status !== 0) {
    console.error(`Refusing to update ${targetDir}: could not verify git origin.`);
    if (origin.stderr) console.error(origin.stderr.trim());
    process.exit(origin.status ?? 3);
  }
  const originUrl = origin.stdout.trim();
  if (isOfficialRepoUrl(repoUrl)) {
    if (isOfficialRepoUrl(originUrl)) {
      if (normalizeRepoUrl(originUrl) !== normalizeRepoUrl(DEFAULT_REPO_URL)) {
        run("git", ["-C", targetDir, "remote", "set-url", "origin", DEFAULT_REPO_URL]);
      }
      return;
    }
    console.error(`Refusing to update ${targetDir}: existing origin is not the official support KB repo (${originUrl}).`);
    process.exit(3);
  }
  if (normalizeRepoUrl(originUrl) !== normalizeRepoUrl(repoUrl)) {
    console.error(`Refusing to update ${targetDir}: existing origin ${originUrl} does not match ${repoUrl}.`);
    process.exit(3);
  }
}

async function directoryIsEmpty(dir) {
  try {
    return (await readdir(dir)).length === 0;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function cloneTarget() {
  run("git", ["clone", "--depth", "1", "--branch", branch, repoUrl, targetDir]);
  if (pinnedRef) {
    run("git", ["-C", targetDir, "fetch", "--depth", "1", "origin", pinnedRef]);
    run("git", ["-C", targetDir, "checkout", "--detach", "FETCH_HEAD"]);
  }
}

function checkoutHasLocalChanges() {
  const status = captureNoExit("git", ["-C", targetDir, "status", "--porcelain"]);
  if (status.status !== 0) {
    console.error(`Refusing to update ${targetDir}: could not inspect git status.`);
    if (status.stderr) console.error(status.stderr.trim());
    process.exit(status.status ?? 3);
  }
  return meaningfulGitStatusLines(status.stdout).length > 0;
}

async function migrateMarkedSourceToGitCheckout() {
  const markerPath = path.join(targetDir, SOURCE_MARKER_FILE);
  if (!(await pathExists(markerPath))) {
    console.error(
      `Refusing to clone into populated non-git directory ${targetDir}. Move it aside, empty it, or create ${SOURCE_MARKER_FILE} only for a managed OpenClaw support KB source.`,
    );
    process.exit(3);
  }

  const backupDir = managedPreGitBackupDir(targetDir);
  await mkdir(path.dirname(backupDir), { recursive: true });
  await rm(backupDir, { recursive: true, force: true });
  console.warn(`Migrating marked OpenClaw support KB source to git checkout. Backup retained at ${backupDir}`);
  await rename(targetDir, backupDir);
  try {
    cloneTarget();
  } catch (error) {
    await rm(targetDir, { recursive: true, force: true });
    await rename(backupDir, targetDir).catch(() => {});
    throw error;
  }
}

async function updateRepo() {
  ensureRepoTrust();
  if (!repoUrl) {
    if (path.resolve(repoRoot) === path.resolve(targetDir)) {
      if (await pathExists(path.join(targetDir, ".git"))) return;
      console.error(
        `Refusing to sync ${targetDir}: this support KB source is not a git checkout. Run scripts/run-client-update.mjs to migrate it to the published repo checkout, or reinstall from ${DEFAULT_REPO_URL}.`,
      );
      process.exit(3);
    }
    if (!allowDevBuildSource) {
      console.error(
        `Refusing to build a non-git support KB source at ${targetDir}. Use OPENCLAW_SUPPORT_KB_REPO=${DEFAULT_REPO_URL} for customer installs or set OPENCLAW_SUPPORT_KB_DEV_BUILD_SOURCE=1 for a local generated source.`,
      );
      process.exit(3);
    }
    if (await pathExists(path.join(targetDir, ".git"))) {
      console.error(`Refusing to build a generated dev source over git checkout ${targetDir}.`);
      process.exit(3);
    }
    run(process.execPath, [path.join(repoRoot, "scripts", "build-kb.mjs"), "--out", targetDir]);
    return;
  }

  await mkdir(path.dirname(targetDir), { recursive: true });
  if (await pathExists(path.join(targetDir, ".git"))) {
    ensureExistingTargetOriginMatchesTrustPolicy();
    if (checkoutHasLocalChanges()) {
      if (await pathExists(path.join(targetDir, SOURCE_MARKER_FILE))) {
        await migrateMarkedSourceToGitCheckout();
        return;
      }
      console.error(`Refusing to update dirty support KB checkout ${targetDir}; commit, stash, or move local changes first.`);
      process.exit(3);
    }
    run("git", ["-C", targetDir, "fetch", "--prune", "origin"]);
    if (pinnedRef) {
      run("git", ["-C", targetDir, "fetch", "--depth", "1", "origin", pinnedRef]);
      run("git", ["-C", targetDir, "checkout", "--detach", "FETCH_HEAD"]);
    } else {
      run("git", ["-C", targetDir, "checkout", branch]);
      run("git", ["-C", targetDir, "pull", "--ff-only", "origin", branch]);
    }
  } else {
    if ((await pathExists(targetDir)) && !(await directoryIsEmpty(targetDir))) {
      await migrateMarkedSourceToGitCheckout();
    } else {
      cloneTarget();
    }
  }
}

function verifyPinnedRef() {
  if (!pinnedRef) return;
  const head = capture("git", ["-C", targetDir, "rev-parse", "HEAD"]).stdout.trim();
  if (head !== pinnedRef) {
    console.error(`Refusing checkout: expected pinned ref ${pinnedRef}, got ${head}.`);
    process.exit(3);
  }
}

await updateRepo();
verifyPinnedRef();
warnIfLocalCheckoutOriginIsUnexpected();

const resolvedGbrain = resolveGbrainCommand({ captureNoExit });
gbrainCommand = resolvedGbrain.command;
const gbrainCheck = resolvedGbrain.check;
const runtimeRoot = await pathExists(path.join(targetDir, "scripts", "install-skills.mjs")) ? targetDir : repoRoot;
if (gbrainCheck.missing) {
  run(process.execPath, [path.join(runtimeRoot, "scripts", "install-skills.mjs")], {
    env: { ...process.env, OPENCLAW_SUPPORT_KB_DIR: targetDir },
  });
  if (allowNoGbrain) {
    console.warn(
      `gbrain not found. Proceeding only because OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1 is set. Skills will be installed, but the KB will not be indexed and agents must not claim GBrain-indexed results.`,
    );
    process.exit(0);
  }
  const message = `gbrain not found. KB source and skills are ready at ${targetDir}, but the KB was not indexed. Install GBrain, add it to PATH, or set GBRAIN_BIN=/path/to/gbrain.`;
  console.error(message);
  process.exit(2);
}
if (gbrainCheck.status !== 0) {
  run(process.execPath, [path.join(runtimeRoot, "scripts", "install-skills.mjs")], {
    env: { ...process.env, OPENCLAW_SUPPORT_KB_DIR: targetDir },
  });
  console.error(
    `gbrain was found at ${gbrainCommand}, but '${gbrainCommand} --version' failed. Output: ${`${gbrainCheck.stdout ?? ""}\n${gbrainCheck.stderr ?? ""}`.trim()}`,
  );
  process.exit(gbrainCheck.status ?? 2);
}

const manifest =
  (await readJsonIfExists(path.join(targetDir, "kb-manifest.json"))) ??
  (await readJsonIfExists(path.join(repoRoot, "kb-manifest.json"))) ??
  {};
const minGbrainVersion = manifest.minGbrainVersion;
if (minGbrainVersion && process.env.OPENCLAW_SUPPORT_KB_SKIP_VERSION_CHECK !== "1") {
  const installedVersion = `${gbrainCheck.stdout} ${gbrainCheck.stderr}`.trim();
  const versionCompare = compareSemver(installedVersion, minGbrainVersion);
  if (versionCompare === -1) {
    run(process.execPath, [path.join(runtimeRoot, "scripts", "install-skills.mjs")], {
      env: { ...process.env, OPENCLAW_SUPPORT_KB_DIR: targetDir },
    });
    console.error(gbrainUpgradeHint({ command: gbrainCommand, installedVersion, minVersion: minGbrainVersion }));
    process.exit(2);
  }
  if (versionCompare === null) {
    console.warn(`Could not parse gbrain version from "${installedVersion}". Continuing after command preflight.`);
  }
}

run(process.execPath, [path.join(runtimeRoot, "scripts", "install-skills.mjs")], {
  env: { ...process.env, OPENCLAW_SUPPORT_KB_DIR: targetDir },
});

let sourceResult;
try {
  sourceResult = ensureGbrainSource({ targetDir, run, captureNoExit, gbrainCommand });
} catch (error) {
  failGbrainSourceRegistration(error);
}
run(gbrainCommand, gbrainSyncArgs(targetDir, sourceResult));
run(gbrainCommand, gbrainEmbedStaleArgs(sourceResult));
if (sourceResult.sourceScoped !== false && process.env.OPENCLAW_SUPPORT_KB_SKIP_SOURCE_VERIFY !== "1") {
  const namedSource = verifyNamedGbrainSource({ captureNoExit, gbrainCommand });
  if (!namedSource.ok) {
    console.error(`GBrain named-source verification failed: ${namedSource.reason}.`);
    if (namedSource.source?.line) console.error(`Source line: ${namedSource.source.line}`);
    if (namedSource.result?.stdout) console.error(namedSource.result.stdout.trim());
    if (namedSource.result?.stderr) console.error(namedSource.result.stderr.trim());
    process.exit(2);
  }
}
verifyGbrainSearch();

console.log(`OpenClaw support KB updated, indexed, and query-verified from ${targetDir}`);
