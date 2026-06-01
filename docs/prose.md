---
type: openclaw_doc
title: "OpenProse"
source: "https://docs.openclaw.ai/prose"
source_hash: "d014a6a9dba4c1e3601833310bbd4d0169600d0b5aa398c1139f700d68ef49b5"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "prose.md"
original_doc_path: "prose.md"
duplicate_index: 1
---

# OpenProse
Source: https://docs.openclaw.ai/prose

OpenProse is a portable, markdown-first workflow format for orchestrating AI
sessions. In OpenClaw it ships as a plugin that installs an OpenProse skill
pack and a `/prose` slash command. Programs live in `.prose` files and can
spawn multiple sub-agents with explicit control flow.

CardGroup


Install

    Enable the OpenProse plugin and restart the Gateway.


Run a program

    Use `/prose run` to execute a `.prose` file or remote program.


Write programs

    Author multi-agent workflows with parallel and sequential steps.


## Install

Steps


Enable the plugin

    Bundled plugins are disabled by default. Enable OpenProse:

    ```bash
    openclaw plugins enable open-prose
    ```



Restart the Gateway

    ```bash
    openclaw gateway restart
    ```


Verify

    ```bash
    openclaw plugins list | grep prose
    ```

    You should see `open-prose` as enabled. The `/prose` skill command is now
    available in chat.



For a local checkout: `openclaw plugins install ./path/to/local/open-prose-plugin`

## Slash command

OpenProse registers `/prose` as a user-invocable skill command:

```text
/prose help
/prose run <file.prose>
/prose run <handle/slug>
/prose run <https://example.com/file.prose>
/prose compile <file.prose>
/prose examples
/prose update
```

`/prose run <handle/slug>` resolves to `https://p.prose.md/<handle>/<slug>`.
Direct URLs are fetched as-is using the `web_fetch` tool.

## What it can do

- Multi-agent research and synthesis with explicit parallelism.
- Repeatable, approval-safe workflows (code review, incident triage, content pipelines).
- Reusable `.prose` programs you can run across supported agent runtimes.

## Example: parallel research and synthesis

```prose
# Research + synthesis with two agents running in parallel.

input topic: "What should we research?"

agent researcher:
  model: sonnet
  prompt: "You research thoroughly and cite sources."

agent writer:
  model: opus
  prompt: "You write a concise summary."

parallel:
  findings = session: researcher
    prompt: "Research {topic}."
  draft = session: writer
    prompt: "Summarize {topic}."

session "Merge the findings + draft into a final answer."
context: { findings, draft }
```

## OpenClaw runtime mapping

OpenProse programs map to OpenClaw primitives:

| OpenProse concept         | OpenClaw tool    |
| ------------------------- | ---------------- |
| Spawn session / Task tool | `sessions_spawn` |
| File read / write         | `read` / `write` |
| Web fetch                 | `web_fetch`      |

Warning

  If your tool allowlist blocks `sessions_spawn`, `read`, `write`, or
  `web_fetch`, OpenProse programs will fail. Check your
  [tools allowlist config](/gateway/config-tools).

## File locations

OpenProse keeps state under `.prose/` in your workspace:

```text
.prose/
├── .env
├── runs/
│   └── {YYYYMMDD}-{HHMMSS}-{random}/
│       ├── program.prose
│       ├── state.md
│       ├── bindings/
│       └── agents/
└── agents/
```

User-level persistent agents live at:

```text
~/.prose/agents/
```

## State backends

AccordionGroup


filesystem (default)

    State is written to `.prose/runs/...` in the workspace. No extra
    dependencies required.


in-context

    Transient state kept in the context window. Suitable for small, short-lived
    programs.


sqlite (experimental)

    Requires the `sqlite3` binary on `PATH`.


postgres (experimental)

    Requires `psql` and a connection string.


Warning

      Postgres credentials flow into sub-agent logs. Use a dedicated,
      least-privileged database.




## Security

Treat `.prose` files like code. Review them before running. Use OpenClaw tool
allowlists and approval gates to control side effects. For deterministic,
approval-gated workflows, compare with [Lobster](/tools/lobster).

## Related

CardGroup


Skills reference

    How OpenProse's skill pack loads and what gates apply.


Subagents

    OpenClaw's native multi-agent coordination layer.


Text-to-speech

    Add audio output to your workflows.


Slash commands

    All available chat commands including /prose.


Official site: [https://www.prose.md](https://www.prose.md)

---
