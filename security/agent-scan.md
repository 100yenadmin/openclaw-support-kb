---
type: openclaw_security_guide
title: "Snyk Agent Scan Guide"
source: "https://github.com/snyk/agent-scan"
source_hash: "15679dd3398001600cf07647aee6a794139798a92f74efb8ee75c65cf7b3d74b"
generated_at: "2026-04-30T12:08:08.028Z"
---

# Snyk Agent Scan Guide

Source: https://github.com/snyk/agent-scan

This page is a local OpenClaw policy summary, not a verbatim upstream README. Use it to gate community skill installs.

## Install Gate

- Require `SNYK_TOKEN` before automatic community skill install.
- Scan the fetched candidate at a pinned commit or immutable archive.
- Keep the scanner spec pinned with `SNYK_AGENT_SCAN_SPEC`; default local policy is `snyk-agent-scan@0.4.0`.
- Refuse automatic install when the scanner is missing, exits non-zero, or no attestation is written.
- Refuse candidates containing symlinks, oversized files, or paths that resolve outside the candidate root.
- Do not run MCP-server scan modes or unsafe consent-bypass flags for skill install review.

## Command

```bash
SNYK_AGENT_SCAN_SPEC=snyk-agent-scan@0.4.0 \
  node ~/.gbrain/sources/openclaw-support-kb/scripts/scan-skill.mjs <candidate-skill-path>
```

The wrapper records a local attestation containing candidate path, candidate hash, scanner spec, exit status, and timestamp.

## Blocks Automatic Install

- Missing `SNYK_TOKEN`.
- Missing `uvx`.
- Scanner exit code other than 0.
- Candidate hash differs from the pinned artifact hash the user approved.
- Candidate asks for credentials, shell/network access, or configuration changes unrelated to the user's requested task.
