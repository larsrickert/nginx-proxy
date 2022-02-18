# Nginx proxy

This repo contains documentation about how to use the official [nginx-proxy docker image](https://hub.docker.com/r/jwilder/nginx-proxy) from jwilder to deploy any application on your linux server. It will automatically connect an arbitrary domain (e.g. blog.example.com) to the application and manage/renew ssl certificates.

<br />

# Prerequisites

1. Linux server / VPS
2. Docker and docker-compose installed on your server
3. Shell access with permissions to execute docker commands
4. Domain with access to the DNS settings

If you don't have a linux server yet you can check out [netcup](https://www.netcup.de/vserver/vps.php) for a cheap and fast VPS.

You can find more information about setting up the linux server in the `utils` folder.

<br />

# Step 1: Setup nginx proxy

The nginx-proxy will automatically start when you start/restart your server.

1. Copy `docker-compose.yml`, `proxy.conf`, `.env.example` and `.gitignore` to a destination of your liking on your linux server.
2. Create a docker network for nginx-proxy that allows the proxy to recognize the deployed containers.

   ```
   docker network create nginx-proxy
   ```

3. Rename `.env.example` to `.env` and change the `LETSENCRYPT_EMAIL` value to your email. This mail will be used to send letsencrypt reminders for e.g. expiring certificates.
4. Start the nginx-proxy with:

   ```
   docker-compose up -d
   ```

<br />

# Step 2 (optional): Deploy your first application

Make sure to create an A Record in your domain DNS settings that points each domain you want to use with the nginx-proxy to the IP of your server.

You can find examples for different applications in the `examples` folder. <br /> <br />
There are `TODO: CHANGE ME` comments above all lines
of the example files that you need to change to make the example application your own.
You don't have to care about the other settings to get the application working but you might want to take a look at them for custom behavior.

Important for any `docker-compose.yml` / application that you want to deploy:

- Make sure to add:

  ```
  networks:
    default:
      name: nginx-proxy
      external: true
  ```

  Otherwise the nginx-proxy will not be able to recognize your application and it will not be reachable through your domain.

- Always add

  ```
  VIRTUAL_HOST: blog.example.com
  LETSENCRYPT_HOST: blog.example.com
  ```

  to the environment variables of the `docker-compose.yml` (changing "blog.example.com" to the domain that you want to deploy the application to). Otherwise the application will not be reachable under the domain.

<br />

# Further information

- Read [nginx-proxy](https://hub.docker.com/r/jwilder/nginx-proxy) for more information and configs.

<br />

# Known issues and fixes for nginx-proxy / applications

1. WordPress: Uploading large files to media library leads to unknown server error (status code 413)

   - Problem: Default max. request body size of nginx proxy is too low
   - Fix:. Change client_max_body_size in `proxy.conf` to your desired size and update the upload_max_filesize in the `uploads.ini` of your wordpress site.
