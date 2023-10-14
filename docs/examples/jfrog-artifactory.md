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
    image: docker.bintray.io/jfrog/artifactory-oss:7.63.14
    restart: always
    volumes:
      - ./artifactory:/var/opt/jfrog/artifactory
    environment:
      VIRTUAL_HOST: "${DOMAIN?:}"
      LETSENCRYPT_HOST: "${DOMAIN?:}"
      VIRTUAL_PORT: 8082

  # Proxy service for redirect request to api.YOUR_DOMAIN.com to port 8081 of the Artifactory
  # which exposes the REST API. Port 8082 on the other hand exposes the UI which is used in
  # the service above.
  proxy:
    image: alpine/socat:1.7.4.4
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

# Unique and secret master key, can be generated with:
# openssl rand -hex 32
# TODO: CHANGE ME:
MASTER_KEY=d9fed922206468b77de4e0c74a0dda647c3aaff7c7e58335c93fc62ffbe90035

# Unique and secret join key, can be generated with:
# openssl rand -hex 32
JOIN_KEY=1a9278d6446e3cd1da0a144ef848bca46eaa984ebc781ffc09459a952f2dcf99
```

### Step 3: Start the application

```bash
docker-compose up -d
```

### Step 4: Set volume permissions

```bash
sudo chown -R 1030:1030 ./artifactory
```

### Step 5: Complete setup

By default, the admin user is:

- Username: admin
- Password: password

Just login with the above credentials and you will be automatically prompted to complete the setup which also includes changing the admin password.
