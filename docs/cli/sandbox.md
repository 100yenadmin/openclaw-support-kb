---
type: openclaw_doc
title: "Sandbox CLI"
source: "https://docs.openclaw.ai/cli/sandbox"
source_hash: "d9cecf723e4ac3597aee4ae2c53ca9ed1a81c06ffae94595c74c69d55d396863"
generated_at: "2026-04-30T13:41:35.154Z"
doc_path: "cli/sandbox.md"
original_doc_path: "cli/sandbox.md"
duplicate_index: 1
---

# Sandbox CLI
Source: https://docs.openclaw.ai/cli/sandbox



Manage sandbox runtimes for isolated agent execution.

## Overview

OpenClaw can run agents in isolated sandbox runtimes for security. The `sandbox` commands help you inspect and recreate those runtimes after updates or configuration changes.

Today that usually means:

* Docker sandbox containers
* SSH sandbox runtimes when `agents.defaults.sandbox.backend = "ssh"`
* OpenShell sandbox runtimes when `agents.defaults.sandbox.backend = "openshell"`

For `ssh` and OpenShell `remote`, recreate matters more than with Docker:

* the remote workspace is canonical after the initial seed
* `openclaw sandbox recreate` deletes that canonical remote workspace for the selected scope
* next use seeds it again from the current local workspace

## Commands

### `openclaw sandbox explain`

Inspect the **effective** sandbox mode/scope/workspace access, sandbox tool policy, and elevated gates (with fix-it config key paths).

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw sandbox explain
openclaw sandbox explain --session agent:main:main
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

### `openclaw sandbox list`

List all sandbox runtimes with their status and configuration.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw sandbox list
openclaw sandbox list --browser  # List only browser containers
openclaw sandbox list --json     # JSON output
```

**Output includes:**

* Runtime name and status
* Backend (`docker`, `openshell`, etc.)
* Config label and whether it matches current config
* Age (time since creation)
* Idle time (time since last use)
* Associated session/agent

### `openclaw sandbox recreate`

Remove sandbox runtimes to force recreation with updated config.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw sandbox recreate --all                # Recreate all containers
openclaw sandbox recreate --session main       # Specific session
openclaw sandbox recreate --agent mybot        # Specific agent
openclaw sandbox recreate --browser            # Only browser containers
openclaw sandbox recreate --all --force        # Skip confirmation
```

**Options:**

* `--all`: Recreate all sandbox containers
* `--session <key>`: Recreate container for specific session
* `--agent <id>`: Recreate containers for specific agent
* `--browser`: Only recreate browser containers
* `--force`: Skip confirmation prompt

<Note>
  Runtimes are automatically recreated when the agent is next used.
</Note>

## Use cases

### After updating a Docker image

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Pull new image
docker pull openclaw-sandbox:latest
docker tag openclaw-sandbox:latest openclaw-sandbox:bookworm-slim

# Update config to use new image
# Edit config: agents.defaults.sandbox.docker.image (or agents.list[].sandbox.docker.image)

# Recreate containers
openclaw sandbox recreate --all
```

### After changing sandbox configuration

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Edit config: agents.defaults.sandbox.* (or agents.list[].sandbox.*)

# Recreate to apply new config
openclaw sandbox recreate --all
```

### After changing SSH target or SSH auth material

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Edit config:
# - agents.defaults.sandbox.backend
# - agents.defaults.sandbox.ssh.target
# - agents.defaults.sandbox.ssh.workspaceRoot
# - agents.defaults.sandbox.ssh.identityFile / certificateFile / knownHostsFile
# - agents.defaults.sandbox.ssh.identityData / certificateData / knownHostsData

openclaw sandbox recreate --all
```

For the core `ssh` backend, recreate deletes the per-scope remote workspace root
on the SSH target. The next run seeds it again from the local workspace.

### After changing OpenShell source, policy, or mode

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Edit config:
# - agents.defaults.sandbox.backend
# - plugins.entries.openshell.config.from
# - plugins.entries.openshell.config.mode
# - plugins.entries.openshell.config.policy

openclaw sandbox recreate --all
```

For OpenShell `remote` mode, recreate deletes the canonical remote workspace
for that scope. The next run seeds it again from the local workspace.

### After changing setupCommand

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw sandbox recreate --all
# or just one agent:
openclaw sandbox recreate --agent family
```

### For a specific agent only

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Update only one agent's containers
openclaw sandbox recreate --agent alfred
```

## Why this is needed

When you update sandbox configuration:

* Existing runtimes continue running with old settings.
* Runtimes are only pruned after 24h of inactivity.
* Regularly-used agents keep old runtimes alive indefinitely.

Use `openclaw sandbox recreate` to force removal of old runtimes. They are recreated automatically with current settings when next needed.

<Tip>
  Prefer `openclaw sandbox recreate` over manual backend-specific cleanup. It uses the Gateway's runtime registry and avoids mismatches when scope or session keys change.
</Tip>

## Configuration

Sandbox settings live in `~/.openclaw/openclaw.json` under `agents.defaults.sandbox` (per-agent overrides go in `agents.list[].sandbox`):

```jsonc theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "all", // off, non-main, all
        "backend": "docker", // docker, ssh, openshell
        "scope": "agent", // session, agent, shared
        "docker": {
          "image": "openclaw-sandbox:bookworm-slim",
          "containerPrefix": "openclaw-sbx-",
          // ... more Docker options
        },
        "prune": {
          "idleHours": 24, // Auto-prune after 24h idle
          "maxAgeDays": 7, // Auto-prune after 7 days
        },
      },
    },
  },
}
```

## Related

* [CLI reference](/cli)
* [Sandboxing](/gateway/sandboxing)
* [Agent workspace](/concepts/agent-workspace)
* [Doctor](/gateway/doctor): checks sandbox setup.
