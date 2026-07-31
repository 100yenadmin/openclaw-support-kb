---
type: openclaw_doc
title: "Onboarding (macOS app)"
source: "https://docs.openclaw.ai/start/onboarding"
source_hash: "4384a292660931597c9034aea4b6752126013188e6e6fefe4b9424e6d1173d40"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "start/onboarding.md"
original_doc_path: "start/onboarding.md"
duplicate_index: 1
---

# Onboarding (macOS app)
Source: https://docs.openclaw.ai/start/onboarding

The macOS app's first-run flow: pick where the Gateway runs, connect a
verified AI backend, grant permissions, and hand off to the agent's own
bootstrap ritual.
For CLI onboarding and a comparison of both paths, see [Onboarding Overview](/start/onboarding-overview).

Tip

Need the app first? [Download OpenClaw for macOS](/platforms/macos#download),
then return here for first-run setup.

Steps

Approve macOS warning

Frame

<img src="/assets/macos-onboarding/01-macos-warning.jpeg" alt="" />

Approve find local networks

Frame

<img src="/assets/macos-onboarding/02-local-networks.jpeg" alt="" />

Welcome and security notice

Frame

<img src="/assets/macos-onboarding/03-security-notice.png" alt="" />

Security trust model:

- By default, OpenClaw is a personal agent: one trusted operator boundary.
- Shared/multi-user setups need lock-down: split trust boundaries, keep tool access minimal, and follow [Security](/gateway/security).
- Local onboarding defaults new configs to `tools.profile: "coding"` so fresh setups keep filesystem/runtime tools without the unrestricted `full` profile.
- If hooks/webhooks or other untrusted content feeds are enabled, use a strong modern model tier and keep strict tool policy/sandboxing.

Local vs Remote

Frame

<img src="/assets/macos-onboarding/04-choose-gateway.png" alt="" />

Where does the **Gateway** run?

- **This Mac (Local only):** onboarding configures auth and writes credentials locally.
- **Remote (over SSH/Tailnet):** onboarding does **not** configure local auth;
  credentials must already exist on the gateway host. The remote gateway token
  field stores the token the macOS app uses to connect to that Gateway;
  existing `gateway.remote.token` SecretRef values are preserved until you
  replace them.
- **Configure later:** skip setup and leave the app unconfigured.

Tip

**Gateway auth tip:**

- Gateway auth mode defaults to `token` even for loopback binds, so local WS clients must authenticate.
- Setting `gateway.auth.mode: "none"` lets any local process connect; use that only on fully trusted machines.
- Use a token for multi-machine access or non-loopback binds.

CLI

  Local setup installs the global `openclaw` CLI via npm, pnpm, or bun,
  preferring npm first. Node remains the recommended runtime for the Gateway
  itself. Existing compatible installations are reused.

Connect your AI

  A connected Gateway that already has a configured agent model skips this
  page entirely and opens the normal agent UI. OpenClaw and provider setup
  only run for a fresh or incomplete Gateway.

Once the Gateway is ready, onboarding looks for AI access you already have:
a Claude Code or Codex login, `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`, or a
tool-capable model with at least 16K of measured effective context already
installed in a reachable Ollama or LM Studio server. Detection runs on the
Gateway host, including when the macOS app connects to a Linux Gateway. The best
option is tested with a real completion and only saved
after it answers; when a test fails the app automatically tries the next option
and shows why the previous one failed. If several options are found you can
switch between them before continuing. Automatic local discovery never pulls
or downloads a model.

To use a Claude subscription when the Gateway host has no Claude CLI login, run
`claude setup-token` on any machine with Claude Code installed, then paste the
printed token as **Anthropic setup-token** under **Connect with an API key or
token**.

Pi and OpenCode installs may be shown for context when they cannot be selected
as the reusable guided-setup inference route. They are whole-agent harnesses,
not setup inference routes; their session integrations require separate runtime
and plugin setup. Gemini CLI and Antigravity are not offered as detected setup
routes.

You can also sign in through the provider's own OAuth or device-pairing flow.
The built-in choices include OpenAI/ChatGPT, OpenRouter, GitHub Copilot, xAI,
MiniMax Global and CN, and Chutes. Google is available through the supported AI
Studio API-key route. The list comes from the
Gateway's active text-inference provider plugins rather than a fixed app list,
so another provider can opt in without adding provider-specific macOS code.

The manual key/token picker uses the same provider registry. In every route,
the provider supplies its starter model and configuration; OpenClaw verifies
the credential with the same live test before storing its auth profile. Next
remains locked until one backend has passed, so the first agent chat cannot
start without working inference. After that live check passes, OpenClaw becomes
available to help configure the remaining workspace, Gateway, channels, and
other optional features. When OpenClaw offers a short list of choices, the app
shows native option cards; choosing one sends the selection, and **Skip for
now** always leaves the choice optional. OpenClaw is also available later under
Settings → OpenClaw.

Import memories (shown when detected)

For a local Gateway, onboarding checks the Mac for memories from supported AI
tools: Claude Code auto-memory, Codex consolidated memories, and Hermes memory
files. When any are found, this page lists each source with its memory count
and lets you import the selected sources into the agent workspace under
`memory/imports/` for indexed recall. Already-imported files are skipped, and
the page never appears when there is nothing to import. Skipping is safe; the
dashboard's Memory import page offers the same import later with per-file
control.

Permissions

Frame

<img src="/assets/macos-onboarding/05-permissions.png" alt="" />

Onboarding requests TCC permissions for: Automation (AppleScript), Notifications, Accessibility, Screen Recording, Microphone, Speech Recognition, Camera, and Location.

Finish

  After inference passes, OpenClaw owns the remaining optional setup and can
  hand you off to the normal agent chat. Finishing the permission walkthrough
  opens that same chat; the app does not create a workspace or launch a separate
  agent setup conversation before OpenClaw. See
  [Bootstrapping](/start/bootstrapping) for what happens on the gateway host
  during the agent's first real turn.

## Related

- [Onboarding overview](/start/onboarding-overview)
- [Getting started](/start/getting-started)

---
