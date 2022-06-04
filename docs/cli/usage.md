# CLI usage

The nginx-proxy offers a CLI that can be used to e.g. simplify or automate the deployment of applications.

## Prerequisites

1. You need to have node installed on your system when you want to use the CLI.

### Install node

- **Step 1:** Get installation script with (replacing `16.x` with the version that you want to install):

```bash
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
```

- **Step 2:** Execute the script with:

```bash
bash nodesource_setup.sh
```

- **Step 3:** Install node

```bash
apt install nodejs
```

- **Step 4 (optional):** Check node version

```bash
node -v
```

# Use the CLI

To see a list of available commands you can run:

```bash
npx nginx-proxy-cli -h
```
