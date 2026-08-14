---
type: openclaw_doc
title: "Showcase"
source: "https://docs.openclaw.ai/start/showcase"
source_hash: "3e7c487e3afcbdfa65b8b9404b9f2758d888fbe28802128dbda0ab11065a8c33"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "start/showcase.md"
original_doc_path: "start/showcase.md"
duplicate_index: 1
---

# Showcase
Source: https://docs.openclaw.ai/start/showcase

Community-built OpenClaw projects: PR review loops, mobile apps, home automation, voice systems, devtools, and memory workflows, built chat-native on Telegram, WhatsApp, Discord, and terminals.

Info

**Want to be featured?** Share your project in [#self-promotion on Discord](https://discord.gg/clawd) or [tag @openclaw on X](https://x.com/openclaw).

## Fresh from Discord

Recent standouts across coding, devtools, mobile, and chat-native product building.

CardGroup

Dropage instant HTML deploy

  **@jiantoucn** • `deploy` `hosting` `skill`

Tell your agent "deploy this HTML" and get a public URL back in about a second. Pages self-expire after an hour — no server, no config, no signup.

Anti-scam URL checker

  **@phishguard-niki** • `security` `phishing` `skill`

Paste any URL, get a verdict. 2.5M+ scam domains from 38 feeds (PhishTank, OpenPhish, CERT.PL, and more), matched locally so browsing history never leaves the machine.

Product-design reasoning skills

  **@monikazapisekstudio** • `product` `reasoning` `skills`

A trio for product work: [Socratic Dialogue](https://clawhub.ai/monikazapisekstudio/skills/socratic-dialog) cross-examines a question before answering, [Kano Model Strategist](https://clawhub.ai/monikazapisekstudio/skills/kano-model-strategist) sorts features into what earns its place, and [Legible Agent Output](https://clawhub.ai/monikazapisekstudio/skills/legible-agent-output) rewrites agent output into plain language.

Mailbox broker for sub-agents

  **@albzhu** • `multi-agent` `async` `skill`

Stops orchestrators from idling while sub-agents work: an async callback mechanism where results land in a mailbox instead of blocking the parent agent.

lite-mode for low-RAM machines

  **@mirajmahmudul** • `performance` `skill`

Keeps OpenClaw usable on 2-4 GB machines: checks free memory and trims heavy features before the box starts swapping. [Source on GitHub](https://github.com/mirajmahmudul/openclaw-lite-mode).

tokenomics cost tracker

  **@ncz-os** • `devtools` `costs` `tokens`

Token cost tracker from an NVIDIA engineer with first-class OpenClaw support: see exactly where your agent spend goes, per model and per session.

Excalidraw diagram generator

  **@swiftlysingh** • `diagrams` `excalidraw` `devtools`

Describe a diagram in chat and get a programmatically generated Excalidraw sketch back.

GA4 analytics skill

  **@jdrhyne** • `analytics` `ga4` `skill`

Had OpenClaw build its own Google Analytics query tool, then packaged and published it to ClawHub.

ClawEval model rankings

  **@AIgenteur** • `evals` `models` `devtools`

Benchmarks models across 59 agent roles to answer "which LLM for my GPU?". A community favorite for picking local models.

Music Craft

  **@luischarro** • `music` `generation` `skill`

Provider-agnostic song generation: plan the track, structure lyrics, and revise sparse results instead of one-shot prompting. Includes a [MiniMax variant](https://clawhub.ai/luischarro/music-craft-minimax) with BPM, key, structure, and mashup control.

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

  <img src="/assets/showcase/r2-upload.png" alt="R2 upload skill on ClawHub" />

iOS app via Telegram

  **@coard** • `ios` `xcode` `app-store`

Built a complete iOS app with maps and voice recording, prepared for App Store distribution entirely via Telegram chat.

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

Car negotiation ($4,200 saved)

  **@astuyve** • `negotiation` `email` `automation`

Set OpenClaw loose on car dealers: it handled the back-and-forth negotiation and knocked $4,200 off the price.

Flight check-in autopilot

  **@armanddp** • `travel` `email` `automation`

Finds the next flight in email, runs through online check-in, and picks a window seat — no airline app required.

Insurance claim filing

  **@avi_press** • `automation` `insurance` `browser`

Filed an insurance claim and scheduled the follow-up appointment autonomously.

Idealista real estate skill

  **@quifago** • `real-estate` `api` `skill`

Idealista API CLI for property queries and valuations, wrapped as a skill so the agent can house-hunt in chat.

Gardening business back office

  **@mjsweet** • `automation` `email` `invoicing`

Watches Gmail for work orders, analyzes property photos sent over Telegram, writes multi-page LaTeX quote PDFs, and invoices through Xero.

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

X post analysis pipeline

  **@andrewjiang** • `analysis` `x` `pipeline`

Pulled 4 million posts across 100 top X accounts and turned them into a queryable analysis pipeline.

Lab results to Notion

  **@danpeguine** • `health` `notion` `organization`

Organized years of bloodwork lab results into a structured Notion database.

Obsidian second brain

  **@lexandstuff** • `obsidian` `whatsapp` `memory`

Daily-driver assistant on WhatsApp with all memory stored as markdown in a version-controlled Obsidian vault: calorie and workout tracking, to-do lists, life admin.

Family history bot

  **@brtkwr** • `telegram` `memory` `family`

Lives in a family Telegram group chat, documents stories across 50+ relatives, and asks informed follow-up questions — responding in Nepali for native speakers.

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

Pebble Ring one-tap voice

  **@thekitze** • `voice` `wearable` `hardware`

One tap on a Pebble Ring starts a voice conversation with OpenClaw — agent access from a wearable.

Creator media studio

  **@cedric_chee** • `media` `tts` `transcription`

A full media studio in chat: TTS, transcription, and browser automation hooked up to Codex 5.2 and MiniMax.

Action Button walkie-talkie

  **@buddyhadry** • `voice` `ios` `mobile`

iPhone Action Button wired to OpenClaw: press, talk, and the agent talks back like a walkie-talkie.

Clawdia phone bridge

  **@alejandroOPI** • `voice` `vapi` `bridge`

Vapi voice assistant to OpenClaw HTTP bridge. Near real-time phone calls with your agent.

OpenRouter transcription

  **@obviyus** • `transcription` `multilingual` `skill`

Multi-lingual audio transcription via OpenRouter (Gemini, and more). Available on ClawHub.

  <img src="/assets/showcase/openrouter-transcribe.png" alt="OpenRouter transcription skill on ClawHub" />

## Infrastructure and deployment

Packaging, deployment, and integrations that make OpenClaw easier to run and extend.

CardGroup

Home Assistant add-on

  **@ngutman** • `homeassistant` `docker` `raspberry-pi`

OpenClaw gateway running on Home Assistant OS with SSH tunnel support and persistent state.

Home Assistant skill

  **@homeofe** • `homeassistant` `skill` `automation`

Control and automate Home Assistant devices via natural language.

  <img src="/assets/showcase/homeassistant.png" alt="Home Assistant skill on ClawHub" />

macOS menu bar manager

  **@MagiMetal** • `macos` `swift` `ui`

Native Swift menu bar app showing agent status with quick controls.

Nix packaging

  **@openclaw** • `nix` `packaging` `deployment`

Batteries-included nixified OpenClaw configuration for reproducible deployments.

CalDAV calendar

  **@asleep123** • `calendar` `caldav` `skill`

Calendar skill using khal and vdirsyncer. Self-hosted calendar integration.

  <img src="/assets/showcase/caldav-calendar.png" alt="CalDAV calendar skill on ClawHub" />

## Home and hardware

The physical-world side of OpenClaw: homes, sensors, cameras, vacuums, and other devices.

CardGroup

Self-built HomePod skill

  **@localghost** • `homepod` `discovery` `skill`

OpenClaw found the HomePods on the local network and wrote itself a skill to control them.

$35 holo cube interface

  **@andrewjiang** • `hardware` `display` `fun`

A cheap holographic cube as the agent's physical face on the desk.

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

Clinch agent negotiation protocol

  **@publicstringapps** • `protocol` `p2p` `skill`

Open agent-to-agent negotiation: your agent haggles deals, schedules, and service agreements with other nodes and cryptographically signs the result — you just approve or reject.

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
- [Full X showcase on openclaw.ai](https://openclaw.ai/showcase/)

---
