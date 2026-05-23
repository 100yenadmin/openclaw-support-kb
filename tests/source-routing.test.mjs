import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");

async function read(relativePath) {
  return readFile(path.join(repoRoot, relativePath), "utf8");
}

async function markdownFiles(relativeDir) {
  const dir = path.join(repoRoot, relativeDir);
  const result = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.name.endsWith(".md")) result.push(path.relative(repoRoot, fullPath));
    }
  }
  await walk(dir);
  return result.sort();
}

test("logical source catalog keeps system config surfaces separate", async () => {
  const catalog = JSON.parse(await read("kb-sources.json"));
  const byId = new Map(catalog.logicalSources.map((source) => [source.id, source]));

  assert.equal(catalog.physicalGbrainSourceId, "openclaw-support-kb");
  assert.equal(byId.get("openclaw").configSurface, "openclaw.json");
  assert.deepEqual(byId.get("openclaw").pathPrefixes, ["docs/", "releases/", "runbooks/", "skills-index/", "security/", "support/"]);
  assert.equal(byId.get("hermes-agent").configSurface, "~/.hermes/config.yaml");
  assert.deepEqual(byId.get("hermes-agent").pathPrefixes, ["systems/hermes/"]);
  assert.match(byId.get("paperclip-mission-control").configSurface, /Paperclip/);
  assert.deepEqual(byId.get("paperclip-mission-control").pathPrefixes, ["systems/paperclip/"]);
  assert.notEqual(byId.get("openclaw").pathPrefix, byId.get("hermes-agent").pathPrefix);
  assert.notEqual(byId.get("hermes-agent").pathPrefix, byId.get("paperclip-mission-control").pathPrefix);
});

test("generated Hermes and Paperclip pages carry namespace markers", async () => {
  const hermesConfig = await read("systems/hermes/docs/user-guide/configuration.md");
  const paperclipAgents = await read("systems/paperclip/docs/site/api/agents.md");

  assert.match(hermesConfig, /Source System: Hermes Agent/);
  assert.match(hermesConfig, /Local KB namespace: hermes-agent/);
  assert.match(hermesConfig, /~\/\.hermes\/config\.yaml/);
  assert.match(paperclipAgents, /Source System: Paperclip Mission Control/);
  assert.match(paperclipAgents, /Local KB namespace: paperclip-mission-control/);
  assert.match(paperclipAgents, /GET \/api\/companies\/\{companyId\}\/agents/);
});

test("generated source pages do not duplicate identical source hashes", async () => {
  const seen = new Set();
  for (const file of await markdownFiles("docs")) {
    const text = await read(file);
    const source = /^source: "(.+)"$/m.exec(text)?.[1];
    const sourceHash = /^source_hash: "(.+)"$/m.exec(text)?.[1];
    if (source && sourceHash) {
      const key = `${source}\0${sourceHash}`;
      assert.equal(seen.has(key), false, `${file} duplicates an existing source_hash`);
      seen.add(key);
    }
  }
});

test("router and recovery skills require target-first source use", async () => {
  const router = await read("skills/customer-kb-router/SKILL.md");
  const recovery = await read("skills/cross-system-recovery/SKILL.md");
  const recoveryRunbook = await read("runbooks/cross-system-recovery.md");
  const hermes = await read("skills/hermes-support-kb/SKILL.md");
  const openclaw = await read("skills/openclaw-support-kb/SKILL.md");
  const resolver = await read("skills/RESOLVER.md");
  const companyOs = await read("skills/evaos-company-os/SKILL.md");

  assert.match(router, /Identify the target system before giving commands/);
  assert.match(router, /OpenClaw[\s\S]*Hermes Agent[\s\S]*Paperclip Mission Control/);
  assert.match(recovery, /Search the target namespace first/);
  assert.match(recovery, /openclaw config schema[\s\S]*openclaw config patch --dry-run[\s\S]*openclaw config validate/);
  assert.match(recoveryRunbook, /Use exactly one target search block first/);
  assert.doesNotMatch(recoveryRunbook, /<target system> Local KB namespace/);
  assert.match(hermes, /Do not edit `openclaw\.json` for a Hermes-only issue/);
  assert.match(openclaw, /Do not apply OpenClaw config guidance to Hermes/);
  assert.match(resolver, /EVAOS roadmap[\s\S]*skills\/evaos-company-os\/SKILL\.md/);
  assert.match(companyOs, /not through a separate AgentMD mirror/);
  assert.match(companyOs, /Notion `EVAOS Company OS` is the agent operating manual/);
  assert.match(companyOs, /EVAOS Agent Handoff\s+Queue/);
  assert.match(companyOs, /Open or search Notion for `EVAOS Company OS`/);
  assert.match(companyOs, /Resolve the relevant Linear initiative\/project/);
  assert.match(companyOs, /Resolve the affected system in `EVAOS Systems`/);
  assert.match(companyOs, /Read current evidence before recommending release, rollout, or roadmap state/);
  assert.match(companyOs, /Linear owns the product roadmap/);
  assert.match(companyOs, /GitHub owns implementation work/);
  assert.match(companyOs, /Paperclip owns live execution\/orchestration/);
  assert.match(companyOs, /Treat search results as cache, not\s+source of truth/);
  assert.match(companyOs, /Do not create duplicate GitHub and Linear issues/);
  assert.match(companyOs, /Mutation boundary: read-only, PR-only, support VM, or production rollout/);
  assert.match(companyOs, /Required closeout: evidence, blocker, and next action/);
  assert.match(companyOs, /If Linear write tools are unavailable/);
});

test("EVAOS Company OS scenario exercises the real routing sequence", async () => {
  const scenarios = JSON.parse(await read("evals/customer-scenarios.json"));
  const scenario = scenarios.find(({ id }) => id === "evaos-company-os-router");
  const companyOs = await read("skills/evaos-company-os/SKILL.md");
  const resolver = await read("skills/RESOLVER.md");

  assert.ok(scenario, "missing evaos-company-os-router scenario");
  assert.deepEqual(scenario.mustHaveDocs, ["skills/evaos-company-os/SKILL.md", "skills/RESOLVER.md"]);
  assert.match(resolver, /Company OS[\s\S]*skills\/evaos-company-os\/SKILL\.md/);

  for (const phrase of [
    "open or search Notion",
    "EVAOS Agent Handoff Queue",
    "Resolve the relevant Linear initiative/project",
    "Resolve the affected system",
    "EVAOS Systems",
    "canonical GitHub repo",
    "Read current evidence before recommending",
    "Linear owns the product roadmap",
    "GitHub owns implementation work",
    "separate AgentMD",
    "not a second canonical issue tracker",
    "Required closeout",
    "Linear write tools are unavailable",
  ]) {
    assert.ok(
      scenario.mustMention.includes(phrase),
      `scenario should require behavior phrase: ${phrase}`,
    );
    assert.match(companyOs, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
