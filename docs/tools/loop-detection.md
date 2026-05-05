---
type: openclaw_doc
title: "Tool-loop detection"
source: "https://docs.openclaw.ai/tools/loop-detection"
source_hash: "24bac1e48e787734dd0e6021a2ce3e228410beef9ae3fa1b125fe69093ca3d3f"
doc_path: "tools/loop-detection.md"
original_doc_path: "tools/loop-detection.md"
duplicate_index: 1
---

# Tool-loop detection
Source: https://docs.openclaw.ai/tools/loop-detection



OpenClaw can keep agents from getting stuck in repeated tool-call patterns.
The guard is **disabled by default**.

Enable it only where needed, because it can block legitimate repeated calls with strict settings.

## Why this exists

* Detect repetitive sequences that do not make progress.
* Detect high-frequency no-result loops (same tool, same inputs, repeated errors).
* Detect specific repeated-call patterns for known polling tools.

## Configuration block

Global defaults:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  tools: {
    loopDetection: {
      enabled: false,
      historySize: 30,
      warningThreshold: 10,
      criticalThreshold: 20,
      globalCircuitBreakerThreshold: 30,
      detectors: {
        genericRepeat: true,
        knownPollNoProgress: true,
        pingPong: true,
      },
    },
  },
}
```

Per-agent override (optional):

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agents: {
    list: [
      {
        id: "safe-runner",
        tools: {
          loopDetection: {
            enabled: true,
            warningThreshold: 8,
            criticalThreshold: 16,
          },
        },
      },
    ],
  },
}
```

### Field behavior

* `enabled`: Master switch. `false` means no loop detection is performed.
* `historySize`: number of recent tool calls kept for analysis.
* `warningThreshold`: threshold before classifying a pattern as warning-only.
* `criticalThreshold`: threshold for blocking repetitive loop patterns.
* `globalCircuitBreakerThreshold`: global no-progress breaker threshold.
* `detectors.genericRepeat`: detects repeated same-tool + same-params patterns.
* `detectors.knownPollNoProgress`: detects known polling-like patterns with no state change.
* `detectors.pingPong`: detects alternating ping-pong patterns.

For `exec`, no-progress checks compare stable command outcomes and ignore volatile runtime metadata such as duration, PID, session ID, and working directory.
When a run id is available, recent tool-call history is evaluated only within that run so scheduled heartbeat cycles and fresh runs do not inherit stale loop counts from earlier runs.

## Recommended setup

* For smaller models, start with `enabled: true`, defaults unchanged. Flagship models rarely need loop detection and can leave it disabled.
* Keep thresholds ordered as `warningThreshold < criticalThreshold < globalCircuitBreakerThreshold`.
* If false positives occur:
  * raise `warningThreshold` and/or `criticalThreshold`
  * (optionally) raise `globalCircuitBreakerThreshold`
  * disable only the detector causing issues
  * reduce `historySize` for less strict historical context

## Post-compaction guard

When the runner completes an auto-compaction-retry (after a context-overflow), it arms a short-window guard that watches the next few tool calls. If the agent emits the *same* `(toolName, args, result)` triple multiple times within that window, the guard concludes that compaction did not break the loop and aborts the run with a `compaction_loop_persisted` error.

This is a separate code path from the global `tools.loopDetection` detectors. It is independently configurable:

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  tools: {
    loopDetection: {
      enabled: true, // existing master switch; set false to disable loop guards
      postCompactionGuard: {
        windowSize: 3, // default: 3
      },
    },
  },
}
```

* `windowSize`: number of post-compaction tool calls during which the guard stays armed *and* the count of identical (tool, args, result) triples that triggers an abort.

The guard never aborts when results are changing, only when results are byte-identical across the window. It is intentionally narrow: it fires only in the immediate aftermath of a compaction-retry.

## Logs and expected behavior

When a loop is detected, OpenClaw reports a loop event and blocks or dampens the next tool-cycle depending on severity.
This protects users from runaway token spend and lockups while preserving normal tool access.

* Prefer warning and temporary suppression first.
* Escalate only when repeated evidence accumulates.

## Notes

* `tools.loopDetection` is merged with agent-level overrides.
* Per-agent config fully overrides or extends global values.
* If no config exists, guardrails stay off.

## Related

* [Exec approvals](/tools/exec-approvals)
* [Thinking levels](/tools/thinking)
* [Sub-agents](/tools/subagents)
