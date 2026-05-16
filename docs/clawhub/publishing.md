---
type: openclaw_doc
title: "Publishing"
source: "https://docs.openclaw.ai/clawhub/publishing"
source_hash: "0cb14b6bf4a092a3f0e1bc63f41781ae7bafb84e3728db6630fc94b8b7b4f39d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "clawhub/publishing.md"
original_doc_path: "clawhub/publishing.md"
duplicate_index: 1
---

# Publishing
Source: https://docs.openclaw.ai/clawhub/publishing



# Publishing

ClawHub publishing is owner-scoped: every publish targets a publisher, and the
server decides whether the signed-in user is allowed to publish there.

## Owners

An owner is a ClawHub publisher handle, such as `@alice` or `@openclaw`.
Personal owners are created for users. Org owners can have multiple members.

When you publish, you either use your personal owner or choose an org owner
where you have publisher access.

## Skills

Skills are published from a skill folder. The public page is:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
https://clawhub.ai/<owner>/<slug>
```

Example:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
https://clawhub.ai/alice/review-helper
```

The publish request includes the selected owner, slug, version, changelog, and
files. The server verifies that the actor can publish as that owner before it
creates the release.

To move an existing skill to another owner while publishing a new version, choose
the new owner and explicitly confirm the ownership move. In the CLI/API, pass the
target owner plus the migration opt-in:

```sh theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub skill publish ./review-helper --owner openclaw --migrate-owner --version 1.2.0
```

Skill owner migration requires admin or owner access on both the current owner
and the destination owner. It preserves the skill, version history, stats,
comments, forks, aliases, and audit trail; old owner URLs continue through the
alias/redirect path.

## Plugins

Plugins use npm-style package names. Scoped package names include the owner in
the first part of the name:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
@owner/package-name
```

The scope must match the selected publish owner. If your package is named
`@openclaw/dronzer`, it can only be published as `@openclaw`. If you publish as
`@vintageayu`, rename the package to `@vintageayu/dronzer`.

This prevents a package from claiming an org namespace that the publisher does
not control.

## Release Flow

1. The UI, CLI, or GitHub workflow gathers package metadata and files.
2. The publish request is sent to ClawHub with the selected owner.
3. The server validates owner permissions, package scope, package name, version,
   file limits, and source metadata.
4. ClawHub stores the release and starts automated security checks.
5. New releases are hidden from normal install/download surfaces until review
   and verification finish.

If validation fails, the release is not created.

## FAQ

### Package scope must match selected owner

If the package scope and selected owner do not match, ClawHub rejects the
publish:

```text theme={"theme":{"light":"min-light","dark":"min-dark"}}
Package scope "@openclaw" must match selected owner "@vintageayu".
Publish as "@openclaw" or rename this package to "@vintageayu/dronzer".
```

To fix it, either choose the owner named by the package scope, or rename the
package so the scope matches the owner you can publish as.

If the package name already has the right scope but the package is owned by the
wrong publisher, transfer ownership instead:

```sh theme={"theme":{"light":"min-light","dark":"min-dark"}}
clawhub package transfer @opik/opik-openclaw --to opik
```

Use package or skill transfer only when you have admin access to both the
current owner and the destination publisher. Package transfer does not let you
publish into a scope you cannot manage.

This protects org namespaces. A package named `@openclaw/dronzer` claims the
`@openclaw` namespace, so only publishers with access to the `@openclaw` owner
can publish it.
