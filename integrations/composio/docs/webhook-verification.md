---
type: composio_doc
title: "Verifying webhooks"
source: "https://docs.composio.dev/docs/webhook-verification.md"
source_hash: "fc3257da72e1313e642316cbcbb616881b8673b19bfa6d9e2c49aa670e89dea2"
system: "composio"
kb_namespace: "composio"
doc_path: "webhook-verification.md"
original_doc_path: "webhook-verification.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Verifying webhooks (/docs/webhook-verification)
Source: https://docs.composio.dev/docs/webhook-verification.md


Composio signs every webhook request. Always verify signatures in production to ensure payloads are authentic.

# SDK verification

The SDK handles signature verification, payload parsing, and version detection (V1, V2, V3).

> Store the webhook secret securely as `COMPOSIO_WEBHOOK_SECRET`. You can fetch it from the [webhook subscription](/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById) at any time or [rotate it](/reference/api-reference/webhook-subscriptions/postWebhookSubscriptionsByIdRotateSecret) if it leaks.

**Python:**

```python
try:
    result = composio.triggers.verify_webhook(
        id=request.headers.get("webhook-id", ""),
        payload=request.get_data(as_text=True),
        signature=request.headers.get("webhook-signature", ""),
        timestamp=request.headers.get("webhook-timestamp", ""),
        secret=os.getenv("COMPOSIO_WEBHOOK_SECRET", ""),
    )
    # result.version, result.payload, result.raw_payload
except Exception:
    return {"error": "Invalid signature"}, 401
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';
const composio = new Composio();
const req = { headers: {} as Record<string, string>, body: '' };
try {
  const result = await composio.triggers.verifyWebhook({
    id: req.headers['webhook-id'],
    payload: req.body,
    signature: req.headers['webhook-signature'],
    timestamp: req.headers['webhook-timestamp'],
    secret: process.env.COMPOSIO_WEBHOOK_SECRET!,
  });
  // result.version, result.payload, result.rawPayload
} catch (error) {
  // Return 401
}
```

> An optional `tolerance` parameter (default: `300` seconds) controls how old a webhook can be before verification fails. Set to `0` to disable timestamp validation.

# Manual verification

If you are not using the Composio SDK and want to verify signatures manually.

> Store the webhook secret securely as `COMPOSIO_WEBHOOK_SECRET`. You can fetch it from the [webhook subscription](/reference/api-reference/webhook-subscriptions/getWebhookSubscriptionsById) at any time or [rotate it](/reference/api-reference/webhook-subscriptions/postWebhookSubscriptionsByIdRotateSecret) if it leaks.

Every webhook request includes three headers: `webhook-signature`, `webhook-id`, and `webhook-timestamp`. Use these along with the raw request body to verify the signature:

**Python:**

```python
import hmac
import hashlib
import base64
import json
import os

def verify_webhook(webhook_id: str, webhook_timestamp: str, body: str, signature: str) -> dict:
    secret = os.getenv("COMPOSIO_WEBHOOK_SECRET", "")
    signing_string = f"{webhook_id}.{webhook_timestamp}.{body}"
    expected = base64.b64encode(
        hmac.new(secret.encode(), signing_string.encode(), hashlib.sha256).digest()
    ).decode()
    received = signature.split(",", 1)[1] if "," in signature else signature
    if not hmac.compare_digest(expected, received):
        raise ValueError("Invalid webhook signature")

    payload = json.loads(body)
    # V3 payload
    return {
        "trigger_slug": payload["metadata"]["trigger_slug"],
        "data": payload["data"],
    }
```

**TypeScript:**

```typescript
import crypto from 'crypto';
function verifyWebhook(
  webhookId: string,
  webhookTimestamp: string,
  body: string,
  signature: string
) {
  const secret = process.env.COMPOSIO_WEBHOOK_SECRET ?? '';
  const signingString = `${webhookId}.${webhookTimestamp}.${body}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signingString)
    .digest('base64');
  const received = signature.split(',')[1] ?? signature;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) {
    throw new Error('Invalid webhook signature');
  }

  const payload = JSON.parse(body);
  // V3 payload
  return {
    triggerSlug: payload.metadata.trigger_slug,
    data: payload.data,
  };
}
```

# Webhook payload versions

`verifyWebhook()` auto-detects the version. If you process payloads manually, here are the formats:

**V3 (default):**

Metadata is separated from event data. New organizations receive V3 payloads by default.

```json
{
  "id": "msg_abc123",
  "type": "composio.trigger.message",
  "metadata": {
    "log_id": "log_abc123",
    "trigger_slug": "GITHUB_COMMIT_EVENT",
    "trigger_id": "ti_xyz789",
    "connected_account_id": "ca_def456",
    "auth_config_id": "ac_xyz789",
    "user_id": "user-id-123435"
  },
  "data": {
    "commit_sha": "a1b2c3d",
    "message": "fix: resolve null pointer",
    "author": "jane"
  },
  "timestamp": "2026-01-15T10:30:00Z"
}
```

**V2 (legacy):**

Metadata fields are mixed into the `data` object alongside event data.

```json
{
  "type": "github_commit_event",
  "data": {
    "commit_sha": "a1b2c3d",
    "message": "fix: resolve null pointer",
    "author": "jane",
    "connection_id": "ca_def456",
    "connection_nano_id": "cn_abc123",
    "trigger_nano_id": "tn_xyz789",
    "trigger_id": "ti_xyz789",
    "user_id": "user-id-123435"
  },
  "timestamp": "2026-01-15T10:30:00Z",
  "log_id": "log_abc123"
}
```

**V1 (legacy):**

```json
{
  "trigger_name": "github_commit_event",
  "trigger_id": "ti_xyz789",
  "connection_id": "ca_def456",
  "payload": {
    "commit_sha": "a1b2c3d",
    "message": "fix: resolve null pointer",
    "author": "jane"
  },
  "log_id": "log_abc123"
}
```

# What to read next

- [Subscribing to events](/docs/setting-up-triggers/subscribing-to-events): Set up webhooks and SDK subscriptions to receive trigger events

- [Creating triggers](/docs/setting-up-triggers/creating-triggers): Configure the webhook endpoint when needed and create trigger instances

- [Triggers overview](/docs/triggers): How Composio delivers event data from connected apps

- [Connection expiry events](/docs/subscribing-to-connection-expiry-events): Detect when OAuth connections expire and prompt re-authentication

---
