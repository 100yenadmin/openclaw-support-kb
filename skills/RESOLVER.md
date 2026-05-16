---
type: openclaw_skill_resolver
title: "OpenClaw Support Skill Resolver"
search_role: "skill_routing"
---

# Customer Support Skill Resolver

Read the matching skill before acting.

| Trigger | Skill |
| --- | --- |
| Ambiguous customer setup/config/support question; "agent", "bot", "gateway", "Telegram", "dashboard", or "config" without a clear target system | `skills/customer-kb-router/SKILL.md` then `runbooks/customer-kb-routing.md` |
| OpenClaw setup, docs, channel, update, runtime, or customer support question | `skills/openclaw-support-kb/SKILL.md` |
| Explain OpenClaw, architecture, Gateway, agent runtime, workspace, or how the system works | `skills/openclaw-support-kb/SKILL.md` then `runbooks/system-explainer.md` |
| Create a new agent, configure an agent, bind a channel to an agent, or set agent identity | `skills/openclaw-support-kb/SKILL.md` then `runbooks/agent-creation.md` |
| Set up Telegram | `skills/openclaw-support-kb/SKILL.md` then `runbooks/telegram-setup.md` |
| Set up another chat channel | `skills/openclaw-support-kb/SKILL.md` then `runbooks/channel-setup.md` |
| `openclaw.json`, config schema, invalid config, SecretRef, channel config, gateway will not start | `skills/openclaw-config-repair/SKILL.md` |
| Hermes Agent setup, config, gateway, Telegram/messaging, MCP, memory, sessions, skills, cron, update, or troubleshooting | `skills/hermes-support-kb/SKILL.md` |
| Paperclip, Mission Control, companies, goals, org chart, tickets, heartbeats, budgets, approvals, dashboard, API, deploy, or adapter questions | `skills/paperclip-mission-control/SKILL.md` |
| One system needs to diagnose or repair another, including Hermes fixing OpenClaw, OpenClaw fixing Hermes, or either runtime handling Paperclip | `skills/cross-system-recovery/SKILL.md` then target-system skill |
| Find, choose, install, vet, or improve OpenClaw skills; search VoltAgent/ClawHub; evaluate Composio or SaaS app integrations | `skills/openclaw-skill-discovery/SKILL.md` |
| Contact support, escalate, send email, message `@evaOS_support_bot`, or support handoff | `skills/openclaw-support-escalation/SKILL.md` |

If multiple rows match, read all matching skills. Search the local GBrain KB before external web lookup. Do not mix config instructions across OpenClaw, Hermes, and Paperclip unless `cross-system-recovery` names the target and actor first.
