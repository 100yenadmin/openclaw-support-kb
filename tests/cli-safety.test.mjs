import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  ensureGbrainSource,
  GBRAIN_SOURCE_ID,
  GBRAIN_SOURCE_NAME,
  loadGbrainEnvFile,
  parseGbrainEnvContent,
  gbrainSearchArgs,
  gbrainSyncArgs,
  isBenignExistingGbrainSourceError,
  isStableCommandPathEntry,
  parseGbrainSourcesList,
  resolveGbrainCommand,
  verifyNamedGbrainSource,
  withCommandPathFallbacks,
  gbrainEmbedStaleArgs,
} from "../scripts/lib/openclaw-support-kb.mjs";

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
  assert.match(result.stdout, /Installed \d+ customer KB skills/);
});

test("install-skills tells agents where customer docs live and which GBrain sources to search", () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "openclaw-kb-agents-"));
  const agentsFile = path.join(tmp, "AGENTS.md");
  const skillsDir = path.join(tmp, "skills");

  const result = spawnSync(process.execPath, ["scripts/install-skills.mjs"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      HOME: tmp,
      OPENCLAW_AGENTS_FILE: agentsFile,
      OPENCLAW_SKILLS_DIR: skillsDir,
      OPENCLAW_SUPPORT_KB_DIR: "/root/.gbrain/sources/openclaw-support-kb",
    },
  });

  assert.equal(result.status, 0, result.stderr);
  const text = readFileSync(agentsFile, "utf8");
  assert.match(text, /\/root\/\.openclaw\/workspace\/docs/);
  assert.match(text, /\/root\/\.openclaw\/workspace\/docs\/runbooks/);
  assert.match(text, /GBrain source id: `workspace-docs`/);
  assert.match(text, /gbrain search "<customer, workspace, or runbook question>" --source workspace-docs/);
  assert.match(text, /gbrain search "<target system> <question>" --source openclaw-support-kb/);
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

test("support Telegram send keeps approved draft content out of process argv", () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "openclaw-kb-telegram-"));
  const draft = path.join(tmp, "draft.md");
  const fakeBin = path.join(tmp, "bin");
  const capturePath = path.join(tmp, "openclaw-args.txt");
  const body = "# OpenClaw Support Request\n\nSECRET CUSTOMER DIAGNOSTIC\n";
  writeFileSync(draft, body);
  mkdirSync(fakeBin);
  writeFileSync(
    path.join(fakeBin, "openclaw"),
    "#!/bin/sh\nif [ \"$1\" = \"--version\" ]; then exit 0; fi\nprintf '%s\\n' \"$@\" > \"$OPENCLAW_CAPTURE_ARGS\"\nexit 0\n",
    { mode: 0o755 },
  );

  const approval = spawnSync(
    process.execPath,
    [
      "scripts/support-escalation.mjs",
      "approval-context",
      "--channel",
      "Telegram",
      "--draft",
      draft,
      "--recipient",
      "@evaOS_support_bot",
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );
  assert.equal(approval.status, 0, approval.stderr);
  const approvedContextSha = approval.stdout.match(/approvedContextSha=([a-f0-9]+)/)?.[1];
  assert.ok(approvedContextSha);

  const result = spawnSync(
    process.execPath,
    [
      "scripts/support-escalation.mjs",
      "send-telegram",
      "--draft",
      draft,
      "--approved-recipient",
      "@evaOS_support_bot",
      "--approved-draft-sha",
      sha256(body),
      "--approved-context-sha",
      approvedContextSha,
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`,
        OPENCLAW_CAPTURE_ARGS: capturePath,
      },
    },
  );

  assert.equal(result.status, 0, result.stderr);
  const args = readFileSync(capturePath, "utf8");
  assert.match(args, /--message/);
  assert.match(args, /sha256=/);
  assert.match(args, /--media/);
  assert.doesNotMatch(args, /SECRET CUSTOMER DIAGNOSTIC/);
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
  assert.deepEqual(gbrainSyncArgs("/tmp/openclaw-support-kb", { sourceScoped: true }), [
    "sync",
    "--repo",
    "/tmp/openclaw-support-kb",
    "--source",
    GBRAIN_SOURCE_ID,
  ]);
  assert.deepEqual(gbrainSyncArgs("/tmp/openclaw-support-kb", { sourceScoped: false }), [
    "sync",
    "--repo",
    "/tmp/openclaw-support-kb",
  ]);
  assert.deepEqual(gbrainEmbedStaleArgs({ sourceScoped: true }), ["embed", "--stale", "--source", GBRAIN_SOURCE_ID]);
  assert.deepEqual(gbrainEmbedStaleArgs({ sourceScoped: false }), ["embed", "--stale"]);
  assert.deepEqual(gbrainSearchArgs("Hermes config", { sourceScoped: true }), [
    "search",
    "Hermes config",
    "--source",
    GBRAIN_SOURCE_ID,
  ]);
  assert.deepEqual(gbrainSearchArgs("Hermes config", { sourceScoped: false }), ["search", "Hermes config"]);

  for (const script of ["scripts/update-client.mjs", "scripts/sync-local.mjs"]) {
    const text = readFileSync(path.join(repoRoot, script), "utf8");
    assert.match(text, /import\s+\{[\s\S]*ensureGbrainSource[\s\S]*\}\s+from\s+"\.\/lib\/openclaw-support-kb\.mjs"/);
    assert.match(text, /ensureGbrainSource\s*\(\s*\{[\s\S]*targetDir[\s\S]*run[\s\S]*captureNoExit[\s\S]*gbrainCommand[\s\S]*\}\s*\)/);
    assert.match(text, /run\s*\(\s*gbrainCommand\s*,\s*gbrainSyncArgs/);
    assert.match(text, /run\s*\(\s*gbrainCommand\s*,\s*gbrainEmbedStaleArgs/);
    assert.doesNotMatch(text, /\[\s*"embed"\s*,\s*"--stale"\s*\]/);
    assert.doesNotMatch(text, /"sources"\s*,\s*"add"/);
  }
});

test("GBrain command discovery prefers the OpenClaw extension before stale PATH shims", () => {
  const calls = [];
  const resolved = resolveGbrainCommand({
    home: "/Users/test",
    captureNoExit(command, args) {
      calls.push([command, args]);
      if (command === "gbrain") return { status: 0, stdout: "gbrain 0.26.6", stderr: "" };
      if (command === "/Users/test/.openclaw/extensions/gbrain/bin/gbrain") return { status: 0, stdout: "gbrain 0.27.0", stderr: "" };
      return { missing: true };
    },
  });

  assert.equal(resolved.command, "/Users/test/.openclaw/extensions/gbrain/bin/gbrain");
  assert.deepEqual(calls[0], ["/Users/test/.bun/bin/gbrain", ["--version"]]);
  assert.ok(calls.some(([command]) => command === "/Users/test/.openclaw/extensions/gbrain/bin/gbrain"));
  assert.ok(!calls.some(([command]) => command === "gbrain"));
});

test("GBrain command discovery prefers Bun-linked Eva Brain before stale legacy shims", () => {
  const calls = [];
  const resolved = resolveGbrainCommand({
    home: "/Users/test",
    captureNoExit(command, args) {
      calls.push([command, args]);
      if (command === "/Users/test/.bun/bin/gbrain") return { status: 0, stdout: "gbrain 0.28.10", stderr: "" };
      if (command === "/Users/test/gbrain/bin/gbrain") return { status: 0, stdout: "gbrain 0.26.6", stderr: "" };
      return { missing: true };
    },
  });

  assert.equal(resolved.command, "/Users/test/.bun/bin/gbrain");
  assert.deepEqual(calls[0], ["/Users/test/.bun/bin/gbrain", ["--version"]]);
  assert.ok(!calls.some(([command]) => command === "/Users/test/gbrain/bin/gbrain"));
});

test("GBRAIN_BIN override is probed before PATH and local fallbacks", () => {
  const previous = process.env.GBRAIN_BIN;
  process.env.GBRAIN_BIN = "/Users/test/custom/bin/gbrain";
  try {
    const calls = [];
    const resolved = resolveGbrainCommand({
      home: "/Users/test",
      captureNoExit(command, args) {
        calls.push([command, args]);
        if (command === "/Users/test/custom/bin/gbrain") {
          return { status: 0, stdout: "gbrain 0.27.0", stderr: "" };
        }
        return { status: 0, stdout: "gbrain 0.99.0", stderr: "" };
      },
    });

    assert.equal(resolved.command, "/Users/test/custom/bin/gbrain");
    assert.deepEqual(calls[0], ["/Users/test/custom/bin/gbrain", ["--version"]]);
    assert.equal(calls.length, 1);
  } finally {
    if (previous === undefined) delete process.env.GBRAIN_BIN;
    else process.env.GBRAIN_BIN = previous;
  }
});

test("auto-update PATH includes local GBrain and OpenClaw fallbacks", () => {
  const value = withCommandPathFallbacks("/usr/bin:/bin", "/Users/test");
  assert.match(value, /\/Users\/test\/\.bun\/bin/);
  assert.match(value, /\/Users\/test\/\.openclaw\/extensions\/gbrain\/bin/);
  assert.match(value, /\/Users\/test\/gbrain\/bin/);
  assert.match(value, /\/Users\/test\/\.openclaw\/bin/);
});

test("auto-update PATH filters transient agent entries before printing cron commands", () => {
  assert.equal(isStableCommandPathEntry("/usr/bin"), true);
  assert.equal(isStableCommandPathEntry("/Users/test/.codex/tmp/abc/bin"), false);
  assert.equal(isStableCommandPathEntry("/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin"), false);
  assert.equal(isStableCommandPathEntry("/Applications/Codex.app/Contents/Resources"), false);
  assert.equal(isStableCommandPathEntry("/private/var/folders/zz/temp/bin"), false);
  assert.equal(isStableCommandPathEntry("/tmp/runtime-bin"), false);
  assert.equal(isStableCommandPathEntry("relative/bin"), false);

  const value = withCommandPathFallbacks(
    [
      "/Users/test/.codex/tmp/abc/bin",
      "/usr/bin",
      "/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin",
      "/Applications/Codex.app/Contents/Resources",
      "relative/bin",
      "/private/var/folders/zz/temp/bin",
      "/bin",
      "/tmp/runtime-bin",
    ].join(path.delimiter),
    "/Users/test",
  );

  assert.doesNotMatch(value, /\.codex\/tmp/);
  assert.doesNotMatch(value, /codex\.system\/bootstrap/);
  assert.doesNotMatch(value, /Codex\.app\/Contents\/Resources/);
  assert.doesNotMatch(value, /private\/var\/folders/);
  assert.doesNotMatch(value, /(^|:)relative\/bin(:|$)/);
  assert.doesNotMatch(value, /(^|:)\/tmp\/runtime-bin(:|$)/);
  assert.match(value, /\/usr\/bin/);
  assert.match(value, /\/Users\/test\/\.openclaw\/extensions\/gbrain\/bin/);
});

test("GBrain env loader supplies embedding credentials without overriding process env", async () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "openclaw-kb-gbrain-env-"));
  const envFile = path.join(tmp, ".gbrain", "gbrain.env");
  mkdirSync(path.dirname(envFile), { recursive: true });
  writeFileSync(
    envFile,
    [
      "# Local GBrain provider config",
      "export VOYAGE_API_KEY='voyage-secret # not a comment'",
      'GBRAIN_EMBEDDING_MODEL="voyage:voyage-4-large"',
      "GBRAIN_EMBEDDING_DIMENSIONS=2048 # inline comment",
      "BAD-NAME=ignored",
      "",
    ].join("\n"),
  );

  assert.deepEqual(parseGbrainEnvContent("A=one\nexport B='two # kept'\nC=three # dropped\nBAD-NAME=no\n"), {
    A: "one",
    B: "two # kept",
    C: "three",
  });

  const env = { VOYAGE_API_KEY: "already-set" };
  const loaded = await loadGbrainEnvFile({ home: tmp, env });

  assert.equal(loaded.ok, true);
  assert.equal(loaded.loaded, true);
  assert.equal(env.VOYAGE_API_KEY, "already-set");
  assert.equal(env.GBRAIN_EMBEDDING_MODEL, "voyage:voyage-4-large");
  assert.equal(env.GBRAIN_EMBEDDING_DIMENSIONS, "2048");
  assert.equal(env["BAD-NAME"], undefined);

  for (const script of ["scripts/update-client.mjs", "scripts/run-client-update.mjs"]) {
    const text = readFileSync(path.join(repoRoot, script), "utf8");
    assert.match(text, /import\s+\{[\s\S]*loadGbrainEnvFile[\s\S]*\}\s+from\s+"\.\/lib\/openclaw-support-kb\.mjs"/);
    assert.match(text, /await\s+loadGbrainEnvFile\s*\(\s*\)/);
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
        if (args[1] === "list" && args[2] === "--json") {
          return {
            status: 0,
            stdout: JSON.stringify({ sources: [{ id: GBRAIN_SOURCE_ID, local_path: "/tmp/openclaw-support-kb", page_count: 616 }] }),
            stderr: "",
          };
        }
        return { status: 0, stdout: "", stderr: "" };
      },
      warn() {},
    }),
  );

  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0][1], ["sources", "list", "--json"]);
  assert.deepEqual(calls[1][1], ["sources", "federate", GBRAIN_SOURCE_ID]);
  assert.ok(!calls.some(([, args]) => args[1] === "add"));
});

test("GBrain source registration recreates stale existing source paths", () => {
  const calls = [];
  assert.doesNotThrow(() =>
    ensureGbrainSource({
      targetDir: "/tmp/openclaw-support-kb",
      run() {
        throw new Error("run should not be used when captureNoExit exists");
      },
      captureNoExit(command, args) {
        calls.push([command, args]);
        if (args[1] === "list" && args[2] === "--json") {
          return {
            status: 0,
            stdout: JSON.stringify({
              sources: [
                {
                  id: GBRAIN_SOURCE_ID,
                  local_path: "/tmp/openclaw-support-kb.pre-git-123",
                  page_count: 616,
                  federated: true,
                },
              ],
            }),
            stderr: "",
          };
        }
        if (args[1] === "add") return { status: 0, stdout: "", stderr: "" };
        return { status: 0, stdout: "", stderr: "" };
      },
      warn() {},
    }),
  );

  assert.ok(calls.some(([, args]) => args.join(" ") === `sources remove ${GBRAIN_SOURCE_ID} --yes`));
  assert.equal(calls.filter(([, args]) => args[1] === "add").length, 1);
  assert.deepEqual(calls.at(-1)[1], ["sources", "federate", GBRAIN_SOURCE_ID]);
});

test("GBrain source registration skips add when list already proves the correct source", () => {
  const calls = [];
  assert.doesNotThrow(() =>
    ensureGbrainSource({
      targetDir: "/tmp/openclaw-support-kb",
      run() {
        throw new Error("run should not be used when captureNoExit exists");
      },
      captureNoExit(command, args) {
        calls.push([command, args]);
        if (args[1] === "list" && args[2] === "--json") {
          return {
            status: 0,
            stdout: JSON.stringify({
              sources: [
                {
                  id: GBRAIN_SOURCE_ID,
                  local_path: "/tmp/openclaw-support-kb",
                  page_count: 616,
                  federated: true,
                },
              ],
            }),
            stderr: "",
          };
        }
        if (args[1] === "add") return { status: 1, stdout: "", stderr: "Error: command failed" };
        return { status: 0, stdout: "", stderr: "" };
      },
      warn() {},
    }),
  );

  assert.deepEqual(calls.map(([, args]) => args), [
    ["sources", "list", "--json"],
    ["sources", "federate", GBRAIN_SOURCE_ID],
  ]);
});

test("GBrain source registration falls back for legacy GBrain without sources command", () => {
  const calls = [];
  const result = ensureGbrainSource({
    targetDir: "/tmp/openclaw-support-kb",
    run() {
      throw new Error("run should not be used when captureNoExit exists");
    },
    captureNoExit(command, args) {
      calls.push([command, args]);
      return { status: 1, stdout: "Unknown command: sources", stderr: "Run gbrain --help" };
    },
    warn() {},
    gbrainCommand: "/Users/test/gbrain/bin/gbrain",
  });

  assert.equal(result.sourceScoped, false);
  assert.deepEqual(calls.map(([command, args]) => [command, args]), [
    ["/Users/test/gbrain/bin/gbrain", ["sources", "list", "--json"]],
    ["/Users/test/gbrain/bin/gbrain", ["sources", "list"]],
    [
      "/Users/test/gbrain/bin/gbrain",
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
  ]);
});

test("GBrain legacy source fallback requires sources-specific unsupported command errors", () => {
  assert.throws(
    () =>
      ensureGbrainSource({
        targetDir: "/tmp/openclaw-support-kb",
        run() {
          throw new Error("run should not be used when captureNoExit exists");
        },
        captureNoExit() {
          return { status: 1, stdout: "invalid command option: --federated", stderr: "" };
        },
        warn() {},
      }),
    /gbrain sources add failed/,
  );
});

test("named GBrain source verification detects missing or empty source pages", () => {
  const good = parseGbrainSourcesList("openclaw-support-kb   federated   616 pages  just synced\n  /tmp/openclaw-support-kb\n");
  assert.equal(good.found, true);
  assert.equal(good.pageCount, 616);
  assert.equal(good.localPath, "/tmp/openclaw-support-kb");

  const empty = verifyNamedGbrainSource({
    captureNoExit() {
      return { status: 0, stdout: "openclaw-support-kb   federated   0 pages  never synced\n", stderr: "" };
    },
  });
  assert.equal(empty.ok, false);
  assert.match(empty.reason, /0 indexed pages/);

  const missing = verifyNamedGbrainSource({
    captureNoExit() {
      return { status: 0, stdout: "default   federated   616 pages  just synced\n", stderr: "" };
    },
  });
  assert.equal(missing.ok, false);
  assert.match(missing.reason, /not found/);
});

test("GBrain source registration does not hide unrelated exists errors", () => {
  assert.equal(isBenignExistingGbrainSourceError({ stdout: "source already exists", stderr: "" }), true);
  assert.equal(isBenignExistingGbrainSourceError({ stdout: "duplicate source id", stderr: "" }), true);
  assert.equal(isBenignExistingGbrainSourceError({ stdout: "path exists but is not a valid source", stderr: "" }), false);
});
