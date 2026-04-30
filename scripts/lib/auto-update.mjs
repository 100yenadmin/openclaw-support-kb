import { createHash } from "node:crypto";
import os from "node:os";

export const AUTO_UPDATE_CRON_START = "# openclaw-support-kb:auto-update:start";
export const AUTO_UPDATE_CRON_END = "# openclaw-support-kb:auto-update:end";

export function shellQuote(value) {
  const text = String(value);
  if (text.includes("\0")) throw new Error("shellQuote cannot quote values containing null bytes");
  if (/[\r\n]/.test(text)) throw new Error("shellQuote cannot quote values containing newlines");
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

export function escapeCronPercents(value) {
  return String(value).replace(/%/g, "\\%");
}

export function defaultCronMinute(seed = os.hostname()) {
  const hash = createHash("sha256").update(String(seed || "openclaw-support-kb")).digest();
  return hash[0] % 60;
}

export function managedCronBlock({
  schedule,
  nodePath,
  scriptPath,
  logPath,
  targetDir,
  channel = "stable",
  repoUrl = "https://github.com/100yenadmin/openclaw-support-kb.git",
  pathValue = process.env.PATH || "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin",
} = {}) {
  if (!schedule) throw new Error("managedCronBlock requires schedule");
  if (!nodePath) throw new Error("managedCronBlock requires nodePath");
  if (!scriptPath) throw new Error("managedCronBlock requires scriptPath");
  if (!logPath) throw new Error("managedCronBlock requires logPath");
  if (!targetDir) throw new Error("managedCronBlock requires targetDir");

  const command = escapeCronPercents([
    `PATH=${shellQuote(pathValue)}`,
    `OPENCLAW_SUPPORT_KB_DIR=${shellQuote(targetDir)}`,
    `OPENCLAW_SUPPORT_KB_REPO=${shellQuote(repoUrl)}`,
    `OPENCLAW_KB_CHANNEL=${shellQuote(channel)}`,
    shellQuote(nodePath),
    shellQuote(scriptPath),
    "--reason",
    "cron",
    ">>",
    shellQuote(logPath),
    "2>&1",
  ].join(" "));

  return [AUTO_UPDATE_CRON_START, `${schedule} ${command}`, AUTO_UPDATE_CRON_END].join("\n");
}

export function upsertManagedCronBlock(existingCrontab, managedBlock) {
  const existing = String(existingCrontab || "").trimEnd();
  const block = String(managedBlock || "").trim();
  if (!block.includes(AUTO_UPDATE_CRON_START) || !block.includes(AUTO_UPDATE_CRON_END)) {
    throw new Error("managed block is missing auto-update markers");
  }

  const pattern = new RegExp(
    `${escapeRegExp(AUTO_UPDATE_CRON_START)}[\\s\\S]*?${escapeRegExp(AUTO_UPDATE_CRON_END)}`,
    "gm",
  );

  const withoutManagedBlocks = existing.replace(pattern, "").trim();
  return `${withoutManagedBlocks}${withoutManagedBlocks ? "\n\n" : ""}${block}\n`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
