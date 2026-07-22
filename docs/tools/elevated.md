---
type: openclaw_doc
title: "Elevated mode"
source: "https://docs.openclaw.ai/tools/elevated"
source_hash: "7443e7a888f9f7486dc70254571224c68d1cabefeca08c2b5057015f7214ef4f"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/elevated.md"
original_doc_path: "tools/elevated.md"
duplicate_index: 1
---

# Elevated mode
Source: https://docs.openclaw.ai/tools/elevated

When an agent runs inside a sandbox, its `exec` commands are confined to the sandbox environment. **Elevated mode** lets the agent break out and run commands outside the sandbox instead, with configurable approval gates.

Info

  Elevated mode only changes behavior when the agent is **sandboxed**. For unsandboxed agents, exec already runs on the host.

## Directives

Control elevated mode per-session with slash commands:

| Directive        | What it does                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `/elevated on`   | Run outside the sandbox on the configured host path, keep approvals                                                             |
| `/elevated ask`  | Same as `on` (alias)                                                                                                            |
| `/elevated full` | Run outside the sandbox on the configured host path and skip approvals when the mode/host approval policy is already permissive |
| `/elevated off`  | Return to sandbox-confined execution                                                                                            |

Also available as `/elev on|off|ask|full`.

Send `/elevated` with no argument to see the current level.

## How it works

Steps


Check availability

    Elevated must be enabled in config and the sender must be on the allowlist:

    ```json5
    {
      tools: {
        elevated: {
          enabled: true,
          allowFrom: {
            discord: ["user-id-123"],
            whatsapp: ["+15555550123"],
          },
        },
      },
    }
    ```




Set the level

    Send a directive-only message to set the session default:

    ```
    /elevated full
    ```

    Or use it inline (applies to that message only):

    ```
    /elevated on run the deployment script
    ```




Commands run outside the sandbox

    With elevated active, `exec` calls leave the sandbox. The effective host is
    `gateway` by default, or `node` when the configured/session exec target is
    `node`. In `full` mode, exec approvals are skipped when the resolved exec
    mode/host approval policy is already fully permissive (security `full`,
    ask `off`); otherwise the normal approval policy still applies. In
    `on`/`ask` mode, configured approval rules always apply.


## Resolution order

1. **Inline directive** on the message (applies only to that message)
2. **Session override** (set by sending a directive-only message)
3. **Global default** (`agents.defaults.elevatedDefault` in config)

## Availability and allowlists

- **Global gate**: `tools.elevated.enabled` (must be `true`)
- **Sender allowlist**: `tools.elevated.allowFrom` with per-channel lists
- **Per-agent gate**: `agents.entries.*.tools.elevated.enabled` (can only further restrict; both the global and per-agent gate must be `true`)
- **Per-agent allowlist**: `agents.entries.*.tools.elevated.allowFrom` (sender must match both global + per-agent)
- **Channel-provided fallback allowlist**: channel plugins can optionally supply a fallback allowlist through an SDK adapter hook, used when `tools.elevated.allowFrom.<provider>` is not configured. No bundled channel currently implements this hook, so in practice every provider needs an explicit `tools.elevated.allowFrom.<provider>` entry today.
- **All gates must pass**; otherwise elevated is treated as unavailable

Allowlist entry formats:

| Prefix                  | Matches                         |
| ----------------------- | ------------------------------- |
| (none)                  | Sender ID, E.164, or From field |
| `name:`                 | Sender display name             |
| `username:`             | Sender username                 |
| `tag:`                  | Sender tag                      |
| `id:`, `from:`, `e164:` | Explicit identity targeting     |

## What elevated does not control

- **Tool policy**: if `exec` is denied by tool policy, elevated cannot override it.
- **Host selection policy**: elevated does not turn `auto` into a free cross-host override. It uses the configured/session exec target rules, choosing `node` only when the target is already `node`.
- **Separate from `/exec`**: the `/exec` directive adjusts per-session exec defaults (host, security, ask, node) for authorized senders and does not require elevated mode.

Note

  The bash chat command (`!` prefix; `/bash` alias) is a separate gate that requires `tools.elevated` to be enabled in addition to its own `tools.bash.enabled` flag. Disabling elevated locks `!` shell commands out as well.

## Related

CardGroup


Exec tool

    Shell command execution from the agent.


Exec approvals

    Approval and allowlist system for `exec`.


Sandboxing

    Gateway-level sandbox configuration.


Sandbox vs Tool Policy vs Elevated

    How the three gates compose during a tool call.

---
