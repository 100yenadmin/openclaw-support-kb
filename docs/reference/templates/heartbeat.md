---
type: openclaw_doc
title: "Retired HEARTBEAT.md workspace file"
source: "https://docs.openclaw.ai/reference/templates/HEARTBEAT"
source_hash: "d2c6d99c524e5013b91c9221275b1439a24190b4ae9539a8997b612b4cde733f"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/templates/heartbeat.md"
original_doc_path: "reference/templates/heartbeat.md"
duplicate_index: 1
---

# Retired HEARTBEAT.md workspace file
Source: https://docs.openclaw.ai/reference/templates/HEARTBEAT

# HEARTBEAT.md is retired

OpenClaw no longer creates `HEARTBEAT.md` in new workspaces or reads it at runtime. Heartbeat instructions now live in the system-owned monitor's cron scratch in the shared state database.

Manage the current scratch with the monitor job id from `openclaw cron list --all`:

```bash
openclaw cron scratch <jobId>
openclaw cron scratch <jobId> --set "..."
openclaw cron scratch <jobId> --file notes.md
openclaw cron scratch <jobId> --unset
```

If an older workspace still contains `HEARTBEAT.md`, run `openclaw doctor --fix`. Doctor imports its instructions into monitor scratch, converts valid legacy `tasks:` entries into cron jobs, archives the original under the state directory, and removes the workspace file.

## Related

- [Heartbeat](/gateway/heartbeat)
- [Cron CLI](/cli/cron)
- [Doctor](/cli/doctor)
- [Heartbeat config](/gateway/config-agents)

---
