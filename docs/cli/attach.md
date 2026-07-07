---
type: openclaw_doc
title: "Attach CLI"
source: "https://docs.openclaw.ai/cli/attach"
source_hash: "a4c8e622784e9e0b5bae13ced9798ce225435c8c20e94cb7c69490e3f2fbab6f"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/attach.md"
original_doc_path: "cli/attach.md"
duplicate_index: 1
---

# Attach CLI
Source: https://docs.openclaw.ai/cli/attach

`openclaw attach` launches Claude Code with a strict temporary MCP config bound to one Gateway session.

```sh
openclaw attach
openclaw attach --session agent:main:telegram:123 --ttl 600000
openclaw attach --print-config
```

Options:

- `--session <key>` binds the grant to a Gateway session. Defaults to the main session.
- `--ttl <ms>` requests a positive grant TTL in milliseconds. The Gateway applies its own ceiling.
- `--bin <path>` selects the Claude Code binary. Default: `claude`.
- `--print-config` writes the temporary `.mcp.json`, prints the launch command and env, and leaves the grant live until TTL expiry (it does not spawn Claude Code or revoke the grant).

The bearer token is passed through environment variables, not argv. OpenClaw launches Claude Code with `--strict-mcp-config --mcp-config <path>` so ambient Claude MCP servers do not join the attached session. Normal launches (without `--print-config`) revoke the grant when the Claude Code process exits.

See also: [Gateway CLI](/cli/gateway), [MCP CLI](/cli/mcp), and [ACP CLI](/cli/acp).

---
