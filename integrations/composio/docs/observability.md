---
type: composio_doc
title: "Observability"
source: "https://docs.composio.dev/docs/observability.md"
source_hash: "b9a20e58faf366841c45c950550b28f4f439ba4fb676b4a47bf514abbce226d6"
system: "composio"
kb_namespace: "composio"
doc_path: "observability.md"
original_doc_path: "observability.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Observability (/docs/observability)
Source: https://docs.composio.dev/docs/observability.md


Composio exposes two v3.1 REST APIs for inspecting activity in your org or project: a **Logs API** for individual tool execution events and a **Usage API** for aggregated counts. Use this page to figure out which one to call.

# Which API should I use?

| I want to...                                               | Use                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------ |
| Debug a specific tool execution (payloads, errors, timing) | [Tool execution logs](/docs/observability/logs)        |
| See how many tool calls or sessions happened in a window   | [Usage summary](/docs/observability/usage#summary)     |
| Break usage down by tool, toolkit, user, or session        | [Usage breakdown](/docs/observability/usage#breakdown) |

Logs record **individual events** and are primarily for debugging. Usage queries return **aggregated counts** and are primarily for dashboards, billing integrations, and customer-facing analytics.

# Authentication at a glance

Each endpoint family takes a specific credential. Use the right one for the scope you need.

| Endpoints                                                                                | Header                            | Scope                    |
| ---------------------------------------------------------------------------------------- | --------------------------------- | ------------------------ |
| `POST /api/v3.1/org/usage/summary`<br />`POST /api/v3.1/org/usage/{entity_type}`         | `x-org-api-key` *(or org JWT)*    | All projects in your org |
| `POST /api/v3.1/project/usage/summary`<br />`POST /api/v3.1/project/usage/{entity_type}` | `x-api-key` *(or session cookie)* | Single project           |
| `POST /api/v3.1/logs/tool_execution`<br />`GET /api/v3.1/logs/tool_execution/{id}`       | `x-api-key` *(or session cookie)* | Single project           |

The org-level usage endpoints accept a `project_id` filter so you can slice by project without rotating keys.

# Reference

* [Organization API reference](/reference/api-reference/organization) — org-level usage endpoints
* [Projects API reference](/reference/api-reference/projects) — project-level usage endpoints and project-scoped APIs

---
