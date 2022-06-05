# Nextcloud

This example creates a [Nextcloud](https://nextcloud.com/) private cloud.

::: warning Make the example your own
In general you don't have to change anything in the below example to make it work for you. However, we highly recommend to take a closer look to the lines marked with a `TODO: CHANGE ME` comment.
:::

- **Step 1:** Create a `docker-compose.yml` file.

```yaml
version: "3"

services:
  db:
    image: postgres:alpine
    restart: always
    env_file: .env
    volumes:
      - ./data/db:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    restart: always
    env_file: .env
    command: >
      --requirepass ${REDIS_HOST_PASSWORD}

  nextcloud:
    image: nextcloud:production-apache
    restart: always
    env_file: .env
    volumes:
      - ./data/nextcloud:/var/www/html
    environment:
      POSTGRES_HOST: db
      REDIS_HOST: redis
      NEXTCLOUD_TRUSTED_DOMAINS: "${DOMAIN}"
      OVERWRITEPROTOCOL: https
      VIRTUAL_HOST: "${DOMAIN}"
      LETSENCRYPT_HOST: "${DOMAIN}"
    links:
      - db
      - redis
    depends_on:
      - db
      - redis

networks:
  default:
    name: nginx-proxy
    external: true
```

- **Step 2:** Create a `.env` file.

```apache
POSTGRES_DB=nextcloud
POSTGRES_USER=nextcloud

# TODO: CHANGE ME:
POSTGRES_PASSWORD=somePassword

# TODO: CHANGE ME:
REDIS_HOST_PASSWORD=somePassword

# TODO: CHANGE ME:
NEXTCLOUD_ADMIN_USER=admin

# TODO: CHANGE ME:
NEXTCLOUD_ADMIN_PASSWORD=somePassword

# Domain that the application should be deployed to
# TODO: CHANGE ME:
DOMAIN=nextcloud.example.com
```

- **Step 3:** Start the application.

```bash
docker-compose up -d
```
