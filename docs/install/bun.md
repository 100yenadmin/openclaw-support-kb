---
type: openclaw_doc
title: "Bun"
source: "https://docs.openclaw.ai/install/bun"
source_hash: "9c25d802585c1a5c9b0929e3e3a09f26d8ea98181c8020ef148d64e2e0a4d9b6"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install/bun.md"
original_doc_path: "install/bun.md"
duplicate_index: 1
---

# Bun
Source: https://docs.openclaw.ai/install/bun

Warning

Bun cannot run the OpenClaw CLI or Gateway because it does not provide the required `node:sqlite` API. Install a supported Node version for all OpenClaw runtime commands.

Bun remains usable as an optional dependency installer and package-script runner. The default package manager remains `pnpm`, which is fully supported and used by docs tooling. Bun cannot use `pnpm-lock.yaml` and ignores it.

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

    Commands that launch OpenClaw itself must still run through Node.



## Lifecycle scripts

Bun blocks dependency lifecycle scripts unless explicitly trusted. For this repo, the commonly blocked scripts are not required:

- `baileys` `preinstall`: checks Node major >= 20 (OpenClaw requires Node 22.22.3+, 24.15+, or 25.9+, with Node 24 recommended)
- `protobufjs` `postinstall`: emits warnings about incompatible version schemes (no build artifacts)

If you hit a runtime issue that needs these scripts, trust them explicitly:

```sh
bun pm trust baileys protobufjs
```

## Caveats

Some package scripts hardcode `pnpm` internally (for example `check:docs`, `ui:*`, `protocol:check`). Running them via `bun run` still shells out to `pnpm`, so just run those via `pnpm` directly.

## Related

- [Install overview](/install)
- [Node.js](/install/node)
- [Updating](/install/updating)

---
