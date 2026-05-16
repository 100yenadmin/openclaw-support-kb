---
type: openclaw_doc
title: "Dashboard"
source: "https://docs.openclaw.ai/cli/dashboard"
source_hash: "1a97259a3db6ffe30f4689815c2e785fbd1d2af8cc95bd32704a2e64138e0c09"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/dashboard.md"
original_doc_path: "cli/dashboard.md"
duplicate_index: 1
---

# Dashboard
Source: https://docs.openclaw.ai/cli/dashboard



# `openclaw dashboard`

Open the Control UI using your current auth.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw dashboard
openclaw dashboard --no-open
```

Notes:

* `dashboard` resolves configured `gateway.auth.token` SecretRefs when possible.
* `dashboard` follows `gateway.tls.enabled`: TLS-enabled gateways print/open
  `https://` Control UI URLs and connect over `wss://`.
* If clipboard/browser delivery fails for a token-authenticated dashboard URL,
  `dashboard` logs a safe manual-auth hint naming `OPENCLAW_GATEWAY_TOKEN`,
  `gateway.auth.token`, and fragment key `token` without printing the token
  value.
* For SecretRef-managed tokens (resolved or unresolved), `dashboard` prints/copies/opens a non-tokenized URL to avoid exposing external secrets in terminal output, clipboard history, or browser-launch arguments.
* If `gateway.auth.token` is SecretRef-managed but unresolved in this command path, the command prints a non-tokenized URL and explicit remediation guidance instead of embedding an invalid token placeholder.

## Related

* [CLI reference](/cli)
* [Dashboard](/web/dashboard)
