---
outline: deep
---

# Static site

This example creates an application for static files (e.g. serving plain files or Vue/React/Angular application). This documentation that you are reading is also deployed as static site using the instructions below.

::: warning Make the example your own
In general you don't have to change anything in the below example to make it work for you. However, we highly recommend to take a closer look to the lines marked with a `TODO: CHANGE ME` comment.
:::

## With build step

In this example, we will deploy a static app that requires a build step, e.g. when you are using Vue, Angular, React etc.

### Step 1: Create a `docker-compose.yml` file

```yaml
version: "3"

services:
  app:
    # path to dir with Dockerfile
    build: .
    # TODO: CHANGE ME: change image name to your liking
    image: larsrickert/nginx-proxy-example-static
    restart: always
    environment:
      VIRTUAL_HOST: "${DOMAIN}"
      LETSENCRYPT_HOST: "${DOMAIN}"

networks:
  default:
    name: nginx-proxy
    external: true
```

### Step 2: Create a `Dockerfile`

You need to adjust the `Dockerfile` below to suit your application needs. This example is for a Node application such as a Vue, Angular or React app.

```docker
# build stage
FROM node:17-alpine as build
WORKDIR /app

# build application
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 3: Create a `nginx.conf` file

The `nginx.conf` file is needed to redirect all unknown URLs to `/` which is the expected behavior for single page applications (SPAs) like a Vue/React/Angular app. It also enables gzip compression to speed the serving of your files. This file is copied into the docker image inside the previously created `Dockerfile`.

```apache
user nginx;
worker_processes auto;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
  '$status $body_bytes_sent "$http_referer" '
  '"$http_user_agent" "$http_x_forwarded_for"';

  access_log /var/log/nginx/access.log main;
  sendfile on;
  keepalive_timeout 65;

  # This is how we host our static site.
  server {
    listen 80;
    server_name localhost;

    location / {
      # Enable gzip. NOTE: text/html files are always gzipped when enabled
      gzip on;
      gzip_min_length 1000;
      gzip_types text/plain text/css application/javascript application/json image/x-icon;

      # The location of the static files to server, must match path defined in Dockerfile
      root /usr/share/nginx/html;

      # Remove trailing slashes. /about/ -> /about
      # This is important because of how static files are generated.
      rewrite ^/(.*)/$ /$1 permanent;

      # config for SPAs do redirect 404 to index.html
      try_files $uri /index.html;
    }
  }
}
```

### Step 4: Create a `.env` file

```apache
# Domain that the application should be deployed to
# TODO: CHANGE ME:
DOMAIN=static.example.com
```

### Step 5: Start the application

```bash
docker-compose up -d
```

## Without build step

If you don't have a build step for you static content (e.g. you just want to serve static files from a directory on your server) you need to follow the above steps and make following changes:

- don't create `Dockerfile`
- create folder `./html` and put your static files inside it
- use following `docker-compose.yml`:

  ```yaml
  version: "3"

  services:
    app:
      image: nginx:1.22-alpine
      restart: always
      environment:
        VIRTUAL_HOST: "${DOMAIN}"
        LETSENCRYPT_HOST: "${DOMAIN}"
      volumes:
        # TODO: CHANGE ME: change ./html to the path to your files
        - ./html:/usr/share/nginx/html
        - ./nginx.conf:/etc/nginx/nginx.conf

  networks:
    default:
      name: nginx-proxy
      external: true
  ```
