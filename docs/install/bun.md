---
type: openclaw_doc
title: "Bun (experimental)"
source: "https://docs.openclaw.ai/install/bun"
source_hash: "cc564e13740608e69d510ddd87a1531390d0ef690f1d6f734178817fc0dbcb46"
generated_at: "2026-04-30T12:26:35.225Z"
doc_path: "install/bun.md"
original_doc_path: "install/bun.md"
duplicate_index: 1
---

# Bun (experimental)
Source: https://docs.openclaw.ai/install/bun



<Warning>
  Bun is **not recommended for gateway runtime** (known issues with WhatsApp and Telegram). Use Node for production.
</Warning>

Bun is an optional local runtime for running TypeScript directly (`bun run ...`, `bun --watch ...`). The default package manager remains `pnpm`, which is fully supported and used by docs tooling. Bun cannot use `pnpm-lock.yaml` and will ignore it.

## Install

<Steps>
  <Step title="Install dependencies">
    ```sh theme={"theme":{"light":"min-light","dark":"min-dark"}}
    bun install
    ```

    `bun.lock` / `bun.lockb` are gitignored, so there is no repo churn. To skip lockfile writes entirely:

    ```sh theme={"theme":{"light":"min-light","dark":"min-dark"}}
    bun install --no-save
    ```
  </Step>

  <Step title="Build and test">
    ```sh theme={"theme":{"light":"min-light","dark":"min-dark"}}
    bun run build
    bun run vitest run
    ```
  </Step>
</Steps>

## Lifecycle scripts

Bun blocks dependency lifecycle scripts unless explicitly trusted. For this repo, the commonly blocked scripts are not required:

* `@whiskeysockets/baileys` `preinstall` -- checks Node major >= 20 (OpenClaw defaults to Node 24 and still supports Node 22 LTS, currently `22.14+`)
* `protobufjs` `postinstall` -- emits warnings about incompatible version schemes (no build artifacts)

If you hit a runtime issue that requires these scripts, trust them explicitly:

```sh theme={"theme":{"light":"min-light","dark":"min-dark"}}
bun pm trust @whiskeysockets/baileys protobufjs
```

## Caveats

Some scripts still hardcode pnpm (for example `docs:build`, `ui:*`, `protocol:check`). Run those via pnpm for now.

## Related

* [Install overview](/install)
* [Node.js](/install/node)
* [Updating](/install/updating)
