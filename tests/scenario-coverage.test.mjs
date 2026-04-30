import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("customer scenario guidance stays covered", () => {
  const result = spawnSync(process.execPath, ["scripts/evaluate-scenarios.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Scenario eval passed/);
});
