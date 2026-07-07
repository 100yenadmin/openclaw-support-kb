---
type: openclaw_doc
title: "Tavily"
source: "https://docs.openclaw.ai/tools/tavily"
source_hash: "bc1a295ceffe77799b3bcce7f0a0af4468fa3d7e976b103d1f1682302c2acd49"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/tavily.md"
original_doc_path: "tools/tavily.md"
duplicate_index: 1
---

# Tavily
Source: https://docs.openclaw.ai/tools/tavily

[Tavily](https://tavily.com) is a search API designed for AI applications. OpenClaw exposes it in two ways:

- as the `web_search` provider for the generic search tool
- as explicit plugin tools: `tavily_search` and `tavily_extract`

Tavily returns structured results optimized for LLM consumption, with configurable search depth, topic filtering, domain filters, AI-generated answer summaries, and content extraction from URLs (including JavaScript-rendered pages).

| Property  | Value                                                                                         |
| --------- | --------------------------------------------------------------------------------------------- |
| Plugin id | `tavily`                                                                                      |
| Package   | `@openclaw/tavily-plugin`                                                                     |
| Auth      | `TAVILY_API_KEY` env var or config `apiKey`                                                   |
| Base URL  | `https://api.tavily.com` (default); `TAVILY_BASE_URL` env var or config `baseUrl` to override |
| Timeouts  | 30s search, 60s extract (default)                                                             |
| Tools     | `tavily_search`, `tavily_extract`                                                             |

## Getting started

Steps


Install the plugin

    ```bash
    openclaw plugins install @openclaw/tavily-plugin
    ```


Get an API key

    Create a Tavily account at [tavily.com](https://tavily.com), then generate an API key in the dashboard.


Configure the plugin and provider

    ```json5
    {
      plugins: {
        entries: {
          tavily: {
            enabled: true,
            config: {
              webSearch: {
                apiKey: "tvly-...", // optional if TAVILY_API_KEY is set
                baseUrl: "https://api.tavily.com",
              },
            },
          },
        },
      },
      tools: {
        web: {
          search: {
            provider: "tavily",
          },
        },
      },
    }
    ```


Verify search runs

    Trigger a `web_search` from any agent, or call `tavily_search` directly.


Tip

Choosing Tavily in onboarding or `openclaw configure --section web` installs and enables the official Tavily plugin when needed.

## Tool reference

### `tavily_search`

Use this when you want Tavily-specific search controls instead of generic `web_search`.

| Parameter         | Type         | Constraints / default                  | Description                                   |
| ----------------- | ------------ | -------------------------------------- | --------------------------------------------- |
| `query`           | string       | required                               | Search query string.                          |
| `search_depth`    | enum         | `basic` (default), `advanced`          | `advanced` is slower but higher relevance.    |
| `topic`           | enum         | `general` (default), `news`, `finance` | Filter by topic family.                       |
| `max_results`     | integer      | 1-20, default `5`                      | Number of results.                            |
| `include_answer`  | boolean      | default `false`                        | Include a Tavily AI-generated answer summary. |
| `time_range`      | enum         | `day`, `week`, `month`, `year`         | Filter results by recency.                    |
| `include_domains` | string array | (none)                                 | Only include results from these domains.      |
| `exclude_domains` | string array | (none)                                 | Exclude results from these domains.           |

Search depth tradeoff:

| Depth      | Speed  | Relevance | Best for                             |
| ---------- | ------ | --------- | ------------------------------------ |
| `basic`    | Faster | High      | General-purpose queries (default).   |
| `advanced` | Slower | Highest   | Precision research and fact-finding. |

### `tavily_extract`

Use this to extract clean content from one or more URLs. Handles JavaScript-rendered pages and supports query-focused chunking for targeted extraction.

| Parameter           | Type         | Constraints / default         | Description                                                 |
| ------------------- | ------------ | ----------------------------- | ----------------------------------------------------------- |
| `urls`              | string array | required, 1-20                | URLs to extract content from.                               |
| `query`             | string       | (optional)                    | Rerank extracted chunks by relevance to this query.         |
| `extract_depth`     | enum         | `basic` (default), `advanced` | Use `advanced` for JS-heavy pages, SPAs, or dynamic tables. |
| `chunks_per_source` | integer      | 1-5; **requires `query`**     | Chunks returned per URL. Errors if set without `query`.     |
| `include_images`    | boolean      | default `false`               | Include image URLs in results.                              |

Extract depth tradeoff:

| Depth      | When to use                                |
| ---------- | ------------------------------------------ |
| `basic`    | Simple pages. Try this first.              |
| `advanced` | JS-rendered SPAs, dynamic content, tables. |

Tip

Batch larger URL lists into multiple `tavily_extract` calls (max 20 per request). Use `query` plus `chunks_per_source` to get only relevant content instead of full pages.

## Choosing the right tool

| Need                                 | Tool             |
| ------------------------------------ | ---------------- |
| Quick web search, no special options | `web_search`     |
| Search with depth, topic, AI answers | `tavily_search`  |
| Extract content from specific URLs   | `tavily_extract` |

Note

The generic `web_search` tool with Tavily as provider supports `query` and `count` (up to 20 results). For Tavily-specific controls (`search_depth`, `topic`, `include_answer`, domain filters, time range), use `tavily_search` instead.

## Advanced configuration

AccordionGroup


API key resolution order

    The Tavily client looks up its API key in this order:

    1. `plugins.entries.tavily.config.webSearch.apiKey` (resolved through SecretRefs).
    2. `TAVILY_API_KEY` from the gateway environment.

    `tavily_search` and `tavily_extract` both raise a setup error if neither is present.




Custom base URL

    Override `plugins.entries.tavily.config.webSearch.baseUrl`, or set `TAVILY_BASE_URL`, if you front Tavily through a proxy. Config takes priority over the env var. The default is `https://api.tavily.com`.



`chunks_per_source` requires `query`

    `tavily_extract` rejects calls that pass `chunks_per_source` without a `query`. Tavily ranks chunks by query relevance, so the parameter is meaningless without one.


## Related

CardGroup


Web Search overview

    All providers and auto-detection rules.


Firecrawl

    Search plus scraping with content extraction.


Exa Search

    Neural search with content extraction.


Configuration

    Full config schema for plugin entries and tool routing.

---
