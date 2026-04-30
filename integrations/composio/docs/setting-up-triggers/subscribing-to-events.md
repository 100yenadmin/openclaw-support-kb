---
type: composio_doc
title: "Subscribing to triggers"
source: "https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events.md"
source_hash: "e6d4504461e669ccb97350be41be041afa99a5f31b4a375d84d5d16ae88534a9"
doc_path: "setting-up-triggers/subscribing-to-events.md"
original_doc_path: "setting-up-triggers/subscribing-to-events.md"
duplicate_index: 1
---

# Subscribing to triggers (/docs/setting-up-triggers/subscribing-to-events)
Source: https://docs.composio.dev/docs/setting-up-triggers/subscribing-to-events.md


# Webhooks

Webhooks are the recommended way to receive trigger events in production. To start receiving events, create a webhook subscription with your endpoint URL and select which event types you want to receive. You can subscribe to any combination:

| Event type                           | Description                                                                                                                                                                                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `composio.trigger.message`           | Fired when a trigger receives data from an external service.                                                                                                                                                                                                                          |
| `composio.connected_account.expired` | Fired when a connected account expires and needs re-authentication. See [Subscribing to connection expiry events](/docs/subscribing-to-connection-expiry-events).                                                                                                                     |
| `composio.trigger.disabled`          | **Fired when** Composio automatically disables a trigger — expired connection, webhook refresh failure, or unhealthy polling. **Not fired when** you disable a trigger through the manage API or deactivate its connected account via `PATCH /api/v3/connected_accounts/{id}/status`. |

Set your webhook URL in the [dashboard settings](https://platform.composio.dev?next_page=/settings/webhook) or via the [Webhook Subscriptions API](/reference/api-reference/webhooks):

```bash
curl -X POST https://backend.composio.dev/api/v3.1/webhook_subscriptions \
  -H "X-API-KEY: <your-composio-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_url": "https://example.com/webhook",
    "enabled_events": ["composio.trigger.message"]
  }'
```

> The response includes a `secret` for [verifying webhook signatures](/docs/webhook-verification). This is only returned at creation time or when you [rotate the secret](/reference/api-reference/webhooks/postWebhookSubscriptionsByIdRotateSecret). Store it securely.

## Handling events

All events arrive at the same endpoint. Route on the `type` field to handle each event type:

> [Inspect the payload schema](#inspecting-trigger-payload-schemas) for a trigger before writing your handler. See [Webhook payload (V3)](#webhook-payload-v3) for the full event structure.

**Python:**

```python
from composio import WebhookEventType

@app.post("/webhook")
async def webhook_handler(request: Request):
    payload = await request.json()
    event_type = payload.get("type")

    if event_type == WebhookEventType.TRIGGER_MESSAGE:
        trigger_slug = payload["metadata"]["trigger_slug"]
        event_data = payload["data"]

        if trigger_slug == "GITHUB_COMMIT_EVENT":
            print(f"New commit by {event_data['author']}: {event_data['message']}")

    # Handle connected account expired events

    return {"status": "ok"}
```

**TypeScript:**

```typescript
type NextApiRequest = { body: any };
type NextApiResponse = { status: (code: number) => { json: (data: any) => void } };
export default async function webhookHandler(req: NextApiRequest, res: NextApiResponse) {
  const payload = req.body;

  if (payload.type === 'composio.trigger.message') {
    const triggerSlug = payload.metadata.trigger_slug;
    const eventData = payload.data;

    if (triggerSlug === 'GITHUB_COMMIT_EVENT') {
      console.log(`New commit by ${eventData.author}: ${eventData.message}`);
    }
  }

  // Handle connected account expired events

  res.status(200).json({ status: 'ok' });
}
```

> Always [verify webhook signatures](/docs/webhook-verification) in production to ensure payloads are authentic.

## Inspecting trigger payload schemas

Each trigger type defines the schema of event data it sends. Use `get_type()`/`getType()` to inspect it before writing your handler:

**Python:**

```python
from composio import Composio

composio = Composio()

trigger_type = composio.triggers.get_type("GITHUB_COMMIT_EVENT")
print(trigger_type.payload)
# Returns: {"properties": {"author": {...}, "id": {...}, "message": {...}, "timestamp": {...}, "url": {...}}}
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();

const triggerType = await composio.triggers.getType("GITHUB_COMMIT_EVENT");
console.log(triggerType.payload);
// Returns: {"properties": {"author": {...}, "id": {...}, "message": {...}, "timestamp": {...}, "url": {...}}}
```

The payload schema tells you what fields will be in the `data` object of the webhook event.

## Webhook payload (V3)

New organizations receive V3 payloads by default. V3 separates event metadata from the actual event data:

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

> See [webhook payload versions](/docs/webhook-verification#webhook-payload-versions) for V2 and V1 formats.

# Testing locally

## SDK subscriptions

Subscribe to trigger events directly through the SDK without setting up a webhook endpoint. Uses WebSockets under the hood.

**Python:**

```python
from composio import Composio

composio = Composio()

subscription = composio.triggers.subscribe()

@subscription.handle(trigger_id="your_trigger_id")
def handle_event(data):
    print(f"Event received: {data}")

subscription.wait_forever()
```

**TypeScript:**

```typescript
import { Composio } from '@composio/core';

const composio = new Composio();

await composio.triggers.subscribe(
    (data) => {
        console.log('Event received:', data);
    },
    { triggerId: 'your_trigger_id' }
);
```

## Using ngrok

To test the full webhook flow locally, use [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 8000
```

Then use the ngrok URL as your webhook endpoint:

```bash
curl -X POST https://backend.composio.dev/api/v3.1/webhook_subscriptions \
  -H "X-API-KEY: <your-composio-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_url": "https://your-ngrok-url.ngrok-free.app/webhook",
    "enabled_events": ["composio.trigger.message"]
  }'
```

Events will now be forwarded to your local server at `http://localhost:8000/webhook`.

# Identifying trigger events

Every webhook event includes a `metadata` object that tells you exactly where it came from:

| Field                           | What it tells you                                 |
| ------------------------------- | ------------------------------------------------- |
| `metadata.trigger_id`           | Which trigger instance fired this event           |
| `metadata.trigger_slug`         | The type of trigger (e.g., `GITHUB_COMMIT_EVENT`) |
| `metadata.connected_account_id` | Which connected account it belongs to             |
| `metadata.user_id`              | Which user it's for                               |
| `metadata.auth_config_id`       | Which auth config was used                        |

Use `trigger_id` to match events to a specific trigger instance, or `trigger_slug` to handle all events of a certain type. These fields can also be passed as filters when using [SDK subscriptions](#sdk-subscriptions).

# What to read next

- [Verifying webhooks](/docs/webhook-verification): Validate webhook signatures to ensure payloads are authentic

- [Managing triggers](/docs/setting-up-triggers/managing-triggers): List, enable, disable, and delete trigger instances

- [Troubleshooting triggers](/docs/troubleshooting/triggers): Not receiving events? Check common trigger issues and how to fix them

---
