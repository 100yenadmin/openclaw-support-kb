---
type: openclaw_doc
title: "Flows (redirect)"
source: "https://docs.openclaw.ai/cli/flows"
source_hash: "debc50735d871b269797e6d2bd813038167b75e8b30f81797854c8f29796dd71"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/flows.md"
original_doc_path: "cli/flows.md"
duplicate_index: 1
---

# Flows (redirect)
Source: https://docs.openclaw.ai/cli/flows



# `openclaw tasks flow`

There is no top-level `openclaw flows` command. Durable TaskFlow inspection lives under `openclaw tasks flow`.

## Subcommands

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks flow list   [--json] [--status <name>]
openclaw tasks flow show   <lookup> [--json]
openclaw tasks flow cancel <lookup>
```

| Subcommand | Description                | Arguments / options                                                                   |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------- |
| `list`     | List tracked TaskFlows.    | `--json` machine-readable output; `--status <name>` filter (see status values below). |
| `show`     | Show one TaskFlow.         | `<lookup>` flow id or owner key; `--json` machine-readable output.                    |
| `cancel`   | Cancel a running TaskFlow. | `<lookup>` flow id or owner key.                                                      |

`<lookup>` accepts either a flow id (returned by `list` / `show`) or the flow's owner key (the stable identifier the owning subsystem uses to track the flow).

### Status filter values

`--status` on `list` accepts one of:

`queued`, `running`, `waiting`, `blocked`, `succeeded`, `failed`, `cancelled`, `lost`

## Examples

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks flow list
openclaw tasks flow list --status running
openclaw tasks flow list --json
openclaw tasks flow show flow_abc123
openclaw tasks flow show flow_abc123 --json
openclaw tasks flow cancel flow_abc123
```

For full TaskFlow concepts and authoring see [TaskFlow](/automation/taskflow). For the parent `tasks` command see [tasks CLI reference](/cli/tasks).

## Related

* [CLI reference](/cli)
* [Automation](/automation)
* [TaskFlow](/automation/taskflow)
