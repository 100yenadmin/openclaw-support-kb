---
type: paperclip_doc
title: "DATABASE_URL=postgres://paperclip:paperclip@localhost:5432/paperclip"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/deploy/database.md"
source_hash: "951149002cf86b22568fdd69886c93376050c5ed9d61a5f7af09c52ccfa5c067"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/deploy/database.md"
original_doc_path: "docs/deploy/database.md"
---

# DATABASE_URL=postgres://paperclip:paperclip@localhost:5432/paperclip

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/deploy/database.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/deploy/database.md

---
title: Database
summary: Embedded PGlite vs Docker Postgres vs hosted
---

Paperclip uses PostgreSQL via Drizzle ORM. There are three ways to run the database.

## 1. Embedded PostgreSQL (Default)

Zero config. If you don't set `DATABASE_URL`, the server starts an embedded PostgreSQL instance automatically.

```sh
pnpm dev
```

On first start, the server:

1. Creates `~/.paperclip/instances/default/db/` for storage
2. Ensures the `paperclip` database exists
3. Runs migrations automatically
4. Starts serving requests

Data persists across restarts. To reset: `rm -rf ~/.paperclip/instances/default/db`.

The Docker quickstart also uses embedded PostgreSQL by default.

## 2. Local PostgreSQL (Docker)

For a full PostgreSQL server locally:

```sh
docker compose up -d
```

This starts PostgreSQL 17 on `localhost:5432`. Set the connection string:

```sh
cp .env.example .env
# DATABASE_URL=postgres://paperclip:paperclip@localhost:5432/paperclip
```

Push the schema:

```sh
DATABASE_URL=postgres://paperclip:paperclip@localhost:5432/paperclip \
  npx drizzle-kit push
```

## 3. Hosted PostgreSQL (Supabase)

For production, use a hosted provider like [Supabase](https://supabase.com/).

1. Create a project at [database.new](https://database.new)
2. Copy the connection string from Project Settings > Database
3. Set `DATABASE_URL` in your `.env`

Use the **direct connection** (port 5432) for migrations and the **pooled connection** (port 6543) for the application.

If using connection pooling (transaction mode), disable prepared statements via the environment — no source edits needed:

```sh
DATABASE_PREPARED_STATEMENTS=false
```

Related optional client tuning (driver defaults apply when unset): `DATABASE_POOL_MAX`, `DATABASE_IDLE_TIMEOUT_SECONDS`, `DATABASE_CONNECT_TIMEOUT_SECONDS`.

## Switching Between Modes

| `DATABASE_URL` | Mode |
|----------------|------|
| Not set | Embedded PostgreSQL |
| `postgres://...localhost...` | Local Docker PostgreSQL |
| `postgres://...supabase.com...` | Hosted Supabase |

The Drizzle schema (`packages/db/src/schema/`) is the same regardless of mode.
