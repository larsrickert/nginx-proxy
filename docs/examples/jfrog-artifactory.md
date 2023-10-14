# JFrog Artifactory

This example creates a self-hosted JFrog Artifactory which can e.g. be used as registry for Maven, npm and more.

::: warning Make the example your own
In general you don't have to change anything in the below example to make it work for you. However, we highly recommend to take a closer look to the lines marked with a `TODO: CHANGE ME` comment.
:::

## Installation

### Step 1: Create a `docker-compose.yml` file

```yaml
version: "3"

services:
  artifactory:
    image: docker.bintray.io/jfrog/artifactory-oss:latest
    restart: always
    # TODO: CHANGE ME: After directory creation execute:
    # sudo chown -R 1030:1030 Artifactory
    volumes:
      - ./artifactory:/var/opt/jfrog/artifactory
    environment:
      VIRTUAL_HOST: "${DOMAIN?:}"
      LETSENCRYPT_HOST: "${DOMAIN?:}"
      VIRTUAL_PORT: 8082
    expose:
      - 8081
      - 8082

  proxy:
    image: alpine/socat
    restart: always
    expose:
      - 80
    environment:
      VIRTUAL_HOST: "api.${DOMAIN?:}"
      LETSENCRYPT_HOST: "api.${DOMAIN?:}"
    command: ["tcp-listen:80,fork,reuseaddr", "tcp-connect:artifactory:8081"]

networks:
  default:
    name: nginx-proxy
    external: true
```

### Step 2: Create a `.env` file

```apache
# Domain that the application should be deployed to
# TODO: CHANGE ME:
DOMAIN=jfrog.example.com
```

### Step 3: Start the application

```bash
docker-compose up -d
```

### Step 4: Set volume permissions

```bash
sudo chown -R 1030:1030 ./artifactory
```
