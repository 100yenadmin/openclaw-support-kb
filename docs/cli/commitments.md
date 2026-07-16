---
type: openclaw_doc
title: "`openclaw commitments`"
source: "https://docs.openclaw.ai/cli/commitments"
source_hash: "8ab9dff92b15d32677d2698b5a1d406320d2ffefbe0b1b47f5f8287365bb45cc"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/commitments.md"
original_doc_path: "cli/commitments.md"
duplicate_index: 1
---

# `openclaw commitments`
Source: https://docs.openclaw.ai/cli/commitments

List and manage inferred follow-up commitments.

Commitments are opt-in (`commitments.enabled`), short-lived follow-up memories
created from conversation context and delivered by heartbeat. See
[Inferred commitments](/concepts/commitments) for the conceptual guide and config.

With no subcommand, `openclaw commitments` lists pending commitments.

## Usage

```bash
openclaw commitments [--all] [--agent <id>] [--status <status>] [--json]
openclaw commitments list [--all] [--agent <id>] [--status <status>] [--json]
openclaw commitments dismiss <id...> [--json]
```

## Options

- `--all`: show all statuses instead of only pending commitments.
- `--agent <id>`: filter to one agent id.
- `--status <status>`: filter by status. Values: `pending`, `sent`,
  `dismissed`, `snoozed`, or `expired`. Unknown values exit with an error.
- `--json`: output machine-readable JSON.

`dismiss` marks the given commitment ids as `dismissed` so heartbeat will not
deliver them.

## Examples

List pending commitments:

```bash
openclaw commitments
```

List every stored commitment:

```bash
openclaw commitments --all
```

Filter to one agent:

```bash
openclaw commitments --agent main
```

Find snoozed commitments:

```bash
openclaw commitments --status snoozed
```

Dismiss one or more commitments:

```bash
openclaw commitments dismiss cm_abc123 cm_def456
```

Export as JSON:

```bash
openclaw commitments --all --json
```

## Output

Text output prints the commitment count, the shared SQLite database path, any active filters,
and one row per commitment:

- commitment id
- status
- kind (`event_check_in`, `deadline_check`, `care_check_in`, or `open_loop`)
- earliest due time
- scope (agent/channel/target)
- suggested check-in text

JSON output includes the count, the active status and agent filters, the
shared SQLite database path, and the full stored records.

## Related

- [Inferred commitments](/concepts/commitments)
- [Memory overview](/concepts/memory)
- [Heartbeat](/gateway/heartbeat)
- [Scheduled tasks](/automation/cron-jobs)

---
