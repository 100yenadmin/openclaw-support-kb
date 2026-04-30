#!/usr/bin/env node
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import {
  archiveRootForSourceDir,
  canonicalSourceDir,
  isLegacyPreGitBackupName,
  pathExists,
} from "./lib/openclaw-support-kb.mjs";

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printUsage();
  process.exit(0);
}

const targetDir = process.env.OPENCLAW_SUPPORT_KB_DIR || canonicalSourceDir();
const sourcesDir = path.dirname(targetDir);
const archiveRoot = archiveRootForSourceDir(targetDir);

function printUsage() {
  console.log(`Usage: node scripts/repair-index.mjs [options]

Moves legacy OpenClaw support KB pre-git backups out of the GBrain sources
directory so agents and filesystem scans do not pick stale copies.

Options:
  --dry-run       Print planned moves without changing files.
  --json          Print machine-readable result.
  -h, --help      Show this help.
`);
}

function parseArgs(argv) {
  const parsed = { dryRun: false, json: false, help: false };
  for (const arg of argv) {
    if (arg === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }
    if (arg === "--json") {
      parsed.json = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    printUsage();
    process.exit(2);
  }
  return parsed;
}

async function legacyBackups() {
  let entries = [];
  try {
    entries = await readdir(sourcesDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isDirectory() && isLegacyPreGitBackupName(entry.name, targetDir))
    .map((entry) => path.join(sourcesDir, entry.name));
}

async function uniqueDestination(from) {
  const baseName = path.basename(from).replace(`${path.basename(targetDir)}.`, "");
  let candidate = path.join(archiveRoot, baseName);
  let suffix = 2;
  while (await pathExists(candidate)) {
    candidate = path.join(archiveRoot, `${baseName}-${suffix}`);
    suffix += 1;
  }
  return candidate;
}

const backups = await legacyBackups();
const moves = [];
for (const from of backups) {
  moves.push({ from, to: await uniqueDestination(from) });
}

if (!args.dryRun && moves.length > 0) {
  await mkdir(archiveRoot, { recursive: true });
  for (const move of moves) {
    await rm(move.to, { recursive: true, force: true });
    await rename(move.from, move.to);
  }
}

const result = {
  ok: true,
  dryRun: args.dryRun,
  targetDir,
  sourcesDir,
  archiveRoot,
  moved: args.dryRun ? 0 : moves.length,
  planned: moves,
};

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else if (moves.length === 0) {
  console.log("No legacy OpenClaw support KB pre-git backups found under GBrain sources.");
} else if (args.dryRun) {
  console.log(`Would move ${moves.length} legacy backup(s) to ${archiveRoot}:`);
  for (const move of moves) console.log(`- ${move.from} -> ${move.to}`);
} else {
  console.log(`Moved ${moves.length} legacy backup(s) to ${archiveRoot}.`);
}
