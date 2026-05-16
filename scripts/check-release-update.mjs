#!/usr/bin/env node
import { appendFile } from "node:fs/promises";
import path from "node:path";
import {
  COMPOSIO_DOCS_FULL_URL,
  COMPOSIO_DOCS_INDEX_URL,
  COMPOSIO_TOOLKITS_URL,
  DOCS_URL,
  HERMES_DOCS_FULL_URL,
  HERMES_DOCS_INDEX_URL,
  PAPERCLIP_DOCS_INDEX_URL,
  PAPERCLIP_TREE_URL,
  RELEASES_URL,
  composioToolkitCatalogPage,
  fetchJson,
  fetchText,
  paperclipDocBody,
  paperclipDocsFromTree,
  paperclipRawUrl,
  readJsonIfExists,
  repoRootFromImportMeta,
  sanitizeReleases,
  selectRelease,
  sha256,
} from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);
const existing = (await readJsonIfExists(path.join(repoRoot, "releases", "releases.json"))) ?? [];
const manifest = (await readJsonIfExists(path.join(repoRoot, "kb-manifest.json"))) ?? {};
async function computeCurrentPaperclipDocsSha256(tree) {
  const paths = paperclipDocsFromTree(tree);
  const pages = await Promise.all(
    paths.map(async (docPath) => paperclipDocBody({ docPath, text: await fetchText(paperclipRawUrl(docPath)) })),
  );
  return sha256(pages.map((page) => `${page.source}\n${page.body}`).join("\n---\n"));
}

const [
  rawCurrent,
  docsText,
  composioDocsFull,
  composioDocsIndex,
  composioToolkitsHtml,
  hermesDocsFull,
  hermesDocsIndex,
  paperclipDocsIndex,
  paperclipTree,
] = await Promise.all([
  fetchJson(RELEASES_URL),
  fetchText(DOCS_URL),
  fetchText(COMPOSIO_DOCS_FULL_URL),
  fetchText(COMPOSIO_DOCS_INDEX_URL),
  fetchText(COMPOSIO_TOOLKITS_URL),
  fetchText(HERMES_DOCS_FULL_URL),
  fetchText(HERMES_DOCS_INDEX_URL),
  fetchText(PAPERCLIP_DOCS_INDEX_URL),
  fetchJson(PAPERCLIP_TREE_URL),
]);
const current = sanitizeReleases(rawCurrent);
const currentPaperclipDocsSha256 = await computeCurrentPaperclipDocsSha256(paperclipTree);

const existingStable = selectRelease(existing, "stable")?.tag_name ?? null;
const existingBeta = selectRelease(existing, "beta")?.tag_name ?? null;
const currentStable = selectRelease(current, "stable")?.tag_name ?? null;
const currentBeta = selectRelease(current, "beta")?.tag_name ?? null;
const currentDocsSha256 = sha256(docsText);
const currentComposioDocsSha256 = sha256(composioDocsFull);
const currentComposioDocsIndexSha256 = sha256(composioDocsIndex);
const currentComposioToolkitsSha256 = sha256(composioToolkitCatalogPage(composioToolkitsHtml));
const currentHermesDocsSha256 = sha256(hermesDocsFull);
const currentHermesDocsIndexSha256 = sha256(hermesDocsIndex);
const currentPaperclipDocsIndexSha256 = sha256(paperclipDocsIndex);
const docsChanged = manifest.docsSha256 !== currentDocsSha256;
const composioDocsChanged = manifest.composioDocsSha256 !== currentComposioDocsSha256;
const composioDocsIndexChanged = manifest.composioDocsIndexSha256 !== currentComposioDocsIndexSha256;
const composioToolkitsChanged = manifest.composioToolkitsSha256 !== currentComposioToolkitsSha256;
const hermesDocsChanged = manifest.hermesDocsSha256 !== currentHermesDocsSha256;
const hermesDocsIndexChanged = manifest.hermesDocsIndexSha256 !== currentHermesDocsIndexSha256;
const paperclipDocsChanged = manifest.paperclipDocsSha256 !== currentPaperclipDocsSha256;
const paperclipDocsIndexChanged = manifest.paperclipDocsIndexSha256 !== currentPaperclipDocsIndexSha256;
const releaseChanged = existingStable !== currentStable || existingBeta !== currentBeta;
const shouldBuild =
  releaseChanged ||
  docsChanged ||
  composioDocsChanged ||
  composioDocsIndexChanged ||
  composioToolkitsChanged ||
  hermesDocsChanged ||
  hermesDocsIndexChanged ||
  paperclipDocsChanged ||
  paperclipDocsIndexChanged;

const result = {
  shouldBuild,
  releaseChanged,
  docsChanged,
  composioDocsChanged,
  composioDocsIndexChanged,
  composioToolkitsChanged,
  hermesDocsChanged,
  hermesDocsIndexChanged,
  paperclipDocsChanged,
  paperclipDocsIndexChanged,
  existingStable,
  currentStable,
  existingBeta,
  currentBeta,
  existingDocsSha256: manifest.docsSha256 ?? null,
  currentDocsSha256,
  existingComposioDocsSha256: manifest.composioDocsSha256 ?? null,
  currentComposioDocsSha256,
  existingComposioDocsIndexSha256: manifest.composioDocsIndexSha256 ?? null,
  currentComposioDocsIndexSha256,
  existingComposioToolkitsSha256: manifest.composioToolkitsSha256 ?? null,
  currentComposioToolkitsSha256,
  existingHermesDocsSha256: manifest.hermesDocsSha256 ?? null,
  currentHermesDocsSha256,
  existingHermesDocsIndexSha256: manifest.hermesDocsIndexSha256 ?? null,
  currentHermesDocsIndexSha256,
  existingPaperclipDocsSha256: manifest.paperclipDocsSha256 ?? null,
  currentPaperclipDocsSha256,
  existingPaperclipDocsIndexSha256: manifest.paperclipDocsIndexSha256 ?? null,
  currentPaperclipDocsIndexSha256,
};

console.log(JSON.stringify(result, null, 2));

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `should_build=${shouldBuild}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `release_changed=${releaseChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `docs_changed=${docsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `composio_docs_changed=${composioDocsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `composio_docs_index_changed=${composioDocsIndexChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `composio_toolkits_changed=${composioToolkitsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `hermes_docs_changed=${hermesDocsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `hermes_docs_index_changed=${hermesDocsIndexChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `paperclip_docs_changed=${paperclipDocsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `paperclip_docs_index_changed=${paperclipDocsIndexChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `current_stable=${currentStable ?? ""}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `current_beta=${currentBeta ?? ""}\n`);
}
