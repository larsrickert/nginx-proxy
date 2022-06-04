# Redirect

This example creates a redirect to another domain.

::: info Make the example your own
In general you don't have to change anything in the below example to make it work for you. However, we highly recommend to take a closer look to the lines marked with a `TODO: CHANGE ME` comment.
:::

- **Step 1:** Create a `docker-compose.yml` file.

```yaml
version: "3"

services:
  redirect:
    image: morbz/docker-web-redirect
    restart: always
    env_file: .env
    environment:
      VIRTUAL_HOST: "${DOMAIN}"
      LETSENCRYPT_HOST: "${DOMAIN}"

networks:
  default:
    name: nginx-proxy
    external: true
```

- **Step 2:** Create a `.env` file.

```apache
# Domain that the application should be deployed to
# TODO: CHANGE ME:
DOMAIN=redirect.example.de

# Target that DOMAIN should be redirected to
# TODO: CHANGE ME:
REDIRECT_TARGET=google.de
```

- **Step 3:** Start the application.

```bash
docker-compose up -d
```
