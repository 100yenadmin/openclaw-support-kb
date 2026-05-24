---
type: openclaw_doc
title: "Install"
source: "https://docs.openclaw.ai/install"
source_hash: "9cd314f70715496f623ecbb0b2940784c0923216fe6429269cd122382a082f0d"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install.md"
original_doc_path: "install.md"
duplicate_index: 1
---

# Install
Source: https://docs.openclaw.ai/install

## System requirements

- **Node 24** (recommended) or Node 22.19+ - the installer script handles this automatically
- **macOS, Linux, or Windows** - both native Windows and WSL2 are supported; WSL2 is more stable. See [Windows](/platforms/windows).
- `pnpm` is only needed if you build from source

## Recommended: installer script

The fastest way to install. It detects your OS, installs Node if needed, installs OpenClaw, and launches onboarding.

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

    Bun is supported for the global CLI install path. For the Gateway runtime, Node remains the recommended daemon runtime.




Troubleshooting: sharp build errors (npm)

  If `sharp` fails due to a globally installed libvips:

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

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

    CLI-only usage via the Bun runtime.


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

Deploy OpenClaw on a cloud server or VPS:

CardGroup


VPS
Any Linux VPS

Docker VM
Shared Docker steps

Kubernetes
K8s

Fly.io
Fly.io

Hetzner
Hetzner

GCP
Google Cloud

Azure
Azure

Railway
Railway

Render
Render

Northflank
Northflank

## Update, migrate, or uninstall

CardGroup


Updating

    Keep OpenClaw up to date.


Migrating

    Move to a new machine.


Uninstall

    Remove OpenClaw completely.


## Troubleshooting: `openclaw` not found

If the install succeeded but `openclaw` is not found in your terminal:

```bash
node -v           # Node installed?
npm prefix -g     # Where are global packages?
echo "$PATH"      # Is the global bin dir in PATH?
```

If `$(npm prefix -g)/bin` is not in your `$PATH`, add it to your shell startup file (`~/.zshrc` or `~/.bashrc`):

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

Then open a new terminal. See [Node setup](/install/node) for more details.

---
