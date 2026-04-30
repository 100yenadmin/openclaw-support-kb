#!/usr/bin/env node
import { appendFile } from "node:fs/promises";
import path from "node:path";
import {
  DOCS_URL,
  RELEASES_URL,
  fetchJson,
  fetchText,
  readJsonIfExists,
  repoRootFromImportMeta,
  selectRelease,
  sha256,
} from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);
const existing = (await readJsonIfExists(path.join(repoRoot, "releases", "releases.json"))) ?? [];
const manifest = (await readJsonIfExists(path.join(repoRoot, "kb-manifest.json"))) ?? {};
const [current, docsText] = await Promise.all([fetchJson(RELEASES_URL), fetchText(DOCS_URL)]);

const existingStable = selectRelease(existing, "stable")?.tag_name ?? null;
const existingBeta = selectRelease(existing, "beta")?.tag_name ?? null;
const currentStable = selectRelease(current, "stable")?.tag_name ?? null;
const currentBeta = selectRelease(current, "beta")?.tag_name ?? null;
const currentDocsSha256 = sha256(docsText);
const docsChanged = manifest.docsSha256 !== currentDocsSha256;
const releaseChanged = existingStable !== currentStable || existingBeta !== currentBeta;
const shouldBuild = releaseChanged || docsChanged;

const result = {
  shouldBuild,
  releaseChanged,
  docsChanged,
  existingStable,
  currentStable,
  existingBeta,
  currentBeta,
  existingDocsSha256: manifest.docsSha256 ?? null,
  currentDocsSha256,
};

console.log(JSON.stringify(result, null, 2));

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `should_build=${shouldBuild}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `release_changed=${releaseChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `docs_changed=${docsChanged}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `current_stable=${currentStable ?? ""}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `current_beta=${currentBeta ?? ""}\n`);
}
