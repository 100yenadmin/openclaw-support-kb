---
type: composio_doc
title: "White-labeling authentication"
source: "https://docs.composio.dev/docs/white-labeling-authentication.md"
source_hash: "335a5e4b65655d77591b4bd67368ed1d6183377df784323c232826bfed0f3aba"
system: "composio"
kb_namespace: "composio"
doc_path: "white-labeling-authentication.md"
original_doc_path: "white-labeling-authentication.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# White-labeling authentication (/docs/white-labeling-authentication)
Source: https://docs.composio.dev/docs/white-labeling-authentication.md


There are four places where Composio branding shows up during authentication:

| Where                                                                 | What users see                                                  | How to fix                                          |
| --------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| [**Connect Link page**](#customizing-the-connect-link)                | Composio logo and name on the hosted auth page                  | Change logo + app title in dashboard                |
| [**OAuth consent screen**](#using-your-own-oauth-apps)                | "Composio wants to access your account" on Google, GitHub, etc. | Use your own OAuth app                              |
| [**Browser address bar**](#routing-the-callback-through-your-domain)  | `backend.composio.dev` flashes during OAuth redirect-back       | Proxy the redirect through your domain              |
| [**Post-auth success page**](#redirecting-users-after-authentication) | Composio-branded success page after OAuth completes             | Pass a `callbackUrl` when initiating the connection |

# Customizing the Connect Link [#customizing-the-connect-link]

The Connect Link is the hosted page your users see when connecting their accounts. By default it shows Composio branding.

To replace it with your own branding:

1. Go to **Project Settings** → [**Auth Screen**](https://dashboard.composio.dev/~/project/settings/auth-screen?utm_source=docs\&utm_medium=content\&utm_campaign=docs-white-labeling-authentication)
2. Upload your **Logo** and set your **App Title**

This applies to all Connect Link flows across all toolkits, for both [in-chat](/docs/authentication#in-chat-authentication) and [manual](/docs/manually-authenticating) authentication. Each project has one logo and app title, so if you need different branding per product, use separate projects.

> Customizing the Connect Link only changes the Composio-hosted page. For OAuth toolkits like Gmail, Google Sheets, GitHub, and Slack, users still see a consent screen saying "Composio wants to access your account." To change that, and to remove the "Secured by Composio" badge, set up your own OAuth app as described [below](#using-your-own-oauth-apps).

> **Troubleshooting**: * **"Secured by Composio" badge won't go away:** This badge is removed when you use your own OAuth app. See [Using your own OAuth apps](#using-your-own-oauth-apps).
  * **Logo doesn't appear after uploading:** Clear browser cache or try incognito.
  * **Upload fails with "failed to fetch":** Retry or use a smaller image.

# Using your own OAuth apps [#using-your-own-oauth-apps]

OAuth toolkits like Google and GitHub show a consent screen that says which app is requesting access. By default this reads "Composio wants to connect to your account." To show your app name instead, create a custom auth config with your own OAuth credentials and pass that auth config when creating a session.

> **You don't need this for every toolkit**: Only white-label toolkits where users see a consent screen (Google, GitHub, Slack, etc.). Toolkits that use API keys don't show consent screens, so there's nothing to white-label. You can mix and match freely.

- [Managed vs custom auth](/docs/custom-app-vs-managed-app): Decide when to use custom credentials, create an auth config, and pass it to sessions.

## Switching from Composio-managed to your own OAuth app [#switching-from-composio-managed-to-your-own-oauth-app]

Existing connected accounts are tied to the auth config they were created with. Switching to a custom auth config affects new connections for that toolkit; existing users keep using their current connected accounts until they re-authenticate or you import/migrate their credentials.

* To use the custom config for new connections, pass `authConfigs` when creating or updating the session.
* Existing connections continue refreshing with their original auth config.
* To fully migrate an existing user, delete the old connected account and have them re-authenticate with the new auth config, or import their credentials into the new config where supported.

# Routing the callback through your domain [#routing-the-callback-through-your-domain]

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

> For FAQs and setup guides for individual toolkits, browse the [toolkits page](/toolkits).

# Redirecting users after authentication [#redirecting-users-after-authentication]

By default, after OAuth completes, users land on a Composio-hosted success page that shows Composio branding. To bypass this page and send users to your own domain instead, pass a `callbackUrl` when calling `session.authorize()`:

**Python:**

```python
connection_request = session.authorize(
    "gmail",
    callback_url="https://your-app.com/callback"
)
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio({ apiKey: 'your_api_key' });
const session = await composio.create("user_123");
const connectionRequest = await session.authorize("gmail", {
  callbackUrl: "https://your-app.com/callback",
});
```

After authentication, Composio redirects the user to your callback URL instead of the default success page. For full details on the parameters appended to your callback URL, see [Manually authenticating users → Redirecting users after authentication](/docs/manually-authenticating#redirecting-users-after-authentication).

# Next [#next]

- [Managed vs custom auth](/docs/custom-app-vs-managed-app): Set up auth configs for OAuth apps, API keys, and toolkits without managed auth

---
