---
type: openclaw_doc
title: "Claude Max API proxy"
source: "https://docs.openclaw.ai/providers/claude-max-api-proxy"
source_hash: "d052364e8d7c2f6aa9da4f36ea579f8506e34ac8a4862799b9285daa3b770847"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/claude-max-api-proxy.md"
original_doc_path: "providers/claude-max-api-proxy.md"
duplicate_index: 1
---

# Claude Max API proxy
Source: https://docs.openclaw.ai/providers/claude-max-api-proxy

**claude-max-api-proxy** is a community npm package (not an OpenClaw plugin) that
exposes a Claude Max/Pro subscription as an OpenAI-compatible API endpoint, so
you can point any OpenAI-compatible tool at your subscription instead of an
Anthropic API key.

Warning

Technical compatibility only, not an officially sanctioned path. Anthropic has
blocked some subscription usage outside Claude Code in the past; verify
Anthropic's current billing rules before relying on this.

Anthropic's Claude Code docs describe `claude -p` as Agent SDK/programmatic
usage. As of Anthropic's June 15, 2026 support update, Claude Agent SDK,
`claude -p`, and third-party app usage draw from the signed-in subscription's
usage limits (the previously announced separate Agent SDK credit plan is
paused). See Anthropic's [Agent SDK plan
article](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan),
the [Pro/Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
and [Team/Enterprise](https://support.claude.com/en/articles/11845131-use-claude-code-with-your-team-or-enterprise-plan)
plan articles, and [Anthropic provider](/providers/anthropic) for OpenClaw's
own Claude CLI billing notes.

## Why use this

| Approach                  | Cost route                                      | Best for                                   |
| ------------------------- | ----------------------------------------------- | ------------------------------------------ |
| Anthropic API key         | Pay per token through Claude Console            | Production apps, shared automation, volume |
| Claude subscription proxy | Claude Code / `claude -p` plan and credit rules | Personal experiments with compatible tools |

This proxy lets a Claude Max or Pro subscription work with OpenAI-compatible
tools. It is not an unlimited flat-rate path — it inherits Claude Code's usage
limits. API keys remain the clearer billing path for production use.

## How it works

```text
Your App -> claude-max-api-proxy -> Claude Code CLI / claude -p -> Anthropic
     (OpenAI format)                (converts format)              (uses your login)
```

The proxy spawns the Claude Code CLI as a subprocess per request, converts
OpenAI-format chat requests to CLI prompts, and streams (or returns) the
response back in OpenAI format.

## Getting started

Steps


Install the proxy

    Requires Node.js 20+ and an authenticated Claude Code CLI.

    ```bash
    npm install -g claude-max-api-proxy

    # Verify Claude CLI is authenticated
    claude --version
    claude auth login   # if not already authenticated
    ```



Start the server

    ```bash
    claude-max-api
    # Server runs at http://localhost:3456
    ```


Test the proxy

    ```bash
    curl http://localhost:3456/health
    curl http://localhost:3456/v1/models

    curl http://localhost:3456/v1/chat/completions \
      -H "Content-Type: application/json" \
      -d '{
        "model": "claude-opus-4",
        "messages": [{"role": "user", "content": "Hello!"}]
      }'
    ```



Configure OpenClaw

    Point OpenClaw at the proxy as a custom OpenAI-compatible endpoint:

    ```json5
    {
      env: {
        OPENAI_API_KEY: "not-needed",
        OPENAI_BASE_URL: "http://localhost:3456/v1",
      },
      agents: {
        defaults: {
          model: { primary: "openai/claude-opus-4" },
        },
      },
    }
    ```



Note

The model ids below are the proxy's own catalog, not OpenClaw's Anthropic
model refs. Each id maps to a Claude Code CLI model alias (`opus`, `sonnet`,
`haiku`), so the underlying model shifts whenever Anthropic updates that
alias in the CLI. Check the proxy's current README before relying on a
specific mapping.

| Model ID          | CLI alias | Current mapping |
| ----------------- | --------- | --------------- |
| `claude-opus-4`   | `opus`    | Claude Opus 4.5 |
| `claude-sonnet-4` | `sonnet`  | Claude Sonnet 4 |
| `claude-haiku-4`  | `haiku`   | Claude Haiku 4  |

## Advanced configuration

AccordionGroup


Proxy-style OpenAI-compatible notes

    This uses OpenClaw's generic custom `/v1` OpenAI-compatible route, the same
    path as any other self-hosted OpenAI-compatible backend:

    - Native OpenAI-only request shaping does not apply.
    - `/fast` and `service_tier` only apply to direct `api.anthropic.com`
      traffic; proxy routes leave `service_tier` untouched (see
      [Anthropic provider fast mode](/providers/anthropic#advanced-configuration)).
    - No Responses `store`, prompt-cache hints, or OpenAI reasoning-compat
      payload shaping.
    - OpenClaw's OpenAI/Codex attribution headers (`originator`, `version`,
      `User-Agent`) are only sent on native `api.openai.com` OAuth traffic, not
      on custom `OPENAI_BASE_URL` targets like this proxy.




Auto-start on macOS with LaunchAgent

    ```bash
    cat > ~/Library/LaunchAgents/com.claude-max-api.plist << 'EOF'
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
      <key>Label</key>
      <string>com.claude-max-api</string>
      <key>RunAtLoad</key>
      <true/>
      <key>KeepAlive</key>
      <true/>
      <key>ProgramArguments</key>
      <array>
        <string>/usr/local/bin/node</string>
        <string>/usr/local/lib/node_modules/claude-max-api-proxy/dist/server/standalone.js</string>
      </array>
      <key>EnvironmentVariables</key>
      <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/opt/homebrew/bin:~/.local/bin:/usr/bin:/bin</string>
      </dict>
    </dict>
    </plist>
    EOF

    launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.claude-max-api.plist
    ```



## Notes

- Inherits Claude Code's `claude -p` billing, usage-credit, and rate-limit behavior.
- Binds to `127.0.0.1` only; does not send data to any third-party server beyond the CLI's own call to Anthropic.
- Streaming responses are supported.
- Auth failures are not checked at startup and only surface once a chat request actually runs; if the CLI is unauthenticated, expect the first request to fail rather than the server to refuse to start.

Note

For native Anthropic integration with Claude CLI or API keys, see [Anthropic provider](/providers/anthropic). For OpenAI/Codex subscriptions, see [OpenAI provider](/providers/openai).

## Related

CardGroup


Anthropic provider

    Native OpenClaw integration with Claude CLI or API keys.


OpenAI provider

    For OpenAI/Codex subscriptions.


Model selection

    Overview of all providers, model refs, and failover behavior.


Configuration

    Full config reference.

---
