---
type: openclaw_doc
title: "Bun (experimental)"
source: "https://docs.openclaw.ai/install/bun"
source_hash: "2a729cc0447f86046dc52fdadb12229507958082bca1039988a0361c759cf374"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install/bun.md"
original_doc_path: "install/bun.md"
duplicate_index: 1
---

# Bun (experimental)
Source: https://docs.openclaw.ai/install/bun

Warning

Bun is **not recommended for gateway runtime** (known issues with WhatsApp and Telegram). Use Node for production.

Bun is an optional local runtime for running TypeScript directly (`bun run ...`, `bun --watch ...`). The default package manager remains `pnpm`, which is fully supported and used by docs tooling. Bun cannot use `pnpm-lock.yaml` and will ignore it.

## Install

Steps


Install dependencies

    ```sh
    bun install
    ```

    `bun.lock` / `bun.lockb` are gitignored, so there is no repo churn. To skip lockfile writes entirely:

    ```sh
    bun install --no-save
    ```



Build and test

    ```sh
    bun run build
    bun run vitest run
    ```


## Lifecycle scripts

Bun blocks dependency lifecycle scripts unless explicitly trusted. For this repo, the commonly blocked scripts are not required:

- `baileys` `preinstall` -- checks Node major >= 20 (OpenClaw defaults to Node 24 and still supports Node 22 LTS, currently `22.19+`)
- `protobufjs` `postinstall` -- emits warnings about incompatible version schemes (no build artifacts)

If you hit a runtime issue that requires these scripts, trust them explicitly:

```sh
bun pm trust baileys protobufjs
```

## Caveats

Some scripts still hardcode pnpm (for example `check:docs`, `ui:*`, `protocol:check`). Run those via pnpm for now.

## Related

- [Install overview](/install)
- [Node.js](/install/node)
- [Updating](/install/updating)

---
