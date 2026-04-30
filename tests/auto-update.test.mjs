import test from "node:test";
import assert from "node:assert/strict";
import {
  AUTO_UPDATE_CRON_END,
  AUTO_UPDATE_CRON_START,
  defaultCronMinute,
  escapeCronPercents,
  managedCronBlock,
  shellQuote,
  upsertManagedCronBlock,
} from "../scripts/lib/auto-update.mjs";

const targetDir = "/Users/test/.gbrain/sources/openclaw-support-kb";

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

test("cron helpers are stable for shell quoting and minute jitter", () => {
  assert.equal(shellQuote("it's fine"), "'it'\\''s fine'");
  assert.throws(() => shellQuote("bad\nvalue"), /newlines/);
  assert.throws(() => shellQuote("bad\0value"), /null bytes/);
  assert.equal(defaultCronMinute("same-host"), defaultCronMinute("same-host"));
  assert.ok(defaultCronMinute("same-host") >= 0);
  assert.ok(defaultCronMinute("same-host") < 60);
});
