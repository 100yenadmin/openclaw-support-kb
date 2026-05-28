---
type: openclaw_doc
title: "Channel message API"
source: "https://docs.openclaw.ai/plugins/sdk-channel-message"
source_hash: "f40dbba8d7324ecaa3ed47a008c56a25b7254957ecba67d2384ed6cdd9dc2439"
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
subpaths for older plugins. New channel plugins should use
`openclaw/plugin-sdk/channel-outbound` for message lifecycle, receipt, durable
send, and live preview helpers. The deprecated subpaths are thin aliases over
the shared channel message core and the focused inbound/outbound SDK surfaces;
do not add new helpers there.

Removal plan: keep these aliases through the external plugin migration window,
then remove them in the next major SDK cleanup after callers have moved to
`channel-outbound`.

---
