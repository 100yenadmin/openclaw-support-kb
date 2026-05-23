---
name: evaos-company-os
description: Use when a question involves EVAOS roadmap, architecture, release state, rollout evidence, system ownership, canonical repos, cross-repo planning, or what agents should work on next.
---

# EVAOS Company OS

Use this skill to orient agents before they answer roadmap, architecture,
release, rollout, ownership, or cross-system work questions. It is a router, not
a second roadmap or a replacement for Linear/GitHub.

## Bootstrap Surface

- Agents should learn this through thin `AGENTS.md` pointers and this support-KB
  skill, not through a separate AgentMD mirror.
- Open or search Notion for `EVAOS Company OS`, then open `EVAOS Agent Handoff
  Queue` when deciding what agents should work on next.

## Source-Of-Truth Model

- Notion `EVAOS Company OS` is the agent operating manual. It owns architecture,
  systems map, decisions, evidence summaries, open questions, and the ranked
  handoff queue.
- Linear owns the product roadmap: initiatives, projects, priority, ownership,
  planning status, and next-agent action state.
- GitHub owns implementation work: code, repo issues, pull requests, CI,
  reviews, and release branch truth.
- Paperclip owns live execution/orchestration: companies, agents, approvals,
  budgets, heartbeats, and task execution.
- GBrain/evaBrain indexes approved Notion, Linear summary, repo, evidence, and
  support-KB surfaces as a retrieval cache. Treat search results as cache, not
  source of truth.

## Resolution Chain

1. Open or search Notion for `EVAOS Company OS`.
2. Open `EVAOS Agent Handoff Queue` for ranked work and assignment context.
3. Resolve the relevant Linear initiative/project.
4. Resolve the affected system in `EVAOS Systems`, then use its canonical GitHub
   repo and source docs.
5. Read current evidence before recommending release, rollout, or roadmap state.
6. Execute in GitHub, Paperclip, support-control, or the target runtime only
   after the source-of-truth layer is clear.
7. When state changes, update Linear once and add or update a concise Notion
   evidence, decision, or open-question link.

## Issue And Status Policy

- Do not create duplicate GitHub and Linear issues for the same work.
- If a GitHub issue already exists, link or mirror it from Linear instead of
  replacing it.
- If Linear/GitHub sync is enabled, treat the synced pair as one logical issue.
- Notion is not a second canonical issue tracker or status machine; synced
  GitHub or Linear views are read models only.

## Assignment Packet

When handing work to another agent, include:

- Start at Notion: `EVAOS Company OS`; open `EVAOS Agent Handoff Queue`.
- Assigned workstream and matching Linear initiative/project.
- Affected `EVAOS Systems` rows, canonical GitHub repo, and latest evidence.
- Mutation boundary: read-only, PR-only, support VM, or production rollout.
- Required closeout: evidence, blocker, and next action.

## Closeout Contract

End EVAOS work by recording the right state in the right layer:

- If code changed, link the GitHub issue or PR and current CI/review state.
- If operating state changed, update or create one concise Notion Evidence,
  Decision, or Open Question record.
- If roadmap or handoff state changed, update Linear project status once.
- If Linear write tools are unavailable, update the Linear project handoff doc
  or Notion Evidence row and explicitly say this fallback was used.
- Never paste secrets, raw logs, or long terminal dumps into Notion or Linear.

## Fallbacks

- If Linear project status updates are unavailable, update the initiative or the
  project handoff document and say which fallback you used.
- If Notion, Linear, or GBrain/evaBrain is unavailable or stale, fall back to
  GitHub plus local evidence under `/Volumes/LEXAR/Codex`, then report the gap.
- If the user asks for live execution or agent orchestration, route to
  `skills/paperclip-mission-control/SKILL.md` after resolving Company OS
  context.

## Stop Conditions

Stop before mutating anything when the canonical repo/system is unclear, when an
existing GitHub issue and Linear issue may be duplicates, or when the next step
would put raw logs, secrets, or long terminal dumps into Notion or Linear.
