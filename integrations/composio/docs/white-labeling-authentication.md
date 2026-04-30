---
type: composio_doc
title: "White-labeling authentication"
source: "https://docs.composio.dev/docs/white-labeling-authentication.md"
source_hash: "0cc65e106ae17b2a313d538ac2bc96ccad90561a92a803b8c3da16785c75ba37"
doc_path: "white-labeling-authentication.md"
original_doc_path: "white-labeling-authentication.md"
duplicate_index: 1
---

# White-labeling authentication (/docs/white-labeling-authentication)
Source: https://docs.composio.dev/docs/white-labeling-authentication.md


There are three places where Composio branding shows up during authentication:

| Where                                                                | What users see                                                  | How to fix                             |
| -------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| [**Connect Link page**](#customizing-the-connect-link)               | Composio logo and name on the hosted auth page                  | Change logo + app title in dashboard   |
| [**OAuth consent screen**](#using-your-own-oauth-apps)               | "Composio wants to access your account" on Google, GitHub, etc. | Use your own OAuth app                 |
| [**Browser address bar**](#routing-the-callback-through-your-domain) | `backend.composio.dev` flashes during OAuth redirect-back       | Proxy the redirect through your domain |

# Customizing the Connect Link

The Connect Link is the hosted page your users see when connecting their accounts. By default it shows Composio branding.

To replace it with your own branding:

1. Go to **Project Settings** → [**Auth Screen**](https://platform.composio.dev?next_page=/settings/auth-screen)
2. Upload your **Logo** and set your **App Title**

This applies to all Connect Link flows across all toolkits, for both [in-chat](/docs/authenticating-users/in-chat-authentication) and [manual](/docs/authenticating-users/manually-authenticating) authentication. Each project has one logo and app title, so if you need different branding per product, use separate projects.

> Customizing the Connect Link only changes the Composio-hosted page. For OAuth toolkits like Gmail, Google Sheets, GitHub, and Slack, users still see a consent screen saying "Composio wants to access your account." To change that, and to remove the "Secured by Composio" badge, set up your own OAuth app as described [below](#using-your-own-oauth-apps).

> **Troubleshooting**: * **"Secured by Composio" badge won't go away:** This badge is removed when you use your own OAuth app. See [Using your own OAuth apps](#using-your-own-oauth-apps).
  * **Logo doesn't appear after uploading:** Clear browser cache or try incognito.
  * **Upload fails with "failed to fetch":** Retry or use a smaller image.

# Using your own OAuth apps

OAuth toolkits like Google and GitHub show a consent screen that says which app is requesting access. By default this reads "Composio wants to connect to your account." To show your app name instead, register your own OAuth app and tell Composio to use it. This is done by creating a [custom auth config](/docs/using-custom-auth-configuration) with your own credentials. See [when to use your own OAuth apps](#when-to-use-your-own-oauth-apps).

> **You don't need this for every toolkit**: Only white-label toolkits where users see a consent screen (Google, GitHub, Slack, etc.). Toolkits that use API keys don't show consent screens, so there's nothing to white-label. You can mix and match freely.

#### Create an OAuth app in the toolkit's developer portal

Register a new OAuth app with the toolkit. Set the callback URL to:

```
https://backend.composio.dev/api/v3.1/toolkits/auth/callback
```

You'll get a **Client ID** and **Client Secret**.

Step-by-step guides: [Google](https://composio.dev/auth/googleapps) | [Slack](https://composio.dev/auth/slack) | [HubSpot](https://composio.dev/auth/hubspot) | [All toolkits](https://composio.dev/auth)

#### Create an auth config in Composio

In the [Composio dashboard](https://platform.composio.dev):

    1. Go to **Authentication management** → **Create Auth Config**
    2. Select the toolkit (e.g., GitHub)
    3. Choose **OAuth2** scheme
    4. Toggle on **Use your own developer credentials**
    5. Enter your **Client ID** and **Client Secret**
    6. Click **Create**

Copy the auth config ID (e.g., `ac_1234abcd`).

#### Pass the auth config ID in your session

Specify which toolkits should use your custom auth config. Any toolkit you don't specify here will use Composio's managed auth automatically:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",
        "slack": "ac_your_slack_config",
        # gmail, linear, etc. use Composio managed auth automatically
    },
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  authConfigs: {
    github: "ac_your_github_config",
    slack: "ac_your_slack_config",
    // gmail, linear, etc. use Composio managed auth automatically
  },
});
```

Now when users connect GitHub or Slack, they'll see your app name on the consent screen. For Gmail and everything else, Composio's default app handles it.

## When to use your own OAuth apps

* **Production apps** where end users see consent screens. They should see your brand, not Composio's.
* **Enterprise customers** who require your branding end-to-end.
* **Toolkits where you need custom scopes** beyond what Composio's default app provides.

For development and testing, Composio's managed auth works fine. No OAuth app setup required.

## Switching from Composio-managed to your own OAuth app

Existing connected accounts are permanently tied to the auth config they were created with. Switching to a custom auth config does not affect them. You have two options:

**Keep existing users as-is.** Just pass `authConfigs` for the toolkits you want to white-label. Users who already have a connection keep using it. Users who need to connect for the first time go through your OAuth app:

**Python:**

```python
session = composio.create(
    user_id="user_123",
    auth_configs={
        "github": "ac_your_github_config",  # new connections use your OAuth app
    },
)
# Existing GitHub connections for this user keep working as before.
# Only new connections go through your custom OAuth app.
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123", {
  authConfigs: {
    github: "ac_your_github_config",  // new connections use your OAuth app
  },
});
// Existing GitHub connections for this user keep working as before.
// Only new connections go through your custom OAuth app.
```

> Existing users' connections continue using Composio's OAuth client credentials for token refresh until they re-authenticate.

**Fully migrate all users.** To move every user to your OAuth app, delete their old connected accounts and have them re-authenticate. There is no way to move an existing connection from one auth config to another without re-authentication.

# Routing the callback through your domain

During OAuth, the browser briefly redirects through `backend.composio.dev` so Composio can capture the auth token. Some toolkits also display this URL on the consent screen.

If you need to hide Composio's domain, you can proxy the redirect through your own domain instead.

#### Set the redirect URI to your domain

In your OAuth app's settings, set the authorized redirect URI to your own endpoint:

```
https://yourdomain.com/api/composio-redirect
```

#### Create a proxy endpoint

This endpoint receives the OAuth callback and immediately 302-redirects it to Composio:

**Python:**

```python
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse

app = FastAPI()

@app.get("/api/composio-redirect")
def composio_redirect(request: Request):
    composio_url = "https://backend.composio.dev/api/v3.1/toolkits/auth/callback"
    return RedirectResponse(url=f"{composio_url}?{request.url.query}")
```

**TypeScript:**

```typescript
// pages/api/composio-redirect.ts (Next.js)
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const composioUrl = "https://backend.composio.dev/api/v3.1/toolkits/auth/callback";
  const params = new URLSearchParams(req.query as Record<string, string>);
  res.redirect(302, `${composioUrl}?${params.toString()}`);
}
```

> Your endpoint must return a **302 redirect**. Do not follow the redirect server-side or make a fetch call to Composio. The user's browser needs to be redirected so the OAuth flow completes correctly.

#### Update your auth config

In the Composio dashboard, update your auth config to use your custom redirect URI.

![Auth Config Settings](/images/custom-redirect-uri.png)
*Setting the custom redirect URI in your auth config*

Here's how the redirect flow works. Your proxy just forwards the browser redirect to Composio. It never touches the authorization code or token.

```mermaid
flowchart TD
    A[Your App] -->|User connects| B["OAuth toolkit (e.g. Google, GitHub)"]
    B -->|Redirects user| C[yourdomain.com]
    C -->|Forwards redirect| D[backend.composio.dev]
    D -.->|Redirects back| A
```

> For FAQs and setup guides for individual toolkits, browse the [toolkits page](/toolkits).

# What to read next

- [Using custom auth configuration](/docs/using-custom-auth-configuration): Set up auth configs for toolkits that don't have Composio managed authentication

- [Authentication overview](/docs/authentication): Connect Links, OAuth, API keys, and how Composio manages auth

---
