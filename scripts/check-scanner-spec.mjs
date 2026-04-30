#!/usr/bin/env node
import { DEFAULT_AGENT_SCAN_SPEC, validateAgentScanSpec } from "./lib/openclaw-support-kb.mjs";

const spec = process.env.SNYK_AGENT_SCAN_SPEC || DEFAULT_AGENT_SCAN_SPEC;
const validated = validateAgentScanSpec(spec);
if (!validated.ok) {
  console.error(`Scanner spec must be pinned as snyk-agent-scan@version, got ${spec}: ${validated.reason}`);
  process.exit(1);
}

const response = await fetch(`https://pypi.org/pypi/${encodeURIComponent(validated.packageName)}/json`, {
  headers: { accept: "application/json", "user-agent": "openclaw-support-kb-scanner-check" },
});
if (!response.ok) {
  console.error(`Could not fetch PyPI metadata for ${validated.packageName}: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const metadata = await response.json();
if (!metadata.releases?.[validated.version]?.length) {
  console.error(`Pinned scanner spec does not exist on PyPI: ${spec}`);
  process.exit(1);
}

console.log(`Scanner spec exists on PyPI: ${spec}`);
