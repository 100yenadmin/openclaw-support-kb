#!/usr/bin/env node
import { appendFile } from "node:fs/promises";
import path from "node:path";
import {
  COMPOSIO_DOCS_FULL_URL,
  COMPOSIO_DOCS_INDEX_URL,
  COMPOSIO_TOOLKITS_URL,
  DOCS_URL,
  RELEASES_URL,
  composioToolkitCatalogPage,
  fetchJson,
  fetchText,
  readJsonIfExists,
  repoRootFromImportMeta,
  sanitizeReleases,
  selectRelease,
  sha256,
} from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);
const existing = (await readJsonIfExists(path.join(repoRoot, "releases", "releases.json"))) ?? [];
const manifest = (await readJsonIfExists(path.join(repoRoot, "kb-manifest.json"))) ?? {};
const [rawCurrent, docsText, composioDocsFull, composioDocsIndex, composioToolkitsHtml] = await Promise.all([
  fetchJson(RELEASES_URL),
  fetchText(DOCS_URL),
  fetchText(COMPOSIO_DOCS_FULL_URL),
  fetchText(COMPOSIO_DOCS_INDEX_URL),
  fetchText(COMPOSIO_TOOLKITS_URL),
]);
const current = sanitizeReleases(rawCurrent);

const existingStable = selectRelease(existing, "stable")?.tag_name ?? null;
const existingBeta = selectRelease(existing, "beta")?.tag_name ?? null;
const currentStable = selectRelease(current, "stable")?.tag_name ?? null;
const currentBeta = selectRelease(current, "beta")?.tag_name ?? null;
const currentDocsSha256 = sha256(docsText);
const currentComposioDocsSha256 = sha256(composioDocsFull);
const currentComposioDocsIndexSha256 = sha256(composioDocsIndex);
const currentComposioToolkitsSha256 = sha256(composioToolkitCatalogPage(composioToolkitsHtml));
const docsChanged = manifest.docsSha256 !== currentDocsSha256;
const composioDocsChanged = manifest.composioDocsSha256 !== currentComposioDocsSha256;
const composioDocsIndexChanged = manifest.composioDocsIndexSha256 !== currentComposioDocsIndexSha256;
const composioToolkitsChanged = manifest.composioToolkitsSha256 !== currentComposioToolkitsSha256;
const releaseChanged = existingStable !== currentStable || existingBeta !== currentBeta;
const shouldBuild = releaseChanged || docsChanged || composioDocsChanged || composioDocsIndexChanged || composioToolkitsChanged;

const result = {
  shouldBuild,
  releaseChanged,
  docsChanged,
  composioDocsChanged,
  composioDocsIndexChanged,
  composioToolkitsChanged,
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
};

console.log(JSON.stringify(result, null, 2));

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `should_build=${shouldBuild}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `release_changed=${releaseChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `docs_changed=${docsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `composio_docs_changed=${composioDocsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `composio_docs_index_changed=${composioDocsIndexChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `composio_toolkits_changed=${composioToolkitsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `current_stable=${currentStable ?? ""}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `current_beta=${currentBeta ?? ""}\n`);
}
