import { createHash } from "node:crypto";
import os from "node:os";

export const AUTO_UPDATE_CRON_START = "# openclaw-support-kb:auto-update:start";
export const AUTO_UPDATE_CRON_END = "# openclaw-support-kb:auto-update:end";

export function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
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
  channel = "stable",
  repoUrl = "https://github.com/100yenadmin/openclaw-support-kb.git",
} = {}) {
  if (!schedule) throw new Error("managedCronBlock requires schedule");
  if (!nodePath) throw new Error("managedCronBlock requires nodePath");
  if (!scriptPath) throw new Error("managedCronBlock requires scriptPath");
  if (!logPath) throw new Error("managedCronBlock requires logPath");

  const command = [
    `OPENCLAW_SUPPORT_KB_REPO=${shellQuote(repoUrl)}`,
    `OPENCLAW_KB_CHANNEL=${shellQuote(channel)}`,
    shellQuote(nodePath),
    shellQuote(scriptPath),
    "--reason",
    "cron",
    ">>",
    shellQuote(logPath),
    "2>&1",
  ].join(" ");

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
