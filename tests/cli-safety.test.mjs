import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

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
