#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  canonicalSourceDir,
  compareSemver,
  ensureGbrainSource,
  gbrainSyncArgs,
  GBRAIN_VERIFY_QUERIES,
  gbrainUpgradeHint,
  readJsonIfExists,
  resolveGbrainCommand,
  validateGbrainSearchOutput,
  verifyNamedGbrainSource,
} from "./lib/openclaw-support-kb.mjs";

const target =
  process.env.OPENCLAW_SUPPORT_KB_DIR ||
  canonicalSourceDir();
const channel = process.env.OPENCLAW_KB_CHANNEL || "stable";
const allowNoGbrain = process.env.OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN === "1";
let gbrainCommand = "gbrain";

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

run(process.execPath, [new URL("./build-kb.mjs", import.meta.url).pathname, "--out", target, "--channel", channel]);

const resolvedGbrain = resolveGbrainCommand({ captureNoExit });
gbrainCommand = resolvedGbrain.command;
const gbrainCheck = resolvedGbrain.check;
if (gbrainCheck.missing) {
  const message = `gbrain not found. KB source is ready at ${target}, but it was not indexed. Install GBrain or set OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1 for explicit degraded rg-only mode.`;
  if (allowNoGbrain) {
    console.warn(message);
    process.exit(0);
  }
  console.error(message);
  process.exit(2);
}
if (gbrainCheck.status !== 0) {
  console.error(
    `gbrain was found at ${gbrainCommand}, but '${gbrainCommand} --version' failed. Output: ${`${gbrainCheck.stdout ?? ""}\n${gbrainCheck.stderr ?? ""}`.trim()}`,
  );
  process.exit(gbrainCheck.status ?? 2);
}

const manifest = (await readJsonIfExists(path.join(target, "kb-manifest.json"))) ?? {};
if (manifest.minGbrainVersion && process.env.OPENCLAW_SUPPORT_KB_SKIP_VERSION_CHECK !== "1") {
  const installedVersion = `${gbrainCheck.stdout} ${gbrainCheck.stderr}`.trim();
  const versionCompare = compareSemver(installedVersion, manifest.minGbrainVersion);
  if (versionCompare === -1) {
    console.error(gbrainUpgradeHint({ command: gbrainCommand, installedVersion, minVersion: manifest.minGbrainVersion }));
    process.exit(2);
  }
  if (versionCompare === null) {
    console.warn(`Could not parse gbrain version from "${installedVersion}". Continuing after command preflight.`);
  }
}

let sourceResult;
try {
  sourceResult = ensureGbrainSource({ targetDir: target, run, captureNoExit, gbrainCommand });
} catch (error) {
  failGbrainSourceRegistration(error);
}
run(gbrainCommand, gbrainSyncArgs(target, sourceResult));
run(gbrainCommand, ["embed", "--stale"]);
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
