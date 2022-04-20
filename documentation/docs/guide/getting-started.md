# Getting Started

::: warning Prerequisites
In order to use this nginx-proxy you will need the following requirements:

- Linux server (Ubuntu recommended but you can also use other distributions)
- Docker and docker-compose
- At least one domain (e.g. `example.com`)

If you don't meet one of the requirements we will give you recommendations and installation instructions on the [Setup linux server and domain](/utilities/setup-server-and-domain) page. Otherwise you can just continue reading 😎
:::

## Installation

- **Step 1:** Create and change into a new directory called `nginx-proxy`

```bash
mkdir nginx-proxy && cd nginx-proxy
```

- **Step 2:** Create a new docker network

```bash
docker network create nginx-proxy
```

All your Docker applications inside this network will be discoverable for the nginx-proxy. Therefore your application must define this network. We will take a look at this later on. If you don't want your application (or some of the services) to be accessible for the nginx-proxy just use another network for them.

- **Step 3:** Create a `docker-compose.yml` file for the nginx-proxy

```bash
touch docker-compose.yml
```

and add the following content:

```yml
version: '3'

services:
  nginx-proxy:
    image: jwilder/nginx-proxy:alpine
    container_name: nginx-proxy
    restart: always
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - /var/run/docker.sock:/tmp/docker.sock:ro
      # custom additional nginx config
      - ./proxy.conf:/etc/nginx/conf.d/proxy.conf

  nginx-proxy-le:
    image: nginxproxy/acme-companion
    container_name: nginx-proxy-le
    restart: always
    environment:
      DEFAULT_EMAIL: '${LETSENCRYPT_EMAIL}'
      NGINX_PROXY_CONTAINER: nginx-proxy
    volumes:
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - acme:/etc/acme.sh
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  certs:
  vhost:
  html:
  acme:

networks:
  default:
    name: nginx-proxy
    external: true
```

Let's take a look at the two services that are defined in the `docker-compose.yml`:

**nginx-proxy**:

This service is the heart of our setup that will automatically generate reverse proxy configurations for all our applications and their domains. In non-technical words: It will make your application available to the internet. Whenever you enter your domain into a browser to access web content the request will be handled by this service.

**nginx-proxy-le:**

This service is the SSL part of the setup. It is responsible for automatically requesting, managing and renewing free Let's Encrypt SSL certificates for all your applications that are using the nginx-proxy to secure the traffic with SSL (HTTPS).

- **Step 4:** Create a `.env` file for environment variables

```bash
touch .env
```

and add the following content (replace `mail@example.de` with your email address):

```
LETSENCRYPT_EMAIL=mail@example.de
```

The email address defined here will be used by the `nginx-proxy-le` service to send you Let's Encrypt related emails, e.g. reminders for expiring SSL certificates. Although the certificates are renewed automatically it's recommended to add your email here.

- **Step 5 (optional):** Create a `proxy.conf` file for custom nginx configuration

```bash
touch proxy.conf
```

and add e.g. the following content:

```apacheconf
#
# custom additional nginx config
#

# allow bigger file uploads
client_max_body_size 64m;
```

This config file is for advanced developers and should generally not need to be edited. You can find an example configuration in the official [nginx documentation](https://www.nginx.com/resources/wiki/start/topics/examples/full/#proxy-conf).

- **Step 6 (optional):** Create a `.gitignore` file for excluding common files

If you want to use git with the nginx-proxy or any applications inside it you should exclude common application, editor and environment files.

::: warning .env files
You should **NEVER** commit the `.env` file of the nginx-proxy or any application to git since they usually contain very sensible information such as passwords or API keys!
:::

```bash
touch .gitignore
```

and add the following content:

```apacheconf
.DS_STORE

# Application directories and files
.env
*.local
db
docker-data
logs

# Editor directories and files
.idea
.vscode
*.iml
*.ipr
*.iws
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

- **Step 7:** Start the nginx-proxy

```bash
docker-compose up -d
```

- **Step 8 (optional):** Verify that the nginx-proxy is running successfully

When running the below command you should see the `nginx-proxy` and `nginx-proxy-le` container running.

```bash
docker-compose ps
```

## DNS records

Your self-hosted nginx-proxy is now up and running. But in order to reach it through your own domain (e.g. `example.com`) you need to set your domain's DNS records accordingly.

If you don't know how to change the DNS records, reach out to you domain provider.

Every domain and / or subdomain that you want to deploy with the nginx-proxy must have an A-Record that points to the IP address of your linux server, for example:

- Host: blog.example.com
- Type: A
- Destination: 12.34.56.78 (your IP address)

Most domain providers enable you to just point the domain and every subdomain to a specific IP address, e.g. by setting the host to `*`. If doing so you don't need to adjust your DNS records for every application you want to deploy. Check your provider's documentation for instructions.

DNS changes may take up to 48 hours to take effect but they usually only need a few minutes. Make sure that the DNS records for your desired domains are set correctly before using the nginx-proxy.
