---
type: openclaw_doc
title: "Soul format"
source: "https://docs.openclaw.ai/clawhub/soul-format"
source_hash: "708af39fbc78ac5e2e9c17e314980f870588c75d97eab56fee32bb211ca6d878"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "clawhub/soul-format.md"
original_doc_path: "clawhub/soul-format.md"
duplicate_index: 1
---

# Soul format
Source: https://docs.openclaw.ai/clawhub/soul-format



# Soul format

## On disk

A soul is a single file:

* `SOUL.md` (or `soul.md`)

For now, onlycrabs.ai rejects any extra files.

## `SOUL.md`

* Markdown with optional YAML frontmatter.
* The server extracts metadata from frontmatter during publish.
* `description` is used as the soul summary in the UI/search.

## Limits

* Total bundle size: 50MB.
* Embedding text includes `SOUL.md` only.

## Slugs

* Derived from folder name by default.
* Must be lowercase and URL-safe: `^[a-z0-9][a-z0-9-]*$`.

## Versioning + tags

* Each publish creates a new version (semver).
* Tags are string pointers to a version; `latest` is commonly used.
