---
type: openclaw_runbook
title: "File A Triage-Ready Agent Bug Report"
search_role: "workflow_not_source"
---

# File A Triage-Ready Agent Bug Report

Use this runbook when a user says an OpenClaw agent is slow, broken, not
responding, missing tools, or "not as smart." The goal is to turn a vague
complaint into a privacy-reviewed issue draft or support escalation without
posting raw private logs.

## Search Contract

Search the local KB and public issue trail before collecting or sharing details:

```bash
gbrain search "OpenClaw agent slow broken not responding missing tools diagnostics" --source openclaw-support-kb
gbrain search "OpenClaw file-bug-report ClawHub diagnostics issue report" --source openclaw-support-kb
gbrain search "OpenClaw <exact error text or symptom>" --source openclaw-support-kb
```

Use these source paths as workflow context:

- `skills/file-bug-report/SKILL.md`
- `skills/file-bug-report/references/issue-template.md`
- `skills/file-bug-report/references/similar-issue-search.md`
- `support/contacts.md`
- ClawHub: https://clawhub.ai/100yenadmin/file-bug-report

## Workflow

1. Ask the intake questions from `skills/file-bug-report/SKILL.md`: exact action
   that failed, expected behavior, observed behavior, last-known-good time,
   recent changes, model/provider/entrypoint, and whether diagnostics/search are
   approved.
2. Prefer the ClawHub install on customer machines:
   ```bash
   openclaw skills install file-bug-report
   ```
3. If the support KB is installed, the skill is also mirrored under
   `~/.openclaw/skills/file-bug-report/` after `node scripts/update-client.mjs`.
4. Ask the user's agent to run:
   ```text
   $file-bug-report
   ```
5. Keep the output local first. Review `diagnostics-summary.md`,
   `file-index.tsv`, selected command output, and the issue draft before sharing
   anything publicly.
6. Search for similar open and closed `openclaw/openclaw` issues using the
   search guide in `skills/file-bug-report/references/similar-issue-search.md`.
7. If a likely duplicate exists, draft a comment with the new reviewed evidence.
   Otherwise draft a new issue from `skills/file-bug-report/references/issue-template.md`.
8. If the user needs direct help instead of a public issue, chain into
   `runbooks/support-escalation.md` and use the hash-bound approval helper.

## Public Handoff

For social or community replies, use a short, non-technical handoff:

```text
Tell your agent to run $file-bug-report, review the diagnostics it collects,
search for similar openclaw/openclaw issues, and draft a triage-ready issue.
Do not post secrets, raw credentials, full config files, private prompts, or
unreviewed logs.
```

## Nontechnical User Prompts

- "What did you ask the agent to do, and what happened instead?"
- "Did this start after an update, plugin install, config change, or model change?"
- "Can I collect a conservative local diagnostics bundle and review it before anything is shared?"
- "Should we draft a public GitHub issue, or would you rather contact support?"

## Stop Conditions

Do not post or attach the full diagnostics directory. Stop before sharing if
redaction is uncertain, logs contain private user content, the user has not
approved the exact public text, or the next step would require changing config
instead of collecting evidence.
