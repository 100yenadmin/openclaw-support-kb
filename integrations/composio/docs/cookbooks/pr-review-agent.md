---
type: composio_doc
title: "PR review agent"
source: "https://docs.composio.dev/cookbooks/pr-review-agent.md"
source_hash: "cc71f4422d4ef20b5a216b5a7edb51ad9b9fcef064aad2ab92f6f70cf7cdf82b"
system: "composio"
kb_namespace: "composio"
doc_path: "cookbooks/pr-review-agent.md"
original_doc_path: "cookbooks/pr-review-agent.md"
duplicate_index: 1
---

Source System: Composio Integration
Local KB namespace: composio

# PR review agent (/cookbooks/pr-review-agent)
Source: https://docs.composio.dev/cookbooks/pr-review-agent.md


Build a PR review agent that runs on every pull request, reads your repo's `CLAUDE.md` or `AGENTS.md`, reviews the diff against those rules, and posts structured feedback as a comment. About 40 lines of Python and a 20-line GitHub Action.

[View source on GitHub](https://github.com/ComposioHQ/composio/tree/next/docs/examples/pr-review-agent)

# What you'll build

* An AI reviewer that runs automatically on every PR via GitHub Actions
* Reads `CLAUDE.md` or `AGENTS.md` from your repo to enforce project-specific rules
* Posts structured reviews with categorized issues, security analysis, and test coverage checks

# Prerequisites

* Python 3.10+
* [Composio API key](https://platform.composio.dev/settings)
* [OpenAI API key](https://platform.openai.com/api-keys)
* A GitHub repository where you have admin access (for adding secrets and workflows)

**Stack:** Python, OpenAI Agents SDK, Composio, GitHub Actions

# Set up the project

Create a new directory and install dependencies:

```bash
mkdir pr-review-agent && cd pr-review-agent
pip install composio composio-openai-agents openai-agents
```

> Get your `COMPOSIO_API_KEY` from [Settings](https://platform.composio.dev/settings) and `OPENAI_API_KEY` from [OpenAI](https://platform.openai.com/api-keys).

Set your API keys:

```bash title=".env"
COMPOSIO_API_KEY=your_composio_api_key
OPENAI_API_KEY=your_openai_api_key
```
# Build the agent

Create `agent.py`:

```py title="agent.py"
import asyncio
import os

from agents import Agent, Runner
from composio_openai_agents import OpenAIAgentsProvider

from composio import Composio

composio = Composio(provider=OpenAIAgentsProvider())

session = composio.create(
    user_id="user_123",
    toolkits=["github"],
)

tools = session.tools()

agent = Agent(
    name="PR Reviewer",
    instructions="""You are PR-Reviewer, an AI code reviewer for GitHub pull requests.

**Step 1: Gather context**
- Fetch the PR details (title, description, author).
- List all changed files and read the diff.
- Check if the repo has a CLAUDE.md or AGENTS.md at the root.
  If found, read it and treat its rules as your review checklist.

**Step 2: Analyze the diff**
Focus only on new code added in the PR. For each changed file, look for:
- Bugs and logic errors
- Security issues (exposed secrets, injection, XSS)
- Performance problems (unnecessary loops, N+1 queries)
- Violations of CLAUDE.md / AGENTS.md rules (if the file exists)
- Whether tests were added or updated

Do NOT flag:
- Style preferences or minor wording changes
- Issues in unchanged code that existed before the PR
- Missing docstrings, type hints, or comments
- Things that would be caught by a linter or CI

For each file, ask: "Would this change break something or mislead someone?"
If no, move on.

**Step 3: Post your review as a PR comment**
Use this format:

# PR Review

**Summary**: [2-3 sentences on what this PR does]

**Review effort [1-5]**: [1 = trivial, 5 = complex and risky]

## Key issues
| # | File | Lines | Category | Description |
|---|------|-------|----------|-------------|
| 1 | `file.py` | 12-15 | Possible bug | [description] |

Categories: `possible bug`, `security`, `performance`, `best practice`

If no issues found, write "No issues found" instead of the table.

## Security concerns
[Any security issues, or "None"]

## CLAUDE.md / AGENTS.md compliance
[Rule violations, or "No project rules file found" / "All rules followed"]

## Tests
[Were relevant tests added? Yes/No with brief explanation]

Be specific and actionable. Don't invent issues to seem thorough.
If the PR looks good, say so.""",
    tools=tools,
)

async def main():
    repo = os.environ.get("GITHUB_REPO", "composiohq/composio")
    pr_number = os.environ.get("PR_NUMBER", "2800")

    result = await Runner.run(
        starting_agent=agent,
        input=f"Review pull request #{pr_number} in the {repo} repository.",
    )
    print(result.final_output)

asyncio.run(main())

```
Here's what's happening:

1. **Session creation**: `composio.create(user_id="user_123", toolkits=["github"])` creates a session with GitHub tools like `GITHUB_GET_A_PULL_REQUEST`, `GITHUB_LIST_PULL_REQUESTS_FILES`, and `GITHUB_CREATE_A_REVIEW_FOR_A_PULL_REQUEST`.

2. **CLAUDE.md / AGENTS.md as review rules**: The agent checks for either file in the repo root and uses it as its review checklist. Your existing project standards become the review guide with zero extra setup.

3. **Focused review**: The agent only flags new code that could break something or mislead someone. It skips style preferences, pre-existing issues, and anything CI already catches.

# Run it locally

```bash
python agent.py
```
If you haven't connected GitHub yet, the agent will prompt you with an auth link. Authorize and rerun.

To review a specific PR:

```bash
GITHUB_REPO=owner/repo PR_NUMBER=42 python agent.py
```
# Run it on every PR with GitHub Actions

Add `agent.py` to the root of your repo, then create `.github/workflows/review.yml`:

```yml title=".github/workflows/review.yml"
name: PR Review Agent

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: pip install composio composio-openai-agents openai-agents

      - name: Run PR review
        env:
          COMPOSIO_API_KEY: ${{ secrets.COMPOSIO_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_REPO: ${{ github.repository }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: python agent.py

```
Your repo should look like this:

```
your-repo/
├── agent.py
├── .github/workflows/review.yml
└── CLAUDE.md (optional)
```
Then set up your repo:

1. Go to **Settings > Secrets and variables > Actions**
2. Add `COMPOSIO_API_KEY` and `OPENAI_API_KEY` as repository secrets
3. **Connect GitHub to Composio** (one-time setup). The agent runs as `user_123` in CI, so that user needs a GitHub connection before the workflow can post reviews:

```bash
python -c "
from composio import Composio
composio = Composio()
session = composio.create(user_id='user_123', toolkits=['github'])
connection = session.authorize('github')
print('Visit this URL to connect GitHub:', connection.redirect_url)
connection.wait_for_connection()
print('Connected!')
"
```

After you authorize once, the connection persists. The GitHub Action will work for all future PRs.

# How it works

When a PR is opened:

1. GitHub Actions triggers the workflow and runs `agent.py`
2. The agent creates a Composio session with GitHub tools
3. It fetches the PR details and diffs using `GITHUB_GET_A_PULL_REQUEST` and `GITHUB_LIST_PULL_REQUESTS_FILES`
4. It checks for `CLAUDE.md` or `AGENTS.md` in the repo root
5. It reviews the diff and posts a structured comment using `GITHUB_CREATE_A_REVIEW_FOR_A_PULL_REQUEST`

Composio handles OAuth, tool discovery, and API execution. You don't write any GitHub API code.

# Take it further

- [Build a Chat App](/cookbooks/chat-app):
Build a full chat interface with tool calling

- [Configuring sessions](/docs/configuring-sessions):
Lock down which toolkits and tools your agent can access

- [Authenticating users](/docs/authenticating-users/manually-authenticating):
Authenticate users ahead of time during onboarding

---
