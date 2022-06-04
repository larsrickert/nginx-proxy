# Using the CLI with GitHub Actions (CI/CD)

You can use the CLI to automatically (re)deploy your application when you commit changes to your GitHub repository using [GitHub Actions](https://github.com/features/actions) and SSH.

The following action will trigger a (re)deploy on every change to the `main` branch as well as on manually triggered workflow runs. Checkout the [deploy command documentation](/cli/commands#deploy) for more options.

::: danger .env file
If your application uses a `.env` file for `docker-compose.yml`, the CLI does currently not support a way to pass environment variables. You will need to manually login to your linux server to create it.

**Important**: Unless your `.env` only contains non-sensitive information (e.g. domain name), you should **NEVER** commit your `.env` file to git.
:::

::: warning GitHub secrets
You must add the following secrets to your GitHub repository:

- `SSH_HOST`: The host of your linux server (e.g. IP address)
- `SSH_USERNAME`: linux username
- `SSH_PASSWORD`: linux password
  :::

```yaml
name: Deploy
on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Git repository
        uses: actions/checkout@v2
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          envs: GITHUB_SERVER_URL,GITHUB_REPOSITORY,GITHUB_REF_NAME
          script: npx nginx-proxy-cli deploy $GITHUB_SERVER_URL/$GITHUB_REPOSITORY --dir=~/nginx-proxy/applications --branch=$GITHUB_REF_NAME
```

**Notes**:

- The `$GITHUB_SERVER_URL` and `$GITHUB_REPOSITORY` environment variables are provided by GitHub and make up the full URL of the repository that the above action was triggered in, e.g. `https://github.com/larsrickert/nginx-proxy`
- The `GITHUB_REF_NAME` environment variable is provided by GitHub and is the name of the branch that triggered the action, e.g. `main`
