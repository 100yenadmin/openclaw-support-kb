---
type: openclaw_doc
title: "Dashboard"
source: "https://docs.openclaw.ai/cli/dashboard"
source_hash: "eb77de5ab4877816bae6afdd41160048a5d8755bbc8cc33019430eb909ea4e3b"
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

```bash
openclaw dashboard
openclaw dashboard --no-open
openclaw dashboard --yes
```

- `--no-open`: print the URL but do not launch a browser.
- `--yes`: start/install the Gateway without prompting when needed.

Notes:

- Resolves configured `gateway.auth.token` SecretRefs when possible.
- Follows `gateway.tls.enabled`: TLS-enabled gateways print/open `https://` Control UI URLs and connect over `wss://`.
- For SecretRef-managed tokens (resolved or unresolved), the printed/copied/opened URL never includes the token, so external secrets do not leak into terminal output, clipboard history, or browser-launch arguments.
- If `gateway.auth.token` is SecretRef-managed but unresolved, the command prints a non-tokenized URL and remediation guidance instead of an invalid token placeholder.
- If clipboard/browser delivery fails for a token-authenticated URL, the command logs a safe manual-auth hint naming `OPENCLAW_GATEWAY_TOKEN`, `gateway.auth.token`, and the URL fragment key `token`, without printing the token value.

## Related

- [CLI reference](/cli)
- [Dashboard](/web/dashboard)

---
