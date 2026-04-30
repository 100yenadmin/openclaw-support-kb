#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  canonicalSourceDir,
  compareSemver,
  GBRAIN_VERIFY_QUERY,
  readJsonIfExists,
  validateGbrainSearchOutput,
} from "./lib/openclaw-support-kb.mjs";

const target =
  process.env.OPENCLAW_SUPPORT_KB_DIR ||
  canonicalSourceDir();
const channel = process.env.OPENCLAW_KB_CHANNEL || "stable";
const allowNoGbrain = process.env.OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN === "1";

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

function verifyGbrainSearch() {
  if (process.env.OPENCLAW_SUPPORT_KB_SKIP_SEARCH_VERIFY === "1") {
    console.warn("Skipping GBrain search verification because OPENCLAW_SUPPORT_KB_SKIP_SEARCH_VERIFY=1 is set.");
    return;
  }
  const search = capture("gbrain", ["search", GBRAIN_VERIFY_QUERY]);
  const output = `${search.stdout}\n${search.stderr}`;
  const verified = validateGbrainSearchOutput(output, {
    strict: process.env.OPENCLAW_SUPPORT_KB_STRICT_SEARCH_VERIFY === "1",
  });
  if (!verified.ok) {
    console.error(`GBrain search verification failed: ${verified.reason}.`);
    console.error(`Query: ${GBRAIN_VERIFY_QUERY}`);
    console.error("Search output preview:");
    console.error(output.trim().slice(0, 4000) || "[empty]");
    process.exit(2);
  }
  for (const warning of verified.warnings ?? []) {
    console.warn(`GBrain search verification warning: ${warning}.`);
  }
}

run(process.execPath, [new URL("./build-kb.mjs", import.meta.url).pathname, "--out", target, "--channel", channel]);

const gbrainCheck = capture("gbrain", ["--version"]);
if (gbrainCheck.missing) {
  const message = `gbrain not found. KB source is ready at ${target}, but it was not indexed. Install GBrain or set OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1 for explicit degraded rg-only mode.`;
  if (allowNoGbrain) {
    console.warn(message);
    process.exit(0);
  }
  console.error(message);
  process.exit(2);
}

const manifest = (await readJsonIfExists(path.join(target, "kb-manifest.json"))) ?? {};
if (manifest.minGbrainVersion && process.env.OPENCLAW_SUPPORT_KB_SKIP_VERSION_CHECK !== "1") {
  const installedVersion = `${gbrainCheck.stdout} ${gbrainCheck.stderr}`.trim();
  const versionCompare = compareSemver(installedVersion, manifest.minGbrainVersion);
  if (versionCompare === -1) {
    console.error(`gbrain ${installedVersion} is older than required ${manifest.minGbrainVersion}. Update GBrain before indexing.`);
    process.exit(2);
  }
  if (versionCompare === null) {
    console.warn(`Could not parse gbrain version from "${installedVersion}". Continuing after command preflight.`);
  }
}

run("gbrain", ["sync", "--repo", target]);
run("gbrain", ["embed", "--stale"]);
verifyGbrainSearch();
