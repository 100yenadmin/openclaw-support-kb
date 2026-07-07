---
type: openclaw_doc
title: "Migrating from Claude"
source: "https://docs.openclaw.ai/install/migrating-claude"
source_hash: "6e766d6766e28cf6ec48cab6529e2cc14ef78f027324191a9b5db276093e1a8a"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install/migrating-claude.md"
original_doc_path: "install/migrating-claude.md"
duplicate_index: 1
---

# Migrating from Claude
Source: https://docs.openclaw.ai/install/migrating-claude

OpenClaw imports local Claude state through the bundled Claude migration provider. The provider previews every item before changing state, redacts secrets in plans and reports, and creates a verified backup before apply.

Note

Onboarding imports require a fresh OpenClaw setup. If you already have local OpenClaw state, reset config, credentials, sessions, and the workspace first, or use `openclaw migrate` directly with `--overwrite` after reviewing the plan.

## Two ways to import

Tabs


Onboarding wizard

    The wizard offers Claude when it detects local Claude state.

    ```bash
    openclaw onboard --flow import
    ```

    Or point at a specific source:

    ```bash
    openclaw onboard --import-from claude --import-source ~/.claude
    ```



CLI

    Use `openclaw migrate` for scripted or repeatable runs. See [`openclaw migrate`](/cli/migrate) for the full reference.

    ```bash
    openclaw migrate claude --dry-run
    openclaw migrate apply claude --yes
    ```

    Add `--from <path>` to import a specific Claude Code home or project root.



## What gets imported

AccordionGroup


Instructions and memory

    - Project `CLAUDE.md` and `.claude/CLAUDE.md` content is copied or appended into the OpenClaw agent workspace `AGENTS.md`.
    - User `~/.claude/CLAUDE.md` content is appended into workspace `USER.md`.



MCP servers

    MCP server definitions are imported from project `.mcp.json`, Claude Code `~/.claude.json`, and Claude Desktop `claude_desktop_config.json` when present.


Skills and commands

    - Claude skills with a `SKILL.md` file are copied into the OpenClaw workspace skills directory.
    - Claude command Markdown files under `.claude/commands/` or `~/.claude/commands/` are converted into OpenClaw skills with `disable-model-invocation: true`.



## What stays archive-only

The provider copies these into the migration report for manual review, but does **not** load them into live OpenClaw config:

- Claude hooks
- Claude permissions and broad tool allowlists
- Claude environment defaults
- `CLAUDE.local.md`
- `.claude/rules/`
- Claude subagents under `.claude/agents/` or `~/.claude/agents/`
- Claude Code caches, plans, and project history directories
- Claude Desktop extensions and OS-stored credentials

OpenClaw refuses to execute hooks, trust permission allowlists, or decode opaque OAuth and Desktop credential state automatically. Move what you need by hand after reviewing the archive.

## Source selection

Without `--from`, OpenClaw inspects the default Claude Code home at `~/.claude`, the sampled Claude Code `~/.claude.json` state file, and the Claude Desktop MCP config on macOS.

When `--from` points at a project root, OpenClaw imports only that project's Claude files, such as `CLAUDE.md`, `.claude/settings.json`, `.claude/commands/`, `.claude/skills/`, and `.mcp.json`. It does not read your global Claude home during a project-root import.

## Recommended flow

Steps


Preview the plan

    ```bash
    openclaw migrate claude --dry-run
    ```

    The plan lists everything that will change, including conflicts, skipped items, and sensitive values redacted from nested MCP `env` or `headers` fields.



Apply with backup

    ```bash
    openclaw migrate apply claude --yes
    ```

    OpenClaw creates and verifies a backup before applying.



Run doctor

    ```bash
    openclaw doctor
    ```

    [Doctor](/gateway/doctor) checks for config or state issues after the import.



Restart and verify

    ```bash
    openclaw gateway restart
    openclaw status
    ```

    Confirm the gateway is healthy and your imported instructions, MCP servers, and skills are loaded.



## Conflict handling

Apply refuses to continue when the plan reports conflicts (a file or config value already exists at the target).

Warning

Rerun with `--overwrite` only when replacing the existing target is intentional. Providers may still write item-level backups for overwritten files in the migration report directory.

For a fresh OpenClaw install, conflicts are unusual. They typically appear when you re-run the import on a setup that already has user edits.

## JSON output for automation

```bash
openclaw migrate claude --dry-run --json
openclaw migrate apply claude --json --yes
```

`--yes` is required for `migrate apply` outside an interactive terminal; without it OpenClaw errors instead of applying, so scripts and CI must pass `--yes` explicitly. Preview first with `--dry-run --json`, then apply with `--json --yes` once the plan looks right.

## Troubleshooting

AccordionGroup


Claude state lives outside ~/.claude

    Pass `--from /actual/path` (CLI) or `--import-source /actual/path` (onboarding).


Onboarding refuses to import on an existing setup

    Onboarding imports require a fresh setup. Either reset state and re-onboard, or use `openclaw migrate apply claude` directly, which supports `--overwrite` and explicit backup control.


MCP servers from Claude Desktop did not import

    Claude Desktop reads `claude_desktop_config.json` from a platform-specific path. Point `--from` at that file's directory if OpenClaw did not detect it automatically.


Claude commands became skills with model invocation disabled

    By design. Claude commands are user-triggered, so OpenClaw imports them as skills with `disable-model-invocation: true`. Edit each skill's frontmatter if you want the agent to invoke them automatically.


## Related

- [`openclaw migrate`](/cli/migrate): full CLI reference, plugin contract, and JSON shapes.
- [Migration guide](/install/migrating): all migration paths.
- [Migrating from Hermes](/install/migrating-hermes): the other cross-system import path.
- [Onboarding](/cli/onboard): wizard flow and non-interactive flags.
- [Doctor](/gateway/doctor): post-migration health check.
- [Agent workspace](/concepts/agent-workspace): where `AGENTS.md`, `USER.md`, and skills live.

---
