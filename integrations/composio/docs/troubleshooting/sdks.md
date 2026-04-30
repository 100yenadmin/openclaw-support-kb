---
type: composio_doc
title: "SDKs"
source: "https://docs.composio.dev/docs/troubleshooting/sdks.md"
source_hash: "04b2b598aaec6a1a401691f404f272518cef1b75ae13e57974d6b797ee386b42"
doc_path: "troubleshooting/sdks.md"
original_doc_path: "troubleshooting/sdks.md"
duplicate_index: 1
---

# SDKs (/docs/troubleshooting/sdks)
Source: https://docs.composio.dev/docs/troubleshooting/sdks.md


# Debug network issues

Enable debug logging to see API calls and identify if issues are SDK or API related. When contacting support, share the full debug logs **along with** the `x-request-id`.

**Python:**

```bash
# Set environment variable
COMPOSIO_LOGGING_LEVEL=debug
```

**TypeScript:**

```bash
// Set environment variable
COMPOSIO_LOG_LEVEL=debug
```

Look for `x-request-id` in the debug output to share with support.

# Check SDK version

Ensure you're using the latest version:

**Python:**

```bash
pip install --upgrade composio
```

**TypeScript:**

```bash
npm install @composio/core@latest
```

Check current version:

* Python: [PyPI](https://pypi.org/project/composio/)
* TypeScript: [npm](https://www.npmjs.com/package/@composio/core)

# Common issues

* **Type errors or parameter confusion**: Search [DeepWiki](https://deepwiki.com/ComposioHQ/composio) or use the Ask AI assistant
* **Tool-specific issues**: Check the [specific tool's documentation](/toolkits)
* **Bug reporting**: Create a [GitHub issue](https://github.com/ComposioHQ/composio/issues/new?labels=bug) with debug logs and reproduction steps

# Getting help

* **Email**: [support@composio.dev](mailto:support@composio.dev)
* **Discord**: [#support-form](https://discord.com/channels/1170785031560646836/1268871288156323901)

---
