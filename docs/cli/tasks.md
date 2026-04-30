---
type: openclaw_doc
title: "`openclaw tasks`"
source: "https://docs.openclaw.ai/cli/tasks"
source_hash: "c7d5a8a198cd3ac792ea35d6def08883b2ed2e8b2e9498bc691b05d15720436c"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "cli/tasks.md"
original_doc_path: "cli/tasks.md"
duplicate_index: 1
---

# `openclaw tasks`
Source: https://docs.openclaw.ai/cli/tasks



Inspect durable background tasks and Task Flow state. With no subcommand,
`openclaw tasks` is equivalent to `openclaw tasks list`.

See [Background Tasks](/automation/tasks) for the lifecycle and delivery model.

## Usage

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks
openclaw tasks list
openclaw tasks list --runtime acp
openclaw tasks list --status running
openclaw tasks show <lookup>
openclaw tasks notify <lookup> state_changes
openclaw tasks cancel <lookup>
openclaw tasks audit
openclaw tasks maintenance
openclaw tasks maintenance --apply
openclaw tasks flow list
openclaw tasks flow show <lookup>
openclaw tasks flow cancel <lookup>
```

## Root Options

* `--json`: output JSON.
* `--runtime <name>`: filter by kind: `subagent`, `acp`, `cron`, or `cli`.
* `--status <name>`: filter by status: `queued`, `running`, `succeeded`, `failed`, `timed_out`, `cancelled`, or `lost`.

## Subcommands

### `list`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks list [--runtime <name>] [--status <name>] [--json]
```

Lists tracked background tasks newest first.

### `show`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks show <lookup> [--json]
```

Shows one task by task ID, run ID, or session key.

### `notify`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks notify <lookup> <done_only|state_changes|silent>
```

Changes the notification policy for a running task.

### `cancel`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks cancel <lookup>
```

Cancels a running background task.

### `audit`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks audit [--severity <warn|error>] [--code <name>] [--limit <n>] [--json]
```

Surfaces stale, lost, delivery-failed, or otherwise inconsistent task and Task Flow records. Lost tasks retained until `cleanupAfter` are warnings; expired or unstamped lost tasks are errors.

### `maintenance`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks maintenance [--apply] [--json]
```

Previews or applies task and Task Flow reconciliation, cleanup stamping, and pruning.
For cron tasks, reconciliation uses persisted run logs/job state before marking an
old active task `lost`, so completed cron runs do not become false audit errors
just because the in-memory Gateway runtime state is gone. Offline CLI audit is
not authoritative for the Gateway's process-local cron active-job set.

### `flow`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw tasks flow list [--status <name>] [--json]
openclaw tasks flow show <lookup> [--json]
openclaw tasks flow cancel <lookup>
```

Inspects or cancels durable Task Flow state under the task ledger.

## Related

* [CLI reference](/cli)
* [Background tasks](/automation/tasks)
