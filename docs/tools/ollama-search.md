---
type: openclaw_doc
title: "Ollama web search"
source: "https://docs.openclaw.ai/tools/ollama-search"
source_hash: "2e9d7649c63e4304c4d6f491dabdb46845a8a2011b75381e1d6f7ad04714504e"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/ollama-search.md"
original_doc_path: "tools/ollama-search.md"
duplicate_index: 1
---

# Ollama web search
Source: https://docs.openclaw.ai/tools/ollama-search

OpenClaw supports **Ollama Web Search** as a bundled `web_search` provider. It
uses Ollama's web-search API and returns structured results with titles, URLs,
and snippets.

For local or self-hosted Ollama, this setup does not need an API key by
default. It does require:

- an Ollama host that is reachable from OpenClaw
- `ollama signin`

For direct hosted search, set the Ollama provider base URL to `https://ollama.com`
and provide a real `OLLAMA_API_KEY`.

## Setup

Steps


Start Ollama

    Make sure Ollama is installed and running.


Sign in

    Run:

    ```bash
    ollama signin
    ```



Choose Ollama Web Search

    Run:

    ```bash
    openclaw configure --section web
    ```

    Then select **Ollama Web Search** as the provider.



If you already use Ollama for models, Ollama Web Search reuses the same
configured host.

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

Optional Ollama host override:

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

If you already configure Ollama as a model provider, the web-search provider can
reuse that host instead:

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

The Ollama model provider uses `baseUrl` as the canonical key. The web-search provider also honors `baseURL` on `models.providers.ollama` for compatibility with OpenAI SDK-style config examples.

If no explicit Ollama base URL is set, OpenClaw uses `http://127.0.0.1:11434`.

If your Ollama host expects bearer auth, OpenClaw reuses
`models.providers.ollama.apiKey` (or the matching env-backed provider auth)
for requests to that configured host.

Direct hosted Ollama Web Search:

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

## Notes

- No web-search-specific API key field is required for this provider.
- If the Ollama host is auth-protected, OpenClaw reuses the normal Ollama
  provider API key when present.
- If `baseUrl` is `https://ollama.com`, OpenClaw calls
  `https://ollama.com/api/web_search` directly and sends the configured Ollama
  API key as bearer auth.
- If the configured host does not expose web search and `OLLAMA_API_KEY` is set,
  OpenClaw can fall back to `https://ollama.com/api/web_search` without sending
  that env key to the local host.
- OpenClaw warns during setup if Ollama is unreachable or not signed in, but
  it does not block selection.
- Runtime auto-detect can fall back to Ollama Web Search when no higher-priority
  credentialed provider is configured.
- Local Ollama daemon hosts use the local proxy endpoint
  `/api/experimental/web_search`, which signs and forwards to Ollama Cloud.
- `https://ollama.com` hosts use the public hosted endpoint
  `/api/web_search` directly with bearer API-key auth.

## Related

- [Web Search overview](/tools/web) -- all providers and auto-detection
- [Ollama](/providers/ollama) -- Ollama model setup and cloud/local modes

---
