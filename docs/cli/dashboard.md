---
type: openclaw_doc
title: "Dashboard"
source: "https://docs.openclaw.ai/cli/dashboard"
source_hash: "c6f12a9570ecf1b4295d012501a4f568132f451186af3fae46380578a649ab79"
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
