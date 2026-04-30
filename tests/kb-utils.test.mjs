import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSupportDraft,
  docsPathFromSource,
  composioToolkitCatalogPage,
  frontmatterPage,
  redactSensitive,
  sanitizeReleases,
  selectRelease,
  splitComposioLlmsFull,
  splitLlmsFull,
  validateAgentScanSpec,
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

test("splitComposioLlmsFull creates source-backed docs pages", () => {
  const pages = splitComposioLlmsFull(`# Composio Documentation

Overview.

---

# Tools and toolkits (/docs/tools-and-toolkits)

Toolkit docs.

\`\`\`python
# Not a page heading (/inside-code)
\`\`\`

---

# Native Tools vs MCP (/docs/native-tools-vs-mcp)

MCP docs.
`);

  assert.equal(pages.length, 3);
  assert.equal(pages[1].source, "https://docs.composio.dev/docs/tools-and-toolkits.md");
  assert.equal(pages[1].path, "tools-and-toolkits.md");
  assert.match(pages[1].body, /Source: https:\/\/docs\.composio\.dev\/docs\/tools-and-toolkits\.md/);
  assert.equal(pages[2].path, "native-tools-vs-mcp.md");
});

test("composioToolkitCatalogPage keeps public catalog cues", () => {
  const page = composioToolkitCatalogPage(`<main>
<h1>AI native integrations for Enterprise Agents</h1>
<p>Give your agents secure access to 1000+ toolkits and 20,000+ tools.</p>
<a href="/toolkits/gmail">Gmail</a>
<a href="/toolkits/category/crm">CRM</a>
<section>Explore Toolkits
Showing 30 of 982 toolkits
Gmail
Gmail is Google's email service.
OAUTH2
Load More
Browse by Category
CRM
Workflow Automation
Never worry about agent reliability</section>
</main>`);

  assert.match(page, /Source: https:\/\/composio\.dev\/toolkits/);
  assert.match(page, /30 of 982/);
  assert.match(page, /gmail - https:\/\/composio\.dev\/toolkits\/gmail/);
  assert.doesNotMatch(page, /category\/crm -/);
});

test("selectRelease chooses stable or beta channel", () => {
  const releases = [
    { tag_name: "v2-beta.1", draft: false, prerelease: true },
    { tag_name: "v1", draft: false, prerelease: false },
  ];
  assert.equal(selectRelease(releases, "stable").tag_name, "v1");
  assert.equal(selectRelease(releases, "beta").tag_name, "v2-beta.1");
});

test("sanitizeReleases removes volatile GitHub release counters", () => {
  const sanitized = sanitizeReleases([
    {
      html_url: "https://github.com/openclaw/openclaw/releases/tag/v1",
      tag_name: "v1",
      name: "v1",
      draft: false,
      prerelease: false,
      created_at: "2026-04-30T00:00:00Z",
      published_at: "2026-04-30T00:00:00Z",
      body: "Release notes",
      reactions: { total_count: 10 },
      assets: [
        {
          name: "OpenClaw.zip",
          content_type: "application/zip",
          state: "uploaded",
          size: 10,
          digest: "sha256:abc",
          created_at: "2026-04-30T00:00:00Z",
          updated_at: "2026-04-30T00:00:00Z",
          browser_download_url: "https://example.com/OpenClaw.zip",
          download_count: 42,
        },
      ],
    },
  ]);

  assert.equal(sanitized[0].reactions, undefined);
  assert.equal(sanitized[0].assets[0].download_count, undefined);
  assert.equal(sanitized[0].assets[0].digest, "sha256:abc");
});

test("frontmatterPage keeps build timestamps out of generated pages", () => {
  const page = frontmatterPage({
    type: "test",
    title: "Test Page",
    source: "https://example.com/docs",
    generatedAt: "2026-04-30T00:00:00Z",
    body: "# Test\n",
  });

  assert.doesNotMatch(page, /generated_at:/);
  assert.match(page, /source_hash:/);
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

test("validateGbrainSearchOutput rejects empty results and enforces requested markers", () => {
  assert.equal(validateGbrainSearchOutput("").ok, false);
  assert.equal(validateGbrainSearchOutput("No results found").ok, false);

  const loose = validateGbrainSearchOutput("OpenClaw Telegram result without source", { strictPatterns: [] });
  assert.equal(loose.ok, true);

  const strict = validateGbrainSearchOutput("OpenClaw Telegram result without source", {
    strictPatterns: [/\ballowFrom\b/, /\bchannels\/telegram\b/],
  });
  assert.equal(strict.ok, false);

  const sourced = validateGbrainSearchOutput(`Source: https://docs.openclaw.ai/channels/telegram
channels.telegram.allowFrom accepts numeric user IDs; groupAllowFrom gates group senders.`, {
    strictPatterns: [/\ballowFrom\b/, /\bchannels\/telegram\b/],
  });
  assert.equal(sourced.ok, true);
  assert.deepEqual(sourced.warnings, []);
});

test("validateAgentScanSpec requires pinned snyk-agent-scan semver", () => {
  assert.equal(validateAgentScanSpec("snyk-agent-scan@0.5.0").ok, true);
  assert.equal(validateAgentScanSpec("snyk-agent-scan@latest").ok, false);
  assert.equal(validateAgentScanSpec("other-agent-scan@0.5.0").ok, false);
  assert.equal(validateAgentScanSpec("snyk-agent-scan").ok, false);
});
