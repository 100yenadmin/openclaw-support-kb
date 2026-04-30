---
type: openclaw_doc
title: "Dashboard"
source: "https://docs.openclaw.ai/cli/dashboard"
source_hash: "8d94d6dc5aaae04ef23deefd9ae4b98b5d1740707d571ac1ab32e37b79c934a8"
generated_at: "2026-04-30T12:08:08.028Z"
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
* For SecretRef-managed tokens (resolved or unresolved), `dashboard` prints/copies/opens a non-tokenized URL to avoid exposing external secrets in terminal output, clipboard history, or browser-launch arguments.
* If `gateway.auth.token` is SecretRef-managed but unresolved in this command path, the command prints a non-tokenized URL and explicit remediation guidance instead of embedding an invalid token placeholder.

## Related

* [CLI reference](/cli)
* [Dashboard](/web/dashboard)
