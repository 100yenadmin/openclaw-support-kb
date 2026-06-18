#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  artifactSha256,
  canonicalSourceDir,
  GBRAIN_SOURCE_ID,
  pathExists,
  readJsonIfExists,
  repoRootFromImportMeta,
} from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);
const sourceDir = path.join(repoRoot, "skills");
const targetDir = process.env.OPENCLAW_SKILLS_DIR || path.join(os.homedir(), ".openclaw", "skills");
const kbDir = process.env.OPENCLAW_SUPPORT_KB_DIR || canonicalSourceDir();
const configFile = process.env.OPENCLAW_CONFIG_FILE || path.join(os.homedir(), ".openclaw", "openclaw.json");
const supportSkills = [];

function expandUser(value) {
  if (!value) return null;
  const stringValue = String(value);
  if (stringValue === "~") return os.homedir();
  if (stringValue.startsWith("~/")) return path.join(os.homedir(), stringValue.slice(2));
  return stringValue;
}

function addWorkspaceAgentFile(files, workspace) {
  const expanded = expandUser(workspace);
  if (!expanded) return;
  files.add(path.join(expanded, "AGENTS.md"));
}

function agentEntries(config) {
  const list = config?.agents?.list ?? config?.agents;
  if (Array.isArray(list)) return list;
  if (list && typeof list === "object") return Object.values(list).filter((value) => value && typeof value === "object");
  return [];
}

function collectAgentHintFiles(config) {
  if (process.env.OPENCLAW_AGENTS_FILE) return [path.resolve(expandUser(process.env.OPENCLAW_AGENTS_FILE))];

  const files = new Set([
    path.join(os.homedir(), ".openclaw", "AGENTS.md"),
    path.join(os.homedir(), ".openclaw", "workspace", "AGENTS.md"),
  ]);

  const workspaceDirs = (process.env.OPENCLAW_WORKSPACE_DIRS || "")
    .split(path.delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
  for (const workspace of workspaceDirs) addWorkspaceAgentFile(files, workspace);

  addWorkspaceAgentFile(files, config?.workspace);
  addWorkspaceAgentFile(files, config?.agents?.defaults?.workspace);
  for (const entry of agentEntries(config)) addWorkspaceAgentFile(files, entry.workspace);

  return [...files].map((file) => path.resolve(file));
}

async function writeBackupOnce(filePath, content) {
  if (!content) return;
  const backupPath = `${filePath}.bak-openclaw-support-kb`;
  try {
    await writeFile(backupPath, content, { flag: "wx" });
    console.log(`Backed up existing agent instructions to ${backupPath}`);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}

async function upsertManagedBlock(filePath, block) {
  const start = "<!-- openclaw-support-kb:start -->";
  const end = "<!-- openclaw-support-kb:end -->";
  const managed = `${start}\n${block.trim()}\n${end}\n`;
  let existing = "";
  try {
    existing = await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const pattern = new RegExp(`${start}[\\s\\S]*?${end}\\n?`);
  if (existing && !pattern.test(existing)) await writeBackupOnce(filePath, existing);
  const next = pattern.test(existing)
    ? existing.replace(pattern, managed)
    : `${existing.trimEnd()}${existing.trimEnd() ? "\n\n" : ""}${managed}`;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, next);
}

async function readSkillMarkerBestEffort(skillDir) {
  try {
    return await readJsonIfExists(path.join(skillDir, ".openclaw-support-kb-skill.json"));
  } catch (error) {
    console.warn(`Warning: could not read managed skill marker in ${skillDir}: ${error.message}`);
    return null;
  }
}

async function backupExistingSkillIfNeeded(skillDir) {
  if (!(await pathExists(skillDir))) return;
  const marker = await readSkillMarkerBestEffort(skillDir);
  if (marker?.managedBy === "openclaw-support-kb") return;

  const backupDir = `${skillDir}.bak-openclaw-support-kb-${Date.now()}`;
  await rename(skillDir, backupDir);
  console.warn(`Backed up existing skill directory before managed install: ${backupDir}`);
}

async function installManagedSkill(from, to, name) {
  await backupExistingSkillIfNeeded(to);
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true, force: false });
  await writeFile(
    path.join(to, ".openclaw-support-kb-skill.json"),
    JSON.stringify(
      {
        managedBy: "openclaw-support-kb",
        skill: name,
        installedAt: new Date().toISOString(),
        source: "openclaw-support-kb/skills",
        sourceSha256: await artifactSha256(from, ["."], []),
      },
      null,
      2,
    ) + "\n",
  );
}

async function readOpenClawConfigBestEffort(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    console.warn(`Warning: could not read OpenClaw config from ${filePath}: ${error.message}`);
    console.warn("Continuing support-skill install with default AGENTS.md targets only.");
    return {};
  }
}

await mkdir(targetDir, { recursive: true });
const config = await readOpenClawConfigBestEffort(configFile);

const entries = await readdir(sourceDir, { withFileTypes: true });
const installed = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const from = path.join(sourceDir, entry.name);
  const to = path.join(targetDir, entry.name);
  await installManagedSkill(from, to, entry.name);
  supportSkills.push(entry.name);
  installed.push(to);
}

console.log(`Installed ${installed.length} customer KB skills into ${targetDir}`);
for (const item of installed) console.log(`- ${item}`);

if (process.env.OPENCLAW_SUPPORT_KB_SKIP_AGENTS_MD !== "1") {
  const agentHintFiles = collectAgentHintFiles(config);
  for (const agentsFile of agentHintFiles) {
    await upsertManagedBlock(
      agentsFile,
    `
## Customer Support KB

For OpenClaw, Hermes Agent, Paperclip Mission Control, Composio, update, channel, Telegram, config, skill, or support questions:

1. Confirm the local KB is installed:
   - source: \`${kbDir}\`
   - GBrain source id: \`${GBRAIN_SOURCE_ID}\`
   - manifest: \`${path.join(kbDir, "kb-manifest.json")}\`
   - source catalog: \`${path.join(kbDir, "kb-sources.json")}\`
2. Identify the target system before giving setup/config commands. Do not apply OpenClaw config docs to Hermes, Hermes config docs to OpenClaw, or Paperclip control-plane docs to either runtime.
3. Search customer/workspace docs first for customer-specific operating context:
   - durable customer docs live in \`/root/.openclaw/workspace/docs\`
   - customer runbooks live in \`/root/.openclaw/workspace/docs/runbooks\`
   - GBrain source id: \`workspace-docs\`
   \`gbrain search "<customer, workspace, or runbook question>" --source workspace-docs\`
4. Search the reusable Support KB source before answering product support or editing config:
   \`gbrain search "<target system> <question>" --source ${GBRAIN_SOURCE_ID}\`
   \`gbrain search "<target system> <exact error, command, config key, or Source URL>" --source ${GBRAIN_SOURCE_ID}\`
5. Use the installed customer KB skills for routing:
   - customer-kb-router
   - openclaw-support-kb
   - openclaw-config-repair
   - openclaw-skill-discovery
   - openclaw-support-escalation
   - hermes-support-kb
   - paperclip-mission-control
   - cross-system-recovery
6. If a runbook appears in search, treat it as workflow only. Run its Search Contract and cite current docs/source pages for facts.
7. If search or citations mention \`.pre-git-\` or backup/archive paths, run \`node ${path.join(kbDir, "scripts", "status.mjs")}\` and do not cite that stale copy.
8. Do not invent config keys. Prefer \`openclaw config schema\`, \`openclaw config patch --dry-run\`, and \`openclaw config validate\` for OpenClaw; prefer Hermes/Paperclip docs and read-only diagnostics for those systems.
9. Ask before sending support escalations. Use \`openclaw-support-escalation\` and its helper so GOG email or Telegram fallback only sends after hash-bound approval.
`,
    );
    console.log(`Updated agent hint block in ${agentsFile}`);
  }
}

function missingSupportSkills(list) {
  if (!Array.isArray(list) || list.includes("*")) return [];
  return supportSkills.filter((skill) => !list.includes(skill));
}

const defaultMissing = missingSupportSkills(config?.agents?.defaults?.skills);
if (defaultMissing.length) {
  console.warn(
    `Warning: agents.defaults.skills appears to be an explicit allowlist missing support skills: ${defaultMissing.join(", ")}.`,
  );
  console.warn("Use a dry-run config patch before changing skill allowlists.");
}

for (const entry of agentEntries(config)) {
  const missing = missingSupportSkills(entry.skills);
  if (!missing.length) continue;
  const id = entry.id || entry.name || "unknown-agent";
  console.warn(`Warning: agent ${id} has an explicit skills allowlist missing: ${missing.join(", ")}.`);
}
