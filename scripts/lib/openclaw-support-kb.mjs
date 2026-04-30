import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DOCS_URL = "https://docs.openclaw.ai/llms-full.txt";
export const RELEASES_URL = "https://api.github.com/repos/openclaw/openclaw/releases?per_page=50";
export const AWESOME_SKILLS_URL =
  "https://raw.githubusercontent.com/VoltAgent/awesome-openclaw-skills/main/README.md";
export const AGENT_SCAN_URL = "https://raw.githubusercontent.com/snyk/agent-scan/main/README.md";
export const COMPOSIO_OPENCLAW_URL = "https://composio.dev/claw";

export const DEFAULT_MIN_GBRAIN_VERSION = "0.19.0";
export const DEFAULT_AGENT_SCAN_SPEC = "snyk-agent-scan@0.5.0";
export const SOURCE_MARKER_FILE = ".openclaw-support-kb-source";
export const GBRAIN_VERIFY_QUERIES = [
  {
    label: "OpenClaw Support KB manifest",
    query: "openclaw-support-kb kb-manifest sourceCount minGbrainVersion",
    strictPatterns: [/\bopenclaw-support-kb\b/i, /\b(kb-manifest|sourceCount|minGbrainVersion)\b/i],
  },
  {
    label: "OpenClaw Telegram docs",
    query: "docs.openclaw.ai/channels/telegram allowFrom groupAllowFrom",
    strictPatterns: [/\b(allowFrom|groupAllowFrom|dmPolicy|botToken|TELEGRAM_BOT_TOKEN)\b/, /\b(telegram|channels\/telegram)\b/i],
  },
];
export const OFFICIAL_REPO_URLS = [
  "https://github.com/100yenadmin/openclaw-support-kb.git",
  "git@github.com:100yenadmin/openclaw-support-kb.git",
];
export const MANIFEST_PREFIXES = [
  "docs",
  "releases",
  "runbooks",
  "support",
  "security",
  "skills-index",
  "integrations",
  "skills",
  "scripts",
];
export const MANIFEST_ROOT_FILES = ["README.md", "INSTALL_FOR_AGENTS.md", "AGENTS.md", "package.json"];

export function repoRootFromImportMeta(metaUrl) {
  let current = path.dirname(fileURLToPath(metaUrl));
  while (current !== path.dirname(current)) {
    if (existsSync(path.join(current, "package.json"))) return current;
    current = path.dirname(current);
  }
  throw new Error(`Could not find package.json above ${metaUrl}`);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function isFullCommitSha(value) {
  return /^[a-f0-9]{40}$/i.test(String(value || ""));
}

export function validateAgentScanSpec(value) {
  const spec = String(value || "").trim();
  if (!spec) return { ok: false, reason: "scanner spec is empty" };
  const match = /^(snyk-agent-scan)@(.+)$/.exec(spec);
  if (!match) return { ok: false, reason: "scanner spec must be snyk-agent-scan@<version>" };
  if (match[2] === "latest") return { ok: false, reason: "scanner spec must be pinned to a version, not latest" };
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(match[2])) {
    return { ok: false, reason: "scanner spec version must be an explicit semver" };
  }
  return { ok: true, packageName: match[1], version: match[2], spec };
}

export function canonicalSourceDir(home = os.homedir()) {
  return path.join(home, ".gbrain", "sources", "openclaw-support-kb");
}

export async function assertManagedSourceTarget(dir, { repoRoot, force = false } = {}) {
  const target = path.resolve(dir);
  if (repoRoot && target === path.resolve(repoRoot)) return;
  if (target === path.resolve(canonicalSourceDir())) return;
  if (force) return;
  if (existsSync(path.join(target, SOURCE_MARKER_FILE))) return;
  throw new Error(
    `Refusing to rebuild unmanaged target ${target}. Use ${canonicalSourceDir()} or create ${SOURCE_MARKER_FILE} in the target first.`,
  );
}

export async function writeSourceMarker(dir) {
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, SOURCE_MARKER_FILE),
    "OpenClaw Support KB managed source directory. Generated subdirectories may be replaced by the KB builder.\n",
  );
}

export function normalizeRepoUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/g, "")
    .replace(/\.git$/i, "")
    .toLowerCase();
}

export function isOfficialRepoUrl(value) {
  const normalized = normalizeRepoUrl(value);
  return OFFICIAL_REPO_URLS.some((url) => normalizeRepoUrl(url) === normalized);
}

export function compareSemver(a, b) {
  const parse = (value) => {
    const match = String(value || "").match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;
    return match.slice(1).map((part) => Number(part));
  };
  const left = parse(a);
  const right = parse(b);
  if (!left || !right) return null;
  for (let i = 0; i < 3; i += 1) {
    if (left[i] > right[i]) return 1;
    if (left[i] < right[i]) return -1;
  }
  return 0;
}

export function validateGbrainSearchOutput(output, { strictPatterns = [] } = {}) {
  const text = String(output ?? "").trim();
  if (!text) return { ok: false, reason: "gbrain search returned no output" };
  if (/\b(no results|0 results|nothing found|no matches)\b/i.test(text)) {
    return { ok: false, reason: "gbrain search reported no results" };
  }

  for (const pattern of strictPatterns) {
    if (!pattern.test(text)) {
      return { ok: false, reason: `gbrain search output did not match ${pattern}` };
    }
  }

  return { ok: true, warnings: [] };
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9._/-]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function docsPathFromSource(sourceUrl) {
  const url = new URL(sourceUrl);
  let pathname = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!pathname || pathname === "index") pathname = "index.md";
  pathname = pathname.replace(/\/index(?:\.md)?$/i, "/index.md");
  if (!pathname.endsWith(".md")) pathname += ".md";
  return pathname
    .split("/")
    .map((part) => slugify(part).replace(/^\.+$/, "page"))
    .join("/");
}

export function splitLlmsFull(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const starts = [];

  for (let i = 0; i < lines.length; i += 1) {
    const titleMatch = /^#\s+(.+?)\s*$/.exec(lines[i]);
    if (!titleMatch) continue;

    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j += 1;
    const sourceMatch = /^Source:\s+(https?:\/\/\S+)\s*$/.exec(lines[j] ?? "");
    if (!sourceMatch) continue;
    starts.push({ index: i, title: titleMatch[1].trim(), source: sourceMatch[1].trim() });
  }

  return starts.map((start, idx) => {
    const end = starts[idx + 1]?.index ?? lines.length;
    const body = lines.slice(start.index, end).join("\n").trimEnd() + "\n";
    return {
      title: start.title,
      source: start.source,
      path: docsPathFromSource(start.source),
      body,
      hash: sha256(body),
    };
  });
}

export function selectRelease(releases, channel = "stable") {
  const filtered =
    channel === "beta" ? releases.filter((release) => !release.draft) : releases.filter((release) => !release.draft && !release.prerelease);
  return filtered[0] ?? null;
}

export function formatReleasesMarkdown(releases, channel = "stable") {
  const selected = selectRelease(releases, channel);
  const stable = selectRelease(releases, "stable");
  const beta = selectRelease(releases, "beta");
  const rows = releases
    .filter((release) => !release.draft)
    .map((release) => {
      const kind = release.prerelease ? "beta" : "stable";
      return `- ${release.tag_name} (${kind}, ${release.published_at}) - ${release.html_url}`;
    })
    .join("\n");

  return `---\ntype: openclaw_release_index\nchannel: ${channel}\nselected_release: ${selected?.tag_name ?? "unknown"}\nstable_release: ${stable?.tag_name ?? "unknown"}\nbeta_release: ${beta?.tag_name ?? "unknown"}\n---\n\n# OpenClaw Releases\n\nSelected ${channel} release: ${selected?.tag_name ?? "unknown"}\n\nLatest stable release: ${stable?.tag_name ?? "unknown"}\n\nLatest beta/prerelease: ${beta?.tag_name ?? "unknown"}\n\nSource: https://github.com/openclaw/openclaw/releases\n\n${rows}\n`;
}

export function frontmatterPage({ type, title, source, generatedAt, body, extra = {} }) {
  const extraLines = Object.entries(extra)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  return `---\ntype: ${type}\ntitle: ${JSON.stringify(title)}\nsource: ${JSON.stringify(source)}\nsource_hash: ${JSON.stringify(sha256(body))}\ngenerated_at: ${JSON.stringify(generatedAt)}${extraLines ? `\n${extraLines}` : ""}\n---\n\n${body.trimEnd()}\n`;
}

export function sanitizeSkillsIndex(readme) {
  const lines = readme.replace(/\r\n/g, "\n").split("\n");
  const kept = [];
  let inFence = false;
  let skippedLevel = 0;
  const skippedHeadings =
    /^(#{2,4})\s+(installation|manual installation|alternative|want to add a skill|openclaw ecosystem tools|security notice|why this list exists)\b/i;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (/^\s*</.test(line) || /<img\b|<a\b|<\/|<div\b|<table\b|<tr\b|<td\b|<h\d\b|<p\b|<sub\b/i.test(line)) continue;
    if (/!\[.*?\]\(/.test(line)) continue;

    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      if (skippedLevel && level <= skippedLevel) skippedLevel = 0;
      if (skippedHeadings.test(line)) {
        skippedLevel = level;
        continue;
      }
      if (skippedLevel) continue;
      const title = heading[2].replace(/[^\x00-\x7F]/g, "").trim();
      if (/^(awesome openclaw skills|table of contents)$/i.test(title)) kept.push(`${heading[1]} ${title}`);
      continue;
    }

    if (skippedLevel) continue;
    if (/^\s*\|/.test(line)) continue;
    if (/clawhub install|paste the skill|copy the skill folder|priority:/i.test(line)) continue;
    if (/^\s*-\s+\[.+?\]\(.+?\)/.test(line) || /^\s*\d+\.\s+\[.+?\]\(.+?\)/.test(line)) {
      kept.push(line.replace(/[^\x00-\x7F]/g, ""));
      continue;
    }
    if (/^>\s*\[View all/.test(line)) {
      kept.push(line.replace(/[^\x00-\x7F]/g, ""));
      continue;
    }
    if (/^\s*$/.test(line) && kept.at(-1) !== "") kept.push("");
  }

  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function agentScanPolicyPage() {
  return [
    "# Snyk Agent Scan Guide",
    "",
    "Source: https://github.com/snyk/agent-scan",
    "",
    "This page is a local OpenClaw policy summary, not a verbatim upstream README. Use it to gate community skill installs.",
    "",
    "## Install Gate",
    "",
    "- Require `SNYK_TOKEN` before automatic community skill install.",
    "- Scan the fetched candidate at a pinned commit or immutable archive.",
    `- Keep the scanner spec pinned with \`SNYK_AGENT_SCAN_SPEC\`; default local policy is \`${DEFAULT_AGENT_SCAN_SPEC}\`.`,
    "- Refuse automatic install when the scanner is missing, exits non-zero, or no attestation is written.",
    "- Refuse candidates containing symlinks, oversized files, or paths that resolve outside the candidate root.",
    "- Do not run MCP-server scan modes or unsafe consent-bypass flags for skill install review.",
    "",
    "## Command",
    "",
    "```bash",
    `SNYK_AGENT_SCAN_SPEC=${DEFAULT_AGENT_SCAN_SPEC} \\`,
    "  node ~/.gbrain/sources/openclaw-support-kb/scripts/scan-skill.mjs <candidate-skill-path>",
    "```",
    "",
    "The wrapper records a local attestation containing candidate path, candidate hash, scanner spec, exit status, and timestamp.",
    "",
    "## Blocks Automatic Install",
    "",
    "- Missing `SNYK_TOKEN`.",
    "- Missing `uvx`.",
    "- Scanner exit code other than 0.",
    "- Candidate hash differs from the pinned artifact hash the user approved.",
    "- Candidate asks for credentials, shell/network access, or configuration changes unrelated to the user's requested task.",
    "",
  ].join("\n");
}

export function composioOpenClawPolicyPage() {
  return [
    "# Composio For OpenClaw",
    "",
    "Source: https://composio.dev/claw",
    "",
    "Use this page when the user wants a small-business or chief-of-staff workflow that may need SaaS integrations such as CRM, email, calendar, support, finance, e-commerce, or content tools.",
    "",
    "## Discovery Role",
    "",
    "- Composio is not a replacement for OpenClaw skills; it is an integration/MCP option when the needed capability is an external app action.",
    "- Prefer a native/bundled/OpenClaw skill when it already solves the task locally.",
    "- Prefer Composio over browser automation for supported app actions after the user approves connecting the relevant app.",
    "- Do not add Composio or connect apps without user approval.",
    "",
    "## OpenClaw Setup Shape",
    "",
    "Composio's OpenClaw setup page describes an MCP server named `composio` using HTTP transport at `https://connect.composio.dev/mcp` and says not to add authentication headers because OAuth is handled by Composio.",
    "",
    "Use current OpenClaw MCP docs before changing config:",
    "",
    "```bash",
    "gbrain search \"Source: https://docs.openclaw.ai/cli/mcp\"",
    "gbrain search \"Source: https://docs.openclaw.ai/gateway/configuration-reference\"",
    "openclaw mcp list",
    "openclaw mcp show composio --json",
    "```",
    "",
    "If setup is approved, use a dry-run config patch or the documented `openclaw mcp set` path from the current docs. Validate afterward:",
    "",
    "```bash",
    "openclaw config validate --json",
    "openclaw doctor",
    "```",
    "",
    "## Matching Questions",
    "",
    "- Which app does the user already use?",
    "- Is the task read-only, draft-only, or allowed to send/write?",
    "- Does an OpenClaw skill already handle this with less account access?",
    "- Would Composio's OAuth-scoped app connection be safer than browser automation?",
    "- What approval should be required before sending email, updating CRM, creating invoices, or messaging customers?",
    "",
  ].join("\n");
}

export async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "openclaw-support-kb-builder",
      accept: "text/plain, application/json;q=0.9, */*;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`Fetch failed ${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

export async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

export async function ensureCleanDir(dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

export async function writeTextFile(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

export function redactSensitive(input) {
  return String(input ?? "")
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "[REDACTED_PRIVATE_KEY]")
    .replace(/https?:\/\/[^/\s:@]+:[^/\s@]+@/g, (match) => match.replace(/\/\/[^/\s:@]+:[^/\s@]+@/, "//[REDACTED_CREDENTIALS]@"))
    .replace(
      /([A-Z0-9_]*(?:TOKEN|PASSWORD|SECRET|API_KEY|BOT_TOKEN|ACCESS_TOKEN|REFRESH_TOKEN)[A-Z0-9_]*|botToken|apiKey|webhookSecret|accessToken|refreshToken|password|secret|token)(["'\s]*[:=]\s*["']?)([^"'\s,}]+)/gi,
      "$1$2[REDACTED]",
    )
    .replace(/(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/g, "$1 [REDACTED]")
    .replace(/(sk-[A-Za-z0-9_-]{12,})/g, "[REDACTED_API_KEY]")
    .replace(/\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/g, "[REDACTED_GITHUB_TOKEN]")
    .replace(/\bnpm_[A-Za-z0-9]{20,}\b/g, "[REDACTED_NPM_TOKEN]")
    .replace(/\b(xox[baprs]-[A-Za-z0-9-]{10,})\b/g, "[REDACTED_SLACK_TOKEN]")
    .replace(/\bya29\.[A-Za-z0-9_-]{20,}\b/g, "[REDACTED_OAUTH_TOKEN]")
    .replace(/([0-9]{6,}:[A-Za-z0-9_-]{20,})/g, "[REDACTED_TELEGRAM_TOKEN]");
}

export function buildSupportDraft({
  issue,
  docsConsulted = [],
  searchQueries = [],
  commandsTried = [],
  kbManifest = {},
  diagnostics = "",
}) {
  const cleanIssue = redactSensitive(issue || "Describe the issue here.");
  const cleanDocs = docsConsulted.map((item) => redactSensitive(item));
  const cleanSearches = searchQueries.map((item) => redactSensitive(item));
  const cleanCommands = commandsTried.map((item) => redactSensitive(item));
  const lines = [
    "# OpenClaw Support Request",
    "",
    `Issue: ${cleanIssue}`,
    "",
    "## Environment",
    `- OpenClaw version: ${kbManifest.openclawReleaseTag ?? "unknown"}`,
    `- KB generated at: ${kbManifest.generatedAt ?? "unknown"}`,
    `- KB channel: ${kbManifest.channel ?? "unknown"}`,
    "",
    "## Docs Consulted",
    ...(cleanDocs.length ? cleanDocs.map((item) => `- ${item}`) : ["- None recorded"]),
    "",
    "## Local Searches",
    ...(cleanSearches.length ? cleanSearches.map((item) => `- ${item}`) : ["- None recorded"]),
    "",
    "## Commands Tried",
    ...(cleanCommands.length ? cleanCommands.map((item) => `- ${item}`) : ["- None recorded"]),
    "",
    "## Redacted Diagnostics",
    "```text",
    redactSensitive(diagnostics || "No diagnostics captured."),
    "```",
    "",
    "Please help me diagnose the next safe step.",
    "",
  ];
  return lines.join("\n");
}

export async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export async function hashFiles(root, relativePaths) {
  const hash = createHash("sha256");
  for (const relativePath of relativePaths.sort()) {
    hash.update(relativePath);
    hash.update("\0");
    hash.update(await readFile(path.join(root, relativePath)));
    hash.update("\0");
  }
  return hash.digest("hex");
}

export async function listFiles(root, prefixes = MANIFEST_PREFIXES, rootFiles = MANIFEST_ROOT_FILES) {
  const result = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(root, fullPath);
      if (entry.isDirectory()) await walk(fullPath);
      else result.push(relativePath);
    }
  }

  for (const prefix of prefixes) await walk(path.join(root, prefix));
  for (const file of rootFiles) {
    if (await pathExists(path.join(root, file))) result.push(file);
  }
  return result.filter((file) => !file.endsWith(".DS_Store") && file !== "kb-manifest.json");
}

export async function artifactSha256(root, prefixes = MANIFEST_PREFIXES) {
  return hashFiles(root, await listFiles(root, prefixes));
}
