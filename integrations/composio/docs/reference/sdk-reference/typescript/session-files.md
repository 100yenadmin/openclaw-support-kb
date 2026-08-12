---
type: composio_doc
title: "Session files"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/session-files.md"
source_hash: "643d56f729de826330f732f50b78a5f189697ce14b282a691b00714de08e180c"
system: "composio"
kb_namespace: "composio"
doc_path: "reference/sdk-reference/typescript/session-files.md"
original_doc_path: "reference/sdk-reference/typescript/session-files.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Session files (/reference/sdk-reference/typescript/session-files)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/session-files.md


## Methods [#methods]

### delete() [#delete]

Deletes a file or directory at the specified path on the session's file mount.

Removes the file or directory from the virtual filesystem. Use with caution:
deletion is typically irreversible. Ensure the path exists and is intended for removal.

```typescript
async delete(remotePath: string, options?: ToolRouterSessionFilesMountDeleteOptions): Promise
```

**Parameters**

| Name         | Type                                       | Description                                               |
| ------------ | ------------------------------------------ | --------------------------------------------------------- |
| `remotePath` | `string`                                   | The path of the file or directory to delete on the mount. |
| `options?`   | `ToolRouterSessionFilesMountDeleteOptions` | Optional configuration for the delete operation.          |

**Returns**

`Promise` — Confirmation of deletion (implementation-specific).

**Example**

```typescript
const session = await composio.toolRouter.use('session_123');
await session.experimental.files.delete('/temp/cache.json');
```

```typescript
// Delete from a custom mount
await session.experimental.files.delete('/old-backup', {
  mountId: 'custom-mount',
});
```

***

### download() [#download]

Downloads a file from the session's file mount to the local filesystem.

Retrieves a file stored in the session's virtual filesystem (e.g., one produced
by a tool or previously uploaded) and saves it to the specified local path.

```typescript
async download(filePath: string, options?: ToolRouterSessionFilesMountDownloadOptions): Promise
```

**Parameters**

| Name       | Type                                         | Description                                                                                                                |
| ---------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `filePath` | `string`                                     | The path of the file on the mount to download, or the local path where the file should be saved (implementation-specific). |
| `options?` | `ToolRouterSessionFilesMountDownloadOptions` | Optional configuration for the download.                                                                                   |

**Returns**

`Promise` — The downloaded file data or path (implementation-specific).

**Example**

```typescript
const session = await composio.toolRouter.use('session_123');
const result = await session.experimental.files.download('/output/report.pdf');
```

```typescript
// Download from a custom mount
await session.experimental.files.download('/exports/data.json', {
  mountId: 'custom-mount',
});
```

***

### list() [#list]

Lists files and directories at the specified path on the session's file mount.

Use this to browse the virtual filesystem attached to the tool router session.
The path is relative to the mount root (e.g., `"/"` for root, `"/documents"` for a subdirectory).
Supports cursor-based pagination via `cursor` and `limit` options.

```typescript
async list(options?: ToolRouterSessionFilesMountListOptions): Promise
```

**Parameters**

| Name       | Type                                     | Description                                    |
| ---------- | ---------------------------------------- | ---------------------------------------------- |
| `options?` | `ToolRouterSessionFilesMountListOptions` | Optional configuration for the list operation. |

**Returns**

`Promise` — List of files with nextCursor for pagination.

**Example**

```typescript
const session = await composio.toolRouter.use('session_123');
const { items, nextCursor } = await session.experimental.files.list({ path: '/' });
```

```typescript
// Paginated listing
let result = await session.experimental.files.list({ path: '/', limit: 10 });
while (result.nextCursor) {
  result = await session.experimental.files.list({ path: '/', cursor: result.nextCursor, limit: 10 });
}
```

***

### upload() [#upload]

Uploads a file to the session's file mount.

Accepts a file path (local or URL), a native File object, or a raw buffer.
The file is stored in the virtual filesystem associated with the tool router session.
URL inputs require a Node.js or Bun runtime so the destination can be DNS-validated;
edge runtimes must fetch the file themselves and pass a File or ArrayBuffer.

```typescript
async upload(input: string | File | ArrayBuffer | Uint8Array, options?: ToolRouterSessionFilesMountUploadOptions): Promise
```

**Parameters**

| Name       | Type                                          | Description                                                            |              |
| ---------- | --------------------------------------------- | ---------------------------------------------------------------------- | ------------ |
| `input`    | `string \| File \| ArrayBuffer \| Uint8Array` | File path (string), native File, or raw buffer (ArrayBuffer            | Uint8Array). |
| `options?` | `ToolRouterSessionFilesMountUploadOptions`    | Optional configuration. When passing a buffer, remotePath is required. |              |

**Returns**

`Promise` — Metadata about the uploaded file.

**Example**

```typescript
// From file path (local or URL)
await session.experimental.files.upload('/path/to/report.pdf');
await session.experimental.files.upload('https://example.com/file.pdf');
```

```typescript
// From native File (e.g. from input[type=file])
await session.experimental.files.upload(fileInput.files[0]);
```

```typescript
// From raw buffer
await session.experimental.files.upload(buffer, { remotePath: 'data.json', mimetype: 'application/json' });
```

***

---
