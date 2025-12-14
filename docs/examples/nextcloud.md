# Nextcloud

This example creates a [Nextcloud](https://nextcloud.com/) private cloud.

::: warning Make the example your own
In general you don't have to change anything in the below example to make it work for you. However, we highly recommend to take a closer look to the lines marked with a `TODO: CHANGE ME` comment.
:::

## Installation

### Step 1: Create a `docker-compose.yml` file

```yaml
services:
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    env_file: .env
    volumes:
      - ./data/db:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    env_file: .env
    command: >
      --requirepass ${REDIS_HOST_PASSWORD?:}

  nextcloud:
    image: nextcloud:25.0-apache
    restart: unless-stopped
    env_file: .env
    volumes:
      - ./data/nextcloud:/var/www/html
    environment:
      POSTGRES_HOST: db
      REDIS_HOST: redis
      NEXTCLOUD_TRUSTED_DOMAINS: ${DOMAIN?:}
      OVERWRITEPROTOCOL: https
      VIRTUAL_HOST: ${DOMAIN?:}
      LETSENCRYPT_HOST: ${DOMAIN?:}
    links:
      - db
      - redis
    depends_on:
      - db
      - redis
    networks:
      - default
      - nginx-proxy

networks:
  default:
  nginx-proxy:
    external: true
```

### Step 2: Create a `.env` file

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

### Step 3: Start the application

When first starting nextcloud, it will take a while for it to initialize. While initializing you might get a 502 Bad Gateway error when opening the domain.

```bash
docker compose up -d
```
