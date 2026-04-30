---
type: composio_doc
title: "CLI"
source: "https://docs.composio.dev/docs/troubleshooting/cli.md"
source_hash: "ce8aec176001b392cdf6e2720b315259e37478e9abbefabc8728d7d191519616"
doc_path: "troubleshooting/cli.md"
original_doc_path: "troubleshooting/cli.md"
duplicate_index: 1
---

# CLI (/docs/troubleshooting/cli)
Source: https://docs.composio.dev/docs/troubleshooting/cli.md


# Command not found

Verify the CLI is installed and in your PATH:

```bash
which composio
```

If not found, reinstall:

```bash
curl -fsSL https://composio.dev/install | bash
```

Or add to PATH:

```bash
echo 'export PATH="$HOME/.composio:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

# Authentication errors

Check current authentication:

```bash
composio whoami
```

Re-authenticate if needed:

```bash
composio logout
composio login
```

For CI/CD, use environment variable:

```bash
export COMPOSIO_API_KEY="your-api-key"
```

If a toolkit account is missing or expired, reconnect it directly:

```bash
composio link github
```

# Type generation issues

## Project type not detected

Use language-specific commands:

```bash
composio generate ts  # TypeScript
composio generate py  # Python
```

## Output directory missing

Specify output directory explicitly:

```bash
composio generate --output-dir ./my-types
```

If project auto-detection is wrong, initialize local developer context first or use the language-specific command explicitly:

```bash
composio dev init
```

# Debug CLI issues

Enable debug logging:

```bash
composio --log-level debug [command]
```

Check version compatibility:

```bash
composio version
```

# Common issues

* **API key not found**: Run `composio login`
* **Toolkit account not connected**: Run `composio link <toolkit>`
* **Project type detection fails**: Use language-specific commands or ensure you're in project root
* **Developer commands fail due to missing project context**: Run `composio dev init`
* **Network timeout**: Check internet connection and proxy settings
* **Permission denied**: Check directory write permissions

# Getting help

* **Email**: [support@composio.dev](mailto:support@composio.dev)
* **Discord**: [#support-form](https://discord.com/channels/1170785031560646836/1268871288156323901)
* **GitHub**: [Create an issue](https://github.com/ComposioHQ/composio/issues/new?labels=bug)

---
