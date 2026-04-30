---
type: openclaw_doc
title: "Gradium"
source: "https://docs.openclaw.ai/providers/gradium"
source_hash: "be32539b7eb6c0599c516804d65b929125e317e24c16751570fa90c6faf699a5"
generated_at: "2026-04-30T12:26:35.225Z"
doc_path: "providers/gradium.md"
original_doc_path: "providers/gradium.md"
duplicate_index: 1
---

# Gradium
Source: https://docs.openclaw.ai/providers/gradium



Gradium is a bundled text-to-speech provider for OpenClaw. It can generate normal audio replies, voice-note-compatible Opus output, and 8 kHz u-law audio for telephony surfaces.

## Setup

Create a Gradium API key, then expose it to OpenClaw:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
export GRADIUM_API_KEY="gsk_..."
```

You can also store the key in config under `messages.tts.providers.gradium.apiKey`.

## Config

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  messages: {
    tts: {
      auto: "always",
      provider: "gradium",
      providers: {
        gradium: {
          voiceId: "YTpq7expH9539ERJ",
          // apiKey: "${GRADIUM_API_KEY}",
          // baseUrl: "https://api.gradium.ai",
        },
      },
    },
  },
}
```

## Voices

| Name      | Voice ID           |
| --------- | ------------------ |
| Emma      | `YTpq7expH9539ERJ` |
| Kent      | `LFZvm12tW_z0xfGo` |
| Tiffany   | `Eu9iL_CYe8N-Gkx_` |
| Christina | `2H4HY2CBNyJHBCrP` |
| Sydney    | `jtEKaLYNn6iif5PR` |
| John      | `KWJiFWu2O9nMPYcR` |
| Arthur    | `3jUdJyOi9pgbxBTK` |

Default voice: Emma.

## Output

* Audio-file replies use WAV.
* Voice-note replies use Opus and are marked voice-compatible.
* Telephony synthesis uses `ulaw_8000` at 8 kHz.

## Related

* [Text-to-Speech](/tools/tts)
* [Media Overview](/tools/media-overview)
