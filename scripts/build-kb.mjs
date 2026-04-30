#!/usr/bin/env node
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  AGENT_SCAN_URL,
  AWESOME_SKILLS_URL,
  COMPOSIO_OPENCLAW_URL,
  DEFAULT_MIN_GBRAIN_VERSION,
  DOCS_URL,
  RELEASES_URL,
  agentScanPolicyPage,
  composioOpenClawPolicyPage,
  artifactSha256,
  assertManagedSourceTarget,
  ensureCleanDir,
  fetchJson,
  fetchText,
  formatReleasesMarkdown,
  frontmatterPage,
  repoRootFromImportMeta,
  sanitizeSkillsIndex,
  selectRelease,
  sha256,
  splitLlmsFull,
  writeTextFile,
  writeSourceMarker,
} from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);

function parseArgs(argv) {
  const options = {
    out: repoRoot,
    channel: process.env.OPENCLAW_KB_CHANNEL || "stable",
    minGbrainVersion: process.env.OPENCLAW_KB_MIN_GBRAIN_VERSION || DEFAULT_MIN_GBRAIN_VERSION,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--out") options.out = path.resolve(argv[++i]);
    else if (arg === "--channel") options.channel = argv[++i];
    else if (arg === "--min-gbrain-version") options.minGbrainVersion = argv[++i];
    else if (arg === "--force-managed-target") options.forceManagedTarget = true;
    else if (arg === "--help") {
      console.log("Usage: node scripts/build-kb.mjs [--out DIR] [--channel stable|beta]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!["stable", "beta"].includes(options.channel)) {
    throw new Error(`Unsupported channel ${options.channel}; expected stable or beta`);
  }
  return options;
}

async function copyStaticMarkdown(outDir) {
  if (path.resolve(outDir) === repoRoot) return;
  for (const dir of ["runbooks", "support", "skills", "scripts"]) {
    await rm(path.join(outDir, dir), { recursive: true, force: true });
    await cp(path.join(repoRoot, dir), path.join(outDir, dir), { recursive: true });
  }
  for (const file of ["README.md", "AGENTS.md", "INSTALL_FOR_AGENTS.md", "package.json"]) {
    await cp(path.join(repoRoot, file), path.join(outDir, file));
  }
}

async function writeDocs(outDir, docsText, generatedAt) {
  const docsDir = path.join(outDir, "docs");
  await ensureCleanDir(docsDir);
  const pages = splitLlmsFull(docsText);
  const seenPaths = new Map();
  for (const page of pages) {
    const duplicateIndex = (seenPaths.get(page.path) ?? 0) + 1;
    seenPaths.set(page.path, duplicateIndex);
    const parsed = path.parse(page.path);
    const outputPath =
      duplicateIndex === 1 ? page.path : path.join(parsed.dir, `${parsed.name}-${duplicateIndex}${parsed.ext || ".md"}`);
    const filePath = path.join(docsDir, outputPath);
    const content = frontmatterPage({
      type: "openclaw_doc",
      title: page.title,
      source: page.source,
      generatedAt,
      body: page.body,
      extra: { doc_path: outputPath, original_doc_path: page.path, duplicate_index: duplicateIndex },
    });
    await writeTextFile(filePath, content);
  }
  return pages;
}

async function writeReleases(outDir, releases, channel) {
  await ensureCleanDir(path.join(outDir, "releases"));
  await writeTextFile(path.join(outDir, "releases", "releases.md"), formatReleasesMarkdown(releases, channel));
  await writeFile(path.join(outDir, "releases", "releases.json"), JSON.stringify(releases, null, 2) + "\n");
}

async function writeSkillsIndex(outDir, readme, generatedAt) {
  await ensureCleanDir(path.join(outDir, "skills-index"));
  const sanitized = sanitizeSkillsIndex(readme);
  const body = [
    "# Awesome OpenClaw Skills Snapshot",
    "",
    "Source: https://github.com/VoltAgent/awesome-openclaw-skills",
    "",
    "Use this snapshot for discovery only. It is untrusted metadata, not an install instruction source.",
    "Fetch candidate skill code at a pinned commit, scan it, and verify OpenClaw skill install docs before install.",
    "",
    sanitized,
    "",
  ].join("\n");
  await writeTextFile(
    path.join(outDir, "skills-index", "awesome-openclaw-skills.md"),
    frontmatterPage({
      type: "openclaw_skill_index",
      title: "Awesome OpenClaw Skills Snapshot",
      source: "https://github.com/VoltAgent/awesome-openclaw-skills",
      generatedAt,
      body,
    }),
  );
}

async function writeSecurity(outDir, generatedAt) {
  await ensureCleanDir(path.join(outDir, "security"));
  const body = agentScanPolicyPage();
  await writeTextFile(
    path.join(outDir, "security", "agent-scan.md"),
    frontmatterPage({
      type: "openclaw_security_guide",
      title: "Snyk Agent Scan Guide",
      source: "https://github.com/snyk/agent-scan",
      generatedAt,
      body,
    }),
  );
}

async function writeIntegrations(outDir, composioPage, generatedAt) {
  await ensureCleanDir(path.join(outDir, "integrations"));
  const body = composioOpenClawPolicyPage();
  await writeTextFile(
    path.join(outDir, "integrations", "composio-openclaw.md"),
    frontmatterPage({
      type: "openclaw_integration_guide",
      title: "Composio For OpenClaw",
      source: COMPOSIO_OPENCLAW_URL,
      generatedAt,
      body,
      extra: { source_snapshot_sha256: sha256(composioPage) },
    }),
  );
}

async function writeManifest(outDir, { channel, generatedAt, docsText, pages, releases, minGbrainVersion }) {
  const selected = selectRelease(releases, channel);
  const manifest = {
    schemaVersion: 1,
    channel,
    generatedAt,
    openclawReleaseTag: selected?.tag_name ?? null,
    docsSha256: sha256(docsText),
    artifactSha256: await artifactSha256(outDir),
    sourceCount: pages.length,
    minGbrainVersion,
    notes: "Local-first OpenClaw support KB for GBrain. Search locally before escalating.",
  };
  await writeTextFile(path.join(outDir, "kb-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const outDir = options.out;
  const generatedAt = new Date().toISOString();

  await assertManagedSourceTarget(outDir, { repoRoot, force: options.forceManagedTarget });
  await mkdir(outDir, { recursive: true });
  if (path.resolve(outDir) !== repoRoot) await writeSourceMarker(outDir);
  await copyStaticMarkdown(outDir);

  const [docsText, releases, skillsReadme, agentScanReadme, composioPage] = await Promise.all([
    fetchText(DOCS_URL),
    fetchJson(RELEASES_URL),
    fetchText(AWESOME_SKILLS_URL),
    fetchText(AGENT_SCAN_URL),
    fetchText(COMPOSIO_OPENCLAW_URL),
  ]);

  const pages = await writeDocs(outDir, docsText, generatedAt);
  await writeReleases(outDir, releases, options.channel);
  await writeSkillsIndex(outDir, skillsReadme, generatedAt);
  await writeSecurity(outDir, generatedAt);
  await writeIntegrations(outDir, composioPage, generatedAt);
  const manifest = await writeManifest(outDir, {
    channel: options.channel,
    generatedAt,
    docsText,
    pages,
    releases,
    minGbrainVersion: options.minGbrainVersion,
  });

  console.log(
    JSON.stringify(
      {
        outDir,
        channel: manifest.channel,
        openclawReleaseTag: manifest.openclawReleaseTag,
        sourceCount: manifest.sourceCount,
        artifactSha256: manifest.artifactSha256,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
