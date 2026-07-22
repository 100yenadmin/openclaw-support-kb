---
type: openclaw_doc
title: "Channel message API"
source: "https://docs.openclaw.ai/plugins/sdk-channel-message"
source_hash: "3c9ad95d850cc41da9611e00eb94a9d192a9ba6f3f310c90943c144ca6de61ed"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/sdk-channel-message.md"
original_doc_path: "plugins/sdk-channel-message.md"
duplicate_index: 1
---

# Channel message API
Source: https://docs.openclaw.ai/plugins/sdk-channel-message

This page moved to [Channel outbound API](/plugins/sdk-channel-outbound).

`openclaw/plugin-sdk/channel-message` remains a deprecated compatibility
subpath for older plugins. New channel plugins should use
`openclaw/plugin-sdk/channel-outbound` for message lifecycle, receipt,
durable send, and live preview helpers instead of adding new helpers to the
deprecated subpath.

Removal plan: keep these aliases through the external plugin migration
window, then remove them in the next major SDK cleanup after callers have
moved to `channel-outbound`.

---
