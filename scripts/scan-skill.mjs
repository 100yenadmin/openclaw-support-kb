#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, mkdir, readdir, readFile, realpath, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);

function argValue(flag, fallback = undefined) {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
}

const target = args.find((arg) => !arg.startsWith("--"));
if (!target || args.includes("--help")) {
  console.error(
    "Usage: node scripts/scan-skill.mjs <candidate-skill-path> [--expected-sha SHA] [--attestation-out FILE]",
  );
  process.exit(args.includes("--help") ? 0 : 1);
}

const scannerSpec = process.env.SNYK_AGENT_SCAN_SPEC || "snyk-agent-scan@0.4.0";
const expectedSha = argValue("--expected-sha", process.env.OPENCLAW_CANDIDATE_SKILL_SHA || "");
const attestationOut =
  argValue("--attestation-out") ||
  path.join(os.homedir(), ".gbrain", "attestations", "openclaw-support-kb", `${Date.now()}-agent-scan.json`);
const maxFileBytes = Number(process.env.OPENCLAW_SKILL_SCAN_MAX_FILE_BYTES || 10 * 1024 * 1024);

async function writeAttestation(attestation) {
  await mkdir(path.dirname(attestationOut), { recursive: true });
  await writeFile(attestationOut, JSON.stringify(attestation, null, 2) + "\n");
  console.log(`agent-scan attestation: ${attestationOut}`);
}

async function hashTarget(targetPath) {
  const root = path.resolve(targetPath);
  const realRoot = await realpath(root);
  const hash = createHash("sha256");
  const rootStat = await lstat(root);

  async function walk(current) {
    const currentStat = await lstat(current);
    if (currentStat.isSymbolicLink()) {
      throw new Error(`Refusing to scan candidate containing symlink: ${current}`);
    }
    if (currentStat.isDirectory()) {
      const realCurrent = await realpath(current);
      if (realCurrent !== realRoot && !realCurrent.startsWith(`${realRoot}${path.sep}`)) {
        throw new Error(`Refusing path outside candidate root: ${current}`);
      }
      const entries = await readdir(current, { withFileTypes: true });
      for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
        if (entry.name === ".git" || entry.name === ".DS_Store" || entry.name === "node_modules") continue;
        await walk(path.join(current, entry.name));
      }
      return;
    }
    if (!currentStat.isFile()) return;
    if (currentStat.size > maxFileBytes) {
      throw new Error(`Refusing oversized file in candidate: ${current}`);
    }
    const relativePath = rootStat.isDirectory() ? path.relative(root, current) : path.basename(current);
    hash.update(relativePath);
    hash.update("\0");
    hash.update(await readFile(current));
    hash.update("\0");
  }

  await walk(root);
  return hash.digest("hex");
}

const startedAt = new Date().toISOString();
const candidatePath = path.resolve(target);
let candidateSha256;

try {
  candidateSha256 = await hashTarget(candidatePath);
} catch (error) {
  await writeAttestation({
    schemaVersion: 1,
    scanner: "snyk-agent-scan",
    scannerSpec,
    candidatePath,
    candidateSha256: null,
    expectedSha256: expectedSha || null,
    startedAt,
    finishedAt: new Date().toISOString(),
    exitStatus: 2,
    passed: false,
    error: error.message,
  });
  console.error(error.message);
  process.exit(2);
}

if (expectedSha && expectedSha !== candidateSha256) {
  await writeAttestation({
    schemaVersion: 1,
    scanner: "snyk-agent-scan",
    scannerSpec,
    candidatePath,
    candidateSha256,
    expectedSha256: expectedSha,
    startedAt,
    finishedAt: new Date().toISOString(),
    exitStatus: 3,
    passed: false,
    error: "Candidate hash mismatch.",
  });
  console.error(`Candidate hash mismatch. Expected ${expectedSha}, got ${candidateSha256}.`);
  process.exit(3);
}

if (!process.env.SNYK_TOKEN) {
  console.error("SNYK_TOKEN is not set. Refusing automatic skill install without agent-scan.");
  process.exit(2);
}

const result = spawnSync("uvx", [scannerSpec, "--skills", candidatePath], { stdio: "inherit" });
if (result.error?.code === "ENOENT") {
  console.error("uvx is not installed. Install uv/uvx before scanning skills.");
  process.exit(2);
}

const attestation = {
  schemaVersion: 1,
  scanner: "snyk-agent-scan",
  scannerSpec,
  candidatePath,
  candidateSha256,
  expectedSha256: expectedSha || null,
  startedAt,
  finishedAt: new Date().toISOString(),
  exitStatus: result.status ?? 1,
  passed: result.status === 0,
};

await writeAttestation(attestation);

process.exit(result.status ?? 1);
