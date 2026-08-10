---
type: openclaw_doc
title: "DNS"
source: "https://docs.openclaw.ai/cli/dns"
source_hash: "6af82d41dd472cdd49160dce744e1446fa63099a0b8a8afce10faa7e677b50a7"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/dns.md"
original_doc_path: "cli/dns.md"
duplicate_index: 1
---

# DNS
Source: https://docs.openclaw.ai/cli/dns

# `openclaw dns`

DNS helpers for wide-area discovery (Tailscale + CoreDNS). Currently macOS + Homebrew CoreDNS only.

Related:

- Gateway discovery: [Discovery](/gateway/discovery)
- Wide-area discovery config: [Configuration](/gateway/configuration)

## `dns setup`

Plan or apply CoreDNS setup for unicast DNS-SD discovery.

```bash
openclaw dns setup
openclaw dns setup --domain openclaw.internal
openclaw dns setup --apply
```

| Option              | Effect                                                                              |
| ------------------- | ----------------------------------------------------------------------------------- |
| `--domain <domain>` | Wide-area discovery domain (for example `openclaw.internal`).                       |
| `--apply`           | Install/update CoreDNS config and (re)start the service. Requires sudo, macOS only. |

Without `--domain`, OpenClaw uses `discovery.wideArea.domain` from config. Setting that domain enables wide-area discovery.

Without `--apply`, the command only prints:

- Resolved discovery domain and zone file path
- Current tailnet IPs
- Recommended `openclaw.json` discovery config
- Tailscale Split DNS nameserver/domain values to set in the Tailscale admin console

With `--apply` (macOS only, requires Homebrew CoreDNS):

- Bootstraps the zone file if missing
- Adds the CoreDNS import stanza if missing
- Restarts the `coredns` brew service

## Related

- [CLI reference](/cli)
- [Discovery](/gateway/discovery)

---
