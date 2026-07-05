---
type: composio_doc
title: "Files"
source: "https://docs.composio.dev/reference/api-reference/files.md"
source_hash: "331f863ca8865de384b28956cc26fa4af1cb559493be4575c8cd23f6ebfc9ee4"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/api-reference/files.md"
original_doc_path: "reference/api-reference/files.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Files (/reference/api-reference/files)
Source: https://docs.composio.dev/reference/api-reference/files.md


{/* Auto-generated from OpenAPI spec. Edit the overview at api-overviews/files.mdx, not this file. */}

These endpoints handle files that tools read and write during execution. When a tool produces or consumes a file, Composio stores it in object storage and exchanges it through presigned URLs rather than streaming bytes through the API.

You reach for these endpoints to:

* **List files** that tools have generated, optionally filtered by app and action.
* **Request an upload**: get a presigned S3 URL, `PUT` your file to it, then pass the returned reference into a tool's input.

This keeps large payloads out of request bodies. Tools receive a file reference and resolve the underlying object on their side.

> File uploads are a two-step flow. Call the upload-request endpoint to mint a presigned URL, then upload the file contents directly to that URL. The API never receives the raw bytes.

If your agent works with files inside a session, prefer the session file mount, where the sandbox exposes uploaded files to running code. See the [remote sandbox](/docs/sandbox/remote) for the sandbox helpers (`upload_local_file`, `smart_file_extract`) that build on this storage.

These endpoints use your project API key in the `x-api-key` header.

# Endpoints

---
