---
type: openclaw_doc
title: "Building plugins"
source: "https://docs.openclaw.ai/plugins/building-plugins"
source_hash: "53d0ac1427bd40050aa4aafda3fdd277dab70bea5bf41222b73d7b6a4b337fe8"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/building-plugins.md"
original_doc_path: "plugins/building-plugins.md"
duplicate_index: 1
---

# Building plugins
Source: https://docs.openclaw.ai/plugins/building-plugins

Plugins extend OpenClaw without changing core. A plugin can add a messaging
channel, model provider, local CLI backend, agent tool, hook, media provider,
or another plugin-owned capability.

You do not need to add an external plugin to the OpenClaw repository. Publish
the package to [ClawHub](/clawhub) and users install it with:

```bash
openclaw plugins install clawhub:<package-name>
```

Bare package specs still install from npm during the launch cutover. Use the
`clawhub:` prefix when you want ClawHub resolution.

## Requirements

- Use Node 22.19 or newer and a package manager such as `npm` or `pnpm`.
- Be familiar with TypeScript ESM modules.
- For in-repo bundled plugin work, clone the repository and run `pnpm install`.
  Source-checkout plugin development is pnpm-only because OpenClaw loads bundled
  plugins from `extensions/*` workspace packages.

## Choose the plugin shape

CardGroup


Channel plugin

    Connect OpenClaw to a messaging platform.


Provider plugin

    Add a model, media, search, fetch, speech, or realtime provider.


CLI backend plugin

    Run a local AI CLI through OpenClaw model fallback.


Tool plugin

    Register agent tools.


## Quickstart

Build a minimal tool plugin by registering one required agent tool. This is the
shortest useful plugin shape and shows the package, manifest, entry point, and
local proof.

Steps


Create package metadata


CodeGroup

```json package.json
{
  "name": "@myorg/openclaw-my-plugin",
  "version": "1.0.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"],
    "compat": {
      "pluginApi": ">=2026.3.24-beta.2",
      "minGatewayVersion": "2026.3.24-beta.2"
    },
    "build": {
      "openclawVersion": "2026.3.24-beta.2",
      "pluginSdkVersion": "2026.3.24-beta.2"
    }
  }
}
```

```json openclaw.plugin.json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "description": "Adds a custom tool to OpenClaw",
  "contracts": {
    "tools": ["my_tool"]
  },
  "activation": {
    "onStartup": true
  },
  "configSchema": {
    "type": "object",
    "additionalProperties": false
  }
}
```



    Published external plugins should point runtime entries at built JavaScript
    files. See [SDK entry points](/plugins/sdk-entrypoints) for the full entry
    point contract.

    Every plugin needs a manifest, even when it has no config. Runtime tools
    must appear in `contracts.tools` so OpenClaw can discover ownership without
    eagerly loading every plugin runtime. Set `activation.onStartup`
    intentionally. This example starts on Gateway startup.

    For every manifest field, see [Plugin manifest](/plugins/manifest).




Register the tool

    ```typescript index.ts
    import { Type } from "typebox";
    import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

    export default definePluginEntry({
      id: "my-plugin",
      name: "My Plugin",
      description: "Adds a custom tool to OpenClaw",
      register(api) {
        api.registerTool({
          name: "my_tool",
          description: "Echo one input value",
          parameters: Type.Object({ input: Type.String() }),
          async execute(_id, params) {
            return {
              content: [{ type: "text", text: `Got: ${params.input}` }],
            };
          },
        });
      },
    });
    ```

    Use `definePluginEntry` for non-channel plugins. Channel plugins use
    `defineChannelPluginEntry`.




Test the runtime

    For an installed or external plugin, inspect the loaded runtime:

    ```bash
    openclaw plugins inspect my-plugin --runtime --json
    ```

    If the plugin registers a CLI command, run that command too. For example,
    a demo command should have an execution proof such as
    `openclaw demo-plugin ping`.

    For a bundled plugin in this repository, OpenClaw discovers source-checkout
    plugin packages from the `extensions/*` workspace. Run the closest targeted
    test:

    ```bash
    pnpm test -- extensions/my-plugin/
    pnpm check
    ```




Publish

    Validate the package before publishing:

    ```bash
    clawhub package publish your-org/your-plugin --dry-run
    clawhub package publish your-org/your-plugin
    ```

    The canonical ClawHub snippets live in `docs/snippets/plugin-publish/`.




Install

    Install the published package through ClawHub:

    ```bash
    openclaw plugins install clawhub:your-org/your-plugin
    ```



<a id="registering-agent-tools"></a>

## Registering tools

Tools can be required or optional. Required tools are always available when the
plugin is enabled. Optional tools require user opt-in.

```typescript
register(api) {
  api.registerTool(
    {
      name: "workflow_tool",
      description: "Run a workflow",
      parameters: Type.Object({ pipeline: Type.String() }),
      async execute(_id, params) {
        return { content: [{ type: "text", text: params.pipeline }] };
      },
    },
    { optional: true },
  );
}
```

Every tool registered with `api.registerTool(...)` must also be declared in the
plugin manifest:

```json
{
  "contracts": {
    "tools": ["workflow_tool"]
  },
  "toolMetadata": {
    "workflow_tool": {
      "optional": true
    }
  }
}
```

Users opt in with `tools.allow`:

```json5
{
  tools: { allow: ["workflow_tool"] }, // or ["my-plugin"] for all tools from one plugin
}
```

Use optional tools for side effects, unusual binaries, or capabilities that
should not be exposed by default. Tool names must not conflict with core tools;
conflicts are skipped and reported in plugin diagnostics. Malformed
registrations, including tool descriptors without `parameters`, are skipped and
reported the same way. Registered tools are typed functions the model can call
after policy and allowlist checks pass.

Tool factories receive a runtime-supplied context object. Use `ctx.activeModel`
when a tool needs to log, display, or adapt to the active model for the current
turn. The object can include `provider`, `modelId`, and `modelRef`. Treat it as
informational runtime metadata, not as a security boundary against the local
operator, installed plugin code, or a modified OpenClaw runtime. Sensitive local
tools should still require an explicit plugin or operator opt-in and fail closed
when active-model metadata is missing or unsuitable.

The manifest declares ownership and discovery; execution still calls the live
registered tool implementation. Keep `toolMetadata.<tool>.optional: true`
aligned with `api.registerTool(..., { optional: true })` so OpenClaw can avoid
loading that plugin runtime until the tool is explicitly allowlisted.

## Import conventions

Import from focused SDK subpaths:

```typescript

```

Do not import from the deprecated root barrel:

```typescript

```

Within your plugin package, use local barrel files such as `api.ts` and
`runtime-api.ts` for internal imports. Do not import your own plugin through an
SDK path. Provider-specific helpers should stay in the provider package unless
the seam is truly generic.

Custom Gateway RPC methods are an advanced entry point. Keep them on a
plugin-specific prefix; core admin namespaces such as `config.*`,
`exec.approvals.*`, `operator.admin.*`, `wizard.*`, and `update.*` stay reserved
and resolve to `operator.admin`. The
`openclaw/plugin-sdk/gateway-method-runtime` bridge is reserved for plugin HTTP
routes that declare `contracts.gatewayMethodDispatch: ["authenticated-request"]`.

For the full import map, see [Plugin SDK overview](/plugins/sdk-overview).

## Pre-submission checklist

Check
**package.json** has correct `openclaw` metadata

Check
**openclaw.plugin.json** manifest is present and valid

Check
Entry point uses `defineChannelPluginEntry` or `definePluginEntry`

Check
All imports use focused `plugin-sdk/<subpath>` paths

Check
Internal imports use local modules, not SDK self-imports

Check
Tests pass (`pnpm test -- <bundled-plugin-root>/my-plugin/`)

Check
`pnpm check` passes (in-repo plugins)

## Test against beta releases

1. Watch for GitHub release tags on [openclaw/openclaw](https://github.com/openclaw/openclaw/releases) and subscribe via `Watch` > `Releases`. Beta tags look like `v2026.3.N-beta.1`. You can also turn on notifications for the official OpenClaw X account [@openclaw](https://x.com/openclaw) for release announcements.
2. Test your plugin against the beta tag as soon as it appears. The window before stable is typically only a few hours.
3. Post in your plugin's thread in the `plugin-forum` Discord channel after testing with either `all good` or what broke. If you do not have a thread yet, create one.
4. If something breaks, open or update an issue titled `Beta blocker: <plugin-name> - <summary>` and apply the `beta-blocker` label. Put the issue link in your thread.
5. Open a PR to `main` titled `fix(<plugin-id>): beta blocker - <summary>` and link the issue in both the PR and your Discord thread. Contributors cannot label PRs, so the title is the PR-side signal for maintainers and automation. Blockers with a PR get merged; blockers without one might ship anyway. Maintainers watch these threads during beta testing.
6. Silence means green. If you miss the window, your fix likely lands in the next cycle.

## Next steps

CardGroup


Channel Plugins

    Build a messaging channel plugin


Provider Plugins

    Build a model provider plugin


CLI Backend Plugins

    Register a local AI CLI backend


SDK Overview

    Import map and registration API reference


Runtime Helpers

    TTS, search, subagent via api.runtime


Testing

    Test utilities and patterns


Plugin Manifest

    Full manifest schema reference


## Related

- [Plugin hooks](/plugins/hooks)
- [Plugin architecture](/plugins/architecture)

---
