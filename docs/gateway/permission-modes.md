---
type: openclaw_doc
title: "Session permission modes"
source: "https://docs.openclaw.ai/gateway/permission-modes"
source_hash: "692d669494b18c2e7800dc8086a917de5df3df84d6b3613dbfb93fc256056d49"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "gateway/permission-modes.md"
original_doc_path: "gateway/permission-modes.md"
duplicate_index: 1
---

# Session permission modes
Source: https://docs.openclaw.ai/gateway/permission-modes

Session permission modes set one session's filesystem boundary and exec escalation reviewer. The boundary is the session's canonical `sessionRoot`; the mode determines what may happen inside or outside it.

| Mode        | Filesystem access                                 | Exec escalation reviewer              |
| ----------- | ------------------------------------------------- | ------------------------------------- |
| `read-only` | Reads under `sessionRoot`; mutation tools omitted | None; exec is denied                  |
| `guarded`   | Reads and writes under `sessionRoot`              | A human after the allowlist fast path |
| `workspace` | Reads and writes under `sessionRoot`              | LLM review, with human fallback       |
| `full`      | Unrestricted filesystem access                    | None                                  |

`full` requires `operator.admin`. The other modes require `operator.write`.

## Session root and defaults

The Gateway records `sessionRoot` when it creates the session. An explicit working directory becomes the root after canonical path resolution. A session without an explicit working directory uses the selected agent's canonical workspace.

Managed worktree sessions use the worktree checkout as `sessionRoot`. A nested working directory remains the runtime `cwd`, so relative paths start there while filesystem containment covers the whole checkout.

A new managed worktree session defaults to `workspace` when no mode is specified. Other sessions with no recorded mode keep the existing config-driven behavior.

## Policy precedence and clamping

An explicit session mode takes precedence over the session's legacy `execSecurity` and `execAsk` overrides. When the mode is unset, those fields and the normal global or per-agent configuration continue to work as before.

An explicit `full` mode is the admin-authorized exception to host approval-file floors: its OpenClaw exec policy remains `full` with approvals off. Approval-file floors continue to tighten config-driven exec policy, legacy session overrides, unset modes, and every non-full session mode. Sandbox restrictions and tool allow/deny policy remain independent, and a harness may clamp an unsupported mode to a compatible safer policy tuple. Codex also continues to honor externally enforced `requirements.toml` constraints.

For the independent sandbox, tool-policy, and elevated-exec controls, see [Sandbox vs tool policy vs elevated](/gateway/sandbox-vs-tool-policy-vs-elevated).

---
