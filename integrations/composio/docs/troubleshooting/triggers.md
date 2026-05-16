---
type: composio_doc
title: "Triggers"
source: "https://docs.composio.dev/docs/troubleshooting/triggers.md"
source_hash: "9603ec56c2ccaf6759dee6fe15fd2e99cb88098513a0eec2d753d33d84b56544"
system: "composio"
kb_namespace: "composio"
doc_path: "troubleshooting/triggers.md"
original_doc_path: "troubleshooting/triggers.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Triggers (/docs/troubleshooting/triggers)
Source: https://docs.composio.dev/docs/troubleshooting/triggers.md


# Unable to create trigger

Check the error message — the connected account might not have sufficient permissions or the required OAuth scopes. Ensure the user has authenticated with the necessary scopes for the trigger.

# Not receiving payloads

* **Polling triggers** (e.g., Gmail): These check for new events on an interval you configure. For Composio managed auth, intervals below 15 minutes are not supported.
* **Webhook URL**: Ensure your URL is publicly accessible and returns a `2xx` status code.
* **Trigger status**: Verify the trigger is enabled, not disabled.
* **Logs**: Check the [trigger logs](https://platform.composio.dev?next_page=/logs/triggers) in the dashboard for delivery attempts and errors.

# Type errors with trigger payloads

Use `getType()` / `get_type()` to inspect the exact payload schema for a trigger type. This shows you the fields and types you should expect.

# Reporting issues

When contacting support, include:

* **Trigger ID** and **connected account ID** — find these under Active Triggers in the dashboard:

![Trigger ID and connected account ID in the dashboard](/images/troubleshooting/troubleshooting-trigger-id.png)

* **Error message** and **reproduction steps**

# Getting help

* **Email**: [support@composio.dev](mailto:support@composio.dev)
* **Discord**: [#support-form](https://discord.com/channels/1170785031560646836/1268871288156323901)

---
