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

export function defaultCronHour(seed = os.hostname()) {
  const hash = createHash("sha256").update(String(seed || "openclaw-support-kb")).digest();
  return hash[1] % 24;
}

export function managedCronBlock({
  schedule,
  nodePath,
  scriptPath,
  logPath,
  targetDir,
  channel = "stable",
  repoUrl = "https://github.com/electricsheephq/openclaw-support-kb.git",
  pathValue = process.env.PATH || "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin",
} = {}) {
  const cronSchedule = String(schedule || "").trim();
  if (!cronSchedule) throw new Error("managedCronBlock requires schedule");
  if (/[\r\n]/.test(cronSchedule)) throw new Error("managedCronBlock schedule must be a single line");
  validateCronSchedule(cronSchedule);
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

  return [AUTO_UPDATE_CRON_START, `${cronSchedule} ${command}`, AUTO_UPDATE_CRON_END].join("\n");
}

export function upsertManagedCronBlock(existingCrontab, managedBlock) {
  const existing = String(existingCrontab || "").trimEnd();
  const block = String(managedBlock || "").trim();
  if (!block.includes(AUTO_UPDATE_CRON_START) || !block.includes(AUTO_UPDATE_CRON_END)) {
    throw new Error("managed block is missing auto-update markers");
  }
  assertManagedMarkersBalanced(existing);

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

function validateCronSchedule(schedule) {
  const fields = schedule.split(/\s+/);
  if (fields.length !== 5) throw new Error("managedCronBlock schedule must contain exactly five cron fields");
  for (const field of fields) {
    if (!/^[A-Za-z0-9_*?,#./-]+$/.test(field)) {
      throw new Error(`managedCronBlock schedule contains unsupported cron field: ${field}`);
    }
  }
}

function assertManagedMarkersBalanced(existingCrontab) {
  const markerPattern = new RegExp(
    `${escapeRegExp(AUTO_UPDATE_CRON_START)}|${escapeRegExp(AUTO_UPDATE_CRON_END)}`,
    "g",
  );
  let depth = 0;
  for (const match of String(existingCrontab || "").matchAll(markerPattern)) {
    if (match[0] === AUTO_UPDATE_CRON_START) {
      if (depth !== 0) throw new Error("existing crontab has nested openclaw-support-kb auto-update markers");
      depth = 1;
    } else {
      if (depth !== 1) throw new Error("existing crontab has unmatched openclaw-support-kb auto-update end marker");
      depth = 0;
    }
  }
  if (depth !== 0) throw new Error("existing crontab has unmatched openclaw-support-kb auto-update start marker");
}
