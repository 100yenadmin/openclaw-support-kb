---
type: composio_doc
title: "Security"
source: "https://docs.composio.dev/docs/security/overview.md"
source_hash: "6315ba434c7cdd834e48b85427933431cd0febf43eeacb4f885887d4177f570f"
system: "composio"
kb_namespace: "composio"
doc_path: "security/overview.md"
original_doc_path: "security/overview.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Security (/docs/security/overview)
Source: https://docs.composio.dev/docs/security/overview.md


Composio is built with security at its core. We use least-privilege defaults, isolate every organization and project, encrypt credentials, and give you controls over what we store.

## Compliance and the Trust Center [#compliance-and-the-trust-center]

Composio is SOC 2 Type II compliant. For our latest reports and certifications (the SOC 2 Type II report, our sub-processor list, and more), visit the [Composio Trust Center](https://trust.composio.dev).

## Isolation and access control [#isolation-and-access-control]

* Organizations and projects isolate your resources. Data from one project is not visible to another.
* API keys are scoped, support per-key IP allowlisting, and can opt in to capabilities such as Proxy Execute at creation.
* Multi-factor authentication (MFA) is available for Dashboard sign-in and can be enforced by an organization admin.

## Credential protection [#credential-protection]

* Connected-account credentials, auth configs, and API keys are encrypted at rest using AES-256-GCM, and all traffic is encrypted in transit using TLS.
* Connected-account tokens are redacted by default in API responses, for both Composio-managed and custom auth configs. To act on a provider directly, use [Proxy Execute](/docs/extending-sessions/proxy-execute).
* Webhook deliveries are signed; verify the `webhook-signature` header when handling trigger events. For custom OAuth webhook setup, see [Custom OAuth webhooks](/docs/setting-up-triggers/custom-oauth-webhooks).

## Your responsibilities [#your-responsibilities]

Composio executes the tools and connections you configure. You control which toolkits are enabled, which accounts are connected, and what your agents are allowed to do. Review the access you grant, and treat connected-account scopes as you would any production credential.

## Reporting a vulnerability [#reporting-a-vulnerability]

To report a security issue, contact `security@composio.dev`. Please do not disclose vulnerabilities publicly until we have addressed them.

## Related resources [#related-resources]

* [Data retention](/docs/security/data-retention): what we store, for how long, and how to stop storing payloads.
* [Composio Trust Center](https://trust.composio.dev): security certifications and compliance.

---
