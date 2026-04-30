---
type: openclaw_doc
title: "Device model database"
source: "https://docs.openclaw.ai/reference/device-models"
source_hash: "84e02d7aef5e8f83e000ac52c417c327f344fb8798352fb3041a1edc6463fcde"
generated_at: "2026-04-30T12:30:37.668Z"
doc_path: "reference/device-models.md"
original_doc_path: "reference/device-models.md"
duplicate_index: 1
---

# Device model database
Source: https://docs.openclaw.ai/reference/device-models



The macOS companion app shows friendly Apple device model names in the **Instances** UI by mapping Apple model identifiers (e.g. `iPad16,6`, `Mac16,6`) to human-readable names.

The mapping is vendored as JSON under:

* `apps/macos/Sources/OpenClaw/Resources/DeviceModels/`

## Data source

We currently vendor the mapping from the MIT-licensed repository:

* `kyle-seongwoo-jun/apple-device-identifiers`

To keep builds deterministic, the JSON files are pinned to specific upstream commits (recorded in `apps/macos/Sources/OpenClaw/Resources/DeviceModels/NOTICE.md`).

## Updating the database

1. Pick the upstream commits you want to pin to (one for iOS, one for macOS).
2. Update the commit hashes in `apps/macos/Sources/OpenClaw/Resources/DeviceModels/NOTICE.md`.
3. Re-download the JSON files, pinned to those commits:

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
IOS_COMMIT="<commit sha for ios-device-identifiers.json>"
MAC_COMMIT="<commit sha for mac-device-identifiers.json>"

curl -fsSL "https://raw.githubusercontent.com/kyle-seongwoo-jun/apple-device-identifiers/${IOS_COMMIT}/ios-device-identifiers.json" \
  -o apps/macos/Sources/OpenClaw/Resources/DeviceModels/ios-device-identifiers.json

curl -fsSL "https://raw.githubusercontent.com/kyle-seongwoo-jun/apple-device-identifiers/${MAC_COMMIT}/mac-device-identifiers.json" \
  -o apps/macos/Sources/OpenClaw/Resources/DeviceModels/mac-device-identifiers.json
```

4. Ensure `apps/macos/Sources/OpenClaw/Resources/DeviceModels/LICENSE.apple-device-identifiers.txt` still matches upstream (replace it if the upstream license changes).
5. Verify the macOS app builds cleanly (no warnings):

```bash theme={"theme":{"light":"min-light","dark":"min-dark"}}
swift build --package-path apps/macos
```

## Related

* [Nodes](/nodes)
* [Node troubleshooting](/nodes/troubleshooting)
