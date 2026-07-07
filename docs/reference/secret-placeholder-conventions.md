---
type: openclaw_doc
title: "Secret Placeholder Conventions"
source: "https://docs.openclaw.ai/reference/secret-placeholder-conventions"
source_hash: "e42d39ef1de89cff53565ebdce74850bb59f029bbd14dd024d3484566b312722"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/secret-placeholder-conventions.md"
original_doc_path: "reference/secret-placeholder-conventions.md"
duplicate_index: 1
---

# Secret Placeholder Conventions
Source: https://docs.openclaw.ai/reference/secret-placeholder-conventions

# Secret placeholder conventions

Use placeholders that are human-readable but do not resemble real secrets.

## Recommended style

- Prefer descriptive values like `example-openai-key-not-real` or `example-discord-bot-token`.
- For shell snippets, prefer `${OPENAI_API_KEY}` over inline token-like strings.
- Keep examples obviously fake and scoped to purpose (provider, channel, auth type).

## Avoid these patterns in docs

- Literal PEM private-key header or footer text.
- Prefixes that resemble live credentials, e.g. `sk-...`, `xoxb-...`, `AKIA...`.
- Realistic-looking bearer tokens copied from runtime logs.

## Example

```bash
# Good
export OPENAI_API_KEY="example-openai-key-not-real"

# Better (when the doc is about env wiring)
export OPENAI_API_KEY="${OPENAI_API_KEY}"
```

---
