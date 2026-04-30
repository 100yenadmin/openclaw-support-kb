#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  canonicalSourceDir,
  isFullCommitSha,
  isOfficialRepoUrl,
  normalizeRepoUrl,
  pathExists,
  readJsonIfExists,
} from "./lib/openclaw-support-kb.mjs";

const DEFAULT_REPO_URL = "https://github.com/100yenadmin/openclaw-support-kb.git";
const targetDir = process.env.OPENCLAW_SUPPORT_KB_DIR || canonicalSourceDir();
const repoUrl = process.env.OPENCLAW_SUPPORT_KB_REPO || DEFAULT_REPO_URL;
const branch = process.env.OPENCLAW_SUPPORT_KB_BRANCH || "main";
const pinnedRef = process.env.OPENCLAW_SUPPORT_KB_PINNED_REF || "";
const allowUntrustedRepo = process.env.OPENCLAW_SUPPORT_KB_ALLOW_UNTRUSTED_REPO === "1";
const staleLockMs = Number(process.env.OPENCLAW_SUPPORT_KB_LOCK_STALE_MS || 30 * 60 * 1000);
const stateDir = process.env.OPENCLAW_SUPPORT_KB_STATE_DIR || path.join(os.homedir(), ".gbrain", "state");
const lockDir = process.env.OPENCLAW_SUPPORT_KB_LOCK_DIR || path.join(os.homedir(), ".gbrain", "locks");
const statusPath = process.env.OPENCLAW_SUPPORT_KB_STATUS_FILE || path.join(stateDir, "openclaw-support-kb-update.json");
const lockPath = path.join(lockDir, "openclaw-support-kb-update.lock");
const reason = readArg("--reason") || process.env.OPENCLAW_SUPPORT_KB_UPDATE_REASON || "manual";
const startedAt = new Date();

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

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.error?.code === "ENOENT") {
    throw new Error(`Missing required command: ${command}`);
  }
  if (result.status !== 0) {
    const error = new Error(`${command} ${args.join(" ")} failed with exit ${result.status ?? 1}`);
    error.status = result.status ?? 1;
    throw error;
  }
  return { ok: true };
}

function capture(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.error?.code === "ENOENT") {
    throw new Error(`Missing required command: ${command}`);
  }
  if (result.status !== 0) {
    const error = new Error(`${command} ${args.join(" ")} failed with exit ${result.status ?? 1}`);
    error.status = result.status ?? 1;
    error.stdout = result.stdout ?? "";
    error.stderr = result.stderr ?? "";
    throw error;
  }
  return { stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

async function writeStatus(status) {
  await mkdir(path.dirname(statusPath), { recursive: true });
  await writeFile(statusPath, `${JSON.stringify(status, null, 2)}\n`);
}

async function acquireLock() {
  await mkdir(lockDir, { recursive: true });
  try {
    await createLockOwner();
    return true;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const owner = await readExistingLock();
    if (!lockIsStale(owner)) {
      await writeStatus({
        ok: true,
        skipped: true,
        reason,
        targetDir,
        status: "locked",
        existingLock: owner,
        finishedAt: new Date().toISOString(),
      });
      console.warn(`OpenClaw support KB update already running at ${lockPath}; skipping.`);
      return false;
    }
    await rm(lockPath, { recursive: true, force: true });
    return reacquireAfterStaleLockRemoval();
  }
}

async function createLockOwner() {
  await mkdir(lockPath);
  try {
    await writeFile(
      path.join(lockPath, "owner.json"),
      `${JSON.stringify({ pid: process.pid, startedAt: startedAt.toISOString(), reason }, null, 2)}\n`,
    );
  } catch (error) {
    await rm(lockPath, { recursive: true, force: true });
    throw error;
  }
}

async function reacquireAfterStaleLockRemoval() {
  try {
    await createLockOwner();
    return true;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const owner = await readExistingLock();
    await writeStatus({
      ok: true,
      skipped: true,
      reason,
      targetDir,
      status: "locked",
      existingLock: owner,
      finishedAt: new Date().toISOString(),
    });
    console.warn(`OpenClaw support KB update already running at ${lockPath}; skipping.`);
    return false;
  }
}

async function readExistingLock() {
  try {
    return JSON.parse(await readFile(path.join(lockPath, "owner.json"), "utf8"));
  } catch {
    try {
      const lockStat = await stat(lockPath);
      return { path: lockPath, startedAt: null, mtimeMs: lockStat.mtimeMs };
    } catch {
      return { path: lockPath, startedAt: null, mtimeMs: Date.now() };
    }
  }
}

function lockIsStale(owner) {
  if (!Number.isFinite(staleLockMs) || staleLockMs <= 0) return false;
  const started = Date.parse(owner?.startedAt || "");
  if (!Number.isFinite(started)) {
    if (Number.isFinite(owner?.mtimeMs)) return Date.now() - owner.mtimeMs > staleLockMs;
    return false;
  }
  return Date.now() - started > staleLockMs;
}

async function releaseLock() {
  await rm(lockPath, { recursive: true, force: true });
}

function ensureRepoTrust() {
  if (isOfficialRepoUrl(repoUrl)) return;
  if (!allowUntrustedRepo) {
    throw new Error(
      `Refusing untrusted OPENCLAW_SUPPORT_KB_REPO=${repoUrl}. Use the official repo or set OPENCLAW_SUPPORT_KB_ALLOW_UNTRUSTED_REPO=1 with OPENCLAW_SUPPORT_KB_PINNED_REF for development.`,
    );
  }
  if (!isFullCommitSha(pinnedRef)) {
    throw new Error("Refusing untrusted repo: OPENCLAW_SUPPORT_KB_PINNED_REF must be a full 40-character commit SHA.");
  }
}

function ensureExistingOriginMatchesTrustPolicy() {
  const originUrl = capture("git", ["-C", targetDir, "remote", "get-url", "origin"]).stdout.trim();
  if (isOfficialRepoUrl(repoUrl)) {
    if (isOfficialRepoUrl(originUrl)) return;
    throw new Error(`Refusing to update ${targetDir}: existing origin is not the official repo (${originUrl}).`);
  }
  if (normalizeRepoUrl(originUrl) !== normalizeRepoUrl(repoUrl)) {
    throw new Error(`Refusing to update ${targetDir}: existing origin ${originUrl} does not match ${repoUrl}.`);
  }
}

async function updateCheckout() {
  ensureRepoTrust();
  await mkdir(path.dirname(targetDir), { recursive: true });

  if (await pathExists(path.join(targetDir, ".git"))) {
    ensureExistingOriginMatchesTrustPolicy();
    if (pinnedRef) {
      run("git", ["-C", targetDir, "fetch", "--depth", "1", "origin", pinnedRef]);
      run("git", ["-C", targetDir, "checkout", "--detach", "FETCH_HEAD"]);
    } else {
      run("git", ["-C", targetDir, "fetch", "--prune", "--depth", "1", "origin", branch]);
      run("git", ["-C", targetDir, "checkout", branch]);
      run("git", ["-C", targetDir, "merge", "--ff-only", "FETCH_HEAD"]);
    }
    return;
  }

  run("git", ["clone", "--depth", "1", "--branch", branch, repoUrl, targetDir]);
  if (pinnedRef) {
    run("git", ["-C", targetDir, "fetch", "--depth", "1", "origin", pinnedRef]);
    run("git", ["-C", targetDir, "checkout", "--detach", "FETCH_HEAD"]);
  }
}

function updateClient() {
  const childEnv = { ...process.env, OPENCLAW_SUPPORT_KB_DIR: targetDir };
  delete childEnv.OPENCLAW_SUPPORT_KB_REPO;
  run(process.execPath, [path.join(targetDir, "scripts", "update-client.mjs")], { env: childEnv });
}

function currentHead() {
  return capture("git", ["-C", targetDir, "rev-parse", "HEAD"]).stdout.trim();
}

async function successStatus() {
  const manifest = (await readJsonIfExists(path.join(targetDir, "kb-manifest.json"))) ?? {};
  return {
    ok: true,
    reason,
    targetDir,
    branch,
    head: currentHead(),
    channel: manifest.channel ?? process.env.OPENCLAW_KB_CHANNEL ?? "stable",
    openclawReleaseTag: manifest.openclawReleaseTag ?? null,
    generatedAt: manifest.generatedAt ?? null,
    sourceCount: manifest.sourceCount ?? null,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
  };
}

let locked = false;
try {
  locked = await acquireLock();
  if (!locked) process.exit(0);
  await updateCheckout();
  updateClient();
  const status = await successStatus();
  await writeStatus(status);
  console.log(`OpenClaw support KB auto-update complete at ${status.head}`);
} catch (error) {
  await writeStatus({
    ok: false,
    reason,
    targetDir,
    error: error.message,
    status: error.status ?? 1,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
  });
  console.error(error.message);
  process.exitCode = error.status ?? 1;
} finally {
  if (locked) await releaseLock();
}
