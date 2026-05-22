---
type: openclaw_doc
title: "Prometheus metrics"
source: "https://docs.openclaw.ai/gateway/prometheus"
source_hash: "ce1af4c35e0a41ac1c6ae7b1d97ecec9a3c05789a874a814b541769323c02a17"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "gateway/prometheus.md"
original_doc_path: "gateway/prometheus.md"
duplicate_index: 1
---

# Prometheus metrics
Source: https://docs.openclaw.ai/gateway/prometheus



OpenClaw can expose diagnostics metrics through the official `diagnostics-prometheus` plugin. It listens to trusted internal diagnostics and renders a Prometheus text endpoint at:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
GET /api/diagnostics/prometheus
```

Content type is `text/plain; version=0.0.4; charset=utf-8`, the standard Prometheus exposition format.

<Warning>
  The route uses Gateway authentication (operator scope). Do not expose it as a public unauthenticated `/metrics` endpoint. Scrape it through the same auth path you use for other operator APIs.
</Warning>

For traces, logs, OTLP push, and OpenTelemetry GenAI semantic attributes, see [OpenTelemetry export](/gateway/opentelemetry).

## Quick start

<Steps>
  <Step title="Install the plugin">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw plugins install clawhub:@openclaw/diagnostics-prometheus
    ```
  </Step>

  <Step title="Enable the plugin">
    <Tabs>
      <Tab title="Config">
        ```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
        {
          plugins: {
            allow: ["diagnostics-prometheus"],
            entries: {
              "diagnostics-prometheus": { enabled: true },
            },
          },
          diagnostics: {
            enabled: true,
          },
        }
        ```
      </Tab>

      <Tab title="CLI">
        ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
        openclaw plugins enable diagnostics-prometheus
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="Restart the Gateway">
    The HTTP route is registered at plugin startup, so reload after enabling.
  </Step>

  <Step title="Scrape the protected route">
    Send the same gateway auth your operator clients use:

    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" \
      http://127.0.0.1:18789/api/diagnostics/prometheus
    ```
  </Step>

  <Step title="Wire Prometheus">
    ```yaml theme={"theme":{"light":"min-light","dark":"min-dark"}}
    # prometheus.yml
    scrape_configs:
      - job_name: openclaw
        scrape_interval: 30s
        metrics_path: /api/diagnostics/prometheus
        authorization:
          credentials_file: /etc/prometheus/openclaw-gateway-token
        static_configs:
          - targets: ["openclaw-gateway:18789"]
    ```
  </Step>
</Steps>

<Note>
  `diagnostics.enabled: true` is required. Without it, the plugin still registers the HTTP route but no diagnostic events flow into the exporter, so the response is empty.
</Note>

## Metrics exported

| Metric                                        | Type      | Labels                                                                                    |
| --------------------------------------------- | --------- | ----------------------------------------------------------------------------------------- |
| `openclaw_run_completed_total`                | counter   | `channel`, `model`, `outcome`, `provider`, `trigger`                                      |
| `openclaw_run_duration_seconds`               | histogram | `channel`, `model`, `outcome`, `provider`, `trigger`                                      |
| `openclaw_model_call_total`                   | counter   | `api`, `error_category`, `model`, `outcome`, `provider`, `transport`                      |
| `openclaw_model_call_duration_seconds`        | histogram | `api`, `error_category`, `model`, `outcome`, `provider`, `transport`                      |
| `openclaw_model_tokens_total`                 | counter   | `agent`, `channel`, `model`, `provider`, `token_type`                                     |
| `openclaw_gen_ai_client_token_usage`          | histogram | `model`, `provider`, `token_type`                                                         |
| `openclaw_model_cost_usd_total`               | counter   | `agent`, `channel`, `model`, `provider`                                                   |
| `openclaw_tool_execution_total`               | counter   | `error_category`, `outcome`, `params_kind`, `tool`                                        |
| `openclaw_tool_execution_duration_seconds`    | histogram | `error_category`, `outcome`, `params_kind`, `tool`                                        |
| `openclaw_harness_run_total`                  | counter   | `channel`, `error_category`, `harness`, `model`, `outcome`, `phase`, `plugin`, `provider` |
| `openclaw_harness_run_duration_seconds`       | histogram | `channel`, `error_category`, `harness`, `model`, `outcome`, `phase`, `plugin`, `provider` |
| `openclaw_message_received_total`             | counter   | `channel`, `source`                                                                       |
| `openclaw_message_dispatch_started_total`     | counter   | `channel`, `source`                                                                       |
| `openclaw_message_dispatch_completed_total`   | counter   | `channel`, `outcome`, `reason`, `source`                                                  |
| `openclaw_message_dispatch_duration_seconds`  | histogram | `channel`, `outcome`, `reason`, `source`                                                  |
| `openclaw_message_processed_total`            | counter   | `channel`, `outcome`, `reason`                                                            |
| `openclaw_message_processed_duration_seconds` | histogram | `channel`, `outcome`, `reason`                                                            |
| `openclaw_message_delivery_started_total`     | counter   | `channel`, `delivery_kind`                                                                |
| `openclaw_message_delivery_total`             | counter   | `channel`, `delivery_kind`, `error_category`, `outcome`                                   |
| `openclaw_message_delivery_duration_seconds`  | histogram | `channel`, `delivery_kind`, `error_category`, `outcome`                                   |
| `openclaw_talk_event_total`                   | counter   | `brain`, `event_type`, `mode`, `provider`, `transport`                                    |
| `openclaw_talk_event_duration_seconds`        | histogram | `brain`, `event_type`, `mode`, `provider`, `transport`                                    |
| `openclaw_talk_audio_bytes`                   | histogram | `brain`, `event_type`, `mode`, `provider`, `transport`                                    |
| `openclaw_queue_lane_size`                    | gauge     | `lane`                                                                                    |
| `openclaw_queue_lane_wait_seconds`            | histogram | `lane`                                                                                    |
| `openclaw_session_state_total`                | counter   | `reason`, `state`                                                                         |
| `openclaw_session_queue_depth`                | gauge     | `state`                                                                                   |
| `openclaw_session_turn_created_total`         | counter   | `agent`, `channel`, `trigger`                                                             |
| `openclaw_session_recovery_total`             | counter   | `action`, `active_work_kind`, `state`, `status`                                           |
| `openclaw_session_recovery_age_seconds`       | histogram | `action`, `active_work_kind`, `state`, `status`                                           |
| `openclaw_memory_bytes`                       | gauge     | `kind`                                                                                    |
| `openclaw_memory_rss_bytes`                   | histogram | none                                                                                      |
| `openclaw_memory_pressure_total`              | counter   | `level`, `reason`                                                                         |
| `openclaw_telemetry_exporter_total`           | counter   | `exporter`, `reason`, `signal`, `status`                                                  |
| `openclaw_prometheus_series_dropped_total`    | counter   | none                                                                                      |

## Label policy

<AccordionGroup>
  <Accordion title="Bounded, low-cardinality labels">
    Prometheus labels stay bounded and low-cardinality. The exporter does not emit raw diagnostic identifiers such as `runId`, `sessionKey`, `sessionId`, `callId`, `toolCallId`, message IDs, chat IDs, or provider request IDs.

    Label values are redacted and must match OpenClaw's low-cardinality character policy. Values that fail the policy are replaced with `unknown`, `other`, or `none`, depending on the metric.
  </Accordion>

  <Accordion title="Series cap and overflow accounting">
    The exporter caps retained time series in memory at **2048** series across counters, gauges, and histograms combined. New series beyond that cap are dropped, and `openclaw_prometheus_series_dropped_total` increments by one each time.

    Watch this counter as a hard signal that an attribute upstream is leaking high-cardinality values. The exporter never lifts the cap automatically; if it climbs, fix the source rather than disabling the cap.
  </Accordion>

  <Accordion title="What never appears in Prometheus output">
    * prompt text, response text, tool inputs, tool outputs, system prompts
    * Talk transcripts, audio payloads, call ids, room ids, handoff tokens, turn ids, and raw session ids
    * raw provider request IDs (only bounded hashes, where applicable, on spans — never on metrics)
    * session keys and session IDs
    * hostnames, file paths, secret values
  </Accordion>
</AccordionGroup>

## PromQL recipes

```promql theme={"theme":{"light":"min-light","dark":"min-dark"}}
# Tokens per minute, split by provider
sum by (provider) (rate(openclaw_model_tokens_total[1m]))

# Spend (USD) over the last hour, by model
sum by (model) (increase(openclaw_model_cost_usd_total[1h]))

# 95th percentile model run duration
histogram_quantile(
  0.95,
  sum by (le, provider, model)
    (rate(openclaw_run_duration_seconds_bucket[5m]))
)

# Queue wait time SLO (95p under 2s)
histogram_quantile(
  0.95,
  sum by (le, lane) (rate(openclaw_queue_lane_wait_seconds_bucket[5m]))
) < 2

# Dropped Prometheus series (cardinality alarm)
increase(openclaw_prometheus_series_dropped_total[15m]) > 0
```

<Tip>
  Prefer `gen_ai_client_token_usage` for cross-provider dashboards: it follows the OpenTelemetry GenAI semantic conventions and is consistent with metrics from non-OpenClaw GenAI services.
</Tip>

## Choosing between Prometheus and OpenTelemetry export

OpenClaw supports both surfaces independently. You can run either, both, or neither.

<Tabs>
  <Tab title="diagnostics-prometheus">
    * **Pull** model: Prometheus scrapes `/api/diagnostics/prometheus`.
    * No external collector required.
    * Authenticated through normal Gateway auth.
    * Surface is metrics only (no traces or logs).
    * Best for stacks already standardized on Prometheus + Grafana.
  </Tab>

  <Tab title="diagnostics-otel">
    * **Push** model: OpenClaw sends OTLP/HTTP to a collector or OTLP-compatible backend.
    * Surface includes metrics, traces, and logs.
    * Bridges to Prometheus through an OpenTelemetry Collector (`prometheus` or `prometheusremotewrite` exporter) when you need both.
    * See [OpenTelemetry export](/gateway/opentelemetry) for the full catalog.
  </Tab>
</Tabs>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Empty response body">
    * Check `diagnostics.enabled: true` in config.
    * Confirm the plugin is enabled and loaded with `openclaw plugins list --enabled`.
    * Generate some traffic; counters and histograms only emit lines after at least one event.
  </Accordion>

  <Accordion title="401 / unauthorized">
    The endpoint requires the Gateway operator scope (`auth: "gateway"` with `gatewayRuntimeScopeSurface: "trusted-operator"`). Use the same token or password Prometheus uses for any other Gateway operator route. There is no public unauthenticated mode.
  </Accordion>

  <Accordion title="`openclaw_prometheus_series_dropped_total` is climbing">
    A new attribute is exceeding the **2048**-series cap. Inspect recent metrics for an unexpectedly high-cardinality label and fix it at the source. The exporter intentionally drops new series instead of silently rewriting labels.
  </Accordion>

  <Accordion title="Prometheus shows stale series after a restart">
    The plugin keeps state in memory only. After a Gateway restart, counters reset to zero and gauges restart at their next reported value. Use PromQL `rate()` and `increase()` to handle resets cleanly.
  </Accordion>
</AccordionGroup>

## Related

* [Diagnostics export](/gateway/diagnostics) — local diagnostics zip for support bundles
* [Health and readiness](/gateway/health) — `/healthz` and `/readyz` probes
* [Logging](/logging) — file-based logging
* [OpenTelemetry export](/gateway/opentelemetry) — OTLP push for traces, metrics, and logs
