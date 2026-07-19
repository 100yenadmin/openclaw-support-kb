---
type: openclaw_doc
title: "Twitch"
source: "https://docs.openclaw.ai/channels/twitch"
source_hash: "065f88f34b6bdc2cead0dcc5473cbcb64e1682962e3d0b568d4f88035e754b23"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "channels/twitch.md"
original_doc_path: "channels/twitch.md"
duplicate_index: 1
---

# Twitch
Source: https://docs.openclaw.ai/channels/twitch

Twitch chat support over Twitch's chat (IRC) interface via the Twurple client. OpenClaw signs in as a Twitch bot account, joins one channel per configured account, and replies in that channel.

## Install

Twitch ships as an official plugin; it is not part of the core install.

Tabs


npm registry

    ```bash
    openclaw plugins install @openclaw/twitch
    ```


Local checkout

    ```bash
    openclaw plugins install ./path/to/local/twitch-plugin
    ```


`plugins install` registers and enables the plugin. Picking Twitch during `openclaw onboard` or `openclaw channels add` installs it on demand. Use the bare package name to follow the current release; pin an exact version only for reproducible installs. Requires OpenClaw 2026.4.10 or newer.

Details: [Plugins](/tools/plugin)

## Quick setup

Steps


Install the plugin

    See [Install](#install) above.


Create a Twitch bot account

    Create a dedicated Twitch account for the bot (or use an existing account).


Generate credentials

    Use [Twitch Token Generator](https://twitchtokengenerator.com/):

    - Select **Bot Token**
    - Verify scopes `chat:read` and `chat:write` are selected
    - Copy the **Client ID** and **Access Token**



Find your Twitch user ID

    Use [https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/](https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/) to convert a username to a Twitch user ID.


Configure the token

    - Env: `OPENCLAW_TWITCH_ACCESS_TOKEN=...` (default account only)
    - Or config: `channels.twitch.accessToken`

    If both are set, config takes precedence (the env var is only a fallback for the default account).



Start the gateway

    ```bash
    openclaw gateway run
    ```


Warning

Add access control (`allowFrom` or `allowedRoles`) to prevent unauthorized users from triggering the bot. `requireMention` defaults to `true`.

Minimal config:

```json5
{
  channels: {
    twitch: {
      enabled: true,
      username: "openclaw", // Bot's Twitch account (authenticates)
      accessToken: "oauth:abc123...", // OAuth access token (or use OPENCLAW_TWITCH_ACCESS_TOKEN env var)
      clientId: "xyz789...", // Client ID from Token Generator
      channel: "yourchannel", // Which Twitch channel's chat to join (required)
      allowFrom: ["123456789"], // (recommended) Your Twitch user ID only
    },
  },
}
```

## What it is

- A Twitch channel owned by the Gateway.
- Deterministic routing: replies always go back to the Twitch channel the message came from.
- Each joined channel maps to an isolated group session key `agent:<agentId>:twitch:group:<channel>`.
- `username` is the bot's account (who authenticates), `channel` is which chat room to join. One account entry joins exactly one channel.
- Tokens work with or without the `oauth:` prefix; OpenClaw normalizes both ways (the setup wizard expects the `oauth:` form).

## Inbound durability

OpenClaw durably queues each accepted Twitch chat message before normal dispatch. Pending or retryable messages survive a Gateway restart, stay serialized for the configured channel, and use Twitch's message ID to suppress duplicate queue entries while the active or retained completion record exists.

Twitch chat does not replay a `PRIVMSG` after the client has accepted it. This protects the local accept-to-dispatch crash window, but it cannot recover messages missed before durable admission. If the queue append itself fails, OpenClaw logs the failure; reconnecting does not ask Twitch to resend that message.

## Token refresh (optional)

Tokens from [Twitch Token Generator](https://twitchtokengenerator.com/) cannot be refreshed by OpenClaw - regenerate when expired (they last a few hours; no app registration needed).

For automatic refresh, create your own app at the [Twitch Developer Console](https://dev.twitch.tv/console) and add:

```json5
{
  channels: {
    twitch: {
      clientSecret: "your_client_secret",
      refreshToken: "your_refresh_token",
    },
  },
}
```

With both set, the plugin uses a refreshing auth provider that renews tokens before expiration and logs each refresh. Without `refreshToken` it logs `token refresh disabled (no refresh token)`; without `clientSecret` it falls back to a static (non-refreshing) token.

## Multi-account support

Use `channels.twitch.accounts` with per-account credentials. See [Configuration](/gateway/configuration) for the shared pattern.

Example (one bot account in two channels):

```json5
{
  channels: {
    twitch: {
      accounts: {
        channel1: {
          username: "openclaw",
          accessToken: "oauth:abc123...",
          clientId: "xyz789...",
          channel: "yourchannel",
        },
        channel2: {
          username: "openclaw",
          accessToken: "oauth:def456...",
          clientId: "uvw012...",
          channel: "secondchannel",
        },
      },
    },
  },
}
```

Note

Every account entry needs its own `accessToken` (the env var covers only the default account). An account joins exactly one channel, so joining two channels means two accounts. `channels.twitch.defaultAccount` picks which account is the default.

## Access control

`allowFrom` is a hard allowlist of Twitch user IDs. When it is set, `allowedRoles` is ignored; leave `allowFrom` unset to use role-based access instead.

**Available roles:** `"moderator"`, `"owner"`, `"vip"`, `"subscriber"`, `"all"`.

Tabs


User ID allowlist (most secure)

    ```json5
    {
      channels: {
        twitch: {
          accounts: {
            default: {
              allowFrom: ["123456789", "987654321"],
            },
          },
        },
      },
    }
    ```


Role-based

    ```json5
    {
      channels: {
        twitch: {
          accounts: {
            default: {
              allowedRoles: ["moderator", "vip"],
            },
          },
        },
      },
    }
    ```


Disable @mention requirement

    By default, `requireMention` is `true`. To respond to all allowed messages:

    ```json5
    {
      channels: {
        twitch: {
          accounts: {
            default: {
              requireMention: false,
            },
          },
        },
      },
    }
    ```



Note

**Why user IDs?** Usernames can change, allowing impersonation. User IDs are permanent.

Find yours with the [username to ID converter](https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/).

## Troubleshooting

First, run diagnostic commands:

```bash
openclaw doctor
openclaw channels status --probe
```

AccordionGroup


Bot does not respond to messages

    - **Check access control:** Ensure your user ID is in `allowFrom`, or temporarily remove `allowFrom` and set `allowedRoles: ["all"]` to test.
    - **Check the mention gate:** With `requireMention: true` (default), messages must @mention the bot username.
    - **Check the bot is in the channel:** The bot only joins the channel named in `channel`.



Token issues

    "Failed to connect" or authentication errors:

    - Verify `accessToken` is the OAuth access token value (the `oauth:` prefix is optional)
    - Check the token has `chat:read` and `chat:write` scopes
    - If using token refresh, verify `clientSecret` and `refreshToken` are set



Token refresh not working

    Check logs for refresh events:

    ```text
    Using env token source for mybot
    Access token refreshed for user 123456 (expires in 14400s)
    ```

    If you see `token refresh disabled (no refresh token)`:

    - Ensure `clientSecret` is provided
    - Ensure `refreshToken` is provided



## Config

### Account config

ParamField

  Bot username (the authenticating account).

ParamField

  OAuth access token with `chat:read` and `chat:write` (config or env for the default account).

ParamField

  Twitch Client ID (from Token Generator or your app). Optional in the schema but required to connect.

ParamField

  Channel to join.

ParamField

  Enable this account.

ParamField

  Optional: for automatic token refresh.

ParamField

  Optional: for automatic token refresh.

ParamField

  Token expiry in seconds (refresh tracking).

ParamField

  Timestamp when the token was obtained (refresh tracking).

ParamField

  User ID allowlist. When set, roles are ignored.

ParamField
'>
  Role-based access control.

ParamField

  Require @mention to trigger the bot.

ParamField

  Outbound response prefix override for this account.

### Provider options

- `channels.twitch.enabled` - Enable/disable channel startup
- `channels.twitch.username` / `accessToken` / `clientId` / `channel` - Simplified single-account config (implicit `default` account; takes precedence over `accounts.default`)
- `channels.twitch.accounts.<accountName>` - Multi-account config (all account fields above)
- `channels.twitch.defaultAccount` - Which account name is the default
- `channels.twitch.markdown.tables` - Markdown table rendering mode (`off` | `bullets` | `code` | `block`)

Full example:

```json5
{
  channels: {
    twitch: {
      enabled: true,
      username: "openclaw",
      accessToken: "oauth:abc123...",
      clientId: "xyz789...",
      channel: "yourchannel",
      clientSecret: "secret123...",
      refreshToken: "refresh456...",
      allowFrom: ["123456789"],
      accounts: {
        second: {
          username: "mybot",
          accessToken: "oauth:def456...",
          clientId: "uvw012...",
          channel: "your_channel",
          enabled: true,
          expiresIn: 14400,
          obtainmentTimestamp: 1706092800000,
          allowedRoles: ["moderator"],
        },
      },
    },
  },
}
```

## Tool actions

The agent can send Twitch messages through the message tool `send` action:

```json5
{
  channel: "twitch",
  action: "send",
  to: "#mychannel",
  message: "Hello Twitch!",
}
```

`to` is optional and defaults to the account's configured `channel`.

## Safety and ops

- **Treat tokens like passwords** - never commit tokens to git.
- **Use automatic token refresh** for long-running bots.
- **Use user ID allowlists** instead of usernames for access control.
- **Monitor logs** for token refresh events and connection status.
- **Scope tokens minimally** - only request `chat:read` and `chat:write`.
- **If stuck**: restart the gateway after confirming no other process owns the session.

## Limits

- **500 characters** per message; longer replies are chunked at word boundaries.
- Markdown is stripped before sending (Twitch chat is plain text; newlines become spaces).
- OpenClaw adds no rate limiting of its own; the Twurple chat client handles Twitch rate limits.

## Related

- [Channel Routing](/channels/channel-routing) — session routing for messages
- [Channels Overview](/channels) — all supported channels
- [Groups](/channels/groups) — group chat behavior and mention gating
- [Pairing](/channels/pairing) — DM authentication and pairing flow
- [Security](/gateway/security) — access model and hardening

---
