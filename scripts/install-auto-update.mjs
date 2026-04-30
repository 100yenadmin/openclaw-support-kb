#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  defaultCronMinute,
  managedCronBlock,
  shellQuote,
  upsertManagedCronBlock,
} from "./lib/auto-update.mjs";
import { canonicalSourceDir } from "./lib/openclaw-support-kb.mjs";

const targetDir = process.env.OPENCLAW_SUPPORT_KB_DIR || canonicalSourceDir();
const mode = readArg("--mode") || "crontab";
const schedule = readArg("--schedule") || `${defaultCronMinute()} * * * *`;
const channel = process.env.OPENCLAW_KB_CHANNEL || readArg("--channel") || "stable";
const repoUrl = process.env.OPENCLAW_SUPPORT_KB_REPO || "https://github.com/100yenadmin/openclaw-support-kb.git";
const logPath =
  process.env.OPENCLAW_SUPPORT_KB_LOG_FILE ||
  path.join(os.homedir(), ".gbrain", "logs", "openclaw-support-kb-update.log");
const scriptPath = path.join(targetDir, "scripts", "run-client-update.mjs");
const runNow = process.argv.includes("--run-now");

function readArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return "";
  const value = process.argv[index + 1];
  if (!value || value.startsWith("-")) {
    console.error(`Missing value for ${name}.`);
    process.exit(2);
  }
  return value;
}

function captureNoExit(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.error?.code === "ENOENT") return { missing: true };
  return { status: result.status ?? 1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.error?.code === "ENOENT") {
    console.error(`Missing required command: ${command}`);
    process.exit(2);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function installCrontab(block) {
  const current = captureNoExit("crontab", ["-l"]);
  if (current.missing) {
    console.error("crontab is not available. Use --mode print and register the shown command in OpenClaw cron or fleet control.");
    process.exit(2);
  }
  const noExistingCrontab = current.status !== 0 && /\b(no crontab|no crontab for)\b/i.test(current.stderr);
  if (current.status !== 0 && !noExistingCrontab) {
    console.error(current.stderr.trim() || "Could not read current crontab.");
    process.exit(current.status);
  }

  const nextCrontab = upsertManagedCronBlock(noExistingCrontab ? "" : current.stdout, block);
  const installed = spawnSync("crontab", ["-"], {
    input: nextCrontab,
    encoding: "utf8",
    stdio: ["pipe", "inherit", "pipe"],
  });
  if (installed.error?.code === "ENOENT") {
    console.error("crontab is not available. Use --mode print and register the shown command in OpenClaw cron or fleet control.");
    process.exit(2);
  }
  if (installed.status !== 0) {
    console.error(installed.stderr?.trim() || "Could not install managed crontab block.");
    process.exit(installed.status ?? 1);
  }
}

await mkdir(path.dirname(logPath), { recursive: true });

const block = managedCronBlock({
  schedule,
  nodePath: process.execPath,
  scriptPath,
  logPath,
  targetDir,
  channel,
  repoUrl,
  pathValue: process.env.PATH || "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin",
});

if (mode === "print") {
  console.log(block);
  console.log("");
  console.log("Fleet/control-panel immediate update command:");
  console.log(
    [
      `OPENCLAW_SUPPORT_KB_DIR=${shellQuote(targetDir)}`,
      `OPENCLAW_SUPPORT_KB_REPO=${shellQuote(repoUrl)}`,
      `OPENCLAW_KB_CHANNEL=${shellQuote(channel)}`,
      `PATH=${shellQuote(process.env.PATH || "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin")}`,
      shellQuote(process.execPath),
      shellQuote(scriptPath),
      "--reason",
      "fleet-release",
    ].join(" "),
  );
  process.exit(0);
}

if (mode !== "crontab") {
  console.error(`Unsupported mode ${mode}. Use --mode crontab or --mode print.`);
  process.exit(2);
}

await installCrontab(block);
console.log(`Installed OpenClaw support KB auto-update crontab: ${schedule}`);
console.log(`Log: ${logPath}`);

if (runNow) {
  run(process.execPath, [scriptPath, "--reason", "install"], {
    env: {
      ...process.env,
      OPENCLAW_SUPPORT_KB_DIR: targetDir,
      OPENCLAW_SUPPORT_KB_REPO: repoUrl,
      OPENCLAW_KB_CHANNEL: channel,
    },
  });
}
