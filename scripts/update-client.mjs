#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  compareSemver,
  canonicalSourceDir,
  GBRAIN_VERIFY_QUERIES,
  GBRAIN_SOURCE_ID,
  GBRAIN_SOURCE_NAME,
  isFullCommitSha,
  isOfficialRepoUrl,
  pathExists,
  readJsonIfExists,
  repoRootFromImportMeta,
  validateGbrainSearchOutput,
} from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);
const targetDir =
  process.env.OPENCLAW_SUPPORT_KB_DIR ||
  canonicalSourceDir();
const repoUrl = process.env.OPENCLAW_SUPPORT_KB_REPO || "";
const branch = process.env.OPENCLAW_SUPPORT_KB_BRANCH || "main";
const allowNoGbrain = process.env.OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN === "1";
const allowUntrustedRepo = process.env.OPENCLAW_SUPPORT_KB_ALLOW_UNTRUSTED_REPO === "1";
const pinnedRef = process.env.OPENCLAW_SUPPORT_KB_PINNED_REF || "";

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

function verifyGbrainSearch() {
  if (process.env.OPENCLAW_SUPPORT_KB_SKIP_SEARCH_VERIFY === "1") {
    console.warn("Skipping GBrain search verification because OPENCLAW_SUPPORT_KB_SKIP_SEARCH_VERIFY=1 is set.");
    return;
  }
  const loose = process.env.OPENCLAW_SUPPORT_KB_LOOSE_SEARCH_VERIFY === "1";
  for (const item of GBRAIN_VERIFY_QUERIES) {
    const search = capture("gbrain", ["search", item.query]);
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

function ensureGbrainSource() {
  run("gbrain", ["sources", "add", GBRAIN_SOURCE_ID, "--path", targetDir, "--name", GBRAIN_SOURCE_NAME, "--federated"]);
  run("gbrain", ["sources", "federate", GBRAIN_SOURCE_ID]);
}

function ensureRepoTrust() {
  if (!repoUrl) return;
  if (isOfficialRepoUrl(repoUrl)) return;
  if (!allowUntrustedRepo) {
    console.error(
      `Refusing untrusted OPENCLAW_SUPPORT_KB_REPO=${repoUrl}. Use the official repo or set OPENCLAW_SUPPORT_KB_ALLOW_UNTRUSTED_REPO=1 with OPENCLAW_SUPPORT_KB_PINNED_REF for development.`,
    );
    process.exit(3);
  }
  if (!pinnedRef) {
    console.error("Refusing untrusted repo without OPENCLAW_SUPPORT_KB_PINNED_REF.");
    process.exit(3);
  }
  if (!isFullCommitSha(pinnedRef)) {
    console.error("Refusing untrusted repo: OPENCLAW_SUPPORT_KB_PINNED_REF must be a full 40-character commit SHA.");
    process.exit(3);
  }
}

function warnIfLocalCheckoutOriginIsUnexpected() {
  if (repoUrl || allowUntrustedRepo) return;
  const origin = captureNoExit("git", ["-C", repoRoot, "remote", "get-url", "origin"]);
  const originUrl = origin.stdout?.trim();
  if (origin.status === 0 && originUrl && !isOfficialRepoUrl(originUrl)) {
    console.warn(
      `Warning: local checkout origin is not the official repo (${originUrl}). The official repo is https://github.com/100yenadmin/openclaw-support-kb.git.`,
    );
  }
}

async function updateRepo() {
  ensureRepoTrust();
  if (!repoUrl) {
    if (path.resolve(repoRoot) === path.resolve(targetDir)) return;
    run(process.execPath, [path.join(repoRoot, "scripts", "build-kb.mjs"), "--out", targetDir]);
    return;
  }

  await mkdir(path.dirname(targetDir), { recursive: true });
  if (await pathExists(path.join(targetDir, ".git"))) {
    run("git", ["-C", targetDir, "fetch", "--prune", "origin"]);
    if (pinnedRef) {
      run("git", ["-C", targetDir, "fetch", "--depth", "1", "origin", pinnedRef]);
      run("git", ["-C", targetDir, "checkout", "--detach", "FETCH_HEAD"]);
    } else {
      run("git", ["-C", targetDir, "checkout", branch]);
      run("git", ["-C", targetDir, "pull", "--ff-only", "origin", branch]);
    }
  } else {
    run("git", ["clone", "--depth", "1", "--branch", branch, repoUrl, targetDir]);
    if (pinnedRef) {
      run("git", ["-C", targetDir, "fetch", "--depth", "1", "origin", pinnedRef]);
      run("git", ["-C", targetDir, "checkout", "--detach", "FETCH_HEAD"]);
    }
  }
}

function verifyPinnedRef() {
  if (!pinnedRef) return;
  const head = capture("git", ["-C", targetDir, "rev-parse", "HEAD"]).stdout.trim();
  if (head !== pinnedRef) {
    console.error(`Refusing checkout: expected pinned ref ${pinnedRef}, got ${head}.`);
    process.exit(3);
  }
}

await updateRepo();
verifyPinnedRef();
warnIfLocalCheckoutOriginIsUnexpected();

const gbrainCheck = capture("gbrain", ["--version"]);
if (gbrainCheck.missing) {
  if (allowNoGbrain) {
    console.warn(
      `gbrain not found. Proceeding only because OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1 is set. Skills will be installed, but the KB will not be indexed and agents must not claim GBrain-indexed results.`,
    );
    const runtimeRoot = await pathExists(path.join(targetDir, "scripts", "install-skills.mjs")) ? targetDir : repoRoot;
    run(process.execPath, [path.join(runtimeRoot, "scripts", "install-skills.mjs")], {
      env: { ...process.env, OPENCLAW_SUPPORT_KB_DIR: targetDir },
    });
    process.exit(0);
  }
  const message = `gbrain not found. KB source is ready at ${targetDir}, but skills were not installed and the KB was not indexed. Install GBrain or set OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN=1 for explicit degraded rg-only mode.`;
  console.error(message);
  process.exit(2);
}

const manifest =
  (await readJsonIfExists(path.join(targetDir, "kb-manifest.json"))) ??
  (await readJsonIfExists(path.join(repoRoot, "kb-manifest.json"))) ??
  {};
const minGbrainVersion = manifest.minGbrainVersion;
if (minGbrainVersion && process.env.OPENCLAW_SUPPORT_KB_SKIP_VERSION_CHECK !== "1") {
  const installedVersion = `${gbrainCheck.stdout} ${gbrainCheck.stderr}`.trim();
  const versionCompare = compareSemver(installedVersion, minGbrainVersion);
  if (versionCompare === -1) {
    console.error(`gbrain ${installedVersion} is older than required ${minGbrainVersion}. Update GBrain before indexing.`);
    process.exit(2);
  }
  if (versionCompare === null) {
    console.warn(`Could not parse gbrain version from "${installedVersion}". Continuing after command preflight.`);
  }
}

const runtimeRoot = await pathExists(path.join(targetDir, "scripts", "install-skills.mjs")) ? targetDir : repoRoot;
run(process.execPath, [path.join(runtimeRoot, "scripts", "install-skills.mjs")], {
  env: { ...process.env, OPENCLAW_SUPPORT_KB_DIR: targetDir },
});

ensureGbrainSource();
run("gbrain", ["sync", "--repo", targetDir, "--source", GBRAIN_SOURCE_ID]);
run("gbrain", ["embed", "--stale"]);
verifyGbrainSearch();

console.log(`OpenClaw support KB updated, indexed, and query-verified from ${targetDir}`);
