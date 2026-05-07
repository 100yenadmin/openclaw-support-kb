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
export const COMPOSIO_DOCS_INDEX_URL = "https://docs.composio.dev/llms.txt";
export const COMPOSIO_DOCS_FULL_URL = "https://docs.composio.dev/llms-full.txt";
export const COMPOSIO_TOOLKITS_URL = "https://composio.dev/toolkits";

export const DEFAULT_MIN_GBRAIN_VERSION = "0.19.0";
export const DEFAULT_AGENT_SCAN_SPEC = "snyk-agent-scan@0.5.0";
export const GBRAIN_SOURCE_ID = "openclaw-support-kb";
export const GBRAIN_SOURCE_NAME = "OpenClaw Support KB";
export const SOURCE_MARKER_FILE = ".openclaw-support-kb-source";
const GBRAIN_SOURCE_ID_PATTERN = new RegExp(`\\b${escapeRegExp(GBRAIN_SOURCE_ID)}\\b`, "i");
export const GBRAIN_VERIFY_QUERIES = [
  {
    label: "OpenClaw Support KB install guide",
    query: "Install OpenClaw Support KB For Agents",
    strictPatterns: [/\bInstall OpenClaw Support KB For Agents\b/i, /\bOpenClaw Support KB\b/i],
  },
  {
    label: "OpenClaw Telegram docs",
    query: "Telegram Setup And Repair",
    strictPatterns: [/\bTelegram Setup And Repair\b/i, /\btelegram\b/i],
  },
];
export const CANONICAL_REPO_URL = "https://github.com/electricsheephq/openclaw-support-kb.git";
export const CANONICAL_REPO_SSH_URL = "git@github.com:electricsheephq/openclaw-support-kb.git";
export const OFFICIAL_REPO_URLS = [
  CANONICAL_REPO_URL,
  CANONICAL_REPO_SSH_URL,
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

export function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
  return path.join(home, ".gbrain", "sources", GBRAIN_SOURCE_ID);
}

export function gbrainEnvFilePath({ home = os.homedir(), env = process.env } = {}) {
  return env.GBRAIN_ENV_FILE || env.GBRAIN_ENV_PATH || path.join(home, ".gbrain", "gbrain.env");
}

function unquoteEnvValue(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const quote = raw[0];
  if (quote !== "'" && quote !== '"') {
    return raw.replace(/\s+#.*$/u, "").trimEnd();
  }

  let output = "";
  for (let i = 1; i < raw.length; i += 1) {
    const char = raw[i];
    if (char === quote) return output;
    if (quote === '"' && char === "\\" && i + 1 < raw.length) {
      const next = raw[i + 1];
      if (next === "n") output += "\n";
      else if (next === "r") output += "\r";
      else if (next === "t") output += "\t";
      else output += next;
      i += 1;
      continue;
    }
    output += char;
  }
  return output;
}

export function parseGbrainEnvContent(content) {
  const values = {};
  for (const rawLine of String(content || "").split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const assignment = line.replace(/^export\s+/u, "");
    const separator = assignment.indexOf("=");
    if (separator <= 0) continue;

    const key = assignment.slice(0, separator).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key)) continue;
    values[key] = unquoteEnvValue(assignment.slice(separator + 1));
  }
  return values;
}

export async function loadGbrainEnvFile({ home = os.homedir(), env = process.env, filePath = gbrainEnvFilePath({ home, env }) } = {}) {
  let content;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return { ok: true, loaded: false, filePath, applied: 0, parsed: 0 };
    throw error;
  }

  const parsed = parseGbrainEnvContent(content);
  let applied = 0;
  for (const [key, value] of Object.entries(parsed)) {
    if (Object.hasOwn(env, key)) continue;
    env[key] = value;
    applied += 1;
  }
  return { ok: true, loaded: true, filePath, applied, parsed: Object.keys(parsed).length };
}

export function gbrainRootForSourceDir(targetDir) {
  const sourceParent = path.dirname(path.resolve(targetDir));
  if (path.basename(sourceParent) === "sources") return path.dirname(sourceParent);
  return sourceParent;
}

export function archiveRootForSourceDir(targetDir) {
  return process.env.OPENCLAW_SUPPORT_KB_ARCHIVE_DIR || path.join(gbrainRootForSourceDir(targetDir), "archive", GBRAIN_SOURCE_ID);
}

export function managedPreGitBackupDir(targetDir, { now = Date.now() } = {}) {
  return path.join(archiveRootForSourceDir(targetDir), `pre-git-${now}`);
}

export function isLegacyPreGitBackupName(name, targetDir = canonicalSourceDir()) {
  return new RegExp(`^${escapeRegExp(path.basename(targetDir))}\\.pre-git-\\d+$`).test(String(name || ""));
}

export function isIgnorableGitStatusLine(line) {
  return /^\?\?\s+\.gbrain-source$/.test(String(line || "").trim());
}

export function meaningfulGitStatusLines(output) {
  return String(output || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isIgnorableGitStatusLine(line));
}

export function commandPathFallbacks(home = os.homedir()) {
  return [
    path.join(home, ".openclaw", "extensions", "gbrain", "bin"),
    path.join(home, "gbrain", "bin"),
    path.join(home, ".gbrain", "bin"),
    path.join(home, ".local", "bin"),
    path.join(home, ".openclaw", "bin"),
    "/opt/homebrew/bin",
    "/usr/local/bin",
    "/usr/bin",
    "/bin",
  ];
}

export function isStableCommandPathEntry(entry) {
  const value = String(entry || "");
  if (!value || !path.isAbsolute(value)) return false;
  const normalized = value.replace(/\\/g, "/");
  if (normalized.includes("/.codex/tmp/")) return false;
  if (normalized.includes("/codex.system/bootstrap/")) return false;
  if (normalized.includes("/Codex.app/Contents/Resources")) return false;
  if (normalized.startsWith("/tmp/") || normalized === "/tmp") return false;
  if (normalized.startsWith("/private/tmp/") || normalized === "/private/tmp") return false;
  if (normalized.startsWith("/var/folders/")) return false;
  if (normalized.startsWith("/private/var/folders/")) return false;
  return true;
}

export function withCommandPathFallbacks(pathValue = process.env.PATH || "", home = os.homedir()) {
  const seen = new Set();
  const parts = [];
  for (const entry of String(pathValue || "").split(path.delimiter)) {
    if (!isStableCommandPathEntry(entry) || seen.has(entry)) continue;
    seen.add(entry);
    parts.push(entry);
  }
  for (const entry of commandPathFallbacks(home)) {
    if (!entry || seen.has(entry)) continue;
    seen.add(entry);
    parts.push(entry);
  }
  return parts.join(path.delimiter);
}

export function gbrainCommandCandidates(home = os.homedir()) {
  return [
    process.env.GBRAIN_BIN,
    path.join(home, ".openclaw", "extensions", "gbrain", "bin", "gbrain"),
    path.join(home, "gbrain", "bin", "gbrain"),
    path.join(home, ".gbrain", "bin", "gbrain"),
    path.join(home, ".local", "bin", "gbrain"),
    path.join(home, ".openclaw", "bin", "gbrain"),
    "gbrain",
  ].filter(Boolean);
}

export function resolveGbrainCommand({ captureNoExit, home = os.homedir() } = {}) {
  if (typeof captureNoExit !== "function") throw new Error("resolveGbrainCommand requires captureNoExit");
  let firstFound = null;
  for (const command of gbrainCommandCandidates(home)) {
    const result = captureNoExit(command, ["--version"]);
    if (result.missing) continue;
    if (result.status === 0) return { command, check: result };
    firstFound ??= { command, check: result };
  }
  return firstFound ?? { command: "gbrain", check: { missing: true } };
}

export function resultOutput(result) {
  return `${result?.stdout ?? ""}\n${result?.stderr ?? ""}`.trim();
}

export function isBenignExistingGbrainSourceError(result) {
  return /\b(already exists|already registered|duplicate source|source already exists)\b/i.test(resultOutput(result));
}

export function isUnsupportedGbrainSourcesError(result) {
  return /\b(?:unknown|invalid|unrecognized)\s+command:?\s+["'`]?\s*sources\b|\bsources:\s+not found\b/i.test(
    resultOutput(result),
  );
}

export function makeGbrainSourceError(action, result) {
  const error = new Error(`gbrain sources ${action} failed for ${GBRAIN_SOURCE_ID}`);
  error.status = result?.status ?? 1;
  error.stdout = result?.stdout ?? "";
  error.stderr = result?.stderr ?? "";
  return error;
}

export function ensureGbrainSource({ targetDir, run, captureNoExit, warn = console.warn, gbrainCommand = "gbrain" } = {}) {
  if (!targetDir) throw new Error("ensureGbrainSource requires targetDir");
  if (typeof run !== "function") throw new Error("ensureGbrainSource requires run(command, args)");

  const addArgs = [
    "sources",
    "add",
    GBRAIN_SOURCE_ID,
    "--path",
    targetDir,
    "--name",
    GBRAIN_SOURCE_NAME,
    "--federated",
  ];
  const federateArgs = ["sources", "federate", GBRAIN_SOURCE_ID];

  if (typeof captureNoExit !== "function") {
    run(gbrainCommand, addArgs);
    run(gbrainCommand, federateArgs);
    return { ok: true, sourceScoped: true };
  }

  const addResult = captureNoExit(gbrainCommand, addArgs);
  if (addResult.missing) return addResult;
  if (addResult.status !== 0 && isUnsupportedGbrainSourcesError(addResult)) {
    warn(`GBrain does not support named sources yet; syncing ${GBRAIN_SOURCE_ID} with legacy repo sync.`);
    return { ok: true, sourceScoped: false, legacy: true };
  }
  if (addResult.status !== 0 && !isBenignExistingGbrainSourceError(addResult)) {
    throw makeGbrainSourceError("add", addResult);
  }
  if (addResult.status !== 0) {
    warn(`GBrain source ${GBRAIN_SOURCE_ID} already exists; refreshing federation.`);
  }

  const sourceInfo = readGbrainSourceInfo({ captureNoExit, gbrainCommand, sourceId: GBRAIN_SOURCE_ID });
  if (sourceInfo.ok && sourceInfo.source?.found && sourceInfo.source.localPathKnown && !pathsEqual(sourceInfo.source.localPath, targetDir)) {
    warn(
      `GBrain source ${GBRAIN_SOURCE_ID} points to ${sourceInfo.source.localPath || "(no path)"}; ` +
        `recreating it at ${targetDir}.`,
    );
    const removeResult = captureNoExit(gbrainCommand, ["sources", "remove", GBRAIN_SOURCE_ID, "--yes"]);
    if (removeResult.missing) return removeResult;
    if (removeResult.status !== 0) throw makeGbrainSourceError("remove", removeResult);

    const reAddResult = captureNoExit(gbrainCommand, addArgs);
    if (reAddResult.missing) return reAddResult;
    if (reAddResult.status !== 0) throw makeGbrainSourceError("add", reAddResult);
  }

  const federateResult = captureNoExit(gbrainCommand, federateArgs);
  if (federateResult.missing) return federateResult;
  if (federateResult.status !== 0) {
    throw makeGbrainSourceError("federate", federateResult);
  }

  return { ok: true, sourceScoped: true };
}

export function gbrainSyncArgs(targetDir, sourceResult = {}) {
  const args = ["sync", "--repo", targetDir];
  if (sourceResult.sourceScoped !== false) args.push("--source", GBRAIN_SOURCE_ID);
  return args;
}

export function gbrainUpgradeHint({ command = "gbrain", installedVersion = "", minVersion = DEFAULT_MIN_GBRAIN_VERSION } = {}) {
  const versionText = installedVersion ? ` (${installedVersion})` : "";
  return [
    `GBrain${versionText} is older than required ${minVersion}.`,
    `Update GBrain before indexing: ${command} upgrade`,
    "If this machine has a source checkout at ~/gbrain but an old binary, rebuild or reinstall that checkout so the gbrain command matches the checkout version.",
  ].join(" ");
}

export function parseGbrainSourcesList(output, sourceId = GBRAIN_SOURCE_ID) {
  const text = String(output || "");
  const lines = text
    .split(/\r?\n/)
    .map((entry) => entry.trim());
  const lineIndex = lines.findIndex((entry) => new RegExp(`^${escapeRegExp(sourceId)}\\b`).test(entry));
  const line = lineIndex >= 0 ? lines[lineIndex] : "";
  if (!line) return { found: false, sourceId, pageCount: null, localPath: null, localPathKnown: false, line: "" };

  const pageMatch = /\b(\d+)\s+pages?\b/i.exec(line);
  const nextLine = lines[lineIndex + 1] || "";
  const localPath =
    nextLine && !/\bpages?\b|\blast sync\b|\bnever synced\b/i.test(nextLine) ? nextLine : null;
  return {
    found: true,
    sourceId,
    pageCount: pageMatch ? Number(pageMatch[1]) : null,
    localPath,
    localPathKnown: Boolean(localPath),
    line,
  };
}

export function parseGbrainSourcesJson(output, sourceId = GBRAIN_SOURCE_ID) {
  const parsed = JSON.parse(String(output || "{}"));
  const sources = Array.isArray(parsed?.sources) ? parsed.sources : [];
  const source = sources.find((entry) => entry?.id === sourceId);
  if (!source) return { found: false, sourceId, pageCount: null, localPath: null, localPathKnown: false, line: "" };
  return {
    found: true,
    sourceId,
    pageCount: Number.isFinite(Number(source.page_count)) ? Number(source.page_count) : null,
    localPath: source.local_path ?? null,
    localPathKnown: Object.hasOwn(source, "local_path"),
    federated: typeof source.federated === "boolean" ? source.federated : null,
    line: "",
    raw: source,
  };
}

export function pathsEqual(left, right) {
  if (!left || !right) return false;
  return path.resolve(String(left)) === path.resolve(String(right));
}

export function readGbrainSourceInfo({ captureNoExit, gbrainCommand = "gbrain", sourceId = GBRAIN_SOURCE_ID } = {}) {
  if (typeof captureNoExit !== "function") throw new Error("readGbrainSourceInfo requires captureNoExit");

  const jsonResult = captureNoExit(gbrainCommand, ["sources", "list", "--json"]);
  if (jsonResult.missing) return { ok: false, reason: "gbrain command missing", result: jsonResult };
  if (jsonResult.status === 0) {
    try {
      return { ok: true, result: jsonResult, source: parseGbrainSourcesJson(jsonResult.stdout, sourceId) };
    } catch {
      // Fall through to human output parsing. Some older source-enabled builds
      // accepted --json later than the base sources command.
    }
  }

  const result = captureNoExit(gbrainCommand, ["sources", "list"]);
  if (result.missing) return { ok: false, reason: "gbrain command missing", result };
  if (result.status !== 0) return { ok: false, reason: "gbrain sources list failed", result };
  return { ok: true, result, source: parseGbrainSourcesList(`${result.stdout ?? ""}\n${result.stderr ?? ""}`, sourceId) };
}

export function verifyNamedGbrainSource({ captureNoExit, gbrainCommand = "gbrain", sourceId = GBRAIN_SOURCE_ID } = {}) {
  if (typeof captureNoExit !== "function") throw new Error("verifyNamedGbrainSource requires captureNoExit");
  const info = readGbrainSourceInfo({ captureNoExit, gbrainCommand, sourceId });
  if (!info.ok) return info;

  const source = info.source;
  if (!source.found) return { ok: false, reason: `${sourceId} source not found`, result: info.result, source };
  if (source.pageCount === 0) return { ok: false, reason: `${sourceId} has 0 indexed pages`, result: info.result, source };
  return { ok: true, result: info.result, source };
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
  if (new RegExp(`${escapeRegExp(GBRAIN_SOURCE_ID)}\\.pre-git-|\\.gbrain/sources/[^\\s]*\\.pre-git-`, "i").test(text)) {
    return { ok: false, reason: "gbrain search output referenced a legacy pre-git backup path" };
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

export function composioDocsSourceFromPath(docPath) {
  const cleanPath = String(docPath || "").trim();
  if (!cleanPath || !cleanPath.startsWith("/")) return COMPOSIO_DOCS_FULL_URL;
  return `https://docs.composio.dev${cleanPath}${cleanPath.endsWith(".md") ? "" : ".md"}`;
}

export function splitComposioLlmsFull(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const starts = [];
  let inFence = false;
  const outputPathForSource = (source) => {
    const outputPath = docsPathFromSource(source);
    return outputPath.startsWith("docs/") ? outputPath.slice("docs/".length) : outputPath;
  };

  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*```/.test(lines[i])) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const pathMatch = /^#\s+(.+?)\s+\((\/[^)]+)\)\s*$/.exec(lines[i]);
    if (pathMatch) {
      starts.push({
        index: i,
        title: pathMatch[1].trim(),
        source: composioDocsSourceFromPath(pathMatch[2]),
        path: outputPathForSource(composioDocsSourceFromPath(pathMatch[2])),
      });
      continue;
    }

    if (i === 0 && /^#\s+Composio Documentation\s*$/.test(lines[i])) {
      starts.push({
        index: i,
        title: "Composio Documentation Overview",
        source: COMPOSIO_DOCS_FULL_URL,
        path: "overview.md",
      });
      continue;
    }

    if (/^#\s+Composio SDK\s+/.test(lines[i])) {
      starts.push({
        index: i,
        title: lines[i].replace(/^#\s+/, "").trim(),
        source: COMPOSIO_DOCS_FULL_URL,
        path: "ai-code-generator-instructions.md",
      });
    }
  }

  return starts.map((start, idx) => {
    const end = starts[idx + 1]?.index ?? lines.length;
    const section = lines.slice(start.index, end);
    const body = [section[0], `Source: ${start.source}`, "", ...section.slice(1)].join("\n").trimEnd() + "\n";
    return {
      title: start.title,
      source: start.source,
      path: start.path,
      body,
      hash: sha256(body),
    };
  });
}

export function htmlToPlainText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function composioToolkitCatalogPage(html) {
  const text = htmlToPlainText(html);
  const exploreStart = text.indexOf("Explore Toolkits");
  const exploreEnd = text.indexOf("Load More", exploreStart);
  const browseStart = text.indexOf("Browse by Category");
  const browseEnd = text.indexOf("Never worry about agent reliability", browseStart);
  const exploreText = exploreStart >= 0 ? text.slice(exploreStart, exploreEnd > exploreStart ? exploreEnd : undefined).trim() : "";
  const categoryText = browseStart >= 0 ? text.slice(browseStart, browseEnd > browseStart ? browseEnd : undefined).trim() : "";
  const slugs = [
    ...new Set(
      [...String(html || "").matchAll(/href="\/toolkits\/([^"#?]+)"/g)]
        .map((match) => match[1])
        .filter((slug) => !slug.startsWith("_next/"))
        .filter((slug) => !slug.startsWith("logos/"))
        .filter((slug) => !slug.startsWith("category/"))
        .filter((slug) => !/\.(?:svg|png|jpg|jpeg|webp|css|js|otf)$/i.test(slug)),
    ),
  ];
  const countMatch = /Showing\s+(\d+)\s+of\s+(\d+)\s+toolkits/i.exec(exploreText);

  return [
    "# Composio Toolkit Catalog Snapshot",
    "",
    `Source: ${COMPOSIO_TOOLKITS_URL}`,
    "",
    "Use this local snapshot to discover whether Composio may support an external business app. Re-check live Composio docs/toolkits before changing config or connecting accounts.",
    "",
    "## Catalog Count",
    "",
    countMatch ? `- Public catalog page showed ${countMatch[1]} of ${countMatch[2]} toolkits in the initial rendered catalog.` : "- Public catalog page advertises 1000+ toolkits.",
    "",
    "## Initial Rendered Toolkit Catalog",
    "",
    exploreText || "No rendered toolkit text captured.",
    "",
    "## Toolkit Slugs Captured From Static Page",
    "",
    ...(slugs.length ? slugs.map((slug) => `- ${slug} - ${COMPOSIO_TOOLKITS_URL}/${slug}`) : ["- No toolkit slugs captured."]),
    "",
    "## Categories",
    "",
    categoryText || "No category text captured.",
    "",
  ].join("\n");
}

export function selectRelease(releases, channel = "stable") {
  const filtered =
    channel === "beta" ? releases.filter((release) => !release.draft) : releases.filter((release) => !release.draft && !release.prerelease);
  return filtered[0] ?? null;
}

export function sanitizeReleases(releases) {
  return releases.map((release) => ({
    html_url: release.html_url,
    tag_name: release.tag_name,
    name: release.name,
    draft: Boolean(release.draft),
    prerelease: Boolean(release.prerelease),
    created_at: release.created_at,
    published_at: release.published_at,
    body: release.body ?? "",
    assets: (release.assets ?? []).map((asset) => ({
      name: asset.name,
      content_type: asset.content_type,
      state: asset.state,
      size: asset.size,
      digest: asset.digest,
      created_at: asset.created_at,
      updated_at: asset.updated_at,
      browser_download_url: asset.browser_download_url,
    })),
  }));
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
  return `---\ntype: ${type}\ntitle: ${JSON.stringify(title)}\nsource: ${JSON.stringify(source)}\nsource_hash: ${JSON.stringify(sha256(body))}${extraLines ? `\n${extraLines}` : ""}\n---\n\n${body.trimEnd()}\n`;
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

export function composioIntegrationPolicyPage() {
  return [
    "# Composio Integration Guide For OpenClaw Agents",
    "",
    `Source: ${COMPOSIO_DOCS_INDEX_URL}`,
    `Source: ${COMPOSIO_DOCS_FULL_URL}`,
    `Source: ${COMPOSIO_TOOLKITS_URL}`,
    "",
    "Use this page when the user wants a small-business or chief-of-staff workflow that may need SaaS integrations such as CRM, email, calendar, support, finance, e-commerce, or content tools.",
    "",
    "## Discovery Role",
    "",
    "- Composio is not a replacement for OpenClaw skills; it is an integration/MCP option when the needed capability is an external app action.",
    "- Prefer a native/bundled/OpenClaw skill when it already solves the task locally.",
    "- Prefer Composio over browser automation for supported app actions after the user approves connecting the relevant app.",
    "- Do not add Composio or connect apps without user approval.",
    "- Search `integrations/composio/toolkits.md` for app coverage before proposing Composio.",
    "- Search `integrations/composio/docs/` for current setup, auth, tools/toolkits, MCP, and troubleshooting guidance.",
    "",
    "## Composio Setup Shape",
    "",
    "Composio's current docs describe two integration modes: Native Tools using a provider package, and MCP using a session MCP URL. Treat the local Composio docs as the source of truth before suggesting setup steps.",
    "",
    "Use current OpenClaw MCP docs before changing config:",
    "",
    "```bash",
    "gbrain search \"Source: https://docs.composio.dev/docs/native-tools-vs-mcp.md\"",
    "gbrain search \"Source: https://docs.composio.dev/docs/tools-and-toolkits.md\"",
    "gbrain search \"Source: https://composio.dev/toolkits\"",
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

export function headersForFetch(url, env = process.env) {
  const headers = {
    "user-agent": "openclaw-support-kb-builder",
    accept: "text/plain, application/json;q=0.9, */*;q=0.8",
  };

  const parsed = new URL(url);
  const githubToken = env.GITHUB_TOKEN || env.GH_TOKEN;
  if (githubToken && parsed.hostname === "api.github.com") {
    headers.authorization = `Bearer ${githubToken}`;
    headers["x-github-api-version"] = "2022-11-28";
  }

  return headers;
}

export async function fetchText(url) {
  const response = await fetch(url, {
    headers: headersForFetch(url),
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
