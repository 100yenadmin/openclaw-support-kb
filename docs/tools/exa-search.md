---
type: openclaw_doc
title: "Exa search"
source: "https://docs.openclaw.ai/tools/exa-search"
source_hash: "714fbeaf471910cc8d1cbae37e59d0c0329d082c9475b1b467f108b219391276"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/exa-search.md"
original_doc_path: "tools/exa-search.md"
duplicate_index: 1
---

# Exa search
Source: https://docs.openclaw.ai/tools/exa-search

OpenClaw supports [Exa AI](https://exa.ai/) as a `web_search` provider. Exa
offers neural, keyword, and hybrid search modes with built-in content
extraction (highlights, text, summaries).

## Install plugin

Install the official plugin, then restart Gateway:

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

**Environment alternative:** set `EXA_API_KEY` in the Gateway environment.
For a gateway install, put it in `~/.openclaw/.env`.

## Base URL override

Set `plugins.entries.exa.config.webSearch.baseUrl` when Exa search requests
should go through a compatible proxy or alternate Exa endpoint. OpenClaw
normalizes bare hosts by prepending `https://` and appends `/search` unless the
path already ends there. The resolved endpoint is included in the search cache
key, so results from different Exa endpoints are not shared.

## Tool parameters

ParamField

Search query.

ParamField

Results to return (1–100).

ParamField

Search mode.

ParamField

Time filter.

ParamField

Results after this date (`YYYY-MM-DD`).

ParamField

Results before this date (`YYYY-MM-DD`).

ParamField

Content extraction options (see below).

### Content extraction

Exa can return extracted content alongside search results. Pass a `contents`
object to enable:

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

- If no `contents` option is provided, Exa defaults to `{ highlights: true }`
  so results include key sentence excerpts
- Results preserve `highlightScores` and `summary` fields from the Exa API
  response when available
- Result descriptions are resolved from highlights first, then summary, then
  full text — whichever is available
- `freshness` and `date_after`/`date_before` cannot be combined — use one
  time-filter mode
- Up to 100 results can be returned per query (subject to Exa search-type
  limits)
- Results are cached for 15 minutes by default (configurable via
  `cacheTtlMinutes`)
- Exa is an official API integration with structured JSON responses

## Related

- [Web Search overview](/tools/web) -- all providers and auto-detection
- [Brave Search](/tools/brave-search) -- structured results with country/language filters
- [Perplexity Search](/tools/perplexity-search) -- structured results with domain filtering

---
