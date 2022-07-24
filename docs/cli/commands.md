# CLI commands

::: info Disclaimer
Before using any of the below commands, make sure that you followed the steps described on the [CLI installation page](/cli/installation).
:::

To see a list of all commands, you can run:

```bash
npx nginx-proxy-cli -h
```

## deploy

Clone or pull latest git repository and (re)build docker-compose.yml.

::: danger .env file
If your application uses a `.env` file for `docker-compose.yml`, this CLI does currently not support a way to pass environment variables. You will need to manually login to your linux server to create it.

**Important**: Unless your `.env` only contains non-sensitive information (e.g. domain name), you should not commit your `.env` file to git.
:::

```bash
npx nginx-proxy-cli deploy https://github.com/larsrickert/example
```

**Options**

| Option       | Description                                                                                                                   | Default value     |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| -h, --help   | display help for command                                                                                                      |                   |
| -b, --branch | Branch name to checkout before deploying                                                                                      | main              |
| -d, --dir    | Directory where the git repository should be cloned in. Will create a subfolder inside this directory (see option `--folder`) | ./applications    |
| -f, --folder | Folder name inside the applications directory that the repo is cloned to                                                      | `repository name` |
| -r, --root   | Root directory inside the git repository where the docker-compose.yml is located that should be deployed                      | .                 |
