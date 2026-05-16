---
type: openclaw_doc
title: "TOOLS.md template"
source: "https://docs.openclaw.ai/reference/templates/TOOLS"
source_hash: "2c7d438cfbdb8b5a7e655779cdd08c111b46fa377c26b5f305dcd0842035908d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "reference/templates/tools.md"
original_doc_path: "reference/templates/tools.md"
duplicate_index: 1
---

# TOOLS.md template
Source: https://docs.openclaw.ai/reference/templates/TOOLS



# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

* Camera names and locations
* SSH hosts and aliases
* Preferred voices for TTS
* Speaker/room names
* Device nicknames
* Anything environment-specific

## Examples

```markdown theme={"theme":{"light":"min-light","dark":"min-dark"}}
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

***

Add whatever helps you do your job. This is your cheat sheet.

## Related

* [Agent workspace](/concepts/agent-workspace)
