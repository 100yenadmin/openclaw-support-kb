---
type: composio_doc
title: "Build an App Connections Dashboard"
source: "https://docs.composio.dev/cookbooks/app-connections-dashboard.md"
source_hash: "a79bd956c2ca01432df58432bafe5dc661d90b93b2dcc44b666b2008093923c0"
doc_path: "cookbooks/app-connections-dashboard.md"
original_doc_path: "cookbooks/app-connections-dashboard.md"
duplicate_index: 1
---

# Build an App Connections Dashboard (/cookbooks/app-connections-dashboard)
Source: https://docs.composio.dev/cookbooks/app-connections-dashboard.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/app-connections-dashboard)

[Build a Chat App](/cookbooks/chat-app) handles authentication in-chat. That works for getting started, but production apps need a dedicated page where users manage their connections. This cookbook builds a dashboard where users can see all available apps, connect via OAuth, and disconnect at any time.

# What you'll build

* A connections dashboard showing all available apps and their auth status
* Connect and disconnect buttons that handle OAuth flows

# Prerequisites

* [Bun](https://bun.sh) (or Node.js 18+)
* [Composio API key](https://platform.composio.dev/settings)

**Stack:** Next.js, `@composio/core`

# Create the project

```bash
bunx create-next-app composio-dashboard --yes
cd composio-dashboard
bun add @composio/core
```

Add your API key to a `.env.local` file:

```bash title=".env.local"
COMPOSIO_API_KEY=your_composio_api_key
```
# Setting up the client

Create `app/api/connections/route.ts`. Initialize the Composio client and set `dynamic = "force-dynamic"` so Next.js always fetches fresh connection data.

```ts no-twoslash title="app/api/connections/route.ts"
import { Composio } from "@composio/core";

const composio = new Composio();

export const dynamic = "force-dynamic";
```
`"user_123"` is a placeholder. In production, replace it with the authenticated user's ID from your auth system. See [Users & Sessions](/docs/users-and-sessions) for details.

# List connections

The `GET` handler creates a session and returns every toolkit's name, logo, and connection status. Toolkits where `isNoAuth` is `true` don't require authentication, so we filter them out.

```ts no-twoslash title="app/api/connections/route.ts"
export async function GET() {
  const session = await composio.create("user_123");
  const { items } = await session.toolkits({ limit: 50 });

  return Response.json({
    // Filter out toolkits that don't require authentication
    toolkits: items
      .filter((t) => !t.isNoAuth)
      .map((t) => ({
        slug: t.slug,
        name: t.name,
        logo: t.logo,
        isConnected: t.connection?.isActive ?? false,
        connectedAccountId: t.connection?.connectedAccount?.id,
      })),
  });
}
```
`session.toolkits()` returns each toolkit with a `connection` object. When `connection.isActive` is `true`, the user has already authorized that app. We also return the `connectedAccountId` so the frontend can disconnect later.

> `session.toolkits()` paginates results. This example fetches up to 50. Use the `nextCursor` value from the response to fetch the next page.

# Connect an app

The `POST` handler starts an OAuth flow for a given toolkit and returns the redirect URL.

```ts no-twoslash title="app/api/connections/route.ts"
export async function POST(req: Request) {
  const { toolkit }: { toolkit: string } = await req.json();
  const origin = new URL(req.url).origin;
  const session = await composio.create("user_123");
  const connectionRequest = await session.authorize(toolkit, {
    callbackUrl: origin,
  });

  return Response.json({ redirectUrl: connectionRequest.redirectUrl });
}
```
`session.authorize(toolkit)` creates a connection request with a `callbackUrl`. After the user completes OAuth, they get redirected back to your app.

# Disconnect an app

Create `app/api/connections/disconnect/route.ts`. This endpoint takes a `connectedAccountId` and deletes it:

```ts title="app/api/connections/disconnect/route.ts"
import { Composio } from "@composio/core";

const composio = new Composio();

export async function POST(req: Request) {
  const { connectedAccountId }: { connectedAccountId: string } =
    await req.json();
  await composio.connectedAccounts.delete(connectedAccountId);
  return Response.json({ success: true });
}

```
`composio.connectedAccounts.delete()` is a standalone SDK method. No session or provider needed.

# Build the dashboard

Replace `app/page.tsx` with a dashboard that shows connection cards:

```tsx title="app/page.tsx"
"use client";

import { useEffect, useState } from "react";

type Toolkit = {
  slug: string;
  name: string;
  logo?: string;
  isConnected: boolean;
  connectedAccountId?: string;
};

export default function Dashboard() {
  const [toolkits, setToolkits] = useState
              )}
              
                <p className="font-medium">{t.name}</p>
                <p
                  className={`text-xs ${
                    t.isConnected ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {t.isConnected ? "Connected" : "Not connected"}
                </p>
              
            
            {t.isConnected ? (
              <button
                onClick={() => disconnect(t.connectedAccountId!)}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => connect(t.slug)}
                className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800"
              >
                Connect
              </button>
            )}
          
        ))}
      
    </main>
  );
}

```
The page fetches toolkit connection status on load. Clicking **Connect** redirects the user to OAuth. After they authorize, the `callbackUrl` brings them back to the dashboard with the connection now active. Clicking **Disconnect** deletes the connection and refreshes the list.

# Complete route

The full `app/api/connections/route.ts` with both handlers:

```ts title="app/api/connections/route.ts"
// region setup
import { Composio } from "@composio/core";

const composio = new Composio();

export const dynamic = "force-dynamic";
// endregion setup

// region list
export async function GET() {
  const session = await composio.create("user_123");
  const { items } = await session.toolkits({ limit: 50 });

  return Response.json({
    // Filter out toolkits that don't require authentication
    toolkits: items
      .filter((t) => !t.isNoAuth)
      .map((t) => ({
        slug: t.slug,
        name: t.name,
        logo: t.logo,
        isConnected: t.connection?.isActive ?? false,
        connectedAccountId: t.connection?.connectedAccount?.id,
      })),
  });
}
// endregion list

// region connect
export async function POST(req: Request) {
  const { toolkit }: { toolkit: string } = await req.json();
  const origin = new URL(req.url).origin;
  const session = await composio.create("user_123");
  const connectionRequest = await session.authorize(toolkit, {
    callbackUrl: origin,
  });

  return Response.json({ redirectUrl: connectionRequest.redirectUrl });
}
// endregion connect

```
# Running the app

```bash
bun dev
```

Open [localhost:3000](http://localhost:3000). You'll see all available apps with their connection status.

1. Click **Connect** on GitHub. You'll be redirected to GitHub's OAuth page.
2. Authorize the app. You'll land back on the dashboard with GitHub showing "Connected."
3. Click **Disconnect** on GitHub. The connection is removed immediately.

# Take it further

- [Managing multiple connected accounts](/docs/managing-multiple-connected-accounts): 
Let users connect multiple accounts for the same toolkit

- [Connected accounts](/docs/auth-configuration/connected-accounts): 
List, refresh, disable, and delete user connections

---
