---
type: openclaw_doc
title: "CLI automation"
source: "https://docs.openclaw.ai/start/wizard-cli-automation"
source_hash: "641fa336f3c62af3a9d57eeb2efbb957c76a549836bedfd847a589aedb155180"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "start/wizard-cli-automation.md"
original_doc_path: "start/wizard-cli-automation.md"
duplicate_index: 1
---

# CLI automation
Source: https://docs.openclaw.ai/start/wizard-cli-automation



Use `--non-interactive` to automate `openclaw onboard`.

<Note>
  `--json` does not imply non-interactive mode. Use `--non-interactive` (and `--workspace`) for scripts.
</Note>

## Baseline non-interactive example

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --secret-input-mode plaintext \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-bootstrap \
  --skip-skills
```

Add `--json` for a machine-readable summary.

Use `--skip-bootstrap` when your automation pre-seeds workspace files and does not want onboarding to create the default bootstrap files.

Use `--secret-input-mode ref` to store env-backed refs in auth profiles instead of plaintext values.
Interactive selection between env refs and configured provider refs (`file` or `exec`) is available in the onboarding flow.

In non-interactive `ref` mode, provider env vars must be set in the process environment.
Passing inline key flags without the matching env var now fails fast.

Example:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice openai-api-key \
  --secret-input-mode ref \
  --accept-risk
```

## Provider-specific examples

<AccordionGroup>
  <Accordion title="Anthropic API key example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice apiKey \
      --anthropic-api-key "$ANTHROPIC_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Gemini example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice gemini-api-key \
      --gemini-api-key "$GEMINI_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Z.AI example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice zai-api-key \
      --zai-api-key "$ZAI_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Vercel AI Gateway example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice ai-gateway-api-key \
      --ai-gateway-api-key "$AI_GATEWAY_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Cloudflare AI Gateway example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice cloudflare-ai-gateway-api-key \
      --cloudflare-ai-gateway-account-id "your-account-id" \
      --cloudflare-ai-gateway-gateway-id "your-gateway-id" \
      --cloudflare-ai-gateway-api-key "$CLOUDFLARE_AI_GATEWAY_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Moonshot example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice moonshot-api-key \
      --moonshot-api-key "$MOONSHOT_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Mistral example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice mistral-api-key \
      --mistral-api-key "$MISTRAL_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Synthetic example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice synthetic-api-key \
      --synthetic-api-key "$SYNTHETIC_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="OpenCode example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice opencode-zen \
      --opencode-zen-api-key "$OPENCODE_API_KEY" \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```

    Swap to `--auth-choice opencode-go --opencode-go-api-key "$OPENCODE_API_KEY"` for the Go catalog.
  </Accordion>

  <Accordion title="Ollama example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice ollama \
      --custom-model-id "qwen3.5:27b" \
      --accept-risk \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```
  </Accordion>

  <Accordion title="Custom provider example">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice custom-api-key \
      --custom-base-url "https://llm.example.com/v1" \
      --custom-model-id "foo-large" \
      --custom-api-key "$CUSTOM_API_KEY" \
      --custom-provider-id "my-custom" \
      --custom-compatibility anthropic \
      --custom-image-input \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```

    `--custom-api-key` is optional. If omitted, onboarding checks `CUSTOM_API_KEY`.
    OpenClaw marks common vision model IDs as image-capable automatically. Add `--custom-image-input` for unknown custom vision IDs, or `--custom-text-input` to force text-only metadata.

    Ref-mode variant:

    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    export CUSTOM_API_KEY="your-key"
    openclaw onboard --non-interactive \
      --mode local \
      --auth-choice custom-api-key \
      --custom-base-url "https://llm.example.com/v1" \
      --custom-model-id "foo-large" \
      --secret-input-mode ref \
      --custom-provider-id "my-custom" \
      --custom-compatibility anthropic \
      --custom-image-input \
      --gateway-port 18789 \
      --gateway-bind loopback
    ```

    In this mode, onboarding stores `apiKey` as `{ source: "env", provider: "default", id: "CUSTOM_API_KEY" }`.
  </Accordion>
</AccordionGroup>

Anthropic setup-token remains available as a supported onboarding token path, but OpenClaw now prefers Claude CLI reuse when available.
For production, prefer an Anthropic API key.

## Add another agent

Use `openclaw agents add <name>` to create a separate agent with its own workspace,
sessions, and auth profiles. Running without `--workspace` launches the wizard.

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw agents add work \
  --workspace ~/.openclaw/workspace-work \
  --model openai/gpt-5.5 \
  --bind whatsapp:biz \
  --non-interactive \
  --json
```

What it sets:

* `agents.list[].name`
* `agents.list[].workspace`
* `agents.list[].agentDir`

Notes:

* Default workspaces follow `~/.openclaw/workspace-<agentId>`.
* Add `bindings` to route inbound messages (the wizard can do this).
* Non-interactive flags: `--model`, `--agent-dir`, `--bind`, `--non-interactive`.

## Related docs

* Onboarding hub: [Onboarding (CLI)](/start/wizard)
* Full reference: [CLI Setup Reference](/start/wizard-cli-reference)
* Command reference: [`openclaw onboard`](/cli/onboard)
