---
type: composio_doc
title: "Premium Tools"
source: "https://docs.composio.dev/toolkits/premium-tools.md"
source_hash: "2a7cb1352c090ce7e0e664505d9b3de9a9b5b6327c8a870a669d20cf7414643c"
system: "composio"
kb_namespace: "composio"
doc_path: "toolkits/premium-tools.md"
original_doc_path: "toolkits/premium-tools.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# Premium Tools (/toolkits/premium-tools)
Source: https://docs.composio.dev/toolkits/premium-tools.md


Some tool calls cost more to run — search APIs, code sandboxes, ML inference. We call those premium tools and price them separately.

# What counts as a premium tool?

- [Search APIs](/toolkits/composio_search): Composio Search, Perplexity, Exa, SerpAPI

- [Code execution](/toolkits/codeinterpreter): Sandboxed runtimes like E2B

} title="Web scraping & data extraction" description="Crawlers and structured extraction" />

} title="AI/ML inference" description="Hosted model calls and embeddings" />

} title="Document processing & OCR" description="PDF, image, and document parsing" />

} title="Compute-intensive operations" description="Long-running or heavy transforms" />

# Pricing

Premium tool calls are roughly 3x the cost of a standard tool call. Full pricing is on the [pricing page](https://composio.dev/pricing).

| Plan               | Included Standard Tool Calls | Included Premium Tool Calls | Usage Based Standard Tool Calls | Usage Based Premium Tool Calls |
| ------------------ | ---------------------------- | --------------------------- | ------------------------------- | ------------------------------ |
| Totally Free       | 20k                          | 1k                          | –                               | –                              |
| Ridiculously Cheap | 200k                         | 5k                          | $0.299/1k                       | $0.897/1k                      |
| Serious Business   | 2M                           | 50k                         | $0.249/1k                       | $0.747/1k                      |
| Enterprise         | Flexible                     | Flexible                    | Flexible                        | Flexible                       |

# Rate limits

Premium tools have lower rate limits than standard tool calls. If you need more, [contact us](mailto:billing@composio.dev).

| Spending Tier | Standard Tool Calls Rate Limit | Premium Tool Calls Rate Limit |
| ------------- | ------------------------------ | ----------------------------- |
| Free          | 100/min                        | 1,000/hour                    |
| Paid          | 5,000/min                      | 10,000/hour                   |
| Enterprise    | Custom                         | Custom                        |
