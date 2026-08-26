---
type: openclaw_doc
title: "Getting started"
source: "https://docs.openclaw.ai/start/getting-started"
source_hash: "79e5e8552ef2d4c63354874e19b080225dc988aecc71a5168854ce2594bcad53"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "start/getting-started.md"
original_doc_path: "start/getting-started.md"
duplicate_index: 1
---

# Getting started
Source: https://docs.openclaw.ai/start/getting-started

Install OpenClaw, run onboarding, and chat with your AI assistant in about 5
minutes. By the end you will have a running Gateway, configured auth, and a
working chat session.

## What you need

- **Node.js 22.22.3+, 24.15+, or 25.9+** (Node 26 is the recommended runtime)
- **An API key** from a model provider (Anthropic, OpenAI, Google, etc.) — onboarding will prompt you

Tip

Check your Node version with `node --version`.
**Windows users:** the native Windows Hub app is the easiest desktop path. The
PowerShell installer and WSL2 Gateway paths are also supported. See [Windows](/platforms/windows).
Need to install Node? See [Node setup](/install/node).

## Quick setup

Steps


Install OpenClaw


Tabs


macOS / Linux

        ```bash
        curl -fsSL https://openclaw.ai/install.sh | bash
        ```
        <img
  src="/assets/install-script.svg"
  alt="Install Script Process"
  className="rounded-lg"
/>


Windows (PowerShell)

        ```powershell
        iwr -useb https://openclaw.ai/install.ps1 | iex
        ```




Note

    Other install methods (Docker, Nix, npm): [Install](/install).




Complete onboarding

    The installer starts the onboarding wizard automatically. Follow it to choose
    a model provider, set an API key, and configure the Gateway. QuickStart is
    usually only a few minutes, but provider sign-in, channel pairing, daemon
    install, network downloads, skills, or optional plugins can make full
    onboarding take longer. Skip optional steps and return later with
    `openclaw configure`.

    See [Onboarding (CLI)](/start/wizard) for the full reference.



Verify the Gateway is running

    ```bash
    openclaw gateway status
    ```

    You should see the Gateway listening on port 18789.



Open the dashboard

    ```bash
    openclaw dashboard
    ```

    This opens the Control UI in your browser. If it loads, everything is working.



Send your first message

    Type a message in the Control UI chat and you should get an AI reply.

    Want to chat from your phone instead? The fastest channel to set up is
    [Telegram](/channels/telegram) (just a bot token). See [Channels](/channels)
    for all options.



Advanced: mount a custom Control UI build

  If you maintain a localized or customized dashboard build, point
  `gateway.controlUi.root` to a directory that contains your built static
  assets and `index.html`.

```bash
mkdir -p "$HOME/.openclaw/control-ui-custom"
# Copy your built static files into that directory.
```

Then set:

```json
{
  "gateway": {
    "controlUi": {
      "enabled": true,
      "root": "${HOME}/.openclaw/control-ui-custom"
    }
  }
}
```

Restart the gateway and reopen the dashboard:

```bash
openclaw gateway restart
openclaw dashboard
```

## If setup does not work

One command turns the current state of your install into a diagnosis you can act on:

```bash
openclaw triage
```

It runs read-only health checks, writes a sanitized prompt describing what it found, and then offers to hand that prompt to a coding agent it detects on your machine — Claude Code, Codex CLI, or the built-in OpenClaw agent — so the agent starts with the diagnosis already loaded. Pick "just print the commands" if you would rather run the handoff yourself.

Nothing leaves your machine until you choose an agent, and secrets, tokens, raw chat payloads, and raw logs are excluded from the prompt.

To read the findings yourself instead, run [`openclaw doctor`](/cli/doctor). For symptom-first routes, see [Troubleshooting](/help/troubleshooting).

## What to do next

Columns


Connect a channel

    Discord, Feishu, iMessage, Matrix, Microsoft Teams, Signal, Slack, Telegram, WhatsApp, Zalo, and more.


Pairing and safety

    Control who can message your agent.


Configure the Gateway

    Models, tools, sandbox, and advanced settings.


Browse tools

    Browser, exec, web search, skills, and plugins.


Advanced: environment variables

  If you run OpenClaw as a service account or want custom paths:

- `OPENCLAW_HOME` — home directory for internal path resolution
- `OPENCLAW_STATE_DIR` — override the state directory
- `OPENCLAW_CONFIG_PATH` — override the config file path

Full reference: [Environment variables](/help/environment).

## Related

- [Install overview](/install)
- [Channels overview](/channels)
- [Setup](/start/setup)
- [Triage](/cli/triage)
- [Troubleshooting](/help/troubleshooting)

---
