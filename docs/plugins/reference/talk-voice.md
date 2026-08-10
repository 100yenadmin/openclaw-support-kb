---
type: openclaw_doc
title: "Talk Voice plugin"
source: "https://docs.openclaw.ai/plugins/reference/talk-voice"
source_hash: "2488cb9283daf0ac1b3571ba086bcade9d7b4919a534dca2f30f8a20dfe2420c"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/reference/talk-voice.md"
original_doc_path: "plugins/reference/talk-voice.md"
duplicate_index: 1
---

# Talk Voice plugin
Source: https://docs.openclaw.ai/plugins/reference/talk-voice

# Talk Voice plugin

Manage Talk voice selection (list/set).

## Distribution

- Package: `openclaw`
- Install route: included in OpenClaw

## Surface

commands: `/voice`

<!-- openclaw-plugin-reference:manual-start -->

## Configure a Talk voice from chat

Set `talk.provider` and configure the matching `talk.providers.<provider>` entry before using the command. The active provider must support voice listing.

- `/voice status` shows the active provider and selected provider-scoped voice ID. The API-key field is only a masked or unset config value; it does not prove that usable credentials are available.
- `/voice list [limit]` lists voices from the active provider. The default limit is 12 and the maximum is 50.
- `/voice set <voiceId|name>` resolves a voice by exact ID, exact name, or partial name, then saves it to `talk.providers.<activeProvider>.voiceId`.

Discord registers the native command as `/talkvoice`; its subcommands and arguments are the same. Status and list are read-only. Setting a voice requires an owner on a message channel or the `operator.admin` scope for a Gateway client.

Failures are returned visibly in chat. Missing Talk configuration identifies the required keys; provider lookup errors include the provider error; unknown voices suggest listing available voices; and unauthorized writes state the required permission.

<!-- openclaw-plugin-reference:manual-end -->

---
