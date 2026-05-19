# evaOS Live Browser Agent Kit

The Live Browser Agent Kit lets humans watch a KasmVNC browser while agents
control the same visible Chromium session through VM-local CDP.

## Contract

- KasmVNC is the human viewer and login handoff surface.
- CDP is agent-only and loopback-only: `http://127.0.0.1:9223`.
- The dashboard/public proxy routes only the KasmVNC browser runtime.
- Agents should use `evaos-browser-control` or OpenClaw browser/CDP tools for
  actions and screenshots.
- Closing the human browser tab should not immediately kill the agent browser.
  Stop, idle timeout, hard TTL, and cleanup are authoritative.

## Commands

```bash
evaos-live-browser start
evaos-live-browser status
evaos-browser-control status --json
evaos-browser-control open-url "https://example.com"
evaos-browser-control screenshot --out /root/agent-files/downloads/browser-runs/<run-id>/screenshot.png
evaos-browser-control logs
evaos-live-browser stop
```

## Canary Smoke

From support-control, run the smoke against one explicit target only:

```bash
evaos-support runtime-health \
  --targets <customer_id> \
  --live-browser-smoke \
  --run-id live-browser-<customer_id>-YYYYMMDD
```

The smoke starts Live Browser, verifies KasmVNC on `127.0.0.1:8444`, verifies
CDP `/json/version` on `127.0.0.1:9223`, opens `about:blank`, captures a
screenshot, checks log signal counts, stops the service, and confirms cleanup.

Do not run Live Browser smoke across the whole fleet unless explicitly
approved. Normal fleet runtime-health remains read-only.

## Production UI Safety

Arbostar, WPForms, and customer sites are read-only by default. Exact same-turn
approval is required for submits, creates, updates, assignments, approvals,
deletes, dispatches, exports, or external messages.

Never ask for credentials in chat. If a site needs login, ask the human to use
the dashboard Live Browser, then resume after they confirm the login is done.

## Evidence

Save screenshots and browser evidence under:

```text
/root/agent-files/downloads/browser-runs/<run-id>/
```

Reports should include the customer, target app, URL, login state, artifact
path, action summary, approval text for mutations, IDs observed, and blockers.
