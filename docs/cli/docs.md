---
type: openclaw_doc
title: "Docs"
source: "https://docs.openclaw.ai/cli/docs"
source_hash: "cc8aed641c01bb236495b81c202bd8a129d9f318900ecd19c63070f3ac7fe3a9"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "cli/docs.md"
original_doc_path: "cli/docs.md"
duplicate_index: 1
---

# Docs
Source: https://docs.openclaw.ai/cli/docs

# `openclaw docs`

Search the live OpenClaw docs index from the terminal. The command calls OpenClaw's Cloudflare-hosted docs search API and renders the results in your terminal.

## Usage

```bash
openclaw docs                       # print docs entrypoint and example search
openclaw docs <query...>            # search the live docs index
```

Arguments:

| Argument     | Description                                                                        |
| ------------ | ---------------------------------------------------------------------------------- |
| `[query...]` | Free-form search query. Multi-word queries are joined with spaces and sent as one. |

## Examples

```bash
openclaw docs browser existing-session
openclaw docs sandbox allowHostControl
openclaw docs gateway token secretref
```

With no query, `openclaw docs` prints the docs entrypoint URL plus a sample search command instead of running a search.

## How it works

`openclaw docs` calls `https://docs.openclaw.ai/api/search` and renders the JSON results. The search call uses a fixed 30 second timeout.

## Output

In a rich (TTY) terminal, results render as a heading followed by a bullet list. Each bullet shows the page title, the linked docs URL, and a short snippet on the next line. Empty results print "No results.".

In non-rich output (piped, `--no-color`, scripts), the same data renders as Markdown:

```markdown
# Docs search: <query>

- [Title](https://docs.openclaw.ai/...) - snippet
- [Title](https://docs.openclaw.ai/...) - snippet
```

## Exit codes

| Code | Meaning                                                           |
| ---- | ----------------------------------------------------------------- |
| `0`  | Search succeeded (including zero-result responses).               |
| `1`  | The hosted docs search API call failed; stderr is printed inline. |

## Related

- [CLI reference](/cli)
- [Live docs](https://docs.openclaw.ai)

---
