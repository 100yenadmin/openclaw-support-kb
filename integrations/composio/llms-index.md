---
type: composio_docs_index
title: "Composio Documentation Index"
source: "https://docs.composio.dev/llms.txt"
source_hash: "dc0568d1bf101ba323b77a1d6209a8e831862e75a1bd32abdd04a64f5e2826ed"
---

# Composio Documentation

> Composio powers 1000+ toolkits, tool search, context management, authentication, and a sandboxed workbench to help you build AI agents that turn intent into action.

> **For AI agents:** Composio supports two integration modes. **Native Tools:** use `composio.create(user_id)` + `session.tools()` with a provider package (e.g. `composio_openai`, `@composio/openai`). **MCP:** use `composio.create(user_id)` + `session.mcp.url` with any MCP-compatible client — no provider package needed. See any page's .md endpoint for full usage instructions.

## Get Started

- https://docs.composio.dev/docs.md
- https://docs.composio.dev/docs/quickstart.md

### Providers

- https://docs.composio.dev/docs/providers.md
- https://docs.composio.dev/docs/providers/claude-agent-sdk.md
- https://docs.composio.dev/docs/providers/anthropic.md
- https://docs.composio.dev/docs/providers/openai-agents.md
- https://docs.composio.dev/docs/providers/openai.md
- https://docs.composio.dev/docs/providers/autogen.md
- https://docs.composio.dev/docs/providers/crewai.md
- https://docs.composio.dev/docs/providers/google.md
- https://docs.composio.dev/docs/providers/google-adk.md
- https://docs.composio.dev/docs/providers/langchain.md
- https://docs.composio.dev/docs/providers/langgraph.md
- https://docs.composio.dev/docs/providers/llamaindex.md
- https://docs.composio.dev/docs/providers/mastra.md
- https://docs.composio.dev/docs/providers/vercel.md

#### Custom Providers

- https://docs.composio.dev/docs/providers/custom-providers.md
- https://docs.composio.dev/docs/providers/custom-providers/typescript.md
- https://docs.composio.dev/docs/providers/custom-providers/python.md
- https://docs.composio.dev/docs/cli.md

## Core Concepts

- https://docs.composio.dev/docs/how-composio-works.md
- https://docs.composio.dev/docs/users-and-sessions.md
- https://docs.composio.dev/docs/authentication.md
- https://docs.composio.dev/docs/tools-and-toolkits.md
- https://docs.composio.dev/docs/workbench.md
- https://docs.composio.dev/docs/triggers.md

## Getting Started

- https://docs.composio.dev/docs/configuring-sessions.md

### Authenticating users

- https://docs.composio.dev/docs/authenticating-users/in-chat-authentication.md
- https://docs.composio.dev/docs/authenticating-users/manually-authenticating.md

### Toolkits

- https://docs.composio.dev/docs/toolkits/fetching-tools-and-toolkits.md
- https://docs.composio.dev/docs/toolkits/enable-and-disable-toolkits.md
- https://docs.composio.dev/docs/toolkits/custom-tools-and-toolkits.md

### Using Triggers

- https://docs.composio.dev/docs/setting-up-triggers/creating-triggers.md
- https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events.md
- https://docs.composio.dev/docs/setting-up-triggers/managing-triggers.md

## Guides

- https://docs.composio.dev/docs/white-labeling-authentication.md
- https://docs.composio.dev/docs/managing-multiple-connected-accounts.md
- https://docs.composio.dev/docs/using-custom-auth-configuration.md
- https://docs.composio.dev/docs/importing-existing-connections.md
- https://docs.composio.dev/docs/webhook-verification.md
- https://docs.composio.dev/docs/subscribing-to-connection-expiry-events.md
- https://docs.composio.dev/docs/custom-app-vs-managed-app.md
- https://docs.composio.dev/docs/native-tools-vs-mcp.md
- https://docs.composio.dev/docs/sessions-vs-direct-execution.md
- https://docs.composio.dev/docs/proxy-execute.md

## Features

- https://docs.composio.dev/docs/projects.md

### Observability

- https://docs.composio.dev/docs/observability.md
- https://docs.composio.dev/docs/observability/logs.md
- https://docs.composio.dev/docs/observability/usage.md
- https://docs.composio.dev/docs/single-toolkit-mcp.md

## Direct Tool Execution Guides

### Tools

- https://docs.composio.dev/docs/tools-direct/fetching-tools.md
- https://docs.composio.dev/docs/tools-direct/authenticating-tools.md
- https://docs.composio.dev/docs/tools-direct/executing-tools.md

#### Modify tool behavior

- https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/schema-modifiers.md
- https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/before-execution-modifiers.md
- https://docs.composio.dev/docs/tools-direct/modify-tool-behavior/after-execution-modifiers.md
- https://docs.composio.dev/docs/tools-direct/custom-tools.md
- https://docs.composio.dev/docs/tools-direct/toolkit-versioning.md

### Authentication

- https://docs.composio.dev/docs/auth-configuration/custom-auth-configs.md
- https://docs.composio.dev/docs/auth-configuration/white-labeling.md
- https://docs.composio.dev/docs/auth-configuration/programmatic-auth-configs.md
- https://docs.composio.dev/docs/auth-configuration/custom-auth-params.md
- https://docs.composio.dev/docs/auth-configuration/connected-accounts.md

## Resources

- https://docs.composio.dev/docs/signing-up-as-an-agent.md
- https://docs.composio.dev/docs/common-faq.md
- https://docs.composio.dev/docs/glossary.md
- https://docs.composio.dev/docs/debugging-info.md

### Migration Guide

- https://docs.composio.dev/docs/migration-guide.md
- https://docs.composio.dev/docs/migration-guide/direct-to-sessions.md
- https://docs.composio.dev/docs/migration-guide/tool-router-beta.md
- https://docs.composio.dev/docs/migration-guide/toolkit-versioning.md
- https://docs.composio.dev/docs/migration-guide/new-sdk.md

### Troubleshooting

- https://docs.composio.dev/docs/troubleshooting.md
- https://docs.composio.dev/docs/troubleshooting/api.md
- https://docs.composio.dev/docs/troubleshooting/authentication.md
- https://docs.composio.dev/docs/troubleshooting/cli.md
- https://docs.composio.dev/docs/troubleshooting/dashboard.md
- https://docs.composio.dev/docs/troubleshooting/mcp.md
- https://docs.composio.dev/docs/troubleshooting/sdks.md
- https://docs.composio.dev/docs/troubleshooting/tools.md
- https://docs.composio.dev/docs/troubleshooting/triggers.md

## Cookbooks

- https://docs.composio.dev/cookbooks/app-connections-dashboard.md
- https://docs.composio.dev/cookbooks/background-agent.md
- https://docs.composio.dev/cookbooks/chat-app.md
- https://docs.composio.dev/cookbooks/fast-api.md
- https://docs.composio.dev/cookbooks/gmail-labeler.md
- https://docs.composio.dev/cookbooks/hono.md
- https://docs.composio.dev/cookbooks.md
- https://docs.composio.dev/cookbooks/pr-review-agent.md
- https://docs.composio.dev/cookbooks/slack-summariser.md
- https://docs.composio.dev/cookbooks/supabase-sql-agent.md
- https://docs.composio.dev/cookbooks/support-agent.md
- https://docs.composio.dev/cookbooks/templates.md
- https://docs.composio.dev/cookbooks/tool-generator.md
- https://docs.composio.dev/cookbooks/workplace-search.md

## API Reference

- https://docs.composio.dev/reference/authentication.md
- https://docs.composio.dev/reference/errors.md
- https://docs.composio.dev/reference.md
- https://docs.composio.dev/reference/rate-limits.md
- https://docs.composio.dev/reference/meta-tools/get_tool_schemas.md
- https://docs.composio.dev/reference/meta-tools.md
- https://docs.composio.dev/reference/meta-tools/manage_connections.md
- https://docs.composio.dev/reference/meta-tools/multi_execute_tool.md
- https://docs.composio.dev/reference/meta-tools/remote_bash_tool.md
- https://docs.composio.dev/reference/meta-tools/remote_workbench.md
- https://docs.composio.dev/reference/meta-tools/search_tools.md
- https://docs.composio.dev/reference/v3/authentication.md
- https://docs.composio.dev/reference/v3/errors.md
- https://docs.composio.dev/reference/v3.md
- https://docs.composio.dev/reference/v3/rate-limits.md
- https://docs.composio.dev/reference/api-reference/auth-configs.md
- https://docs.composio.dev/reference/api-reference/authentication.md
- https://docs.composio.dev/reference/api-reference/connected-accounts.md
- https://docs.composio.dev/reference/api-reference/files.md
- https://docs.composio.dev/reference/api-reference/mcp.md
- https://docs.composio.dev/reference/api-reference/migration.md
- https://docs.composio.dev/reference/api-reference/organization.md
- https://docs.composio.dev/reference/api-reference/projects.md
- https://docs.composio.dev/reference/api-reference/tool-router.md
- https://docs.composio.dev/reference/api-reference/toolkits.md
- https://docs.composio.dev/reference/api-reference/tools.md
- https://docs.composio.dev/reference/api-reference/triggers.md
- https://docs.composio.dev/reference/api-reference/webhooks.md
- https://docs.composio.dev/reference/sdk-reference/python/auth-configs.md
- https://docs.composio.dev/reference/sdk-reference/python/composio.md
- https://docs.composio.dev/reference/sdk-reference/python/connected-accounts.md
- https://docs.composio.dev/reference/sdk-reference/python.md
- https://docs.composio.dev/reference/sdk-reference/python/mcp.md
- https://docs.composio.dev/reference/sdk-reference/python/session-context-impl.md
- https://docs.composio.dev/reference/sdk-reference/python/tool-router-session.md
- https://docs.composio.dev/reference/sdk-reference/python/toolkits.md
- https://docs.composio.dev/reference/sdk-reference/python/tools.md
- https://docs.composio.dev/reference/sdk-reference/python/triggers.md
- https://docs.composio.dev/reference/sdk-reference/typescript/auth-configs.md
- https://docs.composio.dev/reference/sdk-reference/typescript/composio.md
- https://docs.composio.dev/reference/sdk-reference/typescript/connected-accounts.md
- https://docs.composio.dev/reference/sdk-reference/typescript.md
- https://docs.composio.dev/reference/sdk-reference/typescript/mcp.md
- https://docs.composio.dev/reference/sdk-reference/typescript/remote-file.md
- https://docs.composio.dev/reference/sdk-reference/typescript/session-context-impl.md
- https://docs.composio.dev/reference/sdk-reference/typescript/tool-router-session-files-mount.md
- https://docs.composio.dev/reference/sdk-reference/typescript/tool-router-session.md
- https://docs.composio.dev/reference/sdk-reference/typescript/toolkits.md
- https://docs.composio.dev/reference/sdk-reference/typescript/tools.md
- https://docs.composio.dev/reference/sdk-reference/typescript/triggers.md
- https://docs.composio.dev/reference/v3/api-reference/auth-configs.md
- https://docs.composio.dev/reference/v3/api-reference/authentication.md
- https://docs.composio.dev/reference/v3/api-reference/connected-accounts.md
- https://docs.composio.dev/reference/v3/api-reference/files.md
- https://docs.composio.dev/reference/v3/api-reference/mcp.md
- https://docs.composio.dev/reference/v3/api-reference/migration.md
- https://docs.composio.dev/reference/v3/api-reference/organization.md
- https://docs.composio.dev/reference/v3/api-reference/projects.md
- https://docs.composio.dev/reference/v3/api-reference/tool-router.md
- https://docs.composio.dev/reference/v3/api-reference/toolkits.md
- https://docs.composio.dev/reference/v3/api-reference/tools.md
- https://docs.composio.dev/reference/v3/api-reference/triggers.md
- https://docs.composio.dev/reference/v3/api-reference/webhooks.md

## Toolkits

- https://docs.composio.dev/toolkits.md
- https://docs.composio.dev/toolkits/managed-auth.md
- https://docs.composio.dev/toolkits/premium-tools.md

## Full Documentation

- https://docs.composio.dev/llms-full.txt
