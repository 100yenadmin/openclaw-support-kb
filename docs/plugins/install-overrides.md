---
type: openclaw_doc
title: "Plugin install overrides"
source: "https://docs.openclaw.ai/plugins/install-overrides"
source_hash: "a3e6e33169b3615e4e97afeeccdac1133a0ae46f5191f9ce19b4409c17419ff6"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "plugins/install-overrides.md"
original_doc_path: "plugins/install-overrides.md"
duplicate_index: 1
---

# Plugin install overrides
Source: https://docs.openclaw.ai/plugins/install-overrides

Plugin install overrides let maintainers test setup-time plugin installs against
a specific npm package or local npm-pack tarball. They are for E2E and package
validation only. Normal users should install plugins with
[`openclaw plugins install`](/cli/plugins).

Warning

Overrides execute plugin code from the source you provide. Use them only in an
isolated state directory or disposable test machine.

## Environment

Overrides are disabled unless both variables are set:

```bash
export OPENCLAW_ALLOW_PLUGIN_INSTALL_OVERRIDES=1
export OPENCLAW_PLUGIN_INSTALL_OVERRIDES='{
  "codex": "npm-pack:/tmp/openclaw-codex-2026.5.8.tgz",
  "openclaw-web-search": "npm:@openclaw/web-search@2026.5.8"
}'
```

The override map is JSON keyed by plugin id. Values support:

- `npm:<registry-spec>` for registry packages and exact versions or tags
- `npm-pack:<path.tgz>` for local tarballs produced by `npm pack`

Relative `npm-pack:` paths resolve from the current working directory.

## Behavior

When a setup-time flow asks to install a plugin whose id appears in the map,
OpenClaw uses the override source instead of the catalog, bundled, or default
npm source. This applies to onboarding and other flows that use the shared
setup-time plugin installer.

Overrides still enforce the expected plugin id. A tarball mapped to `codex`
must install a plugin whose manifest id is `codex`.

Overrides do not inherit official trusted-source status. Even when the catalog
entry normally represents an OpenClaw-owned package, an override is treated as
operator-supplied test input.

Workspace `.env` files cannot enable install overrides. Set these variables in
the trusted shell, CI job, or remote test command that launches OpenClaw.

## Package E2E

Use an isolated state directory so package installs and install records do not
touch your normal OpenClaw state:

```bash
npm pack extensions/codex --pack-destination /tmp

OPENCLAW_STATE_DIR="$(mktemp -d)" \
OPENCLAW_ALLOW_PLUGIN_INSTALL_OVERRIDES=1 \
OPENCLAW_PLUGIN_INSTALL_OVERRIDES='{"codex":"npm-pack:/tmp/openclaw-codex-2026.5.8.tgz"}' \
pnpm openclaw onboard --mode local
```

Verify the installed package under the state directory:

```bash
find "$OPENCLAW_STATE_DIR/npm/projects" -path '*/node_modules/@openclaw/codex/package.json' -print
grep -R '"@openclaw/codex"' "$OPENCLAW_STATE_DIR/npm/projects"/*/package-lock.json
```

For live provider E2E, source the real API key from a trusted shell or CI secret
before launching the test command. Do not print keys; report only the source and
whether the key was present.

---
