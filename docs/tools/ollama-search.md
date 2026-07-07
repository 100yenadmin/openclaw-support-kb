---
type: openclaw_doc
title: "Ollama web search"
source: "https://docs.openclaw.ai/tools/ollama-search"
source_hash: "225e88c08b2ad9b3a0e58a627f37e4780b515350a5eac072799ad3da1a0e9e25"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/ollama-search.md"
original_doc_path: "tools/ollama-search.md"
duplicate_index: 1
---

# Ollama web search
Source: https://docs.openclaw.ai/tools/ollama-search

OpenClaw supports **Ollama Web Search** as a bundled `web_search` provider,
returning titles, URLs, and snippets from Ollama's web-search API.

Local/self-hosted Ollama needs no API key by default; it requires a reachable
Ollama host plus `ollama signin`. Direct hosted search (no local Ollama) needs
`baseUrl: "https://ollama.com"` and a real `OLLAMA_API_KEY`.

## Setup

Steps


Start Ollama

    Make sure Ollama is installed and running.


Sign in

    ```bash
    ollama signin
    ```


Choose Ollama Web Search

    ```bash
    openclaw configure --section web
    ```

    Select **Ollama Web Search** as the provider.



If you already use Ollama for models, Ollama Web Search reuses the same
configured host.

Note

  OpenClaw never auto-selects Ollama Web Search over a higher-priority
  credentialed provider; you must choose it explicitly with
  `tools.web.search.provider: "ollama"`.

## Config

```json5
{
  tools: {
    web: {
      search: {
        provider: "ollama",
      },
    },
  },
}
```

Optional host override, scoped to web search only:

```json5
{
  plugins: {
    entries: {
      ollama: {
        config: {
          webSearch: {
            baseUrl: "http://ollama-host:11434",
          },
        },
      },
    },
  },
}
```

Or reuse the host already configured for the Ollama model provider:

```json5
{
  models: {
    providers: {
      ollama: {
        baseUrl: "http://ollama-host:11434",
      },
    },
  },
}
```

`models.providers.ollama.baseUrl` is the canonical key; the web-search
provider also accepts `baseURL` there for compatibility with OpenAI SDK-style
config examples. If nothing is set, OpenClaw defaults to
`http://127.0.0.1:11434`.

Direct hosted Ollama Web Search (no local Ollama):

```json5
{
  models: {
    providers: {
      ollama: {
        baseUrl: "https://ollama.com",
        apiKey: "OLLAMA_API_KEY",
      },
    },
  },
  tools: {
    web: {
      search: {
        provider: "ollama",
      },
    },
  },
}
```

## Auth and request routing

- No web-search-specific API key field exists; the provider reuses
  `models.providers.ollama.apiKey` (or the matching env-backed provider auth)
  when the configured host is auth-protected.
- Host resolution order: `plugins.entries.ollama.config.webSearch.baseUrl` →
  `models.providers.ollama.baseUrl` (or `baseURL`) → `http://127.0.0.1:11434`.
- If the resolved host is `https://ollama.com`, OpenClaw calls
  `https://ollama.com/api/web_search` directly with the API key as bearer
  auth.
- Otherwise OpenClaw calls the local proxy endpoint
  `/api/experimental/web_search` first (which signs and forwards to Ollama
  Cloud), then falls back to `/api/web_search` on the same host. If both fail
  and `OLLAMA_API_KEY` is set, it retries once against
  `https://ollama.com/api/web_search` with that key — without sending it to
  the local host.
- OpenClaw warns during setup if Ollama is unreachable or not signed in, but
  does not block selecting the provider.

## Related

- [Web Search overview](/tools/web) -- all providers and auto-detection
- [Ollama](/providers/ollama) -- Ollama model setup and cloud/local modes

---
