---
type: openclaw_doc
title: "apply_patch tool"
source: "https://docs.openclaw.ai/tools/apply-patch"
source_hash: "9a3504ce80433b7f1c844e204595c819fb0a05f62c7a61e97d222c9b80448dd0"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "tools/apply-patch.md"
original_doc_path: "tools/apply-patch.md"
duplicate_index: 1
---

# apply_patch tool
Source: https://docs.openclaw.ai/tools/apply-patch



Apply file changes using a structured patch format. This is ideal for multi-file
or multi-hunk edits where a single `edit` call would be brittle.

The tool accepts a single `input` string that wraps one or more file operations:

```
*** Begin Patch
*** Add File: path/to/file.txt
+line 1
+line 2
*** Update File: src/app.ts
@@
-old line
+new line
*** Delete File: obsolete.txt
*** End Patch
```

## Parameters

* `input` (required): Full patch contents including `*** Begin Patch` and `*** End Patch`.

## Notes

* Patch paths support relative paths (from the workspace directory) and absolute paths.
* `tools.exec.applyPatch.workspaceOnly` defaults to `true` (workspace-contained). Set it to `false` only if you intentionally want `apply_patch` to write/delete outside the workspace directory.
* Use `*** Move to:` within an `*** Update File:` hunk to rename files.
* `*** End of File` marks an EOF-only insert when needed.
* Available by default for OpenAI and OpenAI Codex models. Set
  `tools.exec.applyPatch.enabled: false` to disable it.
* Optionally gate by model via
  `tools.exec.applyPatch.allowModels`.
* Config is only under `tools.exec`.

## Example

```json theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  "tool": "apply_patch",
  "input": "*** Begin Patch\n*** Update File: src/index.ts\n@@\n-const foo = 1\n+const foo = 2\n*** End Patch"
}
```

## Related

<CardGroup>
  <Card title="Diffs" href="/tools/diffs" icon="code-compare">
    Read-only diff viewer for change presentation.
  </Card>

  <Card title="Exec tool" href="/tools/exec" icon="terminal">
    Shell command execution from the agent.
  </Card>

  <Card title="Code execution" href="/tools/code-execution" icon="square-code">
    Sandboxed remote Python analysis with xAI.
  </Card>
</CardGroup>
