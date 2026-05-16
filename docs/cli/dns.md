---
type: openclaw_doc
title: "DNS"
source: "https://docs.openclaw.ai/cli/dns"
source_hash: "27a3247729f819859e4ebda8c8807a713c1119b1cc30d72e266e11bbc9513b3b"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/dns.md"
original_doc_path: "cli/dns.md"
duplicate_index: 1
---

# DNS
Source: https://docs.openclaw.ai/cli/dns



# `openclaw dns`

DNS helpers for wide-area discovery (Tailscale + CoreDNS). Currently focused on macOS + Homebrew CoreDNS.

Related:

* Gateway discovery: [Discovery](/gateway/discovery)
* Wide-area discovery config: [Configuration](/gateway/configuration)

## Setup

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw dns setup
openclaw dns setup --domain openclaw.internal
openclaw dns setup --apply
```

## `dns setup`

Plan or apply CoreDNS setup for unicast DNS-SD discovery.

Options:

* `--domain <domain>`: wide-area discovery domain (for example `openclaw.internal`)
* `--apply`: install or update CoreDNS config and restart the service (requires sudo; macOS only)

What it shows:

* resolved discovery domain
* zone file path
* current tailnet IPs
* recommended `openclaw.json` discovery config
* the Tailscale Split DNS nameserver/domain values to set

Notes:

* Without `--apply`, the command is a planning helper only and prints the recommended setup.
* If `--domain` is omitted, OpenClaw uses `discovery.wideArea.domain` from config.
* `--apply` currently supports macOS only and expects Homebrew CoreDNS.
* `--apply` bootstraps the zone file if needed, ensures the CoreDNS import stanza exists, and restarts the `coredns` brew service.

## Related

* [CLI reference](/cli)
* [Discovery](/gateway/discovery)
