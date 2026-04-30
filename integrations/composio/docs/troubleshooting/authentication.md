---
type: composio_doc
title: "Authentication"
source: "https://docs.composio.dev/docs/troubleshooting/authentication.md"
source_hash: "f19e00de3835eb02cd7defac3a88299f46e5c9b61d9d93dcd831ef76c781c528"
doc_path: "troubleshooting/authentication.md"
original_doc_path: "troubleshooting/authentication.md"
duplicate_index: 1
---

# Authentication (/docs/troubleshooting/authentication)
Source: https://docs.composio.dev/docs/troubleshooting/authentication.md


# Using Composio's default OAuth app

When using our default OAuth configuration:

* **Don't add additional scopes** - They may not be approved in our OAuth app
* Use only the pre-configured scopes provided

# Using custom OAuth apps

Ensure your OAuth app is configured correctly:

* **Redirect URL**: Must match exactly what's configured in your OAuth provider
* **Scopes**: Auth config scopes must match your OAuth app configuration
* **Credentials**: Verify client ID and secret are correct

For setup guides by toolkit: [OAuth Configuration Guides](https://composio.dev/oauth)

# Switching to a custom OAuth app

If you're moving from Composio-managed auth to your own OAuth app, existing connections are not affected. New connections will use your custom auth config. To fully migrate users, delete their old connected accounts and have them re-authenticate.

* **Sessions:** Pass `authConfigs` when calling `composio.create()`. See [Switching auth configs (sessions)](/docs/white-labeling-authentication#switching-from-composio-managed-to-your-own-oauth-app).
* **Direct tool execution:** Pass the new `authConfigId` when calling `initiate()`. See [Switching auth configs (direct)](/docs/auth-configuration/white-labeling#switching-from-composio-managed-to-your-own-oauth-app).

# Common authentication issues

* **Invalid redirect URI**: Check the callback URL matches exactly
* **Scope mismatch**: Ensure requested scopes are configured in both auth config and OAuth app
* **Expired tokens**: Try refreshing the connection
* **Rate limits**: Some providers limit authentication attempts
* **Credentials showing as `REDACTED`**: The "Mask Connected Account Secrets" setting is enabled on your account, which redacts all sensitive credential data. Navigate to **Settings → Project Settings → Project Configuration** and disable "Mask Connected Account Secrets" to view actual values

# Reporting authentication issues

When reporting to support, provide:

* **Error message**: Complete error details and screenshots. For example:

![Example: This app is blocked error screen shown by Google when un-verified sensitive scopes are configured](/images/troubleshooting/troubleshooting-auth-app-blocked.png)

* **Auth config and account IDs**: Include the `authConfigId` used for the request and, if a connection already exists, the `connected_account_id`

![Finding authConfigId and connected account ID in the Composio dashboard](/images/troubleshooting/troubleshooting-auth-config-id.png)

* **OAuth provider**: Which service you're trying to connect

# Getting help

* **Email**: [support@composio.dev](mailto:support@composio.dev)
* **Discord**: [#support-form](https://discord.com/channels/1170785031560646836/1268871288156323901)

---
