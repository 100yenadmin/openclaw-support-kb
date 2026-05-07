---
type: openclaw_integration_guide
title: "Composio Integration Guide For OpenClaw Agents"
source: "https://docs.composio.dev/llms.txt"
source_hash: "6d5245aa9e5c9d1ce58fc5c837bc3ade492e457dd620b9bf6f98cb253cf40f72"
docs_full_sha256: "2b2a0c793e324105454904fee638d6ee7da5124086a2d100901b0f196648350f"
docs_index_sha256: "3d1a6985c271cde7c620d386c443dd9c1a25642632d11d67e814611d994334e9"
toolkit_catalog_sha256: "f31a92da02b35a161e84f43a2a33b6afe1c865f6e4efb3c12b1ff649f2b4c8f4"
---

# Composio Integration Guide For OpenClaw Agents

Source: https://docs.composio.dev/llms.txt
Source: https://docs.composio.dev/llms-full.txt
Source: https://composio.dev/toolkits

Use this page when the user wants a small-business or chief-of-staff workflow that may need SaaS integrations such as CRM, email, calendar, support, finance, e-commerce, or content tools.

## Discovery Role

- Composio is not a replacement for OpenClaw skills; it is an integration/MCP option when the needed capability is an external app action.
- Prefer a native/bundled/OpenClaw skill when it already solves the task locally.
- Prefer Composio over browser automation for supported app actions after the user approves connecting the relevant app.
- Do not add Composio or connect apps without user approval.
- Search `integrations/composio/toolkits.md` for app coverage before proposing Composio.
- Search `integrations/composio/docs/` for current setup, auth, tools/toolkits, MCP, and troubleshooting guidance.

## Composio Setup Shape

Composio's current docs describe two integration modes: Native Tools using a provider package, and MCP using a session MCP URL. Treat the local Composio docs as the source of truth before suggesting setup steps.

Use current OpenClaw MCP docs before changing config:

```bash
gbrain search "Source: https://docs.composio.dev/docs/native-tools-vs-mcp.md"
gbrain search "Source: https://docs.composio.dev/docs/tools-and-toolkits.md"
gbrain search "Source: https://composio.dev/toolkits"
gbrain search "Source: https://docs.openclaw.ai/cli/mcp"
gbrain search "Source: https://docs.openclaw.ai/gateway/configuration-reference"
openclaw mcp list
openclaw mcp show composio --json
```

If setup is approved, use a dry-run config patch or the documented `openclaw mcp set` path from the current docs. Validate afterward:

```bash
openclaw config validate --json
openclaw doctor
```

## Matching Questions

- Which app does the user already use?
- Is the task read-only, draft-only, or allowed to send/write?
- Does an OpenClaw skill already handle this with less account access?
- Would Composio's OAuth-scoped app connection be safer than browser automation?
- What approval should be required before sending email, updating CRM, creating invoices, or messaging customers?
