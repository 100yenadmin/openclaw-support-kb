---
type: openclaw_doc
title: "Directory"
source: "https://docs.openclaw.ai/cli/directory"
source_hash: "a7ebb220226312e3c5dadd31bd492741286e9ebbc6deebe0d2f49a3c8e67741d"
doc_path: "cli/directory.md"
original_doc_path: "cli/directory.md"
duplicate_index: 1
---

# Directory
Source: https://docs.openclaw.ai/cli/directory



# `openclaw directory`

Directory lookups for channels that support it (contacts/peers, groups, and "me").

## Common flags

* `--channel <name>`: channel id/alias (required when multiple channels are configured; auto when only one is configured)
* `--account <id>`: account id (default: channel default)
* `--json`: output JSON

## Notes

* `directory` is meant to help you find IDs you can paste into other commands (especially `openclaw message send --target ...`).
* For many channels, results are config-backed (allowlists / configured groups) rather than a live provider directory.
* Installed channel plugins can still omit directory support; in that case the command reports the unsupported directory operation instead of reinstalling the plugin.
* Default output is `id` (and sometimes `name`) separated by a tab; use `--json` for scripting.

## Using results with `message send`

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw directory peers list --channel slack --query "U0"
openclaw message send --channel slack --target user:U012ABCDEF --message "hello"
```

## ID formats (by channel)

* WhatsApp: `+15551234567` (DM), `1234567890-1234567890@g.us` (group), `120363123456789@newsletter` (Channel/Newsletter outbound target)
* Telegram: `@username` or numeric chat id; groups are numeric ids
* Slack: `user:U…` and `channel:C…`
* Discord: `user:<id>` and `channel:<id>`
* Matrix (plugin): `user:@user:server`, `room:!roomId:server`, or `#alias:server`
* Microsoft Teams (plugin): `user:<id>` and `conversation:<id>`
* Zalo (plugin): user id (Bot API)
* Zalo Personal / `zalouser` (plugin): thread id (DM/group) from `zca` (`me`, `friend list`, `group list`)

## Self ("me")

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw directory self --channel zalouser
```

## Peers (contacts/users)

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw directory peers list --channel zalouser
openclaw directory peers list --channel zalouser --query "name"
openclaw directory peers list --channel zalouser --limit 50
```

## Groups

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw directory groups list --channel zalouser
openclaw directory groups list --channel zalouser --query "work"
openclaw directory groups members --channel zalouser --group-id <id>
```

## Related

* [CLI reference](/cli)
