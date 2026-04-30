#!/usr/bin/env node
import { DEFAULT_AGENT_SCAN_SPEC } from "./lib/openclaw-support-kb.mjs";

const spec = process.env.SNYK_AGENT_SCAN_SPEC || DEFAULT_AGENT_SCAN_SPEC;
const match = /^([^@]+)@(.+)$/.exec(spec);
if (!match || match[2] === "latest") {
  console.error(`Scanner spec must be pinned as package@version, got ${spec}`);
  process.exit(1);
}

const [, packageName, version] = match;
const response = await fetch(`https://pypi.org/pypi/${encodeURIComponent(packageName)}/json`, {
  headers: { accept: "application/json", "user-agent": "openclaw-support-kb-scanner-check" },
});
if (!response.ok) {
  console.error(`Could not fetch PyPI metadata for ${packageName}: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const metadata = await response.json();
if (!metadata.releases?.[version]?.length) {
  console.error(`Pinned scanner spec does not exist on PyPI: ${spec}`);
  process.exit(1);
}

console.log(`Scanner spec exists on PyPI: ${spec}`);
