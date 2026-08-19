---
type: openclaw_doc
title: "Zoom meetings plugin"
source: "https://docs.openclaw.ai/plugins/zoom-meetings"
source_hash: "d5de95b3f29aed1077074f7297f05cb827c25ece8e32cf07d8fddd9d159752b4"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/zoom-meetings.md"
original_doc_path: "plugins/zoom-meetings.md"
duplicate_index: 1
---

# Zoom meetings plugin
Source: https://docs.openclaw.ai/plugins/zoom-meetings

The `zoom-meetings` plugin joins `zoom.us/j/...` links and account subdomains
such as `example.zoom.us/j/...` as a guest through the Zoom Web App in the
OpenClaw Chrome profile. It does not create meetings, dial in, use the Zoom
Meeting SDK, or capture audio/video recordings.

Use [Meeting plugins](/plugins/meeting-plugins) for shared installation, modes,
Chrome and virtual-audio setup, transcripts, remote-node requirements, and
verification.

## Handle Zoom policy and manual actions

The browser adapter chooses **Join from browser**, fills the guest name, turns
the camera off, configures the microphone, and clicks **Join**. It grants the
`app.zoom.us` origin microphone and speaker-selection permissions before
navigation. In-call state uses Zoom's Leave control.

Zoom can disable browser join or require authentication, email verification, a
passcode, CAPTCHA completion, host admission, or browser device permissions.
The plugin reports these as `manualAction`; complete the requested step in the
same OpenClaw Chrome profile, then retry status or speech. It does not bypass
Zoom policy.

The Zoom Web App has been live-validated with an official test meeting through
the interstitial, iframe guest-name entry, microphone/camera controls, browser
and macOS media permissions, in-call detection, live captions, and host-ended
detection. Lobby and authentication states retain text fallbacks when no stable
DOM identifier is available.

## Tool and Gateway surface

The `zoom_meetings` tool supports `join`, `leave`, `status`, `transcript`, and
`speak`. Gateway methods use `zoommeetings.*`; the node command is
`zoommeetings.chrome`.

## Related

- [Meeting plugins](/plugins/meeting-plugins)

---
