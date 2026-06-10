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

  assert.match(router, /Identify the target system before giving commands/);
  assert.match(router, /OpenClaw[\s\S]*Hermes Agent[\s\S]*Paperclip Mission Control/);
  assert.match(recovery, /Search the target namespace first/);
  assert.match(recovery, /openclaw config schema[\s\S]*openclaw config patch --dry-run[\s\S]*openclaw config validate/);
  assert.match(recoveryRunbook, /Use exactly one target search block first/);
  assert.doesNotMatch(recoveryRunbook, /<target system> Local KB namespace/);
  assert.match(hermes, /Do not edit `openclaw\.json` for a Hermes-only issue/);
  assert.match(openclaw, /Do not apply OpenClaw config guidance to Hermes/);
  assert.doesNotMatch(resolver, /skills\/evaos-company-os\/SKILL\.md/);
});

test("public support KB does not route internal Company OS prompts", async () => {
  const scenarios = JSON.parse(await read("evals/customer-scenarios.json"));
  const resolver = await read("skills/RESOLVER.md");
  const markdown = await markdownFiles("skills");

  assert.equal(scenarios.some(({ id }) => id === "evaos-company-os-router"), false);
  assert.equal(markdown.some((file) => /evaos-company-os/i.test(file)), false);
  assert.doesNotMatch(resolver, /Company OS/);
  assert.doesNotMatch(resolver, /what agents should work on next/i);

  for (const phrase of ["EVAOS Company OS", "Operating Lanes", "WorldOS"]) {
    assert.equal(
      scenarios.some(({ prompt = "" }) => prompt.includes(phrase)),
      false,
      `public support KB should not keep internal routing prompt: ${phrase}`,
    );
  }
});
