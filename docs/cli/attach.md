---
type: openclaw_doc
title: "Attach CLI"
source: "https://docs.openclaw.ai/cli/attach"
source_hash: "8e82efe8a564bfb83376e711e6d96c4f43077044e94d30af3fc5f20428844ea1"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/attach.md"
original_doc_path: "cli/attach.md"
duplicate_index: 1
---

# Attach CLI
Source: https://docs.openclaw.ai/cli/attach

`openclaw attach` launches Claude Code with a strict temporary MCP config bound
to one Gateway session.

```sh
openclaw attach
openclaw attach --session agent:main:telegram:123 --ttl 600000
openclaw attach --print-config
```

Options:

- `--session <key>` binds the grant to a Gateway session. Defaults to the main session.
- `--ttl <ms>` requests a positive grant TTL in milliseconds. The Gateway applies its own ceiling.
- `--bin <path>` selects the Claude Code binary. Defaults to `claude`.
- `--print-config` writes the temporary `.mcp.json`, prints the launch command and env, and leaves the grant live until TTL expiry.

The bearer token is passed through environment variables, not argv. OpenClaw
launches Claude Code with `--strict-mcp-config --mcp-config <path>` so ambient
Claude MCP servers do not join the attached session. Normal launches revoke the
grant when the Claude Code process exits.

See also: [Gateway CLI](/cli/gateway), [MCP CLI](/cli/mcp), and [ACP CLI](/cli/acp).

---
