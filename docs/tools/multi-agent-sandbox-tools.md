---
type: openclaw_doc
title: "Multi-agent sandbox and tools"
source: "https://docs.openclaw.ai/tools/multi-agent-sandbox-tools"
source_hash: "ccf8af401d6b0a0773316b3e955b60e9202cc3da09029799ea02d2cdade80574"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/multi-agent-sandbox-tools.md"
original_doc_path: "tools/multi-agent-sandbox-tools.md"
duplicate_index: 1
---

# Multi-agent sandbox and tools
Source: https://docs.openclaw.ai/tools/multi-agent-sandbox-tools

Each agent in a multi-agent setup can override the global sandbox and tool policy. This page covers per-agent configuration, precedence rules, and examples.

CardGroup


Sandboxing

    Backends and modes — full sandbox reference.


Sandbox vs tool policy vs elevated

    Debug "why is this blocked?"


Elevated mode

    Elevated exec for trusted senders.


Warning

Auth is scoped by agent: each agent has its own `agentDir` auth store in `~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite`. Never reuse `agentDir` across agents. Agents can read through to the default/main agent's auth profiles when they do not have a local profile, but OAuth refresh tokens are not cloned into secondary agent stores. If you copy credentials manually, copy only portable static `api_key` or `token` profiles.

---

## Configuration examples

AccordionGroup


Example 1: Personal + restricted family agent

    ```json
    {
      "agents": {
        "entries": {
          "main": {
            "default": true,
            "name": "Personal Assistant",
            "workspace": "~/.openclaw/workspace",
            "sandbox": { "mode": "off" }
          },
          "family": {
            "name": "Family Bot",
            "workspace": "~/.openclaw/workspace-family",
            "sandbox": {
              "mode": "all",
              "scope": "agent"
            },
            "tools": {
              "allow": ["read", "message"],
              "deny": ["exec", "write", "edit", "apply_patch", "process", "browser"],
              "message": {
                "crossContext": {
                  "allowWithinProvider": false,
                  "allowAcrossProviders": false
                }
              }
            }
          }
        }
      },
      "bindings": [
        {
          "agentId": "family",
          "match": {
            "channel": "whatsapp",
            "accountId": "*",
            "peer": {
              "kind": "group",
              "id": "120363424282127706@g.us"
            }
          }
        }
      ]
    }
    ```

    **Result:**

    - `main` agent: runs on host, full tool access.
    - `family` agent: runs in Docker (one container per agent), only `read` and current-conversation message sends.



Example 2: Work agent with shared sandbox

    ```json
    {
      "agents": {
        "entries": {
          "personal": {
            "default": true,
            "workspace": "~/.openclaw/workspace-personal",
            "sandbox": { "mode": "off" }
          },
          "work": {
            "workspace": "~/.openclaw/workspace-work",
            "sandbox": {
              "mode": "all",
              "scope": "shared",
              "workspaceRoot": "/tmp/work-sandboxes"
            },
            "tools": {
              "allow": ["read", "write", "apply_patch", "exec"],
              "deny": ["browser", "gateway", "discord"]
            }
          }
        }
      }
    }
    ```


Example 2b: Global coding profile + messaging-only agent

    ```json
    {
      "tools": { "profile": "coding" },
      "agents": {
        "entries": {
          "main": {
            "default": true
          },
          "support": {
            "tools": { "profile": "messaging", "allow": ["slack"] }
          }
        }
      }
    }
    ```

    **Result:**

    - default agents get coding tools.
    - `support` agent is messaging-only (+ Slack tool).



Example 3: Different sandbox modes per agent

    ```json
    {
      "agents": {
        "defaults": {
          "sandbox": {
            "mode": "non-main",
            "scope": "session"
          }
        },
        "entries": {
          "main": {
            "default": true,
            "workspace": "~/.openclaw/workspace",
            "sandbox": {
              "mode": "off"
            }
          },
          "public": {
            "workspace": "~/.openclaw/workspace-public",
            "sandbox": {
              "mode": "all",
              "scope": "agent"
            },
            "tools": {
              "allow": ["read"],
              "deny": ["exec", "write", "edit", "apply_patch"]
            }
          }
        }
      }
    }
    ```


---

## Configuration precedence

When both global (`agents.defaults.*`) and agent-specific (`agents.entries.*.*`) configs exist:

### Sandbox config

Agent-specific settings override global:

```text
agents.entries.*.sandbox.mode > agents.defaults.sandbox.mode
agents.entries.*.sandbox.scope > agents.defaults.sandbox.scope
agents.entries.*.sandbox.workspaceRoot > agents.defaults.sandbox.workspaceRoot
agents.entries.*.sandbox.workspaceAccess > agents.defaults.sandbox.workspaceAccess
agents.entries.*.sandbox.docker.* > agents.defaults.sandbox.docker.*
agents.entries.*.sandbox.browser.* > agents.defaults.sandbox.browser.*
agents.entries.*.sandbox.prune.* > agents.defaults.sandbox.prune.*
```

Note

`agents.entries.*.sandbox.{docker,browser,prune}.*` overrides `agents.defaults.sandbox.{docker,browser,prune}.*` for that agent (ignored when sandbox scope resolves to `"shared"`).

### Tool restrictions

The filtering order is:

Steps


Tool profile

    `tools.profile` or `agents.entries.*.tools.profile`.


Provider tool profile

    `tools.byProvider[provider].profile` or `agents.entries.*.tools.byProvider[provider].profile`.


Global tool policy

    `tools.allow` / `tools.deny`.


Provider tool policy

    `tools.byProvider[provider].allow/deny`.


Agent-specific tool policy

    `agents.entries.*.tools.allow/deny`.


Agent provider policy

    `agents.entries.*.tools.byProvider[provider].allow/deny`.


Sandbox tool policy

    `tools.sandbox.tools` or `agents.entries.*.tools.sandbox.tools`.


Subagent tool policy

    `tools.subagents.tools`, if applicable.


AccordionGroup


Precedence rules

    - Each level can further restrict tools, but cannot grant back denied tools from earlier levels.
    - If `agents.entries.*.tools.sandbox.tools` is set, it replaces `tools.sandbox.tools` for that agent.
    - If `agents.entries.*.tools.profile` is set, it overrides `tools.profile` for that agent.
    - Provider tool keys accept either `provider` (e.g. `google-antigravity`) or `provider/model` (e.g. `openai/gpt-5.4`).



Empty allowlist behavior

    If any explicit allowlist in that chain leaves the run with no callable tools, OpenClaw stops before submitting the prompt to the model. This is intentional: an agent configured with a missing tool such as `agents.entries.*.tools.allow: ["query_db"]` should fail loudly until the plugin that registers `query_db` is enabled, not continue as a text-only agent.


Tool policies support `group:*` shorthands that expand to multiple tools. See [Tool groups](/gateway/sandbox-vs-tool-policy-vs-elevated#tool-groups-shorthands) for the full list.

Per-agent elevated overrides (`agents.entries.*.tools.elevated`) can further restrict elevated exec for specific agents. See [Elevated mode](/tools/elevated) for details.

---

## Migration from single agent

Tabs


Before (single agent)

    ```json
    {
      "agents": {
        "defaults": {
          "workspace": "~/.openclaw/workspace",
          "sandbox": {
            "mode": "non-main"
          }
        }
      },
      "tools": {
        "sandbox": {
          "tools": {
            "allow": ["read", "write", "apply_patch", "exec"],
            "deny": []
          }
        }
      }
    }
    ```


After (multi-agent)

    ```json
    {
      "agents": {
        "entries": {
          "main": {
            "default": true,
            "workspace": "~/.openclaw/workspace",
            "sandbox": { "mode": "off" }
          }
        }
      }
    }
    ```


Note

Legacy `agents.list` rosters and retired per-agent keys (such as `sandbox.perSession`, `agentRuntime`, and `embeddedPi`) are migrated by `openclaw doctor`; prefer `agents.defaults` + `agents.entries` going forward.

---

## Tool restriction examples

Tabs


Read-only agent

    ```json
    {
      "tools": {
        "allow": ["read"],
        "deny": ["exec", "write", "edit", "apply_patch", "process"]
      }
    }
    ```


Shell execution with filesystem tools disabled

    ```json
    {
      "tools": {
        "allow": ["read", "exec", "process"],
        "deny": ["write", "edit", "apply_patch", "browser", "gateway"]
      }
    }
    ```


Warning

    This policy disables OpenClaw filesystem tools, but `exec` is still a shell and can write files wherever the selected host or sandbox filesystem allows. For a read-only agent, deny `exec` and `process`, or combine shell access with sandbox filesystem controls such as `agents.defaults.sandbox.workspaceAccess: "ro"` or `"none"`.




Communication-only

    ```json
    {
      "tools": {
        "sessions": { "visibility": "tree" },
        "allow": ["sessions_list", "sessions_send", "sessions_history", "session_status"],
        "deny": ["exec", "write", "edit", "apply_patch", "read", "browser"]
      }
    }
    ```

    `sessions_history` in this profile still returns a bounded, sanitized recall view rather than a raw transcript dump. Assistant recall strips thinking tags, `<relevant-memories>` scaffolding, plain-text tool-call XML payloads (including `<tool_call>...</tool_call>`, `<function_call>...</function_call>`, `<tool_calls>...</tool_calls>`, `<function_calls>...</function_calls>`, and truncated tool-call blocks), downgraded tool-call scaffolding, leaked ASCII/full-width model control tokens, and malformed MiniMax tool-call XML before redaction/truncation.



---

## Common pitfall: "non-main"

Warning

`agents.defaults.sandbox.mode: "non-main"` checks the session key against the main session key (always `"main"`; `session.mainKey` is not user-configurable, and OpenClaw warns and ignores any other value), not the agent id. Group/channel sessions always get their own keys, so they are treated as non-main and will be sandboxed. If you want an agent to never sandbox, set `agents.entries.*.sandbox.mode: "off"`.

---

## Testing

After configuring multi-agent sandbox and tools:

Steps


Check agent resolution

    ```bash
    openclaw agents list --bindings
    ```


Verify sandbox containers

    ```bash
    docker ps --filter "name=openclaw-sbx-"
    ```


Test tool restrictions

    - Send a message requiring restricted tools.
    - Verify the agent cannot use denied tools.



Monitor logs

    ```bash
    openclaw logs --follow | grep -E "routing|sandbox|tools"
    ```


---

## Troubleshooting

AccordionGroup


Agent not sandboxed despite `mode: 'all'`

    - Check if there's a global `agents.defaults.sandbox.mode` that overrides it.
    - Agent-specific config takes precedence, so set `agents.entries.*.sandbox.mode: "all"`.



Tools still available despite deny list

    - Check the [full filtering order](#tool-restrictions): profile → provider profile → global policy → provider policy → agent policy → agent provider policy → sandbox → subagent.
    - Each level can only further restrict, not grant back.
    - See [Sandbox vs tool policy vs elevated](/gateway/sandbox-vs-tool-policy-vs-elevated) for step-by-step debugging.



Container not isolated per agent

    - Default `scope` is `"agent"` (one container per agent id).
    - Set `scope: "session"` for one container per session, or `scope: "shared"` to reuse one container across agents.



---

## Related

- [Elevated mode](/tools/elevated)
- [Multi-agent routing](/concepts/multi-agent)
- [Sandbox configuration](/gateway/config-agents#agentsdefaultssandbox)
- [Sandbox vs tool policy vs elevated](/gateway/sandbox-vs-tool-policy-vs-elevated) — debugging "why is this blocked?"
- [Sandboxing](/gateway/sandboxing) — full sandbox reference (modes, scopes, backends, images)
- [Session management](/concepts/session)

---
