#!/usr/bin/env node
import path from "node:path";
import { artifactSha256, readJsonIfExists, repoRootFromImportMeta } from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);
const manifestPath = path.join(repoRoot, "kb-manifest.json");
const manifest = await readJsonIfExists(manifestPath);

if (!manifest) {
  console.error(`Missing manifest: ${manifestPath}`);
  process.exit(1);
}

const actualArtifactSha = await artifactSha256(repoRoot);
const ok = manifest.artifactSha256 === actualArtifactSha;

console.log(
  JSON.stringify(
    {
      ok,
      expected: manifest.artifactSha256,
      actual: actualArtifactSha,
      generatedAt: manifest.generatedAt,
      channel: manifest.channel,
      openclawReleaseTag: manifest.openclawReleaseTag,
    },
    null,
    2,
  ),
);

if (!ok) {
  console.error("kb-manifest.json is stale. Run `npm run build` and commit the regenerated artifact.");
  process.exit(1);
}
