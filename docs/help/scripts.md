---
type: openclaw_doc
title: "Scripts"
source: "https://docs.openclaw.ai/help/scripts"
source_hash: "8c8f70042ff0576542a47096fbfd5d77918225d328102abde9fa55b857a33632"
doc_path: "help/scripts.md"
original_doc_path: "help/scripts.md"
duplicate_index: 1
---

# Scripts
Source: https://docs.openclaw.ai/help/scripts



The `scripts/` directory contains helper scripts for local workflows and ops tasks.
Use these when a task is clearly tied to a script; otherwise prefer the CLI.

## Conventions

* Scripts are **optional** unless referenced in docs or release checklists.
* Prefer CLI surfaces when they exist (example: auth monitoring uses `openclaw models status --check`).
* Assume scripts are host‑specific; read them before running on a new machine.

## Auth monitoring scripts

Auth monitoring is covered in [Authentication](/gateway/authentication). The scripts under `scripts/` are optional extras for systemd/Termux phone workflows.

## GitHub read helper

Use `scripts/gh-read` when you want `gh` to use a GitHub App installation token for repo-scoped read calls while leaving normal `gh` on your personal login for write actions.

Required env:

* `OPENCLAW_GH_READ_APP_ID`
* `OPENCLAW_GH_READ_PRIVATE_KEY_FILE`

Optional env:

* `OPENCLAW_GH_READ_INSTALLATION_ID` when you want to skip repo-based installation lookup
* `OPENCLAW_GH_READ_PERMISSIONS` as a comma-separated override for the read permission subset to request

Repo resolution order:

* `gh ... -R owner/repo`
* `GH_REPO`
* `git remote origin`

Examples:

* `scripts/gh-read pr view 123`
* `scripts/gh-read run list -R openclaw/openclaw`
* `scripts/gh-read api repos/openclaw/openclaw/pulls/123`

## When adding scripts

* Keep scripts focused and documented.
* Add a short entry in the relevant doc (or create one if missing).

## Related

* [Testing](/help/testing)
* [Testing live](/help/testing-live)
