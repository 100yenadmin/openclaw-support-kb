---
type: openclaw_doc
title: "Exa search"
source: "https://docs.openclaw.ai/tools/exa-search"
source_hash: "e75ed3e315ad4e06be0055b8a2e3da64ebfc921ab60fe32ff25e4ce32fea816d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/exa-search.md"
original_doc_path: "tools/exa-search.md"
duplicate_index: 1
---

# Exa search
Source: https://docs.openclaw.ai/tools/exa-search

[Exa AI](https://exa.ai/) is a `web_search` provider with neural, keyword, and
hybrid search modes plus built-in content extraction (highlights, text,
summaries).

## Install plugin

```bash
openclaw plugins install @openclaw/exa-plugin
openclaw gateway restart
```

## Get an API key

Steps


Create an account

    Sign up at [exa.ai](https://exa.ai/) and generate an API key from your
    dashboard.


Store the key

    Set `EXA_API_KEY` in the Gateway environment, or configure via:

    ```bash
    openclaw configure --section web
    ```



## Config

```json5
{
  plugins: {
    entries: {
      exa: {
        config: {
          webSearch: {
            apiKey: "exa-...", // optional if EXA_API_KEY is set
            baseUrl: "https://api.exa.ai", // optional; OpenClaw appends /search
          },
        },
      },
    },
  },
  tools: {
    web: {
      search: {
        provider: "exa",
      },
    },
  },
}
```

**Environment alternative:** set `EXA_API_KEY` in the Gateway environment. For
a gateway install, put it in `~/.openclaw/.env`. See
[Env vars](/help/faq#env-vars-and-env-loading).

## Base URL override

Set `plugins.entries.exa.config.webSearch.baseUrl` to route Exa search
requests through a compatible proxy or alternate endpoint. OpenClaw
normalizes bare hosts by prepending `https://` and appends `/search` unless
the path already ends there. The resolved endpoint is part of the search
cache key, so results from different endpoints are never shared.

## Tool parameters

ParamField

Search query.

ParamField

Results to return (1-100, subject to Exa search-type limits).

ParamField

Search mode.

ParamField

Time filter. Cannot be combined with `date_after`/`date_before`.

ParamField

Results after this date (`YYYY-MM-DD`).

ParamField

Results before this date (`YYYY-MM-DD`).

ParamField

Content extraction options (see below).

### Content extraction

Pass a `contents` object to control extracted content in results:

```javascript
await web_search({
  query: "transformer architecture explained",
  type: "neural",
  contents: {
    text: true, // full page text
    highlights: { numSentences: 3 }, // key sentences
    summary: true, // AI summary
  },
});
```

| Contents option | Type                                                                  | Description            |
| --------------- | --------------------------------------------------------------------- | ---------------------- |
| `text`          | `boolean \| { maxCharacters }`                                        | Extract full page text |
| `highlights`    | `boolean \| { maxCharacters, query, numSentences, highlightsPerUrl }` | Extract key sentences  |
| `summary`       | `boolean \| { query }`                                                | AI-generated summary   |

If `contents` is omitted, Exa defaults to `{ highlights: true }` so results
include key-sentence excerpts. Result descriptions resolve from highlights
first, then summary, then full text -- whichever is available first. Results
also preserve the raw `highlightScores` and `summary` fields from the Exa API
response when available.

### Search modes

| Mode             | Description                       |
| ---------------- | --------------------------------- |
| `auto`           | Exa picks the best mode (default) |
| `neural`         | Semantic/meaning-based search     |
| `fast`           | Quick keyword search              |
| `deep`           | Thorough deep search              |
| `deep-reasoning` | Deep search with reasoning        |
| `instant`        | Fastest results                   |

## Notes

- `count` accepts up to 100, subject to Exa search-type limits.
- Results are cached for 15 minutes by default. Configure the shared
  `tools.web.search.cacheTtlMinutes` (minutes) and
  `tools.web.search.timeoutSeconds` (default 30s) to change caching and
  request timeout for all `web_search` providers, including Exa.

## Related

- [Web Search overview](/tools/web) -- all providers and auto-detection
- [Brave Search](/tools/brave-search) -- structured results with country/language filters
- [Perplexity Search](/tools/perplexity-search) -- structured results with domain filtering

---
