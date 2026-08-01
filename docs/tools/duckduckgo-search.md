---
type: openclaw_doc
title: "DuckDuckGo search"
source: "https://docs.openclaw.ai/tools/duckduckgo-search"
source_hash: "b4ccc4fe294a67e3916af1bd2f2f90d5c26964769af02390c864a000c70af2e3"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/duckduckgo-search.md"
original_doc_path: "tools/duckduckgo-search.md"
duplicate_index: 1
---

# DuckDuckGo search
Source: https://docs.openclaw.ai/tools/duckduckgo-search

OpenClaw supports DuckDuckGo as a **key-free** `web_search` provider. No API key or account is required.

Warning

  DuckDuckGo is an **experimental, unofficial** integration that scrapes DuckDuckGo's non-JavaScript HTML search pages -- not an official API. Expect occasional breakage from bot-challenge pages or HTML changes.

## Setup

DuckDuckGo is never auto-selected, since auto-detection only considers providers with usable credentials. Set it explicitly:

Steps


Install the plugin

    ```bash
    openclaw plugins install @openclaw/duckduckgo-plugin
    openclaw gateway restart
    ```


Configure

    ```bash
    openclaw configure --section web
    # Select "duckduckgo" as the provider
    ```


## Config

Set the provider directly in config:

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

`region` and `safeSearch` tool parameters override the plugin config values above on a per-query basis.

## Notes

- **No API key** -- works once DuckDuckGo is selected as the `web_search` provider.
- **Experimental** -- scrapes DuckDuckGo's non-JavaScript HTML search pages, not an official API or SDK. Results depend on page structure, which can change without notice.
- **Bot-challenge risk** -- DuckDuckGo may serve CAPTCHAs or block requests under heavy or automated use.
- **Explicit selection only** -- OpenClaw's auto-detect only considers providers with usable credentials, so a key-free provider like DuckDuckGo is never chosen automatically; you must set `provider: "duckduckgo"`.
- **SafeSearch defaults to `moderate`** when not configured.

Tip

  For production use, consider [Brave Search](/tools/brave-search) (free tier available) or another API-backed provider.

## Related

- [Web Search overview](/tools/web) -- all providers and auto-detection
- [Brave Search](/tools/brave-search) -- structured results with free tier
- [Exa Search](/tools/exa-search) -- neural search with content extraction

---
