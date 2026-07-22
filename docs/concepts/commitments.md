---
type: openclaw_doc
title: "Inferred commitments"
source: "https://docs.openclaw.ai/concepts/commitments"
source_hash: "bb6dcc557ba12db979b1daf3070424513730d583c027535bc1ad1d3c0acf7b91"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "concepts/commitments.md"
original_doc_path: "concepts/commitments.md"
duplicate_index: 1
---

# Inferred commitments
Source: https://docs.openclaw.ai/concepts/commitments

The inferred commitments experiment is retired. OpenClaw no longer extracts new
conversation follow-ups or delivers them through heartbeat, and the former
`commitments` config block is removed by `openclaw doctor --fix`.

Exact reminders and scheduled work continue to use
[scheduled tasks](/automation/cron-jobs). Durable conversational facts belong in
[memory](/concepts/memory).

## Existing records

Previously stored commitments remain in the shared SQLite state database so an
upgrade does not destroy operator-visible history. Use the legacy maintenance
CLI to inspect or dismiss those rows:

```bash
openclaw commitments --all
openclaw commitments dismiss cm_abc123
```

See [`openclaw commitments`](/cli/commitments) for the maintenance command
reference.

## Related

- [Scheduled tasks](/automation/cron-jobs)
- [Memory overview](/concepts/memory)
- [Heartbeat](/gateway/heartbeat)

---
