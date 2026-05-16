---
name: cross-system-recovery
description: Use when OpenClaw, Hermes Agent, or Paperclip must diagnose or repair another system, when the acting agent and broken target are different, or when docs from multiple systems might conflict.
---

# Cross-System Recovery

## Core Rule

Target system facts beat acting system convenience. The agent performing the repair should use its own tools to inspect and apply changes, but the broken system's docs decide what is valid.

## Workflow

1. Name both roles:
   - Target: the system being fixed.
   - Actor: the runtime executing commands.
2. Search the target namespace first:
   ```bash
   gbrain search "<target system> <exact error> <config key>" --source openclaw-support-kb
   ```
3. Search the actor namespace only for execution mechanics:
   ```bash
   gbrain search "<actor system> run shell command approval workspace" --source openclaw-support-kb
   ```
4. Use read-only diagnostics before edits.
5. For OpenClaw config, use `openclaw config schema`, `openclaw config patch --dry-run`, and `openclaw config validate`.
6. For Hermes config, use Hermes docs and diagnostics; do not write OpenClaw keys.
7. For Paperclip, use Paperclip API/CLI/deploy docs; do not treat it as a runtime config file.

## Common Patterns

- Hermes fixes OpenClaw: cite OpenClaw docs/runbooks, use Hermes only as the shell/executor.
- OpenClaw fixes Hermes: cite Hermes docs, use OpenClaw only for messaging/session constraints.
- Either fixes Paperclip: cite Paperclip docs, then use the acting runtime to run approved commands.

## Stop Conditions

Stop if docs disagree, the target is ambiguous, credentials are needed, the user has not approved a write/send action, or the next step would replace a whole config/database instead of making a narrow reversible change.
