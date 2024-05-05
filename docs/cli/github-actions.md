# Using the CLI with GitHub Actions (CI/CD)

You can use the CLI to automatically (re)deploy your application when you commit changes to your GitHub repository using [GitHub Actions](https://github.com/features/actions) and SSH.

The following action will trigger a (re)deploy on every change to the `main` branch as well as on manually triggered workflow runs. Checkout the [deploy command documentation](/cli/commands#deploy) for more options.

::: danger .env file
If your application uses a `.env` file for `docker-compose.yml`, this CLI does currently not support a way to pass environment variables. You will need to manually login to your linux server to create it.

**Important**: Unless your `.env` only contains non-sensitive information (e.g. domain name), you should not commit your `.env` file to git.
:::

## Add SSH credentials as GitHub secrets

In order to login to your linux server, you need to add your user credentials as GitHub secrets. Follow the [GitHub guide](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) to add the following secrets:

- `SSH_HOST`: The host of your linux server (e.g. IP address or domain)
- `SSH_USERNAME`: linux username
- `SSH_PASSWORD`: linux password

## Create GitHub workflow

Inside your git repository, create a `.github/workflows/deploy.yml` file and add the following content:

:::tip CLI version
We recommend to specify the major version of the CLI to use (e.g. `npx nginx-proxy-cli@3`).
Otherwise, breaking changes we make to the CLI might break your existing GitHub actions.
:::

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Git repository
        uses: actions/checkout@v4

      - name: Deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          envs: GITHUB_SERVER_URL,GITHUB_REPOSITORY
          script: npx nginx-proxy-cli@3 deploy $GITHUB_SERVER_URL/$GITHUB_REPOSITORY --dir=~/nginx-proxy/applications
```

**Notes**:

- The `$GITHUB_SERVER_URL` and `$GITHUB_REPOSITORY` environment variables are provided by GitHub and make up the full URL of the repository that the above action was triggered in, e.g. `https://github.com/larsrickert/nginx-proxy`
