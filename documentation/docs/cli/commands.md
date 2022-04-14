# CLI commands

::: warning Disclaimer
Before using any of the below commands, make sure that you followed the step described on the [CLI usage page](/cli/usage).
:::

To see a list of all commands, you can run:

```bash
npx nginx-proxy-cli -h
```

## deploy

::: danger .env file
If your application uses a `.env` file for `docker-compose.yml`, this command does currently not support a way to pass environment variables. You will need to manually login to your linux server to create it.

**Important**: Unless your `.env` only contains non-sensitive information (e.g. domain name), you should **NEVER** commit your `.env` file to git.
:::

Clone or pull latest git repository and (re)build docker-compose.yml.

```bash
npx nginx-proxy-cli deploy https://github.com/larsrickert/example
```

**Options**

| Option       | description                                                                                          | default value   |
| ------------ | ---------------------------------------------------------------------------------------------------- | --------------- |
| -h, --help   | display help for command                                                                             |                 |
| -b, --branch | Branch name to checkout before deploying                                                             | main            |
| -d, --dir    | Root directory where the applications should be deployed                                             | ./applications  |
| -f, --folder | Folder name inside the applications directory that the repo is cloned to                             | repository name |
| -r, --root   | Root directory in the git repository where the docker-compose.yml is located that should be deployed | .               |
