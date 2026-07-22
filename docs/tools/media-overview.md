---
type: openclaw_doc
title: "Media overview"
source: "https://docs.openclaw.ai/tools/media-overview"
source_hash: "d0df765dd4148b5656020c747bea4c534fdf1737049fa0b7db4267069141df9b"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/media-overview.md"
original_doc_path: "tools/media-overview.md"
duplicate_index: 1
---

# Media overview
Source: https://docs.openclaw.ai/tools/media-overview

OpenClaw generates images, videos, and music, understands inbound media
(images, audio, video), and speaks replies aloud with text-to-speech. All
media capabilities are tool-driven: the agent decides when to use them based
on the conversation, and each tool only appears when at least one backing
provider is configured.

Live speech uses the Talk session contract instead of the one-shot media tool
path. Talk has three modes: provider-native `realtime`, local or streaming
`stt-tts`, and `transcription` for observe-only speech capture. Those modes
share provider catalogs, event envelopes, and cancellation semantics with
telephony, meetings, browser realtime, and native push-to-talk clients.

## Capabilities

CardGroup


Image generation

    Create and edit images from text prompts or reference images via
    `image_generate`. Async in chat sessions — runs in the background and
    posts the result when ready.


Video generation

    Text-to-video, image-to-video, and video-to-video via `video_generate`.
    Async — runs in the background and posts the result when ready.


Music generation

    Generate music or audio tracks via `music_generate`. Async in chat
    sessions on the shared media-generation task lifecycle.


Text-to-speech

    Convert outbound replies to spoken audio via the `tts` tool plus
    `tts` config. Synchronous.


Media understanding

    Summarize inbound images, audio, and video using vision-capable model
    providers and dedicated media-understanding plugins.


Speech-to-text

    Transcribe inbound voice messages through batch STT or Voice Call
    streaming STT providers.


## Provider capability matrix

Note

This table covers the dedicated media-generation, TTS, and STT plugins. Many
chat-model providers (Anthropic, Google, OpenAI, and others) also understand
inbound media through their reply model; see the full provider list in
[Media understanding](/nodes/media-understanding#provider-support-matrix).

| Provider          | Image | Video | Music | TTS | STT | Realtime voice | Media understanding |
| ----------------- | :---: | :---: | :---: | :-: | :-: | :------------: | :-----------------: |
| Alibaba           |       |   ✓   |       |     |     |                |                     |
| Azure Speech      |       |       |       |  ✓  |     |                |                     |
| BytePlus          |       |   ✓   |       |     |     |                |                     |
| ComfyUI           |   ✓   |   ✓   |   ✓   |     |     |                |                     |
| Deepgram          |       |       |       |     |  ✓  |                |                     |
| DeepInfra         |   ✓   |   ✓   |       |  ✓  |  ✓  |                |          ✓          |
| ElevenLabs        |       |       |       |  ✓  |  ✓  |                |                     |
| fal               |   ✓   |   ✓   |   ✓   |     |     |                |                     |
| Google            |   ✓   |   ✓   |   ✓   |  ✓  |  ✓  |       ✓        |          ✓          |
| Gradium           |       |       |       |  ✓  |     |                |                     |
| Inworld           |       |       |       |  ✓  |     |                |                     |
| LiteLLM           |   ✓   |       |       |     |     |                |                     |
| Local CLI         |       |       |       |  ✓  |     |                |                     |
| Microsoft         |       |       |       |  ✓  |     |                |                     |
| Microsoft Foundry |   ✓   |       |       |     |     |                |                     |
| MiniMax           |   ✓   |   ✓   |   ✓   |  ✓  |     |                |                     |
| Mistral           |       |       |       |     |  ✓  |                |                     |
| OpenAI            |   ✓   |   ✓   |       |  ✓  |  ✓  |       ✓        |          ✓          |
| OpenRouter        |   ✓   |   ✓   |   ✓   |  ✓  |  ✓  |                |          ✓          |
| PixVerse          |       |   ✓   |       |     |     |                |                     |
| Qwen              |       |   ✓   |       |     |     |                |          ✓          |
| Runway            |       |   ✓   |       |     |     |                |                     |
| SenseAudio        |       |       |       |     |  ✓  |                |                     |
| Together          |       |   ✓   |       |     |     |                |                     |
| Volcengine        |       |       |       |  ✓  |     |                |                     |
| Vydra             |   ✓   |   ✓   |       |  ✓  |     |                |                     |
| xAI               |   ✓   |   ✓   |       |  ✓  |  ✓  |                |          ✓          |
| Xiaomi MiMo       |       |       |       |  ✓  |     |                |                     |

Note

**Realtime voice** here means provider-native bidirectional realtime (Talk
`realtime` mode, e.g. Gemini Live or the OpenAI Realtime API) — only Google
and OpenAI register it today. Deepgram, ElevenLabs, Mistral, OpenAI, and xAI
separately register Voice Call streaming STT (one-way audio-to-text); see
[Speech-to-text and Voice Call](#speech-to-text-and-voice-call) below.
xAI Realtime voice is an upstream capability but is not registered in
OpenClaw until the shared realtime-voice contract can represent it.

## Async vs synchronous

| Capability     | Mode         | Why                                                                                                  |
| -------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| Image          | Asynchronous | Provider processing can outlive a chat turn; generated attachments use the shared completion path.   |
| Text-to-speech | Synchronous  | Provider responses return in seconds; attached to the reply audio.                                   |
| Video          | Asynchronous | Provider processing takes 30 s to several minutes; slow queues can run up to the configured timeout. |
| Music          | Asynchronous | Same provider-processing characteristic as video.                                                    |

For async tools, OpenClaw submits the request to the provider, returns a task
id immediately, and tracks the job in the task ledger. The agent continues
responding to other messages while the job runs. When the provider finishes,
OpenClaw wakes the agent with the generated media paths so it can tell the
user through the session's normal visible-reply mode: automatic final reply
delivery when configured, or `message(action="send")` when the session requires
the message tool. If the requester session is inactive or its active wake
fails, and some generated media is still missing from the completion reply,
OpenClaw sends an idempotent direct fallback with only the missing media. Media
already delivered by the completion reply is not posted again.

## Speech-to-text and Voice Call

Deepgram, DeepInfra, ElevenLabs, Google, Groq, Mistral, OpenAI, OpenRouter,
SenseAudio, and xAI can all transcribe inbound audio through the batch
`tools.media.audio` path when configured. Channel plugins that preflight a
voice note for mention gating or command parsing mark the transcribed
attachment on the inbound context, so the shared media-understanding pass
reuses that transcript instead of making a second STT call for the same
audio.

Deepgram, ElevenLabs, Mistral, OpenAI, and xAI also register Voice Call
streaming STT providers, so live phone audio can be forwarded to the selected
vendor without waiting for a completed recording.

For live user conversations, prefer [Talk mode](/nodes/talk). Batch audio
attachments stay on the media path; browser realtime, native push-to-talk,
telephony, and meeting audio should use Talk events and the session-scoped
catalogs returned by the Gateway.

## Provider mappings (how vendors split across surfaces)

AccordionGroup


Google

    Image, video, music, batch TTS, batch STT, backend realtime voice, and
    media-understanding surfaces.


OpenAI

    Image, video, batch TTS, batch STT, Voice Call streaming STT, backend
    realtime voice, and memory-embedding surfaces.


DeepInfra

    Chat/model routing, image generation/editing, text-to-video, batch TTS,
    batch STT, image media understanding, and memory-embedding surfaces.
    DeepInfra also exposes reranking, classification, object-detection, and
    other native model types; OpenClaw has no provider contract for those
    categories yet, so this plugin does not register them.


xAI

    Image, video, search, code-execution, batch TTS, batch STT, and Voice
    Call streaming STT. xAI Realtime voice is an upstream capability but is
    not registered in OpenClaw until the shared realtime-voice contract can
    represent it.


## Related

- [Image generation](/tools/image-generation)
- [Video generation](/tools/video-generation)
- [Music generation](/tools/music-generation)
- [Text-to-speech](/tools/tts)
- [Media understanding](/nodes/media-understanding)
- [Audio nodes](/nodes/audio)
- [Talk mode](/nodes/talk)

---
