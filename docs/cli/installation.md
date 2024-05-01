# CLI usage

The `nginx-proxy` offers a Node CLI that can be used to e.g. simplify or automate the deployment of applications.

## Prerequisites

You need to have [Node.js](https://nodejs.org) `>= 18` installed on your system when you want to use the CLI.

### Install node

We recommend to install node using [fnm](https://github.com/Schniz/fnm).

- **Step 1:** Follow the [fnm installation instructions](https://github.com/Schniz/fnm?tab=readme-ov-file#installation)

- **Step 2:** Install your desired node version

```bash
fnm install 20
fnm default 20
```

- **Step 3 (optional):** Verify installation

```bash
node -v
```

## Use the CLI

To see a list of available commands you can run:

```bash
npx nginx-proxy-cli -h
```
