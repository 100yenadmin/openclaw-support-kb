import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ensureGbrainSource, GBRAIN_SOURCE_ID, GBRAIN_SOURCE_NAME } from "../scripts/lib/openclaw-support-kb.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

test("install-skills still installs when openclaw config is malformed", () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "openclaw-kb-test-"));
  const badConfig = path.join(tmp, "openclaw.json");
  const skillsDir = path.join(tmp, "skills");
  writeFileSync(badConfig, "{not valid json");

  const result = spawnSync(process.execPath, ["scripts/install-skills.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      HOME: tmp,
      OPENCLAW_CONFIG_FILE: badConfig,
      OPENCLAW_SKILLS_DIR: skillsDir,
      OPENCLAW_SUPPORT_KB_SKIP_AGENTS_MD: "1",
    },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /could not read OpenClaw config/);
  assert.match(result.stdout, /Installed 4 OpenClaw support skills/);
});

test("support email send refuses omitted subject before invoking transport", () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "openclaw-kb-support-"));
  const draft = path.join(tmp, "draft.md");
  const body = "# OpenClaw Support Request\n\nIssue: test\n";
  writeFileSync(draft, body);

  const result = spawnSync(
    process.execPath,
    [
      "scripts/support-escalation.mjs",
      "send-email",
      "--draft",
      draft,
      "--account",
      "user@example.com",
      "--approved-recipient",
      "support@electricsheephq.com",
      "--approved-draft-sha",
      sha256(body),
      "--approved-context-sha",
      "unused",
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /without explicit --subject/);
});

test("scan-skill refuses unpinned scanner override before invoking uvx", () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "openclaw-kb-scan-"));
  const candidate = path.join(tmp, "candidate");
  const fakeBin = path.join(tmp, "bin");
  mkdirSync(candidate);
  mkdirSync(fakeBin);
  writeFileSync(path.join(candidate, "SKILL.md"), "# Test skill\n");
  writeFileSync(path.join(fakeBin, "uvx"), "#!/bin/sh\necho should-not-run\nexit 0\n", { mode: 0o755 });

  const result = spawnSync(process.execPath, ["scripts/scan-skill.mjs", candidate], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`,
      SNYK_TOKEN: "dummy",
      SNYK_AGENT_SCAN_SPEC: "snyk-agent-scan@latest",
    },
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /must be pinned/);
  assert.doesNotMatch(result.stdout, /should-not-run/);
});

test("client sync registers and uses the named GBrain source", () => {
  const calls = [];
  ensureGbrainSource({
    targetDir: "/tmp/openclaw-support-kb",
    run(command, args) {
      calls.push([command, args]);
      return { ok: true };
    },
  });

  assert.deepEqual(calls, [
    [
      "gbrain",
      [
        "sources",
        "add",
        GBRAIN_SOURCE_ID,
        "--path",
        "/tmp/openclaw-support-kb",
        "--name",
        GBRAIN_SOURCE_NAME,
        "--federated",
      ],
    ],
    ["gbrain", ["sources", "federate", GBRAIN_SOURCE_ID]],
  ]);

  for (const script of ["scripts/update-client.mjs", "scripts/sync-local.mjs"]) {
    const text = readFileSync(path.join(repoRoot, script), "utf8");
    assert.match(text, /import\s+\{[\s\S]*ensureGbrainSource[\s\S]*\}\s+from\s+"\.\/lib\/openclaw-support-kb\.mjs"/);
    assert.match(text, /ensureGbrainSource\s*\(\s*\{[\s\S]*targetDir[\s\S]*run[\s\S]*captureNoExit[\s\S]*\}\s*\)/);
    assert.match(text, /run\s*\(\s*"gbrain"\s*,\s*\[[\s\S]*"sync"[\s\S]*"--source"[\s\S]*GBRAIN_SOURCE_ID[\s\S]*\]\s*\)/);
    assert.doesNotMatch(text, /"sources"\s*,\s*"add"/);
  }
});

test("GBrain source registration tolerates existing sources before refederating", () => {
  const calls = [];
  assert.doesNotThrow(() =>
    ensureGbrainSource({
      targetDir: "/tmp/openclaw-support-kb",
      run() {
        throw new Error("run should not be used when captureNoExit exists");
      },
      captureNoExit(command, args) {
        calls.push([command, args]);
        if (args[1] === "add") return { status: 1, stdout: "source already exists", stderr: "" };
        return { status: 0, stdout: "", stderr: "" };
      },
      warn() {},
    }),
  );

  assert.equal(calls.length, 2);
  assert.equal(calls[0][1][2], GBRAIN_SOURCE_ID);
  assert.deepEqual(calls[1][1], ["sources", "federate", GBRAIN_SOURCE_ID]);
});
