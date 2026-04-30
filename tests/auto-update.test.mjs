import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  AUTO_UPDATE_CRON_END,
  AUTO_UPDATE_CRON_START,
  defaultCronMinute,
  escapeCronPercents,
  managedCronBlock,
  shellQuote,
  upsertManagedCronBlock,
} from "../scripts/lib/auto-update.mjs";
import { SOURCE_MARKER_FILE } from "../scripts/lib/openclaw-support-kb.mjs";

const targetDir = "/Users/test/.gbrain/sources/openclaw-support-kb";
const repoRoot = path.resolve(import.meta.dirname, "..");

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function runGit(args, options = {}) {
  const result = spawnSync("git", args, { encoding: "utf8", ...options });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

async function createRemoteFixture(tempDir) {
  const remote = path.join(tempDir, "remote.git");
  const work = path.join(tempDir, "work");
  runGit(["init", "--bare", "--initial-branch=main", remote]);
  runGit(["clone", remote, work]);
  runGit(["config", "user.email", "test@example.com"], { cwd: work });
  runGit(["config", "user.name", "OpenClaw KB Test"], { cwd: work });
  await writeFile(path.join(work, "README.md"), "one\n");
  runGit(["add", "."], { cwd: work });
  runGit(["commit", "-m", "one"], { cwd: work });
  runGit(["push", "origin", "main"], { cwd: work });
  return { remote, work };
}

test("managed cron block quotes paths and preserves command ordering", () => {
  const block = managedCronBlock({
    schedule: "17 * * * *",
    nodePath: "/Users/test/Node Bin/node",
    scriptPath: "/Users/test/.gbrain/sources/openclaw-support-kb/scripts/run-client-update.mjs",
    logPath: "/Users/test/.gbrain/logs/openclaw support.log",
    targetDir,
    pathValue: "/usr/local/bin:/usr/bin:/bin",
  });

  assert.match(block, new RegExp(`^${AUTO_UPDATE_CRON_START}`));
  assert.match(block, /17 \* \* \* \*/);
  assert.match(block, /PATH='\/usr\/local\/bin:\/usr\/bin:\/bin'/);
  assert.match(block, /OPENCLAW_SUPPORT_KB_DIR='\/Users\/test\/\.gbrain\/sources\/openclaw-support-kb'/);
  assert.match(block, /OPENCLAW_SUPPORT_KB_REPO='https:\/\/github\.com\/100yenadmin\/openclaw-support-kb\.git'/);
  assert.match(block, /OPENCLAW_KB_CHANNEL='stable'/);
  assert.match(block, /'\/Users\/test\/Node Bin\/node'/);
  assert.match(block, /--reason cron/);
  assert.match(block, new RegExp(`${AUTO_UPDATE_CRON_END}$`));
});

test("managed cron block escapes cron percent characters", () => {
  const block = managedCronBlock({
    schedule: "17 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/openclaw%kb.log",
    targetDir,
    repoUrl: "https://example.com/kb%20repo.git",
  });

  assert.match(block, /kb\\%20repo/);
  assert.match(block, /openclaw\\%kb\.log/);
  assert.equal(escapeCronPercents("a%b"), "a\\%b");
});

test("managed cron block rejects multiline schedules", () => {
  assert.throws(
    () =>
      managedCronBlock({
        schedule: "17 * * * *\n* * * * * echo injected",
        nodePath: "/usr/local/bin/node",
        scriptPath: "/tmp/run-client-update.mjs",
        logPath: "/tmp/update.log",
        targetDir,
      }),
    /single line/,
  );
  assert.throws(
    () =>
      managedCronBlock({
        schedule: "17 * * * * echo injected",
        nodePath: "/usr/local/bin/node",
        scriptPath: "/tmp/run-client-update.mjs",
        logPath: "/tmp/update.log",
        targetDir,
      }),
    /exactly five/,
  );
  assert.throws(
    () =>
      managedCronBlock({
        schedule: "17 * * * ; touch /tmp/injected",
        nodePath: "/usr/local/bin/node",
        scriptPath: "/tmp/run-client-update.mjs",
        logPath: "/tmp/update.log",
        targetDir,
      }),
    /unsupported cron field|exactly five/,
  );
});

test("managed cron block appends without replacing existing crontab entries", () => {
  const existing = "SHELL=/bin/zsh\n0 0 * * * echo keep-me\n";
  const block = managedCronBlock({
    schedule: "21 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/update.log",
    targetDir,
  });

  const next = upsertManagedCronBlock(existing, block);
  assert.match(next, /echo keep-me/);
  assert.match(next, /21 \* \* \* \*/);
  assert.equal((next.match(new RegExp(AUTO_UPDATE_CRON_START, "g")) || []).length, 1);
});

test("managed cron block replaces only its own prior block", () => {
  const first = managedCronBlock({
    schedule: "21 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/update.log",
    targetDir,
  });
  const second = managedCronBlock({
    schedule: "42 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/update.log",
    targetDir,
  });

  const next = upsertManagedCronBlock(`0 0 * * * echo keep\n\n${first}\n`, second);
  assert.match(next, /echo keep/);
  assert.doesNotMatch(next, /21 \* \* \* \*/);
  assert.match(next, /42 \* \* \* \*/);
  assert.equal((next.match(new RegExp(AUTO_UPDATE_CRON_START, "g")) || []).length, 1);
});

test("managed cron block collapses duplicate managed blocks", () => {
  const first = managedCronBlock({
    schedule: "21 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/update.log",
    targetDir,
  });
  const second = managedCronBlock({
    schedule: "22 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/update.log",
    targetDir,
  });
  const replacement = managedCronBlock({
    schedule: "42 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/update.log",
    targetDir,
  });

  const next = upsertManagedCronBlock(`0 0 * * * echo keep\n\n${first}\n\n${second}\n`, replacement);
  assert.match(next, /echo keep/);
  assert.doesNotMatch(next, /21 \* \* \* \*/);
  assert.doesNotMatch(next, /22 \* \* \* \*/);
  assert.match(next, /42 \* \* \* \*/);
  assert.equal((next.match(new RegExp(AUTO_UPDATE_CRON_START, "g")) || []).length, 1);
});

test("managed cron block refuses malformed managed marker state", () => {
  const block = managedCronBlock({
    schedule: "42 * * * *",
    nodePath: "/usr/local/bin/node",
    scriptPath: "/tmp/run-client-update.mjs",
    logPath: "/tmp/update.log",
    targetDir,
  });

  assert.throws(() => upsertManagedCronBlock(`${AUTO_UPDATE_CRON_START}\n21 * * * * echo old\n`, block), /unmatched/);
  assert.throws(
    () => upsertManagedCronBlock(`${AUTO_UPDATE_CRON_END}\n21 * * * * echo old\n`, block),
    /unmatched/,
  );
  assert.throws(
    () => upsertManagedCronBlock(`${AUTO_UPDATE_CRON_START}\n${AUTO_UPDATE_CRON_START}\n${AUTO_UPDATE_CRON_END}\n`, block),
    /nested/,
  );
});

test("cron helpers are stable for shell quoting and minute jitter", () => {
  assert.equal(shellQuote("it's fine"), "'it'\\''s fine'");
  assert.throws(() => shellQuote("bad\nvalue"), /newlines/);
  assert.throws(() => shellQuote("bad\0value"), /null bytes/);
  assert.equal(defaultCronMinute("same-host"), defaultCronMinute("same-host"));
  assert.ok(defaultCronMinute("same-host") >= 0);
  assert.ok(defaultCronMinute("same-host") < 60);
});

test("auto-update installer help and default print mode do not touch crontab", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-cron-help-"));
  try {
    const fakeBin = path.join(tempDir, "bin");
    await mkdir(fakeBin, { recursive: true });
    await writeFile(path.join(fakeBin, "crontab"), "#!/bin/sh\necho crontab should not run >&2\nexit 99\n", {
      mode: 0o755,
    });
    const env = {
      ...process.env,
      PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`,
      OPENCLAW_SUPPORT_KB_DIR: path.join(tempDir, "source"),
    };

    const help = spawnSync(process.execPath, ["scripts/install-auto-update.mjs", "--help"], {
      cwd: repoRoot,
      encoding: "utf8",
      env,
    });
    assert.equal(help.status, 0, help.stderr);
    assert.match(help.stdout, /Defaults to print/);
    assert.doesNotMatch(help.stderr, /crontab should not run/);

    const printed = spawnSync(process.execPath, ["scripts/install-auto-update.mjs"], {
      cwd: repoRoot,
      encoding: "utf8",
      env,
    });
    assert.equal(printed.status, 0, printed.stderr);
    assert.match(printed.stdout, /openclaw-support-kb:auto-update/);
    assert.doesNotMatch(printed.stderr, /crontab should not run/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("auto-update installer rejects unknown args before crontab mutation", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-cron-args-"));
  try {
    const fakeBin = path.join(tempDir, "bin");
    await mkdir(fakeBin, { recursive: true });
    await writeFile(path.join(fakeBin, "crontab"), "#!/bin/sh\necho crontab should not run >&2\nexit 99\n", {
      mode: 0o755,
    });

    const result = spawnSync(process.execPath, ["scripts/install-auto-update.mjs", "--bogus"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: { ...process.env, PATH: `${fakeBin}${path.delimiter}${process.env.PATH}` },
    });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /Unknown argument/);
    assert.doesNotMatch(result.stderr, /crontab should not run/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("client updater treats a live lock owner as active past stale timeout", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-lock-"));
  try {
    const lockDir = path.join(tempDir, "locks");
    const lockPath = path.join(lockDir, "openclaw-support-kb-update.lock");
    const statusFile = path.join(tempDir, "state", "status.json");
    await mkdir(lockPath, { recursive: true });
    await writeFile(
      path.join(lockPath, "owner.json"),
      `${JSON.stringify({ id: "other-process", pid: process.pid, startedAt: "2000-01-01T00:00:00.000Z" })}\n`,
    );

    const result = spawnSync(process.execPath, ["scripts/run-client-update.mjs", "--reason", "test-live-lock"], {
      cwd: path.resolve(import.meta.dirname, ".."),
      encoding: "utf8",
      env: {
        ...process.env,
        OPENCLAW_SUPPORT_KB_DIR: path.join(tempDir, "source"),
        OPENCLAW_SUPPORT_KB_LOCK_DIR: lockDir,
        OPENCLAW_SUPPORT_KB_LOCK_STALE_MS: "1",
        OPENCLAW_SUPPORT_KB_STATUS_FILE: statusFile,
      },
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(await exists(lockPath), true);
    const status = JSON.parse(await readFile(statusFile, "utf8"));
    assert.equal(status.skipped, true);
    assert.equal(status.status, "locked");
    assert.equal(status.existingLock.id, "other-process");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("lagged shallow checkouts can fast-forward with the client updater fetch sequence", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-shallow-"));
  try {
    const { remote, work } = await createRemoteFixture(tempDir);
    const client = path.join(tempDir, "client");
    runGit(["clone", "--depth", "1", "--branch", "main", pathToFileURL(remote).href, client]);

    await writeFile(path.join(work, "README.md"), "one\ntwo\n");
    runGit(["commit", "-am", "two"], { cwd: work });
    await writeFile(path.join(work, "README.md"), "one\ntwo\nthree\n");
    runGit(["commit", "-am", "three"], { cwd: work });
    runGit(["push", "origin", "main"], { cwd: work });

    runGit(["fetch", "--prune", "origin", "main"], { cwd: client });
    runGit(["checkout", "main"], { cwd: client });
    runGit(["merge", "--ff-only", "FETCH_HEAD"], { cwd: client });

    const script = await readFile(path.join(repoRoot, "scripts", "run-client-update.mjs"), "utf8");
    assert.doesNotMatch(script, /"fetch", "--prune", "--depth", "1"/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("client updater migrates a marked non-git managed source into a git checkout", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-migrate-"));
  try {
    const { remote, work } = await createRemoteFixture(tempDir);
    await mkdir(path.join(work, "scripts"), { recursive: true });
    await writeFile(path.join(work, "scripts", "update-client.mjs"), "console.log('stub update-client ran');\n");
    await writeFile(path.join(work, "kb-manifest.json"), '{"channel":"stable","generatedAt":"test","sourceCount":1}\n');
    runGit(["add", "."], { cwd: work });
    runGit(["commit", "-m", "add updater"], { cwd: work });
    runGit(["push", "origin", "main"], { cwd: work });

    const sourceDir = path.join(tempDir, "source");
    const statusFile = path.join(tempDir, "state", "status.json");
    await mkdir(sourceDir, { recursive: true });
    await writeFile(path.join(sourceDir, SOURCE_MARKER_FILE), "managed source\n");
    await writeFile(path.join(sourceDir, "old-generated.md"), "old\n");

    const result = spawnSync(process.execPath, ["scripts/run-client-update.mjs", "--reason", "test-migrate"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        OPENCLAW_SUPPORT_KB_DIR: sourceDir,
        OPENCLAW_SUPPORT_KB_LOCK_DIR: path.join(tempDir, "locks"),
        OPENCLAW_SUPPORT_KB_STATUS_FILE: statusFile,
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: `url.${pathToFileURL(remote).href}.insteadOf`,
        GIT_CONFIG_VALUE_0: "https://github.com/100yenadmin/openclaw-support-kb.git",
      },
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(await exists(path.join(sourceDir, ".git")), true);
    assert.equal(await exists(path.join(sourceDir, "old-generated.md")), false);
    const status = JSON.parse(await readFile(statusFile, "utf8"));
    assert.equal(status.ok, true);
    assert.equal(status.reason, "test-migrate");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("client updater reclones dirty marked git source and keeps backup", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-dirty-git-"));
  try {
    const { remote, work } = await createRemoteFixture(tempDir);
    await mkdir(path.join(work, "scripts"), { recursive: true });
    await writeFile(path.join(work, "scripts", "update-client.mjs"), "console.log('stub update-client ran');\n");
    await writeFile(path.join(work, "kb-manifest.json"), '{"channel":"stable","generatedAt":"test","sourceCount":1}\n');
    runGit(["add", "."], { cwd: work });
    runGit(["commit", "-m", "add updater"], { cwd: work });
    runGit(["push", "origin", "main"], { cwd: work });

    const sourceDir = path.join(tempDir, "source");
    const statusFile = path.join(tempDir, "state", "status.json");
    runGit(["clone", pathToFileURL(remote).href, sourceDir]);
    runGit(["remote", "set-url", "origin", "https://github.com/100yenadmin/openclaw-support-kb.git"], { cwd: sourceDir });
    await writeFile(path.join(sourceDir, SOURCE_MARKER_FILE), "managed source\n");
    await writeFile(path.join(sourceDir, "README.md"), "locally generated dirty content\n");

    const result = spawnSync(process.execPath, ["scripts/run-client-update.mjs", "--reason", "test-dirty-git"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        OPENCLAW_SUPPORT_KB_DIR: sourceDir,
        OPENCLAW_SUPPORT_KB_LOCK_DIR: path.join(tempDir, "locks"),
        OPENCLAW_SUPPORT_KB_STATUS_FILE: statusFile,
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: `url.${pathToFileURL(remote).href}.insteadOf`,
        GIT_CONFIG_VALUE_0: "https://github.com/100yenadmin/openclaw-support-kb.git",
      },
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(await exists(path.join(sourceDir, ".git")), true);
    assert.equal(await exists(path.join(sourceDir, SOURCE_MARKER_FILE)), false);
    assert.equal((await readFile(path.join(sourceDir, "README.md"), "utf8")).trim(), "one");
    const backupEntries = (await readdir(tempDir)).filter((entry) => entry.startsWith("source.pre-git-"));
    assert.equal(backupEntries.length, 1);
    assert.equal(await exists(path.join(tempDir, backupEntries[0], SOURCE_MARKER_FILE)), true);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("direct client setup clones the published repo instead of building a non-git source", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-direct-clone-"));
  try {
    const { remote } = await createRemoteFixture(tempDir);
    const sourceDir = path.join(tempDir, "source");
    const fakeBin = path.join(tempDir, "bin");
    await mkdir(fakeBin, { recursive: true });
    await writeFile(
      path.join(fakeBin, "gbrain"),
      [
        "#!/bin/sh",
        "if [ \"$1\" = \"--version\" ]; then echo 'gbrain 0.27.0'; exit 0; fi",
        "if [ \"$1\" = \"sources\" ] && [ \"$2\" = \"list\" ]; then echo 'openclaw-support-kb   federated   3 pages  synced'; exit 0; fi",
        "if [ \"$1\" = \"sources\" ]; then exit 0; fi",
        "if [ \"$1\" = \"sync\" ]; then exit 0; fi",
        "if [ \"$1\" = \"embed\" ]; then exit 0; fi",
        "if [ \"$1\" = \"search\" ]; then echo 'Install OpenClaw Support KB For Agents openclaw-support-kb Telegram Setup And Repair telegram'; exit 0; fi",
        "exit 0",
        "",
      ].join("\n"),
      { mode: 0o755 },
    );

    const result = spawnSync(process.execPath, ["scripts/update-client.mjs"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        HOME: tempDir,
        PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`,
        OPENCLAW_SUPPORT_KB_DIR: sourceDir,
        OPENCLAW_SKILLS_DIR: path.join(tempDir, "skills"),
        OPENCLAW_SUPPORT_KB_SKIP_AGENTS_MD: "1",
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: `url.${pathToFileURL(remote).href}.insteadOf`,
        GIT_CONFIG_VALUE_0: "https://github.com/100yenadmin/openclaw-support-kb.git",
      },
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(await exists(path.join(sourceDir, ".git")), true);
    assert.equal(await exists(path.join(sourceDir, SOURCE_MARKER_FILE)), false);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("direct client setup refuses pre-existing git source with untrusted origin", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-bad-origin-"));
  try {
    const sourceDir = path.join(tempDir, "source");
    runGit(["init", "--initial-branch=main", sourceDir]);
    runGit(["remote", "add", "origin", "https://example.com/not-the-support-kb.git"], { cwd: sourceDir });

    const result = spawnSync(process.execPath, ["scripts/update-client.mjs"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        HOME: tempDir,
        OPENCLAW_SUPPORT_KB_DIR: sourceDir,
        OPENCLAW_SUPPORT_KB_ALLOW_NO_GBRAIN: "1",
        OPENCLAW_SUPPORT_KB_SKIP_AGENTS_MD: "1",
      },
    });

    assert.equal(result.status, 3);
    assert.match(result.stderr, /existing origin is not the official support KB repo/);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("status command reports healthy installs and stale checkpoints", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "openclaw-kb-status-"));
  try {
    const sourceDir = path.join(tempDir, "source");
    const skillsDir = path.join(tempDir, "skills");
    const fakeBin = path.join(tempDir, "bin");
    const checkpointFile = path.join(tempDir, "checkpoint.json");
    runGit(["init", "--initial-branch=main", sourceDir]);
    runGit(["config", "user.email", "test@example.com"], { cwd: sourceDir });
    runGit(["config", "user.name", "OpenClaw KB Test"], { cwd: sourceDir });
    await mkdir(fakeBin, { recursive: true });
    await writeFile(
      path.join(sourceDir, "kb-manifest.json"),
      JSON.stringify({ channel: "stable", sourceCount: 3, minGbrainVersion: "0.19.0" }),
    );
    runGit(["add", "kb-manifest.json"], { cwd: sourceDir });
    runGit(["commit", "-m", "manifest"], { cwd: sourceDir });
    for (const skill of [
      "openclaw-support-kb",
      "openclaw-config-repair",
      "openclaw-skill-discovery",
      "openclaw-support-escalation",
    ]) {
      await mkdir(path.join(skillsDir, skill), { recursive: true });
      await writeFile(path.join(skillsDir, skill, "SKILL.md"), `# ${skill}\n`);
    }
    await writeFile(
      path.join(fakeBin, "gbrain"),
      [
        "#!/bin/sh",
        "if [ \"$1\" = \"--version\" ]; then echo 'gbrain 0.27.0'; exit 0; fi",
        "if [ \"$1\" = \"sources\" ] && [ \"$2\" = \"list\" ]; then echo 'openclaw-support-kb   federated   3 pages  synced'; exit 0; fi",
        "exit 0",
        "",
      ].join("\n"),
      { mode: 0o755 },
    );

    const env = {
      ...process.env,
      HOME: tempDir,
      PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`,
      OPENCLAW_SUPPORT_KB_DIR: sourceDir,
      OPENCLAW_SKILLS_DIR: skillsDir,
      OPENCLAW_SUPPORT_KB_IMPORT_CHECKPOINT_FILE: checkpointFile,
      OPENCLAW_SUPPORT_KB_STATUS_SKIP_SEARCH: "1",
    };

    const healthy = spawnSync(process.execPath, ["scripts/status.mjs", "--json"], {
      cwd: repoRoot,
      encoding: "utf8",
      env,
    });
    assert.equal(healthy.status, 0, healthy.stderr);
    assert.equal(JSON.parse(healthy.stdout).status, "healthy");

    await writeFile(path.join(sourceDir, "local-change.md"), "dirty\n");
    const dirty = spawnSync(process.execPath, ["scripts/status.mjs", "--json"], {
      cwd: repoRoot,
      encoding: "utf8",
      env,
    });
    assert.equal(dirty.status, 1);
    const dirtyStatus = JSON.parse(dirty.stdout);
    assert.equal(dirtyStatus.source.gitStatus.dirty, true);
    assert.ok(dirtyStatus.problems.some((problem) => /local changes/.test(problem)));
    await rm(path.join(sourceDir, "local-change.md"), { force: true });

    await writeFile(
      checkpointFile,
      JSON.stringify({
        dir: sourceDir,
        totalFiles: 10,
        processedIndex: 4,
        completedFiles: 4,
        timestamp: "2000-01-01T00:00:00.000Z",
      }),
    );

    const stale = spawnSync(process.execPath, ["scripts/status.mjs", "--json"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: { ...env, OPENCLAW_SUPPORT_KB_CHECKPOINT_STALE_MS: "1" },
    });
    assert.equal(stale.status, 1);
    const staleStatus = JSON.parse(stale.stdout);
    assert.equal(staleStatus.status, "repair-needed");
    assert.equal(staleStatus.checkpoint.stale, true);
    assert.ok(staleStatus.problems.some((problem) => /checkpoint/.test(problem)));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
