---
type: paperclip_doc
title: "storage"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/deploy/storage.md"
source_hash: "18e81519b10163ca51801f49418f85840a264540fedcf76fe622d69ec91ac4d6"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/deploy/storage.md"
original_doc_path: "docs/deploy/storage.md"
---

# storage

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/deploy/storage.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/deploy/storage.md

---
title: Storage
summary: Local disk vs S3-compatible storage
---

Paperclip stores uploaded files (issue attachments, images) using a configurable storage provider.

## Local Disk (Default)

Files are stored at:

```
~/.paperclip/instances/default/data/storage
```

No configuration required. Suitable for local development and single-machine deployments.

## S3-Compatible Storage

For production or multi-node deployments, use S3-compatible object storage (AWS S3, MinIO, Cloudflare R2, etc.).

Configure via CLI:

```sh
pnpm paperclipai configure --section storage
```

## Configuration

| Provider | Best For |
|----------|----------|
| `local_disk` | Local development, single-machine deployments |
| `s3` | Production, multi-node, cloud deployments |

Storage configuration is stored in the instance config file:

```
~/.paperclip/instances/default/config.json
```
