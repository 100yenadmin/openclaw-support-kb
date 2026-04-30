---
type: openclaw_doc
title: "Docs"
source: "https://docs.openclaw.ai/cli/docs"
source_hash: "337828f9fe8e96ec6519648ca9404f42741090dcd19052dcb745e8472973a4a0"
generated_at: "2026-04-30T12:08:08.028Z"
doc_path: "cli/docs.md"
original_doc_path: "cli/docs.md"
duplicate_index: 1
---

# Docs
Source: https://docs.openclaw.ai/cli/docs



# `openclaw docs`

Search the live docs index.

Arguments:

* `[query...]`: search terms to send to the live docs index

Examples:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw docs
openclaw docs browser existing-session
openclaw docs sandbox allowHostControl
openclaw docs gateway token secretref
```

Notes:

* With no query, `openclaw docs` opens the live docs search entrypoint.
* Multi-word queries are passed through as one search request.

## Related

* [CLI reference](/cli)
