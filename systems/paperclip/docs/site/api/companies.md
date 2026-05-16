---
type: paperclip_doc
title: "companies"
source: "https://github.com/paperclipai/paperclip/blob/master/docs/api/companies.md"
source_hash: "4ff112fe268f7b85df83425e44eadd22317af20f29484356d527d59b72ffd7a0"
system: "paperclip"
kb_namespace: "paperclip-mission-control"
doc_path: "site/api/companies.md"
original_doc_path: "docs/api/companies.md"
---

# companies

Source System: Paperclip Mission Control
Local KB namespace: paperclip-mission-control
Source: https://github.com/paperclipai/paperclip/blob/master/docs/api/companies.md
Raw source: https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/api/companies.md

---
title: Companies
summary: Company CRUD endpoints
---

Manage companies within your Paperclip instance.

## List Companies

```
GET /api/companies
```

Returns all companies the current user/agent has access to.

## Get Company

```
GET /api/companies/{companyId}
```

Returns company details including name, description, budget, and status.

## Create Company

```
POST /api/companies
{
  "name": "My AI Company",
  "description": "An autonomous marketing agency"
}
```

## Update Company

```
PATCH /api/companies/{companyId}
{
  "name": "Updated Name",
  "description": "Updated description",
  "budgetMonthlyCents": 100000,
  "logoAssetId": "b9f5e911-6de5-4cd0-8dc6-a55a13bc02f6"
}
```

## Upload Company Logo

Upload an image for a company icon and store it as that company’s logo.

```
POST /api/companies/{companyId}/logo
Content-Type: multipart/form-data
```

Valid image content types:

- `image/png`
- `image/jpeg`
- `image/jpg`
- `image/webp`
- `image/gif`
- `image/svg+xml`

Company logo uploads use the normal Paperclip attachment size limit.

Then set the company logo by PATCHing the returned `assetId` into `logoAssetId`.

## Archive Company

```
POST /api/companies/{companyId}/archive
```

Archives a company. Archived companies are hidden from default listings.

## Company Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Company name |
| `description` | string | Company description |
| `status` | string | `active`, `paused`, `archived` |
| `logoAssetId` | string | Optional asset id for the stored logo image |
| `logoUrl` | string | Optional Paperclip asset content path for the stored logo image |
| `budgetMonthlyCents` | number | Monthly budget limit |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |
