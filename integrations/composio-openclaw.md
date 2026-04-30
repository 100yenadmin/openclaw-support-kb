---
type: openclaw_integration_guide
title: "Composio For OpenClaw"
source: "https://composio.dev/claw"
source_hash: "239e633e887159044acebd347a71ffe2b26c0b5b2ed1ed28e646bda4f907b2fc"
generated_at: "2026-04-30T12:08:08.028Z"
source_snapshot_sha256: "cc6c791e96f2f9857f8ce2e8979dd2e871dc8e3b395a818cd5607ad88e139ca2"
---

# Composio For OpenClaw

Source: https://composio.dev/claw

Use this page when the user wants a small-business or chief-of-staff workflow that may need SaaS integrations such as CRM, email, calendar, support, finance, e-commerce, or content tools.

## Discovery Role

- Composio is not a replacement for OpenClaw skills; it is an integration/MCP option when the needed capability is an external app action.
- Prefer a native/bundled/OpenClaw skill when it already solves the task locally.
- Prefer Composio over browser automation for supported app actions after the user approves connecting the relevant app.
- Do not add Composio or connect apps without user approval.

## OpenClaw Setup Shape

Composio's OpenClaw setup page describes an MCP server named `composio` using HTTP transport at `https://connect.composio.dev/mcp` and says not to add authentication headers because OAuth is handled by Composio.

Use current OpenClaw MCP docs before changing config:

```bash
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
