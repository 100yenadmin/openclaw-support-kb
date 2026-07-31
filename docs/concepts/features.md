---
type: openclaw_doc
title: "Features"
source: "https://docs.openclaw.ai/concepts/features"
source_hash: "bab35e7ab7a9f82d4b035370bd29855b69e2b0cdb9256f6dba17075c3d44e5c1"
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

    Official plugins add Matrix, Nextcloud Talk, Nostr, Twitch, Zalo, and dozens more with one install command.


Routing

    Multi-agent routing with isolated sessions.


Media

    Images, audio, video, documents, and image/video generation.


Apps and UI

    Windows Hub, browser Control UI, macOS menu bar app, and mobile nodes.


Mobile nodes

    iOS and Android nodes with pairing, voice/chat, and rich device commands.


## Full list

**Channels:**

- iMessage, Telegram, and WebChat ship with the core install; every other channel is an
  official plugin installed with `openclaw plugins install @openclaw/<id>` (or on demand
  during `openclaw onboard` / `openclaw channels add`)
- Official plugin channels: Discord, Feishu, Google Chat, IRC, LINE, Matrix, Mattermost,
  Microsoft Teams, Nextcloud Talk, Nostr, QQ Bot, Raft, Signal, Slack, SMS, Synology Chat,
  Tlon, Twitch, Voice Call, WhatsApp, Zalo, and Zalo Personal
- External plugin channels maintained outside the OpenClaw repo: WeChat, Yuanbao, and Zalo ClawBot
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
- Custom and self-hosted provider support (vLLM, SGLang, Ollama, llama.cpp, LM Studio, and
  any OpenAI-compatible or Anthropic-compatible endpoint)

**Media:**

- Images, audio, video, and documents in and out
- [Inline audio and video playback](/nodes/media-playback) across the Control UI, iOS/macOS, Android, and the Linux companion
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

    Official and external plugins that extend OpenClaw.

---
