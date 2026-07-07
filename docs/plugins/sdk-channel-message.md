---
type: openclaw_doc
title: "Channel message API"
source: "https://docs.openclaw.ai/plugins/sdk-channel-message"
source_hash: "99d8e4bb0edbf5a53caf0b6cae6021631e56d6a50a5d5cbb3bb5307f781e740d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/sdk-channel-message.md"
original_doc_path: "plugins/sdk-channel-message.md"
duplicate_index: 1
---

# Channel message API
Source: https://docs.openclaw.ai/plugins/sdk-channel-message

This page moved to [Channel outbound API](/plugins/sdk-channel-outbound).

`openclaw/plugin-sdk/channel-message` and
`openclaw/plugin-sdk/channel-message-runtime` remain deprecated compatibility
subpaths for older plugins; both are thin aliases over the shared channel
message core. New channel plugins should use
`openclaw/plugin-sdk/channel-outbound` for message lifecycle, receipt,
durable send, and live preview helpers instead of adding new helpers to the
deprecated subpaths.

Removal plan: keep these aliases through the external plugin migration
window, then remove them in the next major SDK cleanup after callers have
moved to `channel-outbound`.

---
