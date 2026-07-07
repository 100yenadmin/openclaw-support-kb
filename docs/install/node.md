---
type: openclaw_doc
title: "Node.js"
source: "https://docs.openclaw.ai/install/node"
source_hash: "de6bfb8ac5c5ee36ec52497709ca2af571f45dd899facdf0f39ee9f1ea19cde5"
system: "openclaw"
kb_namespace: "openclaw"
doc_path: "install/node.md"
original_doc_path: "install/node.md"
duplicate_index: 1
---

# Node.js
Source: https://docs.openclaw.ai/install/node

OpenClaw requires **Node 22.19+, Node 23.11+, or Node 24+**. **Node 24 is the default and recommended runtime** for installs, CI, and release workflows; Node 22 remains supported via the active LTS line. The [installer script](/install#alternative-install-methods) detects and installs Node automatically — use this page when you want to set up Node yourself (versions, PATH, global installs).

## Check your version

```bash
node -v
```

`v24.x.x` or higher is the recommended default. `v22.19.x` or higher is the supported Node 22 LTS path (upgrade to Node 24 when convenient). Node 23 builds before `v23.11.0` are unsupported. If Node is missing or outside the supported range, pick an install method below.

## Install Node

Tabs


macOS

    **Homebrew** (recommended):

    ```bash
    brew install node
    ```

    Or download the macOS installer from [nodejs.org](https://nodejs.org/).



Linux

    **Ubuntu / Debian:**

    ```bash
    curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

    **Fedora / RHEL:**

    ```bash
    sudo dnf install nodejs
    ```

    Or use a version manager (see below).



Windows

    **winget** (recommended):

    ```powershell
    winget install OpenJS.NodeJS.LTS
    ```

    **Chocolatey:**

    ```powershell
    choco install nodejs-lts
    ```

    Or download the Windows installer from [nodejs.org](https://nodejs.org/).



Using a version manager (nvm, fnm, mise, asdf)

  Version managers let you switch between Node versions easily. Popular options:

- [**fnm**](https://github.com/Schniz/fnm) - fast, cross-platform
- [**nvm**](https://github.com/nvm-sh/nvm) - widely used on macOS/Linux
- [**mise**](https://mise.jdx.dev/) - polyglot (Node, Python, Ruby, etc.)

Example with fnm:

```bash
fnm install 24
fnm use 24
```


Warning

  Initialize your version manager in your shell startup file (`~/.zshrc` or `~/.bashrc`). If you skip this, `openclaw` may not be found in new terminal sessions because PATH won't include Node's bin directory.


## Troubleshooting

### `openclaw: command not found`

This almost always means npm's global bin directory isn't on your PATH.

Steps


Find your global npm prefix

    ```bash
    npm prefix -g
    ```


Check if it's on your PATH

    ```bash
    echo "$PATH"
    ```

    Look for `<npm-prefix>/bin` (macOS/Linux) or `<npm-prefix>` (Windows) in the output.



Add it to your shell startup file


Tabs


macOS / Linux

        Add to `~/.zshrc` or `~/.bashrc`:

        ```bash
        export PATH="$(npm prefix -g)/bin:$PATH"
        ```

        Then open a new terminal (or run `rehash` in zsh / `hash -r` in bash).


Windows

        Add the output of `npm prefix -g` to your system PATH via Settings → System → Environment Variables.





### Permission errors on `npm install -g` (Linux)

If you see `EACCES` errors, switch npm's global prefix to a user-writable directory:

```bash
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
```

Add the `export PATH=...` line to your `~/.bashrc` or `~/.zshrc` to make it permanent.

## Related

- [Install Overview](/install) - all installation methods
- [Updating](/install/updating) - keeping OpenClaw up to date
- [Getting Started](/start/getting-started) - first steps after install

---
