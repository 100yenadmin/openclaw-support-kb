#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  defaultCronHour,
  defaultCronMinute,
  managedCronBlock,
  shellQuote,
  upsertManagedCronBlock,
} from "./lib/auto-update.mjs";
import { canonicalSourceDir, withCommandPathFallbacks } from "./lib/openclaw-support-kb.mjs";

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printUsage();
  process.exit(0);
}

const targetDir = process.env.OPENCLAW_SUPPORT_KB_DIR || canonicalSourceDir();
const mode = args.mode || "print";
const schedule = args.schedule || `${defaultCronMinute()} ${defaultCronHour()} * * *`;
const channel = process.env.OPENCLAW_KB_CHANNEL || args.channel || "stable";
const repoUrl = process.env.OPENCLAW_SUPPORT_KB_REPO || "https://github.com/electricsheephq/openclaw-support-kb.git";
const logPath =
  process.env.OPENCLAW_SUPPORT_KB_LOG_FILE ||
  path.join(os.homedir(), ".gbrain", "logs", "openclaw-support-kb-update.log");
const scriptPath = path.join(targetDir, "scripts", "run-client-update.mjs");
const runNow = args.runNow;
const pathValue = withCommandPathFallbacks(process.env.PATH || "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin");

function printUsage() {
  console.log(`Usage: node scripts/install-auto-update.mjs [options]

Options:
  --mode print|crontab   Print the managed command/block, or install it into crontab.
                         Defaults to print; crontab mutation must be explicit.
  --schedule "CRON"      Five-field cron schedule. Defaults to a stable daily time.
  --channel stable|beta  KB channel to pass to client updates.
  --run-now             After --mode crontab install, run one immediate update.
  -h, --help            Show this help without changing crontab.
`);
}

function parseArgs(argv) {
  const parsed = { help: false, mode: "", schedule: "", channel: "", runNow: false };
  const valueArgs = new Set(["--mode", "--schedule", "--channel"]);

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--run-now") {
      parsed.runNow = true;
      continue;
    }
    if (valueArgs.has(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("-")) {
        console.error(`Missing value for ${arg}.`);
        process.exit(2);
      }
      parsed[arg.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase())] = value;
      index += 1;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    printUsage();
    process.exit(2);
  }

  return parsed;
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
    console.error("crontab is not available. Use --mode print and register the shown command in system cron, systemd, or fleet control.");
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
    console.error("crontab is not available. Use --mode print and register the shown command in system cron, systemd, or fleet control.");
    process.exit(2);
  }
  if (installed.status !== 0) {
    console.error(installed.stderr?.trim() || "Could not install managed crontab block.");
    process.exit(installed.status ?? 1);
  }
}

const block = managedCronBlock({
  schedule,
  nodePath: process.execPath,
  scriptPath,
  logPath,
  targetDir,
  channel,
  repoUrl,
  pathValue,
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
      `PATH=${shellQuote(pathValue)}`,
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

await mkdir(path.dirname(logPath), { recursive: true });
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
      PATH: pathValue,
    },
  });
}
