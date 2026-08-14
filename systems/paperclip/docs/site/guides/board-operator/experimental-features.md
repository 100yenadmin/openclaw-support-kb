---
type: paperclip_doc
title: "experimental-features"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/experimental-features.md"
source_hash: "0c7acb5b752725c692d6b56f6b8aa96b91c1c642f20580a403c80db96e1c6bab"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/guides/board-operator/experimental-features.md"
original_doc_path: "docs/guides/board-operator/experimental-features.md"
---

# experimental-features

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/experimental-features.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/guides/board-operator/experimental-features.md

---
title: Experimental Features
summary: What Paperclip experimental features mean for board operators
---

Experimental features are opt-in and are provided without compatibility guarantees. They may break, change, or be removed at any time. Use them at your own risk.

## What "experimental" means

When a feature is marked experimental, Paperclip is still evaluating the product shape and implementation details.

- The feature is not part of the stable operator contract yet.
- UI, API, CLI, behavior, and stored configuration may change as the feature evolves.
- Paperclip does not promise compatibility, rollback, migration, or long-term support for experimental features.

If you need stable behavior for an important workflow, do not rely on an experimental feature.

## Where you enable them

Board operators enable or disable experiments from **Instance Settings > Experimental** in the app.

The CLI exposes the same surface:

```sh
pnpm paperclipai instance settings:experimental
pnpm exec paperclipai instance settings:experimental:update --payload-json '{...}'
```

Those commands change the same opt-in settings that the UI manages.

## When to use them

Experimental features are best used when you are:

- evaluating a new capability before wider rollout
- testing a non-critical workflow
- comfortable with behavior changes between releases
- prepared to stop using the feature if it changes or disappears

## Operator expectations

Before enabling an experimental feature:

- decide whether the workflow can tolerate breakage or churn
- avoid making the feature a dependency for stable production processes
- keep the scope small until you understand how the feature behaves in your company
- watch release notes and docs for changes to the feature contract

## Related references

- See [Status Cards](/guides/board-operator/status-cards) for the watched-query summary experiment, refresh policies, and cost model.
- See the CLI caveat in [Control-Plane Commands](/cli/control-plane-commands).
- See the repo CLI reference in [`doc/CLI.md`](https://github.com/paperclipai/paperclip/blob/master/doc/CLI.md) when working from the repository.
