---
type: openclaw_doc
title: "`openclaw commitments`"
source: "https://docs.openclaw.ai/cli/commitments"
source_hash: "61fd4998888e92b24cc0e652c845d7aee220c0f7e9fe8b1b3db5b27d529cc867"
generated_at: "2026-04-30T12:18:14.365Z"
doc_path: "cli/commitments.md"
original_doc_path: "cli/commitments.md"
duplicate_index: 1
---

# `openclaw commitments`
Source: https://docs.openclaw.ai/cli/commitments



List and manage inferred follow-up commitments.

Commitments are opt-in, short-lived follow-up memories created from
conversation context. See [Inferred commitments](/concepts/commitments) for the
conceptual guide.

With no subcommand, `openclaw commitments` lists pending commitments.

## Usage

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw commitments [--all] [--agent <id>] [--status <status>] [--json]
openclaw commitments list [--all] [--agent <id>] [--status <status>] [--json]
openclaw commitments dismiss <id...> [--json]
```

## Options

* `--all`: show all statuses instead of only pending commitments.
* `--agent <id>`: filter to one agent id.
* `--status <status>`: filter by status. Values: `pending`, `sent`,
  `dismissed`, `snoozed`, or `expired`.
* `--json`: output machine-readable JSON.

## Examples

List pending commitments:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw commitments
```

List every stored commitment:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw commitments --all
```

Filter to one agent:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw commitments --agent main
```

Find snoozed commitments:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw commitments --status snoozed
```

Dismiss one or more commitments:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw commitments dismiss cm_abc123 cm_def456
```

Export as JSON:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw commitments --all --json
```

## Output

Text output includes:

* commitment id
* status
* kind
* earliest due time
* scope
* suggested check-in text

JSON output also includes the commitment store path and full stored records.

## Related

* [Inferred commitments](/concepts/commitments)
* [Memory overview](/concepts/memory)
* [Heartbeat](/gateway/heartbeat)
* [Scheduled tasks](/automation/cron-jobs)
