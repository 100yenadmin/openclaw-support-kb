---
type: composio_doc
title: "Agent plugins"
source: "https://docs.composio.dev/docs/agent-plugins.md"
source_hash: "23e8ac9a123947ba3cac31e5ac3d9bcad9daf3e0c7748ed2018441b888e9b4c6"
system: "composio"
kb_namespace: "composio"
doc_path: "agent-plugins.md"
original_doc_path: "agent-plugins.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Agent plugins (/docs/agent-plugins)
Source: https://docs.composio.dev/docs/agent-plugins.md


Agent plugins let Codex and Claude Code use Composio from your current conversation. The plugin teaches your agent how to find tools, connect accounts, and run actions through the Composio CLI.

## Install the plugin [#install-the-plugin]

Install the Composio CLI:

```bash
curl -fsSL https://composio.dev/install | sh
```

Open a new terminal, sign in, and configure every supported agent on your machine:

```bash
composio login
composio setup --target auto
```

`auto` detects Codex and Claude Code. If both are installed, it configures both.

> **Running setup from an agent or script?**: Setup asks before changing local files. Add `--yes` in a non-interactive shell: `composio setup --target auto --yes`.

## Try a task [#try-a-task]

Ask Codex or Claude Code to work with one of your apps:

* `List the open GitHub issues assigned to me.`
* `Summarize the unread Gmail messages I received today.`
* `Create a Linear issue from these release notes: ...`

You do not need to know a tool slug or connection ID. The agent searches by task and selects a matching tool. If the toolkit is not connected, the agent starts `composio link` and gives you a Connect Link. Approve the connection, then ask the agent to continue.

## Configure one agent [#configure-one-agent]

Use an explicit target when you only want to configure one agent.

### Codex [#codex]

```bash
composio setup --target codex
```

The Codex plugin bundles the Composio CLI skill. You can also install the plugin with Codex directly:

```bash
codex plugin marketplace add https://github.com/ComposioHQ/composio-plugin-openai.git --json
codex plugin add composio@composio --json
```

The plugin source is available in [`ComposioHQ/composio-plugin-openai`](https://github.com/ComposioHQ/composio-plugin-openai).

### Claude Code [#claude-code]

```bash
composio setup --target claude
```

You can also install the plugin from Claude Code:

```bash
/plugin marketplace add ComposioHQ/composio-plugin-cc
/plugin install composio@composio
```

See the [Claude Code plugin guide](/docs/claude-code-plugin) for team installation, updates, and troubleshooting.

## What the plugin uses [#what-the-plugin-uses]

Both plugins run the Composio CLI underneath. The agent uses `composio search` to find an unknown tool, `composio link` to connect an account, and `composio execute` to run a known tool. The same connections are available when you use the [CLI directly](/docs/cli).

## Install only the CLI skill [#install-only-the-cli-skill]

The plugin includes a Composio CLI skill that teaches your agent how to search for and run tools. Codex receives it with the plugin, while `composio login` installs it for Claude Code by default.

If you want the skill without the plugin, install it for your agent directly:

```bash
composio --install-skill composio-cli claude
composio --install-skill composio-cli codex
```

## Choose another setup [#choose-another-setup]

- [Build an agent](/docs/quickstart): Add Composio tools and authentication to your application.

- [Use the CLI](/docs/cli): Search, connect, and run tools from your terminal.

- [Connect over MCP](/docs/composio-connect): Add Composio to an existing MCP client.

---
