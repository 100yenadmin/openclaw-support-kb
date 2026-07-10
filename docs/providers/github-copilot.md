---
type: openclaw_doc
title: "GitHub Copilot"
source: "https://docs.openclaw.ai/providers/github-copilot"
source_hash: "5ef1eb5e876035ed41b796ce3a769cbb43a51103c6d9d84dccc02f73c5787360"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "providers/github-copilot.md"
original_doc_path: "providers/github-copilot.md"
duplicate_index: 1
---

# GitHub Copilot
Source: https://docs.openclaw.ai/providers/github-copilot

GitHub Copilot is GitHub's AI coding assistant. It provides access to Copilot
models for your GitHub account and plan. OpenClaw can use Copilot as a model
provider or agent runtime in three different ways.

## Three ways to use Copilot in OpenClaw

Tabs


Built-in provider (github-copilot)

    Use the native device-login flow to obtain a GitHub token, then exchange it for
    Copilot API tokens when OpenClaw runs. This is the **default** and simplest path
    because it does not require VS Code.


Steps


Run the login command

        ```bash
        openclaw models auth login-github-copilot
        ```

        You will be prompted to visit a URL and enter a one-time code. Keep the
        terminal open until it completes.


Set a default model

        ```bash
        openclaw models set github-copilot/claude-opus-4.7
        ```

        Or in config:

        ```json5
        {
          agents: {
            defaults: { model: { primary: "github-copilot/claude-opus-4.7" } },
          },
        }
        ```






Copilot SDK harness plugin (copilot)

    Install the external `@openclaw/copilot` plugin when you want GitHub's
    Copilot CLI and SDK to own the low-level agent loop for selected
    `github-copilot/*` models.

    ```bash
    openclaw plugins install @openclaw/copilot
    ```

    Then opt a model or provider into the runtime:

    ```json5
    {
      agents: {
        defaults: {
          model: "github-copilot/gpt-5.5",
          models: {
            "github-copilot/gpt-5.5": {
              agentRuntime: { id: "copilot" },
            },
          },
        },
      },
    }
    ```

    Choose this when you want native Copilot CLI sessions, SDK-managed thread
    state, and Copilot-owned compaction for those agent turns. Without the
    explicit `agentRuntime` opt-in, `github-copilot/*` models keep using the
    built-in provider. See [Copilot SDK harness](/plugins/copilot) for the full
    runtime contract.




Copilot Proxy plugin (copilot-proxy)

    Use the **Copilot Proxy** VS Code extension as a local bridge. OpenClaw talks to
    the proxy's `/v1` endpoint (default `http://localhost:3000/v1`) and uses the
    model list you configure.

    The `copilot-proxy` plugin ships with OpenClaw and is enabled by default.
    Configure the base URL and model ids with:

    ```bash
    openclaw models auth login --provider copilot-proxy --set-default
    ```


Note

    Choose this when you already run Copilot Proxy in VS Code or need to route
    through it. The VS Code extension must stay running.




## GitHub Enterprise (data residency)

If your organization uses a data-residency GitHub Enterprise tenant (a
`*.ghe.com` host such as `your-org.ghe.com`), Copilot lives on tenant-local
endpoints rather than public `github.com`. OpenClaw exposes this as a
first-class auth choice so you do not have to hand-edit URLs.

Steps


Pick the Enterprise auth choice

    In onboarding or `openclaw models auth`, choose
    **GitHub Copilot (Enterprise / data residency)**. You will be prompted for
    your Enterprise domain (for example `your-org.ghe.com`), then the device
    login runs against that tenant.

    Enter the tenant root only (`your-org.ghe.com`). Derived service hosts such
    as `api.your-org.ghe.com` or `copilot-api.your-org.ghe.com` are not accepted;
    OpenClaw derives those endpoints from the tenant root automatically.

    ```bash
    openclaw models auth login --provider github-copilot --method device-enterprise
    ```



Domain is persisted to config

    The chosen host is stored under the provider params so later token refreshes
    and completions target the tenant automatically:

    ```json5
    {
      models: {
        providers: {
          "github-copilot": { params: { githubDomain: "your-org.ghe.com" } },
        },
      },
    }
    ```



The device flow, token exchange, and completions resolve to
`https://your-org.ghe.com/login/device/code`,
`https://api.your-org.ghe.com/copilot_internal/v2/token`, and
`https://copilot-api.your-org.ghe.com` respectively. Data-residency tokens carry
a tenant stamp and no proxy hint, so the completions base URL falls back to the
tenant Copilot host instead of the public endpoint.

Note

Switching domains always re-runs the device login. If you already have a stored
Copilot token and pick a different domain (public `github.com` ↔ a `*.ghe.com`
tenant, or one tenant to another), OpenClaw will not reuse the existing token —
it forces a fresh login so the token is scoped to the domain being written to
config. Re-running login for the *same* domain still offers to reuse the current
token. Switching back to public `github.com` clears the persisted
`githubDomain` so config returns to the default.

Note

The `COPILOT_GITHUB_DOMAIN` environment variable overrides the resolved domain
for every Copilot path that resolves it — the Enterprise device login
(`--method device-enterprise`), the standalone
`openclaw models auth login-github-copilot` shortcut, token refresh, embeddings,
and completions. Set it to your `*.ghe.com` host for fully headless or CI
setups. Leave it unset (and the config param absent) to use public `github.com`.
Logins persist the domain they minted the token for (and clear it when logging
in against public `github.com`), so routing stays correct even after the
environment variable is unset.

## Optional flags

| Command                                                                | Flag            | Description                                          |
| ---------------------------------------------------------------------- | --------------- | ---------------------------------------------------- |
| `openclaw models auth login-github-copilot`                            | `--yes`         | Overwrite an existing auth profile without prompting |
| `openclaw models auth login --provider github-copilot --method device` | `--set-default` | Also apply the provider's recommended default model  |

```bash
# Skip the re-login confirmation
openclaw models auth login-github-copilot --yes

# Login and set the default model in one step
openclaw models auth login --provider github-copilot --method device --set-default
```

## Non-interactive onboarding

The device-login flow requires an interactive TTY. For headless setup, import
an existing GitHub OAuth access token with `openclaw onboard --non-interactive`:

```bash
openclaw onboard --non-interactive --accept-risk \
  --auth-choice github-copilot \
  --github-copilot-token "$COPILOT_GITHUB_TOKEN" \
  --skip-channels --skip-health
```

You can also omit `--auth-choice`; passing `--github-copilot-token` infers the
GitHub Copilot provider auth choice. If the flag is omitted, onboarding falls
back to `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, then `GITHUB_TOKEN`. Use
`--secret-input-mode ref` with `COPILOT_GITHUB_TOKEN` set to store an env-backed
`tokenRef` instead of plaintext in `auth-profiles.json`.

AccordionGroup


Interactive TTY required

    The device-login flow requires an interactive TTY. Run it directly in a
    terminal, not in a non-interactive script or CI pipeline.



Model availability depends on your plan

    Copilot model availability depends on your GitHub plan. If a model is
    rejected, try another ID (for example `github-copilot/gpt-5.5`). See
    GitHub's [supported models per Copilot plan](https://docs.github.com/en/copilot/reference/ai-models/supported-models#supported-ai-models-per-copilot-plan)
    for the current model list.



Live catalog refresh from the Copilot API

    Once the device-login (or env-var) auth path has resolved a GitHub token,
    OpenClaw refreshes the model catalog on demand from `${baseUrl}/models`
    (the same endpoint VS Code Copilot uses) so the runtime tracks
    per-account entitlement and accurate context windows without manifest
    churn. Newly published Copilot models become visible without an OpenClaw
    upgrade, and context windows reflect the real per-model limits
    (e.g. 400k for the gpt-5.x series, 1M for the internal
    `claude-opus-*-1m` variants).

    The bundled static catalog stays as the visible fallback when discovery
    is disabled, the user has no GitHub auth profile, the token-exchange
    fails, or the `/models` HTTPS call errors. To opt out and rely entirely
    on the static manifest catalog (offline / air-gapped scenarios):

    ```json5
    {
      plugins: {
        entries: {
          "github-copilot": {
            config: { discovery: { enabled: false } },
          },
        },
      },
    }
    ```




Transport selection

    Claude model IDs use the Anthropic Messages transport automatically.
    Gemini models use the OpenAI Chat Completions transport; GPT and o-series
    models keep the OpenAI Responses transport. OpenClaw selects the correct
    transport based on the model ref.



Request compatibility

    OpenClaw sends Copilot IDE-style request headers on Copilot transports
    (VS Code editor/plugin versions and the `vscode-chat` integration id),
    marks tool-result follow-up turns as agent-initiated, and sets the Copilot
    vision header when a turn carries image input.



Environment variable resolution order

    OpenClaw resolves Copilot auth from environment variables in the following
    priority order:

    | Priority | Variable              | Notes                            |
    | -------- | --------------------- | -------------------------------- |
    | 1        | `COPILOT_GITHUB_TOKEN` | Highest priority, Copilot-specific |
    | 2        | `GH_TOKEN`            | GitHub CLI token (fallback)      |
    | 3        | `GITHUB_TOKEN`        | Standard GitHub token (lowest)   |

    When multiple variables are set, OpenClaw uses the highest-priority one.
    The device-login flow (`openclaw models auth login-github-copilot`) stores
    its token in the auth profile store and takes precedence over all environment
    variables.




Token storage

    The login stores a GitHub token in the auth profile store (profile id
    `github-copilot:github`) and exchanges it for a short-lived Copilot API
    token when OpenClaw runs. You do not need to manage the token manually.


## Memory search embeddings

GitHub Copilot can also serve as an embedding provider for
[memory search](/concepts/memory-search). If you have a Copilot subscription and
have logged in, OpenClaw can use it for embeddings without a separate API key.

### Config

Set `memorySearch.provider` explicitly to use GitHub Copilot embeddings. If a
GitHub token is available, OpenClaw discovers available embedding models from
the Copilot API and picks the best one automatically.

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "github-copilot",
        // Optional: override the auto-discovered model
        model: "text-embedding-3-small",
      },
    },
  },
}
```

### How it works

1. OpenClaw resolves your GitHub token (from env vars or auth profile).
2. Exchanges it for a short-lived Copilot API token.
3. Queries the Copilot `/models` endpoint to discover available embedding models.
4. Picks the best model (preference order: `text-embedding-3-small`,
   `text-embedding-3-large`, `text-embedding-ada-002`).
5. Sends embedding requests to the Copilot `/embeddings` endpoint.

Model availability depends on your GitHub plan. If no embedding models are
available, OpenClaw skips Copilot and tries the next provider.

## Related

CardGroup


Model selection

    Choosing providers, model refs, and failover behavior.


OAuth and auth

    Auth details and credential reuse rules.

---
