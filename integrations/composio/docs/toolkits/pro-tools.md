---
type: composio_doc
title: "Pro Tools"
source: "https://docs.composio.dev/toolkits/pro-tools.md"
source_hash: "4886e6a3c09e323fa9211803cdb8d486abc5992718f0f522c774e4450a7029a4"
system: "composio"
kb_namespace: "composio"
doc_path: "toolkits/pro-tools.md"
original_doc_path: "toolkits/pro-tools.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Pro Tools (/toolkits/pro-tools)
Source: https://docs.composio.dev/toolkits/pro-tools.md


Some tool calls cost more to run — search APIs, code sandboxes, ML inference. We call those pro tools and price them separately.

# What counts as a pro tool?

- [Search APIs](/toolkits/composio_search): Composio Search, Perplexity, Exa, SerpAPI

- [Code execution](/toolkits/codeinterpreter): Sandboxed runtimes like E2B

} title="Web scraping & data extraction" description="Crawlers and structured extraction" />

} title="AI/ML inference" description="Hosted model calls and embeddings" />

} title="Document processing & OCR" description="PDF, image, and document parsing" />

} title="Compute-intensive operations" description="Long-running or heavy transforms" />

# Pricing

Pro tool calls are roughly 3x the cost of a standard tool call. Full pricing is on the [pricing page](https://composio.dev/pricing).

| Plan               | Included Standard Tool Calls | Included Pro Tool Calls | Usage Based Standard Tool Calls | Usage Based Pro Tool Calls |
| ------------------ | ---------------------------- | ----------------------- | ------------------------------- | -------------------------- |
| Totally Free       | 20k                          | 1k                      | –                               | –                          |
| Ridiculously Cheap | 200k                         | 5k                      | $0.299/1k                       | $0.897/1k                  |
| Serious Business   | 2M                           | 50k                     | $0.249/1k                       | $0.747/1k                  |
| Enterprise         | Flexible                     | Flexible                | Flexible                        | Flexible                   |

# Rate limits

Pro tools have lower rate limits than standard tool calls. If you need more, [contact us](mailto:billing@composio.dev).

| Spending Tier | Standard Tool Calls Rate Limit | Pro Tool Calls Rate Limit |
| ------------- | ------------------------------ | ------------------------- |
| Free          | 100/min                        | 1,000/hour                |
| Paid          | 5,000/min                      | 10,000/hour               |
| Enterprise    | Custom                         | Custom                    |

---
