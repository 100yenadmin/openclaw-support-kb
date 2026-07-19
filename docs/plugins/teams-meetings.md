---
type: openclaw_doc
title: "Microsoft Teams meetings plugin"
source: "https://docs.openclaw.ai/plugins/teams-meetings"
source_hash: "81f3f346be202b5006bc5a998d13eb70f1c1035bc76d19c39319a4413506c13b"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/teams-meetings.md"
original_doc_path: "plugins/teams-meetings.md"
duplicate_index: 1
---

# Microsoft Teams meetings plugin
Source: https://docs.openclaw.ai/plugins/teams-meetings

The `teams-meetings` plugin joins Microsoft Teams links as a guest in the OpenClaw Chrome profile. It accepts work links under `teams.microsoft.com/l/meetup-join/...` and consumer links under `teams.live.com/meet/...`. It does not create meetings, dial in, call Microsoft Graph, or record meetings.

## Setup

Talk-back uses the same local audio prerequisites as the [Google Meet plugin](/plugins/google-meet): macOS, the `BlackHole 2ch` virtual audio device, and SoX.

```bash
brew install blackhole-2ch sox
sudo reboot
system_profiler SPAudioDataType | grep -i BlackHole
command -v sox
```

Enable the plugin, then check setup:

```json5
{
  plugins: {
    entries: {
      "teams-meetings": {
        enabled: true,
        config: {
          defaultMode: "agent",
          chrome: { guestName: "OpenClaw Agent" },
        },
      },
    },
  },
}
```

```bash
openclaw teamsmeetings setup
openclaw teamsmeetings join 'https://teams.microsoft.com/l/meetup-join/...'
```

Use `chromeNode.node` to run Chrome, BlackHole, and SoX on a paired macOS node. The node must allow `teamsmeetings.chrome` and `browser.proxy`.

## Modes

| Mode         | Behavior                                                                    |
| ------------ | --------------------------------------------------------------------------- |
| `agent`      | Realtime transcription consults the configured OpenClaw agent; TTS replies. |
| `bidi`       | A realtime voice model listens and replies directly.                        |
| `transcribe` | Observe-only join with live-caption transcript snapshots.                   |

Transcribe mode enables Teams live captions after admission and captures speaker-attributed caption rows. The `transcript` action returns the bounded caption buffer for the active OpenClaw meeting session.

## Guest join limits

The browser adapter dismisses the app interstitial, fills the guest name, turns the camera off, configures the microphone for the selected mode, and clicks the join button. In-call state uses the hang-up control; lobby, tenant sign-in, and device-permission states return explicit manual-action reasons. Consumer meeting launcher redirects and the `BlackHole 2ch (Virtual)` labels shown by Chrome are supported.

Teams tenant policy can require sign-in, email verification, or organizer admission. Complete that step in the OpenClaw Chrome profile, then retry status or speech. The plugin does not bypass tenant policy.

The consumer Teams web client has been live-validated for the app interstitial, guest-name entry, prejoin microphone/camera toggles, join, lobby admission, media permissions, in-call detection, live captions, BlackHole input/output routing, leave, and post-call detection. Work tenants can impose different sign-in, email-verification, admission, and leave-confirmation policy; complete any reported manual action in the OpenClaw Chrome profile.

## Tool and gateway surface

The `teams_meetings` agent tool supports `join`, `leave`, `status`, `transcript`, and `speak`. Gateway methods use the `teamsmeetings.*` prefix. The node command is `teamsmeetings.chrome`.

## Related

- [Meeting plugins overview](/plugins/meeting-plugins)
- [Microsoft Teams channel](/channels/msteams)

---
