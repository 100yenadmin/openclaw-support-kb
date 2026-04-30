import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSupportDraft,
  docsPathFromSource,
  redactSensitive,
  selectRelease,
  splitLlmsFull,
  validateGbrainSearchOutput,
} from "../scripts/lib/openclaw-support-kb.mjs";

test("splitLlmsFull preserves source sections and paths", () => {
  const pages = splitLlmsFull(`# Telegram
Source: https://docs.openclaw.ai/channels/telegram

Telegram docs.

# Config
Source: https://docs.openclaw.ai/cli/config.md

Config docs.
`);

  assert.equal(pages.length, 2);
  assert.equal(pages[0].title, "Telegram");
  assert.equal(pages[0].source, "https://docs.openclaw.ai/channels/telegram");
  assert.equal(pages[0].path, "channels/telegram.md");
  assert.match(pages[0].body, /Telegram docs/);
  assert.equal(pages[1].path, "cli/config.md");
});

test("docsPathFromSource normalizes extension and nested paths", () => {
  assert.equal(docsPathFromSource("https://docs.openclaw.ai/gateway/configuration"), "gateway/configuration.md");
  assert.equal(docsPathFromSource("https://docs.openclaw.ai/cli/config.md"), "cli/config.md");
});

test("selectRelease chooses stable or beta channel", () => {
  const releases = [
    { tag_name: "v2-beta.1", draft: false, prerelease: true },
    { tag_name: "v1", draft: false, prerelease: false },
  ];
  assert.equal(selectRelease(releases, "stable").tag_name, "v1");
  assert.equal(selectRelease(releases, "beta").tag_name, "v2-beta.1");
});

test("redactSensitive removes common secret shapes", () => {
  const input = `botToken: 123456:ABCdefghijklmnopqrstuvwxyz
Authorization: Bearer sk-test-secret
apiKey="sk-1234567890abcdefghijklmnop"`;
  const output = redactSensitive(input);
  assert.doesNotMatch(output, /ABCdefgh/);
  assert.doesNotMatch(output, /sk-1234567890/);
  assert.match(output, /\[REDACTED/);
});

test("buildSupportDraft includes manifest and redacts diagnostics", () => {
  const draft = buildSupportDraft({
    issue: "Telegram bot fails",
    docsConsulted: ["https://docs.openclaw.ai/channels/telegram"],
    commandsTried: ["openclaw config validate"],
    kbManifest: {
      channel: "stable",
      generatedAt: "2026-04-30T00:00:00.000Z",
      openclawReleaseTag: "v2026.4.27",
    },
    diagnostics: "password: hunter2",
  });

  assert.match(draft, /Telegram bot fails/);
  assert.match(draft, /v2026\.4\.27/);
  assert.match(draft, /https:\/\/docs\.openclaw\.ai\/channels\/telegram/);
  assert.doesNotMatch(draft, /hunter2/);
});

test("validateGbrainSearchOutput is light by default and strict on request", () => {
  assert.equal(validateGbrainSearchOutput("").ok, false);
  assert.equal(validateGbrainSearchOutput("No results found").ok, false);

  const loose = validateGbrainSearchOutput("OpenClaw Telegram result without source");
  assert.equal(loose.ok, true);
  assert.ok(loose.warnings.length > 0);

  const strict = validateGbrainSearchOutput("OpenClaw Telegram result without source", { strict: true });
  assert.equal(strict.ok, false);

  const sourced = validateGbrainSearchOutput(`Source: https://docs.openclaw.ai/channels/telegram
channels.telegram.allowFrom accepts numeric user IDs; groupAllowFrom gates group senders.`);
  assert.equal(sourced.ok, true);
  assert.deepEqual(sourced.warnings, []);
});
