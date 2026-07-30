---
type: openclaw_integration_guide
title: "Composio Integration Guide For OpenClaw Agents"
source: "https://docs.composio.dev/llms.txt"
source_hash: "c275bfa62072836a6a652c3cbf8bba9da8c2396972c349f69cb29e7f2d095963"
system: "composio"
kb_namespace: "composio"
docs_full_sha256: "ed3bd12248743804cfe5f55acd253f8b8dd5a4a03d62b4fb046d8371508d57d8"
docs_index_sha256: "7787e3cf8a85fcb02f3417fb08b356a0ee88afb1f110f81f7d9adf1400973727"
toolkit_catalog_sha256: "3c9ad257b9d3987959ea95347caf0592bf9857c5feafcac62d98adc15284ee94"
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
