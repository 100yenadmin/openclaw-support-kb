---
type: openclaw_doc
title: "Showcase"
source: "https://docs.openclaw.ai/start/showcase"
source_hash: "411de693c9a62d499101dbb3af2d79887b50f9ac90b2da8f4289b39acbca7eb8"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "start/showcase.md"
original_doc_path: "start/showcase.md"
duplicate_index: 1
---

# Showcase
Source: https://docs.openclaw.ai/start/showcase

OpenClaw projects are not toy demos. People are shipping PR review loops, mobile apps, home automation, voice systems, devtools, and memory-heavy workflows from the channels they already use — chat-native builds on Telegram, WhatsApp, Discord, and terminals; real automation for booking, shopping, and support without waiting for an API; and physical-world integrations with printers, vacuums, cameras, and home systems.

Info

**Want to be featured?** Share your project in [#self-promotion on Discord](https://discord.gg/clawd) or [tag @openclaw on X](https://x.com/openclaw).

## Videos

Start here if you want the shortest path from "what is this?" to "okay, I get it."

CardGroup

Full setup walkthrough

  VelvetShark, 28 minutes. Install, onboard, and get to a first working assistant end to end.

Community showcase reel

  A faster pass across real projects, surfaces, and workflows built around OpenClaw.

Projects in the wild

  Examples from the community, from chat-native coding loops to hardware and personal automation.

## Fresh from Discord

Recent standouts across coding, devtools, mobile, and chat-native product building.

CardGroup

PR Review to Telegram Feedback

  **@bangnokia** • `review` `github` `telegram`

OpenCode finishes the change, opens a PR, OpenClaw reviews the diff and replies in Telegram with suggestions plus a clear merge verdict.

  <img src="/assets/showcase/pr-review-telegram.jpg" alt="OpenClaw PR review feedback delivered in Telegram" />

Wine Cellar Skill in Minutes

  **@prades_maxime** • `skills` `local` `csv`

Asked "Robby" (@openclaw) for a local wine cellar skill. It requests a sample CSV export and a store path, then builds and tests the skill (962 bottles in the example).

  <img src="/assets/showcase/wine-cellar-skill.jpg" alt="OpenClaw building a local wine cellar skill from CSV" />

Tesco Shop Autopilot

  **@marchattonhere** • `automation` `browser` `shopping`

Weekly meal plan, regulars, book delivery slot, confirm order. No APIs, just browser control.

  <img src="/assets/showcase/tesco-shop.jpg" alt="Tesco shop automation via chat" />

SNAG screenshot-to-Markdown

  **@am-will** • `devtools` `screenshots` `markdown`

Hotkey a screen region, Gemini vision, instant Markdown in your clipboard.

  <img src="/assets/showcase/snag.png" alt="SNAG screenshot-to-markdown tool" />

Agents UI

  **@kitze** • `ui` `skills` `sync`

Desktop app to manage skills and commands across Agents, Claude, Codex, and OpenClaw.

  <img src="/assets/showcase/agents-ui.jpg" alt="Agents UI app" />

Telegram voice notes (papla.media)

  **Community** • `voice` `tts` `telegram`

Wraps papla.media TTS and sends results as Telegram voice notes (no annoying autoplay).

  <img src="/assets/showcase/papla-tts.jpg" alt="Telegram voice note output from TTS" />

CodexMonitor

  **@odrobnik** • `devtools` `codex` `brew`

Homebrew-installed helper to list, inspect, and watch local OpenAI Codex sessions (CLI + VS Code).

  <img src="/assets/showcase/codexmonitor.png" alt="CodexMonitor on ClawHub" />

Bambu 3D Printer Control

  **@tobiasbischoff** • `hardware` `3d-printing` `skill`

Control and troubleshoot BambuLab printers: status, jobs, camera, AMS, calibration, and more.

  <img src="/assets/showcase/bambu-cli.png" alt="Bambu CLI skill on ClawHub" />

Vienna transport (Wiener Linien)

  **@hjanuschka** • `travel` `transport` `skill`

Real-time departures, disruptions, elevator status, and routing for Vienna's public transport.

  <img src="/assets/showcase/wienerlinien.png" alt="Wiener Linien skill on ClawHub" />

ParentPay school meals

  **@George5562** • `automation` `browser` `parenting`

Automated UK school meal booking via ParentPay. Uses mouse coordinates for reliable table cell clicking.

R2 upload (Send Me My Files)

  **@julianengel** • `files` `r2` `presigned-urls`

Upload to Cloudflare R2/S3 and generate secure presigned download links. Useful for remote OpenClaw instances.

iOS app via Telegram

  **@coard** • `ios` `xcode` `testflight`

Built a complete iOS app with maps and voice recording, deployed to TestFlight entirely via Telegram chat.

  <img src="/assets/showcase/ios-testflight.jpg" alt="iOS app on TestFlight" />

Oura Ring health assistant

  **@AS** • `health` `oura` `calendar`

Personal AI health assistant integrating Oura ring data with calendar, appointments, and gym schedule.

  <img src="/assets/showcase/oura-health.png" alt="Oura ring health assistant" />

Kev's Dream Team (14+ agents)

  **@adam91holt** • `multi-agent` `orchestration`

14+ agents under one gateway with an Opus 4.5 orchestrator delegating to Codex workers. See the [technical write-up](https://github.com/adam91holt/orchestrated-ai-articles) and [Clawdspace](https://github.com/adam91holt/clawdspace) for agent sandboxing.

Linear CLI

  **@NessZerra** • `devtools` `linear` `cli`

CLI for Linear that integrates with agentic workflows (Claude Code, OpenClaw). Manage issues, projects, and workflows from the terminal.

Beeper CLI

  **@jules** • `messaging` `beeper` `cli`

Read, send, and archive messages via Beeper Desktop. Uses Beeper local MCP API so agents can manage all your chats (iMessage, WhatsApp, and more) in one place.

## Automation and workflows

Scheduling, browser control, support loops, and the "just do the task for me" side of the product.

CardGroup

Winix air purifier control

  **@antonplex** • `automation` `hardware` `air-quality`

Claude Code discovered and confirmed the purifier controls, then OpenClaw takes over to manage room air quality.

  <img src="/assets/showcase/winix-air-purifier.jpg" alt="Winix air purifier control via OpenClaw" />

Pretty sky camera shots

  **@signalgaining** • `automation` `camera` `skill`

Triggered by a roof camera: ask OpenClaw to snap a sky photo whenever it looks pretty. It designed a skill and took the shot.

  <img src="/assets/showcase/roof-camera-sky.jpg" alt="Roof camera sky snapshot captured by OpenClaw" />

Visual morning briefing scene

  **@buddyhadry** • `automation` `briefing` `telegram`

A scheduled prompt generates one scene image each morning (weather, tasks, date, favorite post or quote) via an OpenClaw persona.

Padel court booking

  **@joshp123** • `automation` `booking` `cli`

Playtomic availability checker plus booking CLI. Never miss an open court again.

  <img src="/assets/showcase/padel-screenshot.jpg" alt="padel-cli screenshot" />

Accounting intake

  **Community** • `automation` `email` `pdf`

Collects PDFs from email, preps documents for a tax consultant. Monthly accounting on autopilot.

Couch potato dev mode

  **@davekiss** • `telegram` `migration` `astro`

Rebuilt an entire personal site via Telegram while watching Netflix — Notion to Astro, 18 posts migrated, DNS to Cloudflare. Never opened a laptop.

Job search agent

  **@attol8** • `automation` `api` `skill`

Searches job listings, matches against CV keywords, and returns relevant opportunities with links. Built in 30 minutes using the JSearch API.

Jira skill builder

  **@jdrhyne** • `jira` `skill` `devtools`

OpenClaw connected to Jira, then generated a new skill on the fly (before it existed on ClawHub).

Todoist skill via Telegram

  **@iamsubhrajyoti** • `todoist` `skill` `telegram`

Automated Todoist tasks and had OpenClaw generate the skill directly in Telegram chat.

TradingView analysis

  **@bheem1798** • `finance` `browser` `automation`

Logs into TradingView via browser automation, screenshots charts, and performs technical analysis on demand. No API needed — just browser control.

Slack auto-support

  **@henrymascot** • `slack` `automation` `support`

Watches a company Slack channel, responds helpfully, and forwards notifications to Telegram. Autonomously fixed a production bug in a deployed app without being asked.

## Knowledge and memory

Systems that index, search, remember, and reason over personal or team knowledge.

CardGroup

xuezh Chinese learning

  **@joshp123** • `learning` `voice` `skill`

Chinese learning engine with pronunciation feedback and study flows via OpenClaw.

  <img src="/assets/showcase/xuezh-pronunciation.jpeg" alt="xuezh pronunciation feedback" />

WhatsApp memory vault

  **Community** • `memory` `transcription` `indexing`

Ingests full WhatsApp exports, transcribes 1k+ voice notes, cross-checks with git logs, outputs linked markdown reports.

Karakeep semantic search

  **@jamesbrooksco** • `search` `vector` `bookmarks`

Adds vector search to Karakeep bookmarks using Qdrant plus OpenAI or Ollama embeddings.

Inside-Out-2 memory

  **Community** • `memory` `beliefs` `self-model`

Separate memory manager that turns session files into memories, then beliefs, then an evolving self model.

## Voice and phone

Speech-first entry points, phone bridges, and transcription-heavy workflows.

CardGroup

Clawdia phone bridge

  **@alejandroOPI** • `voice` `vapi` `bridge`

Vapi voice assistant to OpenClaw HTTP bridge. Near real-time phone calls with your agent.

OpenRouter transcription

  **@obviyus** • `transcription` `multilingual` `skill`

Multi-lingual audio transcription via OpenRouter (Gemini, and more). Available on ClawHub.

## Infrastructure and deployment

Packaging, deployment, and integrations that make OpenClaw easier to run and extend.

CardGroup

Home Assistant add-on

  **@ngutman** • `homeassistant` `docker` `raspberry-pi`

OpenClaw gateway running on Home Assistant OS with SSH tunnel support and persistent state.

Home Assistant skill

  **ClawHub** • `homeassistant` `skill` `automation`

Control and automate Home Assistant devices via natural language.

Nix packaging

  **@openclaw** • `nix` `packaging` `deployment`

Batteries-included nixified OpenClaw configuration for reproducible deployments.

CalDAV calendar

  **ClawHub** • `calendar` `caldav` `skill`

Calendar skill using khal and vdirsyncer. Self-hosted calendar integration.

## Home and hardware

The physical-world side of OpenClaw: homes, sensors, cameras, vacuums, and other devices.

CardGroup

GoHome automation

  **@joshp123** • `home` `nix` `grafana`

Nix-native home automation with OpenClaw as the interface, plus Grafana dashboards.

  <img src="/assets/showcase/gohome-grafana.png" alt="GoHome Grafana dashboard" />

Roborock vacuum

  **@joshp123** • `vacuum` `iot` `plugin`

Control your Roborock robot vacuum through natural conversation.

  <img src="/assets/showcase/roborock-screenshot.jpg" alt="Roborock status" />

## Community projects

Things that grew beyond a single workflow into broader products or ecosystems.

CardGroup

StarSwap marketplace

  **Community** • `marketplace` `astronomy` `webapp`

Full astronomy gear marketplace. Built with and around the OpenClaw ecosystem.

## Submit your project

Steps


Share it

    Post in [#self-promotion on Discord](https://discord.gg/clawd) or [tweet @openclaw](https://x.com/openclaw).


Include details

    Tell us what it does, link to the repo or demo, and share a screenshot if you have one.


Get featured

    We'll add standout projects to this page.


## Related

- [Getting started](/start/getting-started)
- [OpenClaw](/start/openclaw)

---
