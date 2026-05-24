---
type: openclaw_doc
title: "Features"
source: "https://docs.openclaw.ai/concepts/features"
source_hash: "ffba32384e2a9aab80593df40121b90e0d760eff371e59da05cb481f83e54b13"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "concepts/features.md"
original_doc_path: "concepts/features.md"
duplicate_index: 1
---

# Features
Source: https://docs.openclaw.ai/concepts/features

## Highlights

Columns


Channels

    Discord, iMessage, Signal, Slack, Telegram, WhatsApp, WebChat, and more with a single Gateway.


Plugins

    Bundled plugins add Matrix, Nextcloud Talk, Nostr, Twitch, Zalo, and more without separate installs in normal current releases.


Routing

    Multi-agent routing with isolated sessions.


Media

    Images, audio, video, documents, and image/video generation.


Apps and UI

    Web Control UI and macOS companion app.


Mobile nodes

    iOS and Android nodes with pairing, voice/chat, and rich device commands.


## Full list

**Channels:**

- Built-in channels include Discord, Google Chat, iMessage, IRC, Signal, Slack, Telegram, WebChat, and WhatsApp
- Bundled plugin channels include Feishu, LINE, Matrix, Mattermost, Microsoft Teams, Nextcloud Talk, Nostr, QQ Bot, Synology Chat, Tlon, Twitch, Zalo, and Zalo Personal
- Optional separately installed channel plugins include Voice Call and third-party packages such as WeChat
- Third-party channel plugins can extend the Gateway further, such as WeChat
- Group chat support with mention-based activation
- DM safety with allowlists and pairing

**Agent:**

- Embedded agent runtime with tool streaming
- Multi-agent routing with isolated sessions per workspace or sender
- Sessions: direct chats collapse into shared `main`; groups are isolated
- Streaming and chunking for long responses

**Auth and providers:**

- 35+ model providers (Anthropic, OpenAI, Google, and more)
- Subscription auth via OAuth (e.g. OpenAI Codex)
- Custom and self-hosted provider support (vLLM, SGLang, Ollama, and any OpenAI-compatible or Anthropic-compatible endpoint)

**Media:**

- Images, audio, video, and documents in and out
- Shared image generation and video generation capability surfaces
- Voice note transcription
- Text-to-speech with multiple providers

**Apps and interfaces:**

- WebChat and browser Control UI
- macOS menu bar companion app
- iOS node with pairing, Canvas, camera, screen recording, location, and voice
- Android node with pairing, chat, voice, Canvas, camera, and device commands

**Tools and automation:**

- Browser automation, exec, sandboxing
- Web search (Brave, DuckDuckGo, Exa, Firecrawl, Gemini, Grok, Kimi, MiniMax Search, Ollama Web Search, Perplexity, SearXNG, Tavily)
- Cron jobs and heartbeat scheduling
- Skills, plugins, and workflow pipelines (Lobster)

## Related

CardGroup


Experimental features

    Opt-in features that have not yet shipped to the default surface.


Agent runtime

    Agent runtime model and how runs are dispatched.


Channels

    Connect Telegram, WhatsApp, Discord, Slack, and more from one Gateway.


Plugins

    Bundled and third-party plugins that extend OpenClaw.

---
