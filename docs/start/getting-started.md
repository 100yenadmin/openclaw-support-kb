---
type: openclaw_doc
title: "Getting started"
source: "https://docs.openclaw.ai/start/getting-started"
source_hash: "d22b5a72dda9cdcd8b064213d18b5acab60ed7ff24a1a6305781c63a522d22c0"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "start/getting-started.md"
original_doc_path: "start/getting-started.md"
duplicate_index: 1
---

# Getting started
Source: https://docs.openclaw.ai/start/getting-started



Install OpenClaw, run onboarding, and chat with your AI assistant — all in
about 5 minutes. By the end you will have a running Gateway, configured auth,
and a working chat session.

## What you need

* **Node.js** — Node 24 recommended (Node 22.14+ also supported)
* **An API key** from a model provider (Anthropic, OpenAI, Google, etc.) — onboarding will prompt you

<Tip>
  Check your Node version with `node --version`.
  **Windows users:** both native Windows and WSL2 are supported. WSL2 is more
  stable and recommended for the full experience. See [Windows](/platforms/windows).
  Need to install Node? See [Node setup](/install/node).
</Tip>

## Quick setup

<Steps>
  <Step title="Install OpenClaw">
    <Tabs>
      <Tab title="macOS / Linux">
        ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
        curl -fsSL https://openclaw.ai/install.sh | bash
        ```

        <img alt="Install Script Process" />
      </Tab>

      <Tab title="Windows (PowerShell)">
        ```powershell theme={"theme":{"light":"min-light","dark":"min-dark"}}
        iwr -useb https://openclaw.ai/install.ps1 | iex
        ```
      </Tab>
    </Tabs>

    <Note>
      Other install methods (Docker, Nix, npm): [Install](/install).
    </Note>
  </Step>

  <Step title="Run onboarding">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw onboard --install-daemon
    ```

    The wizard walks you through choosing a model provider, setting an API key,
    and configuring the Gateway. It takes about 2 minutes.

    See [Onboarding (CLI)](/start/wizard) for the full reference.
  </Step>

  <Step title="Verify the Gateway is running">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw gateway status
    ```

    You should see the Gateway listening on port 18789.
  </Step>

  <Step title="Open the dashboard">
    ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
    openclaw dashboard
    ```

    This opens the Control UI in your browser. If it loads, everything is working.
  </Step>

  <Step title="Send your first message">
    Type a message in the Control UI chat and you should get an AI reply.

    Want to chat from your phone instead? The fastest channel to set up is
    [Telegram](/channels/telegram) (just a bot token). See [Channels](/channels)
    for all options.
  </Step>
</Steps>

<Accordion title="Advanced: mount a custom Control UI build">
  If you maintain a localized or customized dashboard build, point
  `gateway.controlUi.root` to a directory that contains your built static
  assets and `index.html`.

  ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
  mkdir -p "$HOME/.openclaw/control-ui-custom"
  # Copy your built static files into that directory.
  ```

  Then set:

  ```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
  {
    "gateway": {
      "controlUi": {
        "enabled": true,
        "root": "$HOME/.openclaw/control-ui-custom"
      }
    }
  }
  ```

  Restart the gateway and reopen the dashboard:

  ```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
  openclaw gateway restart
  openclaw dashboard
  ```
</Accordion>

## What to do next

<Columns>
  <Card title="Connect a channel" href="/channels" icon="message-square">
    Discord, Feishu, iMessage, Matrix, Microsoft Teams, Signal, Slack, Telegram, WhatsApp, Zalo, and more.
  </Card>

  <Card title="Pairing and safety" href="/channels/pairing" icon="shield">
    Control who can message your agent.
  </Card>

  <Card title="Configure the Gateway" href="/gateway/configuration" icon="settings">
    Models, tools, sandbox, and advanced settings.
  </Card>

  <Card title="Browse tools" href="/tools" icon="wrench">
    Browser, exec, web search, skills, and plugins.
  </Card>
</Columns>

<Accordion title="Advanced: environment variables">
  If you run OpenClaw as a service account or want custom paths:

  * `OPENCLAW_HOME` — home directory for internal path resolution
  * `OPENCLAW_STATE_DIR` — override the state directory
  * `OPENCLAW_CONFIG_PATH` — override the config file path

  Full reference: [Environment variables](/help/environment).
</Accordion>

## Related

* [Install overview](/install)
* [Channels overview](/channels)
* [Setup](/start/setup)
