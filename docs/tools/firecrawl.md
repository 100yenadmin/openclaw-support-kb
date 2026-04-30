---
type: openclaw_doc
title: "Firecrawl"
source: "https://docs.openclaw.ai/tools/firecrawl"
source_hash: "5b0dac41832013c321e55b11f81b1833b03eeb05e5323a2ef5a77aaf308e5a44"
generated_at: "2026-04-30T12:26:35.225Z"
doc_path: "tools/firecrawl.md"
original_doc_path: "tools/firecrawl.md"
duplicate_index: 1
---

# Firecrawl
Source: https://docs.openclaw.ai/tools/firecrawl



OpenClaw can use **Firecrawl** in three ways:

* as the `web_search` provider
* as explicit plugin tools: `firecrawl_search` and `firecrawl_scrape`
* as a fallback extractor for `web_fetch`

It is a hosted extraction/search service that supports bot circumvention and caching,
which helps with JS-heavy sites or pages that block plain HTTP fetches.

## Get an API key

1. Create a Firecrawl account and generate an API key.
2. Store it in config or set `FIRECRAWL_API_KEY` in the gateway environment.

## Configure Firecrawl search

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  tools: {
    web: {
      search: {
        provider: "firecrawl",
      },
    },
  },
  plugins: {
    entries: {
      firecrawl: {
        enabled: true,
        config: {
          webSearch: {
            apiKey: "FIRECRAWL_API_KEY_HERE",
            baseUrl: "https://api.firecrawl.dev",
          },
        },
      },
    },
  },
}
```

Notes:

* Choosing Firecrawl in onboarding or `openclaw configure --section web` enables the bundled Firecrawl plugin automatically.
* `web_search` with Firecrawl supports `query` and `count`.
* For Firecrawl-specific controls like `sources`, `categories`, or result scraping, use `firecrawl_search`.
* `baseUrl` overrides must stay on `https://api.firecrawl.dev`.
* `FIRECRAWL_BASE_URL` is the shared env fallback for Firecrawl search and scrape base URLs.

## Configure Firecrawl scrape + web\_fetch fallback

```json5 theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  plugins: {
    entries: {
      firecrawl: {
        enabled: true,
        config: {
          webFetch: {
            apiKey: "FIRECRAWL_API_KEY_HERE",
            baseUrl: "https://api.firecrawl.dev",
            onlyMainContent: true,
            maxAgeMs: 172800000,
            timeoutSeconds: 60,
          },
        },
      },
    },
  },
}
```

Notes:

* Firecrawl fallback attempts run only when an API key is available (`plugins.entries.firecrawl.config.webFetch.apiKey` or `FIRECRAWL_API_KEY`).
* `maxAgeMs` controls how old cached results can be (ms). Default is 2 days.
* Legacy `tools.web.fetch.firecrawl.*` config is auto-migrated by `openclaw doctor --fix`.
* Firecrawl scrape/base URL overrides are restricted to `https://api.firecrawl.dev`.

`firecrawl_scrape` reuses the same `plugins.entries.firecrawl.config.webFetch.*` settings and env vars.

## Firecrawl plugin tools

### `firecrawl_search`

Use this when you want Firecrawl-specific search controls instead of generic `web_search`.

Core parameters:

* `query`
* `count`
* `sources`
* `categories`
* `scrapeResults`
* `timeoutSeconds`

### `firecrawl_scrape`

Use this for JS-heavy or bot-protected pages where plain `web_fetch` is weak.

Core parameters:

* `url`
* `extractMode`
* `maxChars`
* `onlyMainContent`
* `maxAgeMs`
* `proxy`
* `storeInCache`
* `timeoutSeconds`

## Stealth / bot circumvention

Firecrawl exposes a **proxy mode** parameter for bot circumvention (`basic`, `stealth`, or `auto`).
OpenClaw always uses `proxy: "auto"` plus `storeInCache: true` for Firecrawl requests.
If proxy is omitted, Firecrawl defaults to `auto`. `auto` retries with stealth proxies if a basic attempt fails, which may use more credits
than basic-only scraping.

## How `web_fetch` uses Firecrawl

`web_fetch` extraction order:

1. Readability (local)
2. Firecrawl (if selected or auto-detected as the active web-fetch fallback)
3. Basic HTML cleanup (last fallback)

The selection knob is `tools.web.fetch.provider`. If you omit it, OpenClaw
auto-detects the first ready web-fetch provider from available credentials.
Today the bundled provider is Firecrawl.

## Related

* [Web Search overview](/tools/web) -- all providers and auto-detection
* [Web Fetch](/tools/web-fetch) -- web\_fetch tool with Firecrawl fallback
* [Tavily](/tools/tavily) -- search + extract tools
