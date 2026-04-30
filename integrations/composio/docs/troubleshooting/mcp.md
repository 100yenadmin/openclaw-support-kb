---
type: composio_doc
title: "MCP"
source: "https://docs.composio.dev/docs/troubleshooting/mcp.md"
source_hash: "b406414b8baee31eebcbc0bce9b2ba3af0dc0938dd51bc083dac6cbbdae33a98"
doc_path: "troubleshooting/mcp.md"
original_doc_path: "troubleshooting/mcp.md"
duplicate_index: 1
---

# MCP (/docs/troubleshooting/mcp)
Source: https://docs.composio.dev/docs/troubleshooting/mcp.md


# Connected account not found error

This error occurs when MCP cannot find a valid connected account for authentication:

* **Specify an account**: Provide either `connected_account_id` or `user_id` in your MCP configuration
* **Default behavior**: Without specification, MCP uses `user_id=default`. If multiple connections exist with the same user\_id, the most recent is used
* **Verification checklist**:
  * Account status is `ACTIVE` (not deleted)
  * Account belongs to the same auth config used to create the MCP server. MCP servers only resolve connected accounts through their bound auth configs, so connections under a different auth config will not be found.

To fix a mismatched auth config, update the MCP server's `auth_config_ids` using the [`PATCH /api/v3.1/mcp/{id}`](/reference/api-reference/mcp/patchMcpById) endpoint.

Learn more: [Single Toolkit MCP](/docs/single-toolkit-mcp)

# Getting 404 errors

Verify your URL format matches one of these patterns:

* `https://apollo-<randomID>-composio.vercel.app/v3/mcp/`
* `https://apollo.composio.dev/v3/mcp/`

# Getting 401 Unauthorized errors

If your MCP client gets `401 Unauthorized`, include your Composio project API key in request headers:

* Header name: `x-api-key`
* Value: your project API key from the Composio dashboard

When `require_mcp_api_key` is enabled on your project, requests without this header are rejected.

# Testing and debugging

If experiencing issues, test your MCP server with:

* [Postman MCP Requests](https://learning.postman.com/docs/postman-ai-developer-tools/mcp-requests/create/)
* [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

This helps identify whether the issue is with your MCP client or the server.

# Reporting MCP issues

When reporting to support, provide:

* **Error message**: Complete error details

* **MCP server URL**: The exact URL you're connecting to and the corresponding `mcp_server_id`

![Example MCP server URL shown in the Composio dashboard](/images/troubleshooting/troubleshooting-mcp-server-url.png)

* **Testing results**: Whether issue reproduces in MCP Inspector/Postman or only in specific client

* **Connected account ID**: If facing connection issues

![Example connected account ID used for MCP authentication](/images/troubleshooting/troubleshooting-mcp-connected-account-id.png)

* **Reproduction steps**: Clear steps to reproduce the issue

# Getting help

* **Email**: [support@composio.dev](mailto:support@composio.dev)
* **Discord**: [#support-form](https://discord.com/channels/1170785031560646836/1268871288156323901)

---
