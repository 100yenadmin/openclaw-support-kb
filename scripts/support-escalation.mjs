#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  buildSupportDraft,
  canonicalSourceDir,
  sha256,
  readJsonIfExists,
  repoRootFromImportMeta,
} from "./lib/openclaw-support-kb.mjs";

const repoRoot = repoRootFromImportMeta(import.meta.url);

function argValue(args, flag, fallback = undefined) {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
}

function argValues(args, flag) {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === flag && args[i + 1]) {
      values.push(args[i + 1]);
      i += 1;
    }
  }
  return values;
}

function approvalContextPayload({ channel, recipient, draftSha, subject = "", account = "" }) {
  return {
    channel,
    recipient,
    draftSha,
    subject,
    account,
  };
}

function approvalContextSha(payload) {
  return sha256(JSON.stringify(payload));
}

async function requireApprovedDraft(args, channel) {
  const draftPath = argValue(args, "--draft");
  if (!draftPath) throw new Error("--draft is required");
  const expectedSha = argValue(args, "--approved-draft-sha");
  const expectedRecipient = argValue(args, "--approved-recipient");
  if (!expectedSha || !expectedRecipient) {
    throw new Error(
      `Refusing to send without --approved-draft-sha and --approved-recipient. Show the ${channel} draft to the user first.`,
    );
  }
  const content = await readFile(draftPath, "utf8");
  const actualSha = sha256(content);
  if (actualSha !== expectedSha) {
    throw new Error(`Refusing to send: draft hash mismatch. Expected ${expectedSha}, got ${actualSha}.`);
  }
  const subject = argValue(args, "--subject", "");
  const account = argValue(args, "--account", "");
  const approvalSha = argValue(args, "--approved-context-sha");
  if (!approvalSha) {
    throw new Error("Refusing to send without --approved-context-sha. Generate it after the user approves recipient, account, and subject.");
  }
  const contextSha = approvalContextSha(
    approvalContextPayload({
      channel,
      recipient: expectedRecipient,
      draftSha: actualSha,
      subject,
      account,
    }),
  );
  if (contextSha !== approvalSha) {
    throw new Error(`Refusing to send: approval context hash mismatch. Expected ${approvalSha}, got ${contextSha}.`);
  }
  return { draftPath, content };
}

function commandAvailable(command) {
  const result = spawnSync(command, ["--version"], { stdio: "ignore" });
  return !result.error;
}

async function draft(args) {
  const manifest =
    (await readJsonIfExists(path.join(repoRoot, "kb-manifest.json"))) ??
    (await readJsonIfExists(path.join(canonicalSourceDir(), "kb-manifest.json"))) ??
    {};
  const diagnosticsPath = argValue(args, "--diagnostics");
  const diagnostics = diagnosticsPath ? await readFile(diagnosticsPath, "utf8") : "";
  const out = argValue(args, "--out", path.join(os.tmpdir(), `openclaw-support-draft-${Date.now()}.md`));
  const docsConsulted = [
    ...argValues(args, "--doc"),
    ...args.filter((arg) => arg.startsWith("https://docs.openclaw.ai/")),
  ];
  const searchQueries = argValues(args, "--search-query");
  const commandsTried = argValues(args, "--command-tried");
  const content = buildSupportDraft({
    issue: argValue(args, "--issue", ""),
    docsConsulted,
    searchQueries,
    commandsTried,
    kbManifest: manifest,
    diagnostics,
  });
  await mkdir(path.dirname(path.resolve(out)), { recursive: true });
  await writeFile(out, content, { flag: "wx" });
  console.log(out);
  const draftSha = sha256(content);
  console.log(`sha256=${draftSha}`);
  console.log("Generate --approved-context-sha after the user approves the exact recipient, subject, account, and transport.");
}

async function approvalContext(args) {
  const draftPath = argValue(args, "--draft");
  if (!draftPath) throw new Error("--draft is required");
  const channel = argValue(args, "--channel");
  const recipient = argValue(args, "--recipient");
  if (!channel || !recipient) throw new Error("--channel and --recipient are required");
  const content = await readFile(draftPath, "utf8");
  const draftSha = sha256(content);
  const payload = approvalContextPayload({
    channel,
    recipient,
    draftSha,
    subject: argValue(args, "--subject", ""),
    account: argValue(args, "--account", ""),
  });
  console.log(`draftSha=${draftSha}`);
  console.log(`approvedContextSha=${approvalContextSha(payload)}`);
}

async function sendEmail(args) {
  const subject = argValue(args, "--subject", "[OpenClaw Support] Support request");
  const account = argValue(args, "--account");
  const approvedRecipient = argValue(args, "--approved-recipient");
  const { draftPath } = await requireApprovedDraft(args, "email");
  if (approvedRecipient !== "support@electricsheephq.com") {
    throw new Error("Refusing to send email: approved recipient must be support@electricsheephq.com");
  }
  if (!account) {
    throw new Error("Refusing to send email without explicit --account. Do not use account auto for support escalation.");
  }
  if (!commandAvailable("gog")) throw new Error("gog is not available on PATH");
  const result = spawnSync(
    "gog",
    ["gmail", "send", "--account", account, "--to", "support@electricsheephq.com", "--subject", subject, "--body-file", draftPath],
    { stdio: "inherit" },
  );
  process.exit(result.status ?? 1);
}

async function sendTelegram(args) {
  const approvedRecipient = argValue(args, "--approved-recipient");
  const { content } = await requireApprovedDraft(args, "Telegram");
  if (approvedRecipient !== "@evaOS_support_bot") {
    throw new Error("Refusing to send Telegram: approved recipient must be @evaOS_support_bot");
  }
  if (!commandAvailable("openclaw")) throw new Error("openclaw is not available on PATH");
  const result = spawnSync(
    "openclaw",
    ["message", "send", "--channel", "telegram", "--target", "@evaOS_support_bot", "--message", content],
    { stdio: "inherit" },
  );
  process.exit(result.status ?? 1);
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === "draft") await draft(args);
  else if (command === "approval-context") await approvalContext(args);
  else if (command === "send-email") await sendEmail(args);
  else if (command === "send-telegram") await sendTelegram(args);
  else {
    console.log(`Usage:
  node scripts/support-escalation.mjs draft --issue "..." [--doc URL_OR_PATH] [--search-query "..."] [--command-tried "..."] [--diagnostics file] [--out file]
  node scripts/support-escalation.mjs approval-context --channel email --draft file --recipient support@electricsheephq.com --subject "..." --account you@example.com
  node scripts/support-escalation.mjs send-email --draft file --subject "..." --account you@example.com --approved-recipient support@electricsheephq.com --approved-draft-sha SHA --approved-context-sha SHA
  node scripts/support-escalation.mjs approval-context --channel Telegram --draft file --recipient @evaOS_support_bot
  node scripts/support-escalation.mjs send-telegram --draft file --approved-recipient @evaOS_support_bot --approved-draft-sha SHA --approved-context-sha SHA`);
    process.exit(command ? 1 : 0);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
