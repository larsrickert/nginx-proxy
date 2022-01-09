# Nginx proxy

The nginx proxy is used to easily deploy anything that can be run in docker and connect it to a domain (e.g. blog.example.com). It will automatically manage and renew ssl certificates.

<br />

# Prerequisites

1. Linux server / VPS
2. Docker and docker-compose installed on your server

<br />

# Step 1: Setup nginx proxy

The nginx-proxy will automatically start when you start/restart your server.

1. From folder `nginx-proxy`, copy all files but `examples` to a destination of your liking on your linux server.
2. Create docker network for nginx-proxy that allows the proxy to recognize the deployed containers.

   ```
   docker network create nginx-proxy
   ```

3. Change the `LETSENCRYPT_EMAIL` value in `.env` to your email. This mail will be used to send letsencrypt reminders for e.g. expiring certificates.
4. Start the nginx-proxy with:

   ```
   docker-compose up -d
   ```

<br />

# Step 2 (optional): Deploy your first application

Make sure to create an A Record that redirects each domain you want to use with the nginx-proxy to the IP of your server.

You can find `docker-compose.yml` examples for different applications in the `examples` folder of `nginx-proxy`.

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

  to the environment variables (changing the domain to the domain that you want to deploy the application to). Otherwise the application will not be reachable under the domain.

<br />

# Further information

- Read [nginx-proxy](https://hub.docker.com/r/jwilder/nginx-proxy) for more information and configs.

<br />

# Known issues and fixes for nginx-proxy / applications

1. WordPress: Uploading large files to media library leads to unknown server error (status code 413)

   - Problem: Default max. request body size of nginx proxy is too low
   - Fix:. Change client_max_body_size in `proxy.conf` to your desired size and update the upload_max_filesize in the `uploads.ini` of your wordpress site.
