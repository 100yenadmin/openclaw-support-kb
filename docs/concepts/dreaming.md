---
type: openclaw_doc
title: "Dreaming"
source: "https://docs.openclaw.ai/concepts/dreaming"
source_hash: "ddfef5de1bbee09a55fcabe1889fe0de22aac2bc8d8f36977f3aef056a11af34"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "concepts/dreaming.md"
original_doc_path: "concepts/dreaming.md"
duplicate_index: 1
---

# Dreaming
Source: https://docs.openclaw.ai/concepts/dreaming

Dreaming is the background memory consolidation system in `memory-core`. It moves strong short-term signals into durable memory while keeping the process explainable and reviewable.

Note

Dreaming is **opt-in** and disabled by default.

## What dreaming writes

- **Machine state** in `memory/.dreams/` (recall store, phase signals, ingestion checkpoints, locks).
- **Human-readable output** in `DREAMS.md` (or an existing `dreams.md`) and optional phase report files under `memory/dreaming/<phase>/YYYY-MM-DD.md`.

Long-term promotion still writes only to `MEMORY.md`.

## Phase model

Dreaming runs three cooperative phases per sweep, in order: light -> REM -> deep. These are internal implementation phases, not separate user-configured modes.

| Phase | Purpose                                   | Durable write     |
| ----- | ----------------------------------------- | ----------------- |
| Light | Sort and stage recent short-term material | No                |
| REM   | Reflect on themes and recurring ideas     | No                |
| Deep  | Score and promote durable candidates      | Yes (`MEMORY.md`) |

AccordionGroup


Light phase

    - Reads recent short-term recall state, daily memory files, and redacted session transcripts when available.
    - Dedupes signals and stages candidate lines.
    - Writes a managed `## Light Sleep` block when storage includes inline output.
    - Records reinforcement signals for later deep ranking.
    - Never writes to `MEMORY.md`.



REM phase

    - Builds theme and reflection summaries from recent short-term traces.
    - Writes a managed `## REM Sleep` block when storage includes inline output.
    - Records REM reinforcement signals used by deep ranking.
    - Never writes to `MEMORY.md`.



Deep phase

    - Ranks candidates with weighted scoring and threshold gates (`minScore`, `minRecallCount`, `minUniqueQueries` must all pass).
    - Rehydrates snippets from live daily files before writing, so stale/deleted snippets are skipped.
    - Appends promoted entries to `MEMORY.md`.
    - Writes a `## Deep Sleep` summary into `DREAMS.md` and optionally `memory/dreaming/deep/YYYY-MM-DD.md`.



## Session transcript ingestion

Dreaming can ingest redacted session transcripts into the dreaming corpus. When available, transcripts feed the light phase alongside daily memory signals and recall traces. Personal and sensitive content is redacted before ingestion.

## Dream Diary

Dreaming keeps a narrative **Dream Diary** in `DREAMS.md`. After each phase has enough material, `memory-core` runs a best-effort background subagent turn and appends a short diary entry, using the default runtime model unless `dreaming.model` is configured. If the configured model is unavailable, the diary run retries once with the session default model; trust or allowlist failures are not retried and stay visible in logs instead of silently falling back to a generic diary entry.

Note

The diary is for human reading in the Dreams UI, not a promotion source. Diary/report artifacts are excluded from short-term promotion; only grounded memory snippets are eligible to promote into `MEMORY.md`.

There is also a grounded historical backfill lane for review and recovery work:

AccordionGroup


Backfill commands

    - `memory rem-harness --path ... --grounded` previews grounded diary output from historical `YYYY-MM-DD.md` notes.
    - `memory rem-backfill --path ...` writes reversible grounded diary entries into `DREAMS.md`.
    - `memory rem-backfill --path ... --stage-short-term` stages grounded durable candidates into the same short-term evidence store the normal deep phase uses.
    - `memory rem-backfill --rollback` and `--rollback-short-term` remove those staged backfill artifacts without touching ordinary diary entries or live short-term recall.



The Control UI exposes the same diary backfill/reset flow so you can inspect results in the Dreams scene before deciding whether grounded candidates deserve promotion. A distinct grounded Scene lane shows which staged short-term entries came from historical replay, which promoted items were grounded-led, and lets you clear only grounded-only staged entries without touching live short-term state.

## Deep ranking signals

Deep ranking uses six weighted base signals plus phase reinforcement:

| Signal              | Weight | Description                                       |
| ------------------- | ------ | ------------------------------------------------- |
| Relevance           | 0.30   | Average retrieval quality for the entry           |
| Frequency           | 0.24   | How many short-term signals the entry accumulated |
| Query diversity     | 0.15   | Distinct query/day contexts that surfaced it      |
| Recency             | 0.15   | Time-decayed freshness score                      |
| Consolidation       | 0.10   | Multi-day recurrence strength                     |
| Conceptual richness | 0.06   | Concept-tag density from snippet/path             |

Light and REM phase hits add a small recency-decayed boost from `memory/.dreams/phase-signals.json`.

Shadow-trial results can layer on top of the base score as a review signal before any durable write: a helpful trial gives a candidate a small bounded boost, a neutral trial keeps it deferred, and a harmful trial marks it rejected for that scoring pass. This signal is report-only - it can change candidate ordering or review metadata, but never writes to `MEMORY.md` or promotes a candidate by itself.

### QA shadow trial report coverage

QA Lab includes a report-only scenario for exploring how a future dreaming shadow trial could review a candidate memory before promotion: an agent compares a baseline answer against an answer that can use the candidate memory, then writes a local report with a verdict, reason, and risk flags. This coverage is scoped to QA - it verifies the report artifact stays separate from `MEMORY.md` and that the agent never claims the candidate was promoted. It does not add production shadow-trial behavior or change the deep-phase promotion engine.

The `memory-core` shadow-trial runner keeps the same report-only contract for code paths that need a stable artifact. It accepts the candidate, trial prompt, baseline outcome, candidate outcome, verdict, reason, risk flags, and evidence references, then writes a report with `promotion action: report-only`. Helpful verdicts map to a `promote` recommendation, neutral verdicts map to `defer`, and harmful verdicts map to `reject` - none of those writes to `MEMORY.md` or applies deep-phase promotion.

## Scheduling

When enabled, `memory-core` auto-manages one cron job for a full dreaming sweep, deduped across the primary runtime workspace and any configured agent workspaces so subagent workspace fan-out does not exclude the main agent's `DREAMS.md` and memory state.

| Setting              | Default       |
| -------------------- | ------------- |
| `dreaming.frequency` | `0 3 * * *`   |
| `dreaming.model`     | default model |

## Quick start

Tabs


Enable dreaming

    ```json
    {
      "plugins": {
        "entries": {
          "memory-core": {
            "config": {
              "dreaming": {
                "enabled": true
              }
            }
          }
        }
      }
    }
    ```


Custom sweep cadence

    ```json
    {
      "plugins": {
        "entries": {
          "memory-core": {
            "config": {
              "dreaming": {
                "enabled": true,
                "timezone": "America/Los_Angeles",
                "frequency": "0 */6 * * *"
              }
            }
          }
        }
      }
    }
    ```


## Slash command

```text
/dreaming status
/dreaming on
/dreaming off
/dreaming help
```

`/dreaming on` and `/dreaming off` require owner status for channel callers or `operator.admin` for Gateway clients. `/dreaming status` and `/dreaming help` are read-only.

## CLI workflow

Tabs


Promotion preview / apply

    ```bash
    openclaw memory promote
    openclaw memory promote --apply
    openclaw memory promote --limit 5
    openclaw memory status --deep
    ```

    Manual `memory promote` uses deep-phase thresholds by default unless overridden with CLI flags.



Explain promotion

    Explain why a specific candidate would or would not promote:

    ```bash
    openclaw memory promote-explain "router vlan"
    openclaw memory promote-explain "router vlan" --json
    ```



REM harness preview

    Preview REM reflections, candidate truths, and deep promotion output without writing anything:

    ```bash
    openclaw memory rem-harness
    openclaw memory rem-harness --json
    ```



## Key defaults

All settings live under `plugins.entries.memory-core.config.dreaming`.

ParamField

  Enable or disable the dreaming sweep.

ParamField

  Cron cadence for the full dreaming sweep.

ParamField

  Optional Dream Diary subagent model override. Use a canonical `provider/model` value when also setting a subagent `allowedModels` allowlist.

ParamField

  Maximum estimated token count kept from each short-term recall snippet promoted into `MEMORY.md`. Ranking provenance remains visible.

Warning

`dreaming.model` requires `plugins.entries.memory-core.subagent.allowModelOverride: true`. To restrict it, also set `plugins.entries.memory-core.subagent.allowedModels`. The automatic retry only covers model-unavailable errors; trust or allowlist failures stay visible in logs instead of falling back silently.

Note

Most phase policy, thresholds, and storage behavior are internal implementation details. See [Memory configuration reference](/reference/memory-config#dreaming) for the full key list.

## Dreams UI

When enabled, the Gateway **Dreams** tab shows:

- current dreaming enabled state
- phase-level status and managed-sweep presence
- short-term, grounded, signal, and promoted-today counts
- next scheduled run timing
- a distinct grounded Scene lane for staged historical replay entries
- an expandable Dream Diary reader backed by `doctor.memory.dreamDiary`

## Related

- [Memory](/concepts/memory)
- [Memory CLI](/cli/memory)
- [Memory configuration reference](/reference/memory-config)
- [Memory search](/concepts/memory-search)

---
