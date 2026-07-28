---
type: openclaw_doc
title: "Install"
source: "https://docs.openclaw.ai/install"
source_hash: "eaef8d56623fee810e8407b8093b4614a9131f67a386f066b5f9584a9d7bb67f"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install.md"
original_doc_path: "install.md"
duplicate_index: 1
---

# Install
Source: https://docs.openclaw.ai/install

## System requirements

- **Node 22.22.3+, 24.15+, or 25.9+** - Node 26 is the recommended default; the installer script provisions it automatically when Node is missing.
- **macOS, Linux, or Windows** - Windows users can start with the native Windows Hub app, the PowerShell CLI installer, or a WSL2 Gateway. See [Windows](/platforms/windows).
- `pnpm` is only needed if you build from source.

## Recommended: installer script

The fastest way to install. It detects your OS, installs Node if needed, installs OpenClaw, and launches onboarding.

Note

Windows desktop users can also install the native [Windows Hub](/platforms/windows#recommended-windows-hub) companion app, which includes setup, tray status, chat, node mode, and local MCP mode.

Tabs


macOS / Linux / WSL2

    ```bash
    curl -fsSL https://openclaw.ai/install.sh | bash
    ```


Windows (PowerShell)

    ```powershell
    iwr -useb https://openclaw.ai/install.ps1 | iex
    ```


To install without running onboarding:

Tabs


macOS / Linux / WSL2

    ```bash
    curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
    ```


Windows (PowerShell)

    ```powershell
    & ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
    ```


For all flags and CI/automation options, see [Installer internals](/install/installer).

## Alternative install methods

### Local prefix installer (`install-cli.sh`)

Use this when you want OpenClaw and Node kept under a local prefix such as
`~/.openclaw`, without depending on a system-wide Node install:

```bash
curl -fsSL https://openclaw.ai/install-cli.sh | bash
```

It supports npm installs by default, plus git-checkout installs under the same
prefix flow. Full reference: [Installer internals](/install/installer#install-clish).

Already installed? Switch between package and git installs with
`openclaw update --channel dev` and `openclaw update --channel stable`. See
[Updating](/install/updating#switch-between-npm-and-git-installs).

### npm, pnpm, or bun

If you already manage Node yourself:

Tabs


npm

    ```bash
    npm install -g openclaw@latest
    openclaw onboard --install-daemon
    ```


Note

    The hosted installer clears npm freshness filters such as `min-release-age`
    for the OpenClaw package install. If you install manually with npm, your own
    npm policy still applies.




pnpm

    ```bash
    pnpm add -g openclaw@latest
    pnpm approve-builds -g
    openclaw onboard --install-daemon
    ```


Note

    pnpm requires explicit approval for packages with build scripts. Run `pnpm approve-builds -g` after the first install.




bun

    ```bash
    bun add -g openclaw@latest
    openclaw onboard --install-daemon
    ```


Note

    Bun can install the global package, but the resulting `openclaw` executable requires a supported Node runtime because OpenClaw state uses `node:sqlite`.




### From source

For contributors or anyone who wants to run from a local checkout:

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build && pnpm ui:build
pnpm link --global
openclaw onboard --install-daemon
```

Or skip the link and use `pnpm openclaw ...` from inside the repo. See [Setup](/start/setup) for full development workflows.

### Install from the GitHub main checkout

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --install-method git --version main
```

### Containers and package managers

CardGroup


Docker

    Containerized or headless deployments.


Podman

    Rootless container alternative to Docker.


Nix

    Declarative install via Nix flake.


Ansible

    Automated fleet provisioning.


Bun

    Optional dependency installer and package-script runner.


## Verify the install

```bash
openclaw --version      # confirm the CLI is available
openclaw doctor         # check for config issues
openclaw gateway status # verify the Gateway is running
```

If you want managed startup after install:

- macOS: LaunchAgent via `openclaw onboard --install-daemon` or `openclaw gateway install`
- Linux/WSL2: systemd user service via the same commands
- Native Windows: Scheduled Task first, with a per-user Startup-folder login item fallback if task creation is denied

## Hosting and deployment

Deploy OpenClaw on a cloud server or VPS. See [Linux server](/vps) for the full
provider picker (DigitalOcean, Hetzner, Hostinger, Fly.io, GCP, Azure, Railway,
Northflank, Oracle Cloud, Raspberry Pi, and more), or deploy declaratively on
[Render](/install/render).

CardGroup


VPS

    Pick a provider.


Docker VM

    Shared Docker steps.


Kubernetes

    K8s deployment.


## Update, migrate, or uninstall

CardGroup


Updating

    Keep OpenClaw up to date.


Migrating

    Move to a new machine.


Uninstall

    Remove OpenClaw completely.


## Troubleshooting: `openclaw` not found

Almost always a PATH issue: npm's global bin directory isn't on your shell's `PATH`. See [Node.js troubleshooting](/install/node#troubleshooting) for the full fix, including the Windows path.

```bash
node -v           # Node installed?
npm prefix -g     # Where are global packages?
echo "$PATH"      # Is the global bin dir in PATH?
```

---
