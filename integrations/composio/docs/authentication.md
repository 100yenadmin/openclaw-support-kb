---
type: composio_doc
title: "Authentication"
source: "https://docs.composio.dev/docs/authentication.md"
source_hash: "bf4c343556077edb3bcd2234450c09c3b936ea6e6e8bfdda80fc812ea7659e3c"
doc_path: "authentication.md"
original_doc_path: "authentication.md"
duplicate_index: 1
---

# Authentication (/docs/authentication)
Source: https://docs.composio.dev/docs/authentication.md


Composio simplifies authentication with Connect Links: hosted pages where users securely connect their accounts. There are two approaches. Choose based on where in your app users should authenticate.

# Which approach should I use?

* **Users chat with your agent?** Use [in-chat authentication](#in-chat-authentication). The agent handles connection prompts automatically, no setup needed.
* **Want users connected before they chat?** Use [manual authentication](#manual-authentication). Your app calls `session.authorize()` during onboarding or from a settings page.

Not sure? Start with in-chat. You can add manual auth later.

# In-chat authentication

By default, when a tool requires authentication, the agent prompts the user with a Connect Link. The user authenticates and confirms in chat. No setup needed. Just create a session and the agent handles OAuth flows, token refresh, and credential management automatically.

> **You:** Summarize my emails from today
>
> **Agent:** I need you to connect your Gmail account first. Please click here to authorize: [https://connect.composio.dev/link/ln\_abc123](https://connect.composio.dev/link/ln_abc123)
>
> **You:** Done
>
> **Agent:** Here's a summary of your emails from today...

- [In-chat authentication guide](/docs/authenticating-users/in-chat-authentication): 
Configuration, callback URLs, and full examples

# Manual authentication

Use `session.authorize()` to generate Connect Links programmatically when you want to control when and where users authenticate. Common use cases:

* **Onboarding**: connect accounts during signup before the user ever chats with the agent
* **Settings page**: let users manage their connections from a dedicated UI
* **Pre-flight checks**: verify all required connections are active before starting a task

- [Manual authentication guide](/docs/authenticating-users/manually-authenticating): 
`session.authorize()` API, callback URLs, and connection status checks

# How Composio manages authentication

Behind the scenes, Composio uses **auth configs** to manage authentication.

An **auth config** is a blueprint that defines how authentication works for a toolkit across all your users. It specifies:

* **Authentication method**: OAuth2, Bearer token, API key, or Basic Auth
* **Scopes**: what actions your tools can perform
* **Credentials**: your own app credentials or Composio's managed auth

Composio creates one auth config per toolkit, and it applies to every user who connects that toolkit. When a user authenticates, Composio creates a **connected account** that stores their credentials (OAuth tokens or API keys) and links them to your user ID. When you need to use your own OAuth credentials or customize scopes, you can create [custom auth configs](/docs/using-custom-auth-configuration).

```mermaid
graph LR
    AC["Auth Config<br/><b>ac_gmail_oauth2</b>"]

    subgraph user_1
        CA1["Work Gmail · <b>ca_1a2b3c</b>"]
        CA2["Personal Gmail · <b>ca_4d5e6f</b>"]
    end

    subgraph user_2
        CA3["Gmail · <b>ca_7g8h9i</b>"]
    end

    AC --> CA1
    AC --> CA2
    AC --> CA3
```

Composio handles this automatically:

1. When a toolkit needs authentication, we create an auth config using Composio managed credentials
2. The auth config is reused for all users authenticating with that toolkit
3. Connected accounts are created and linked to your users

**What are connected accounts?**

A connected account is created when a user authenticates with a toolkit. It stores the user's credentials (OAuth tokens or API keys) and links them to your user ID. Each user can have multiple connected accounts, even for the same toolkit (e.g., work and personal Gmail).

**What happens when tokens expire?**

Composio automatically refreshes OAuth tokens before they expire. You don't need to handle re-authentication or token expiration. Connected accounts stay valid as long as the user doesn't revoke access.

Most toolkits work out of the box with **Composio managed OAuth**. For API key-based toolkits, users enter their keys directly via Connect Link.

You only need to create a custom auth config when:

* You want to use your **own OAuth app credentials** for white-labeling
* You need **specific OAuth scopes** beyond the defaults
* The toolkit doesn't have Composio managed auth
* You have **existing auth configs** with connected accounts you want to use

To bring your own OAuth apps or customize scopes, see [custom auth configs](/docs/using-custom-auth-configuration).

# What to read next

- [Tools and toolkits](/docs/tools-and-toolkits): How meta tools discover, authenticate, and execute tools

- [In-chat authentication](/docs/authenticating-users/in-chat-authentication): Let the agent prompt users to authenticate during conversation

- [Manual authentication](/docs/authenticating-users/manually-authenticating): Generate Connect Links programmatically in your app

## Related guides

- [White-labeling](/docs/white-labeling-authentication): Customize OAuth screens with your branding

- [Custom auth configs](/docs/using-custom-auth-configuration): Use your own OAuth apps

---
