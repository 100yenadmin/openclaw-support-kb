#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathExists, repoRootFromImportMeta } from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);
const scenarios = JSON.parse(await readFile(path.join(repoRoot, "evals", "customer-scenarios.json"), "utf8"));

const candidateCorpusFiles = [
  "README.md",
  "INSTALL_FOR_AGENTS.md",
  "AGENTS.md",
  "skills/RESOLVER.md",
  "skills/openclaw-support-kb/SKILL.md",
  "skills/openclaw-config-repair/SKILL.md",
  "skills/openclaw-skill-discovery/SKILL.md",
  "skills/openclaw-support-escalation/SKILL.md",
  "runbooks/system-explainer.md",
  "runbooks/agent-creation.md",
  "runbooks/channel-setup.md",
  "runbooks/telegram-setup.md",
  "runbooks/config-repair.md",
  "runbooks/skill-discovery.md",
  "runbooks/self-diagnostics.md",
  "runbooks/support-escalation.md",
  "runbooks/updates.md",
  "support/contacts.md",
];

const corpusFiles = [];
for (const file of candidateCorpusFiles) {
  if (await pathExists(path.join(repoRoot, file))) corpusFiles.push(file);
}

const corpus = (
  await Promise.all(
    corpusFiles.map(async (file) => `${file}\n${await readFile(path.join(repoRoot, file), "utf8")}`),
  )
).join("\n\n");

const failures = [];

for (const scenario of scenarios) {
  for (const file of [...scenario.mustHaveDocs, ...scenario.mustHaveRunbooks]) {
    if (!(await pathExists(path.join(repoRoot, file)))) {
      failures.push(`${scenario.id}: missing expected file ${file}`);
    }
  }
  for (const needle of scenario.mustMention) {
    if (!corpus.toLowerCase().includes(needle.toLowerCase())) {
      failures.push(`${scenario.id}: missing expected guidance "${needle}"`);
    }
  }
}

const runbookFiles = [
  "runbooks/system-explainer.md",
  "runbooks/agent-creation.md",
  "runbooks/channel-setup.md",
  "runbooks/telegram-setup.md",
  "runbooks/config-repair.md",
  "runbooks/skill-discovery.md",
  "runbooks/self-diagnostics.md",
  "runbooks/support-escalation.md",
  "runbooks/updates.md",
];

for (const file of runbookFiles) {
  const fullPath = path.join(repoRoot, file);
  if (!(await pathExists(fullPath))) continue;
  const text = await readFile(fullPath, "utf8");
  if (!text.includes("search_role: \"workflow_not_source\"")) {
    failures.push(`${file}: missing workflow_not_source frontmatter`);
  }
  if (!/## Search Contract/.test(text)) {
    failures.push(`${file}: missing Search Contract section`);
  }
  if (!/gbrain (search|query)/.test(text)) {
    failures.push(`${file}: missing concrete GBrain query/search command`);
  }
  if (!/```bash/.test(text)) {
    failures.push(`${file}: missing command block`);
  }
  if (!/(docs\/|Source: https:\/\/docs\.openclaw\.ai|support\/contacts|kb-manifest|https:\/\/github\.com\/)/.test(text)) {
    failures.push(`${file}: missing source path or source URL cue`);
  }
  if (!/## (Guided Workflow|Workflow|First Commands|Explanation Shape|Update OpenClaw Install|Rules)/.test(text)) {
    failures.push(`${file}: missing workflow/procedure section`);
  }
  if (!/(## Nontechnical User Prompts|Ask the user|For nontechnical users|Show the draft)/i.test(text)) {
    failures.push(`${file}: missing nontechnical user prompt guidance`);
  }
  if (!/(## Stop Conditions|## Failure Routing|## Scanner Missing|Blocks Automatic Install|Refusing|Never|do not)/i.test(text)) {
    failures.push(`${file}: missing safety stop/failure guidance`);
  }
  if (text.split("\n").length > 220) {
    failures.push(`${file}: runbook is too long; keep it workflow-based, not a copied docs page`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Scenario eval passed for ${scenarios.length} customer scenarios.`);
