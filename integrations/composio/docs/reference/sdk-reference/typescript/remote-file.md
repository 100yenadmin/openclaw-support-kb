---
type: composio_doc
title: "RemoteFile"
source: "https://docs.composio.dev/reference/sdk-reference/typescript/remote-file.md"
source_hash: "947a64f347d993e57d104b408c1a182910907ac9917456162c0e728cc7358fc5"
doc_path: "reference/sdk-reference/typescript/remote-file.md"
original_doc_path: "reference/sdk-reference/typescript/remote-file.md"
duplicate_index: 1
---

# RemoteFile (/reference/sdk-reference/typescript/remote-file)
Source: https://docs.composio.dev/reference/sdk-reference/typescript/remote-file.md


# Usage

Access this class through the `composio.remoteFile` property:

```typescript
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.remoteFile.list();
```

# Properties

| Name                 | Type     | Description                                              |
| -------------------- | -------- | -------------------------------------------------------- |
| `downloadUrl`        | `string` | Presigned URL for downloading the file                   |
| `expiresAt`          | `string` | ISO 8601 timestamp when the download URL expires         |
| `mountRelativePath`  | `string` | Relative path within the mount (e.g. "report.pdf")       |
| `sandboxMountPrefix` | `string` | Absolute mount path inside the sandbox (e.g. /mnt/files) |

# Methods

## blob()

Fetches the file content as a Blob.

```typescript
async blob(): Promise
```

**Returns**

`Promise` — The file content as a Blob

***

## buffer()

Fetches the file content as a buffer.

```typescript
async buffer(): Promise
```

**Returns**

`Promise` — The file content as a Uint8Array

***

## save()

Downloads and saves the file to the local filesystem.
Requires a Node.js runtime with file system support (not available in Cloudflare Workers/Edge).

```typescript
async save(path?: string): Promise<string>
```

**Parameters**

| Name    | Type     | Description                                                                                                           |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `path?` | `string` | Local path to save the file. If omitted, saves to the Composio temp directory using the filename from the mount path. |

**Returns**

`Promise<string>` — The absolute path where the file was saved

***

## text()

Fetches the file content as UTF-8 text.

```typescript
async text(): Promise<string>
```

**Returns**

`Promise<string>` — The file content as a string

***

## parse()

Parses an API response (snake\_case) and returns a RemoteFile instance.

```typescript
parse(data: unknown): RemoteFile
```

**Parameters**

| Name   | Type      | Description                            |
| ------ | --------- | -------------------------------------- |
| `data` | `unknown` | Raw API response with snake\_case keys |

**Returns**

`RemoteFile` — A RemoteFile instance

***

---
