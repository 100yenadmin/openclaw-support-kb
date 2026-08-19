---
type: openclaw_doc
title: "Custodian skills"
source: "https://docs.openclaw.ai/tools/custodian-skills"
source_hash: "f71633b4c2acf2cf00ade0a502c3f8f22812b1fb02f8e5a2ed54bc978c78fb42"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/custodian-skills.md"
original_doc_path: "tools/custodian-skills.md"
duplicate_index: 1
---

# Custodian skills
Source: https://docs.openclaw.ai/tools/custodian-skills

Custodian skills are release-versioned operational playbooks shipped with OpenClaw. They live under `custodian-skills/` in the package and load at the bundled-skill precedence tier, but only for the agent resolved by `agents.defaults.systemAgent.agentId`.

When that setting is absent, OpenClaw uses the existing system-agent fallback: the sole configured agent, or legacy `main` when no explicit agent roster exists. If several agents are configured and no system agent is selected, no agent receives the library. For every other agent, Custodian skills are absent from discovery, snapshots, slash-command catalogs, sandbox sync, and the model-facing skills prompt.

Normal skill controls still apply. `skills.entries.<name>.enabled: false` disables an individual Custodian skill, and agent skill allowlists can narrow the final set. See [Skills config](/tools/skills-config).

## Workflow contract

Every shipped Custodian skill uses the same five sections in this order:

1. **Gather** reads redacted current config and probes live state.
2. **Mutate** uses validated non-interactive writes — `openclaw config set` / `openclaw config patch` from a trusted shell, or the in-session Custodian tool actions where policy allows — never a direct file edit.
3. **Repair** runs `openclaw doctor` and separates diagnosis from any approved repair.
4. **Prove** exercises one live end-to-end outcome.
5. **Report** records what changed, what was observed, and what remains.

All five-section playbooks keep secret values out of prompts, logs, and files. Credentials use SecretRefs or credential stores. A workflow never claims success without its Prove outcome; it reports the exact blocker when live proof is unavailable.

## First wave

| Skill                | Outcome                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `configure-channel`  | Configure and send a confirmed test message through a channel family such as Discord, Slack, Telegram, or WhatsApp. |
| `add-model-provider` | Configure API-key or subscription/OAuth provider access and run one live Gateway inference.                         |
| `diagnose-gateway`   | Perform read-only Gateway, config, SecretRef, channel-auth, log, and port triage.                                   |
| `cloud-image-bake`   | Bake a Cloud Worker image, prove it with a timed dispatch, and safely retire the superseded snapshot.               |

## Roadmap catalog

The following catalog documents intended later tiers. These names are roadmap entries, not bundled skills or promises of current behavior.

### Tier 2: common operations

- `configure-search`: configure and live-prove a search provider.
- `create-agent`: create an agent, verify its workspace, and prove one turn.
- `manage-plugin`: install, configure, verify, or remove an approved plugin.
- `rotate-credential`: rotate one supported credential through its owning store and prove the consumer.
- `upgrade-openclaw`: stage an upgrade, run health checks, and verify rollback readiness.

### Tier 3: advanced operations

- `fleet-rollout`: roll out one verified config or release across managed Gateways.
- `incident-response`: collect redacted evidence, contain an incident, and verify recovery.
- `migrate-gateway`: move a Gateway while preserving explicit state and identity contracts.
- `release-validation`: run release-track package, install, and live behavior proof.
- `restore-backup`: restore into an isolated target, validate state, and cut over deliberately.

## Add an operator skill

Put local additions in the configured Custodian agent's workspace, not in the release-owned package directory:

```text
<custodian-workspace>/skills/<skill-name>/SKILL.md
```

Workspace skills already have higher precedence than the bundled tier and are scoped to that agent's workspace. Follow the same Gather → Mutate → Repair → Prove → Report contract, keep the description short, and start a new session after changing the skill. See [Creating skills](/tools/creating-skills) for the full format.

## Related

- [Skills](/tools/skills)
- [Skills config](/tools/skills-config)
- [Cloud Workers](/gateway/cloud-workers)
- [Gateway troubleshooting](/gateway/troubleshooting)

---
