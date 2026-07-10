---
type: openclaw_doc
title: "Show widget"
source: "https://docs.openclaw.ai/tools/show-widget"
source_hash: "0e5b83075b6d46359006168e2a706a2ee2bf7fb8deec5e62b361790072acd9b1"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/show-widget.md"
original_doc_path: "tools/show-widget.md"
duplicate_index: 1
---

# Show widget
Source: https://docs.openclaw.ai/tools/show-widget

`show_widget` renders a self-contained SVG or HTML fragment inline in the Control UI chat transcript. The bundled Canvas plugin owns the tool and hosts each result as a same-origin Canvas document.

The tool is available only when the originating Gateway client declares the `inline-widgets` capability. The Control UI declares this capability automatically. Channel runs such as Telegram and WhatsApp do not receive `show_widget`.

Capability transport covers embedded, Codex app-server, and CLI-backed model backends. Grant-authenticated MCP callers and direct HTTP tool-invoke callers remain fail closed because they do not declare client capabilities.

## Use the tool

The agent supplies two required strings:

ParamField

  Short title shown with the inline preview and in the hosted document title.

ParamField

  Self-contained SVG or HTML fragment. Input beginning with `<svg` after trimming is rendered in SVG mode; all other input is treated as an HTML fragment. Maximum length: 262,144 characters.

The tool result includes a Canvas preview handle, so web chat renders the widget directly from the tool call and restores it after history reload. Transcripts that do not render previews still show the hosted Canvas path.

## Security and storage

Widget documents use a restrictive Content Security Policy: inline style and script are allowed, images may use `data:` URLs, and external fetches and resource loads are blocked. Keep all markup, styles, scripts, and image data inside `widget_code`.

The iframe always omits `allow-same-origin`, even when the Control UI's global embed mode is `trusted`, so widget scripts cannot read the parent application origin. The Canvas host also serves widget documents with a `Content-Security-Policy: sandbox allow-scripts` response header, so opening the hosted URL directly still runs the widget in an opaque origin instead of the Control UI origin. Browser sandboxing does not prevent a script from navigating its own iframe; only render widget code you are willing to execute in that isolated frame.

The iframe also follows [`gateway.controlUi.embedSandbox`](/web/control-ui#hosted-embeds). The default `scripts` tier supports interactive widgets while preserving origin isolation.

Canvas retains at most 32 widgets per session (or per agent when no session is available). Creating another widget removes the oldest document in that scope.

## Related

- [Control UI hosted embeds](/web/control-ui#hosted-embeds)
- [Canvas plugin](/plugins/reference/canvas)
- [Gateway protocol client capabilities](/gateway/protocol#client-capabilities)

---
