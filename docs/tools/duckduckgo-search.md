---
type: openclaw_doc
title: "DuckDuckGo search"
source: "https://docs.openclaw.ai/tools/duckduckgo-search"
source_hash: "156c7a2de6a1ab027cd40f8d9110158c079d6cc5f7c77daec9e86729dc64283e"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/duckduckgo-search.md"
original_doc_path: "tools/duckduckgo-search.md"
duplicate_index: 1
---

# DuckDuckGo search
Source: https://docs.openclaw.ai/tools/duckduckgo-search

OpenClaw supports DuckDuckGo as a **key-free** `web_search` provider. No API
key or account is required.

Warning

  DuckDuckGo is an **experimental, unofficial** integration that pulls results
  from DuckDuckGo's non-JavaScript search pages - not an official API. Expect
  occasional breakage from bot-challenge pages or HTML changes.

## Setup

No API key needed - just set DuckDuckGo as your provider:

Steps


Configure

    ```bash
    openclaw configure --section web
    # Select "duckduckgo" as the provider
    ```


## Config

```json5
{
  tools: {
    web: {
      search: {
        provider: "duckduckgo",
      },
    },
  },
}
```

Optional plugin-level settings for region and SafeSearch:

```json5
{
  plugins: {
    entries: {
      duckduckgo: {
        config: {
          webSearch: {
            region: "us-en", // DuckDuckGo region code
            safeSearch: "moderate", // "strict", "moderate", or "off"
          },
        },
      },
    },
  },
}
```

## Tool parameters

ParamField

Search query.

ParamField

Results to return (1-10).

ParamField

DuckDuckGo region code (e.g. `us-en`, `uk-en`, `de-de`).

ParamField

SafeSearch level.

Region and SafeSearch can also be set in plugin config (see above) - tool
parameters override config values per-query.

## Notes

- **No API key** - works out of the box, zero configuration
- **Experimental** - gathers results from DuckDuckGo's non-JavaScript HTML
  search pages, not an official API or SDK
- **Bot-challenge risk** - DuckDuckGo may serve CAPTCHAs or block requests
  under heavy or automated use
- **HTML parsing** - results depend on page structure, which can change without
  notice
- **Auto-detection order** - DuckDuckGo is the first key-free fallback
  (order 100) in auto-detection. API-backed providers with configured keys run
  first, then Ollama Web Search (order 110), then SearXNG (order 200)
- **SafeSearch defaults to moderate** when not configured

Tip

  For production use, consider [Brave Search](/tools/brave-search) (free tier
  available) or another API-backed provider.

## Related

- [Web Search overview](/tools/web) -- all providers and auto-detection
- [Brave Search](/tools/brave-search) -- structured results with free tier
- [Exa Search](/tools/exa-search) -- neural search with content extraction

---
