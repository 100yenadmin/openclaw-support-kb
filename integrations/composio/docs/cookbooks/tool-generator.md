---
type: composio_doc
title: "Tool Type Generator"
source: "https://docs.composio.dev/cookbooks/tool-generator.md"
source_hash: "be50894042fccc8a2894ae68fa87f4b7c6a07aa3f6dc35d3daaea957c0c457cc"
doc_path: "cookbooks/tool-generator.md"
original_doc_path: "cookbooks/tool-generator.md"
duplicate_index: 1
---

# Tool Type Generator (/cookbooks/tool-generator)
Source: https://docs.composio.dev/cookbooks/tool-generator.md


[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/tool-generator)

This cookbook shows how to access the raw tool definitions and toolkit metadata that Composio exposes. If you are building a platform on top of Composio, say a workflow builder or an IDE plugin, you will need to display tool schemas, auth requirements, and input/output parameters to your users. This is how you get that data.

# Prerequisites

* Python 3.10+
* [UV](https://docs.astral.sh/uv/getting-started/installation/)
* [Composio API key](https://platform.composio.dev/settings)

# Project setup

Create a new project and install dependencies:

```bash
mkdir composio-tool-generator && cd composio-tool-generator
uv init && uv add composio
```

Add your API key to a `.env` file:

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
```
# Setting up the client

No provider is needed here. We are reading tool metadata directly from the Composio API, not passing tools to an AI framework.

```py
from composio import Composio

composio = Composio()
```
# Raw tool definitions

Composio has two internal representations for tools: **raw definitions** and **provider definitions**. Raw definitions are framework-agnostic JSON schemas with `input_parameters`, `output_parameters`, scopes, and tags. Provider definitions translate these into the format a specific framework expects (OpenAI, Anthropic, etc.).

For building platform UIs, the raw definitions are what you want. `composio.tools.get_raw_composio_tools()` returns them for an entire toolkit. Each tool has a standard JSON Schema for its inputs and outputs, so you can render forms, validate user input, or generate types from it.

```py
def list_tools(toolkit_slug: str):
    """Fetch raw tool definitions for a toolkit and print them."""
    tools = composio.tools.get_raw_composio_tools(toolkits=[toolkit_slug])

    for tool in tools:
        print(f"\n--- {tool.slug} ---")
        print(f"Name: {tool.name}")
        print(f"Description: {tool.description}")

        params = tool.input_parameters or {}
        required = params.get("required", [])
        for name, schema in params.get("properties", {}).items():
            tag = "required" if name in required else "optional"
            print(f"  [{tag}] {name}: {schema.get('type', 'any')} - {schema.get('description', '')}")
```
# Toolkit metadata

A toolkit groups related tools under one integration. `composio.toolkits.get()` returns metadata about the toolkit itself, including its supported auth schemes. Each auth scheme lists the fields required for two stages: creating an auth config (platform setup) and initiating a connected account (end-user connection). This is useful if you need to build your own auth configuration UI.

```py
def toolkit_info(toolkit_slug: str):
    """Fetch toolkit metadata including auth schemes."""
    toolkit = composio.toolkits.get(toolkit_slug)

    print(f"Name: {toolkit.name}")
    print(f"Slug: {toolkit.slug}")

    if not toolkit.auth_config_details:
        print("Auth: none (no auth required)")
        return

    for scheme in toolkit.auth_config_details:
        print(f"\nAuth scheme: {scheme.mode}")

        if not scheme.fields:
            continue

        creation = scheme.fields.auth_config_creation
        if creation:
            print("  Auth config creation:")
            for field in creation.required or []:
                print(f"    [required] {field.name}: {field.description}")
            for field in creation.optional or []:
                print(f"    [optional] {field.name}: {field.description}")

        connection = scheme.fields.connected_account_initiation
        if connection:
            print("  Account connection:")
            for field in connection.required or []:
                print(f"    [required] {field.name}: {field.description}")
            for field in connection.optional or []:
                print(f"    [optional] {field.name}: {field.description}")
```
# Exporting to JSON

For code generation or static analysis, you can export the full raw schemas to a JSON file. Each entry includes the `input_parameters` and `output_parameters` as standard JSON Schema objects, which you can feed into tools like `json-schema-to-typescript` or `datamodel-code-generator` to produce typed interfaces.

```py
def export(toolkit_slug: str, output_file: str):
    """Export raw tool definitions to a JSON file."""
    tools = composio.tools.get_raw_composio_tools(toolkits=[toolkit_slug])

    data = []
    for tool in tools:
        data.append({
            "slug": tool.slug,
            "name": tool.name,
            "description": tool.description,
            "input_parameters": tool.input_parameters or {},
            "output_parameters": tool.output_parameters or {},
            "scopes": getattr(tool, "scopes", []),
            "tags": getattr(tool, "tags", []),
            "no_auth": getattr(tool, "no_auth", False),
        })

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)

    print(f"Exported {len(data)} tools to {output_file}")
```
# Complete script

Here is everything together:

```py
import json
import sys

# region setup
from composio import Composio

composio = Composio()
# endregion setup

# region list-tools
def list_tools(toolkit_slug: str):
    """Fetch raw tool definitions for a toolkit and print them."""
    tools = composio.tools.get_raw_composio_tools(toolkits=[toolkit_slug])

    for tool in tools:
        print(f"\n--- {tool.slug} ---")
        print(f"Name: {tool.name}")
        print(f"Description: {tool.description}")

        params = tool.input_parameters or {}
        required = params.get("required", [])
        for name, schema in params.get("properties", {}).items():
            tag = "required" if name in required else "optional"
            print(f"  [{tag}] {name}: {schema.get('type', 'any')} - {schema.get('description', '')}")
# endregion list-tools

# region toolkit-info
def toolkit_info(toolkit_slug: str):
    """Fetch toolkit metadata including auth schemes."""
    toolkit = composio.toolkits.get(toolkit_slug)

    print(f"Name: {toolkit.name}")
    print(f"Slug: {toolkit.slug}")

    if not toolkit.auth_config_details:
        print("Auth: none (no auth required)")
        return

    for scheme in toolkit.auth_config_details:
        print(f"\nAuth scheme: {scheme.mode}")

        if not scheme.fields:
            continue

        creation = scheme.fields.auth_config_creation
        if creation:
            print("  Auth config creation:")
            for field in creation.required or []:
                print(f"    [required] {field.name}: {field.description}")
            for field in creation.optional or []:
                print(f"    [optional] {field.name}: {field.description}")

        connection = scheme.fields.connected_account_initiation
        if connection:
            print("  Account connection:")
            for field in connection.required or []:
                print(f"    [required] {field.name}: {field.description}")
            for field in connection.optional or []:
                print(f"    [optional] {field.name}: {field.description}")
# endregion toolkit-info

# region export
def export(toolkit_slug: str, output_file: str):
    """Export raw tool definitions to a JSON file."""
    tools = composio.tools.get_raw_composio_tools(toolkits=[toolkit_slug])

    data = []
    for tool in tools:
        data.append({
            "slug": tool.slug,
            "name": tool.name,
            "description": tool.description,
            "input_parameters": tool.input_parameters or {},
            "output_parameters": tool.output_parameters or {},
            "scopes": getattr(tool, "scopes", []),
            "tags": getattr(tool, "tags", []),
            "no_auth": getattr(tool, "no_auth", False),
        })

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)

    print(f"Exported {len(data)} tools to {output_file}")
# endregion export

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python main.py list-tools <toolkit>")
        print("  python main.py toolkit-info <toolkit>")
        print("  python main.py export <toolkit> <output.json>")
        sys.exit(1)

    command = sys.argv[1]

    if command == "list-tools":
        slug = sys.argv[2] if len(sys.argv) > 2 else "gmail"
        list_tools(slug)
    elif command == "toolkit-info":
        slug = sys.argv[2] if len(sys.argv) > 2 else "gmail"
        toolkit_info(slug)
    elif command == "export":
        slug = sys.argv[2] if len(sys.argv) > 2 else "gmail"
        out = sys.argv[3] if len(sys.argv) > 3 else "output.json"
        export(slug, out)
    else:
        print(f"Unknown command: {command}")
        print("Use 'list-tools', 'toolkit-info', or 'export'.")
        sys.exit(1)

```
# Running the script

List all tools in a toolkit:

```bash
uv run --env-file .env python main.py list-tools gmail
```
Inspect a toolkit's auth schemes:

```bash
uv run --env-file .env python main.py toolkit-info gmail
```
Export raw tool schemas to a JSON file:

```bash
uv run --env-file .env python main.py export gmail tools.json
```

# Take it further

Raw tool schemas are building blocks for platform features:

* **Dynamic form builder**: use `input_parameters` JSON Schema to render forms for any tool — no hardcoded UI per integration
* **Type generation pipeline**: feed exported JSON into `json-schema-to-typescript` or `datamodel-code-generator` in CI to keep types in sync
* **Tool catalog UI**: combine `list-tools` and `toolkit-info` to build a searchable directory of available integrations and their auth requirements

- [App Connections Dashboard](/cookbooks/app-connections-dashboard): Build a UI for managing user connections

- [Tool Type Generator source](https://github.com/ComposioHQ/composio/tree/next/docs/examples/tool-generator): View the full source on GitHub

---
