# Nextcloud

This example creates a [Nextcloud](https://nextcloud.com/) private cloud.

::: info Make the example your own
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
DOMAIN=nextcloud.example.de
```

- **Step 3:** Create a `nginx.conf` file.

```apache
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

  upstream php-handler {
    server app:9000;
  }

  server {
    listen 80;

    # set max upload size
    client_max_body_size 512M;
    fastcgi_buffers 64 4K;

    # Enable gzip but do not remove ETag headers
    gzip on;
    gzip_vary on;
    gzip_comp_level 4;
    gzip_min_length 256;
    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
    gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;

    # HTTP response headers borrowed from Nextcloud `.htaccess`
    add_header Referrer-Policy "no-referrer" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Download-Options "noopen" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Robots-Tag "none" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Remove X-Powered-By, which is an information leak
    fastcgi_hide_header X-Powered-By;

    # Path to the root of your installation
    root /var/www/html;

    # Specify how to handle directories -- specifying `/index.php$request_uri`
    # here as the fallback means that Nginx always exhibits the desired behaviour
    # when a client requests a path that corresponds to a directory that exists
    # on the server. In particular, if that directory contains an index.php file,
    # that file is correctly served; if it doesn't, then the request is passed to
    # the front-end controller. This consistent behaviour means that we don't need
    # to specify custom rules for certain paths (e.g. images and other assets,
    # `/updater`, `/ocm-provider`, `/ocs-provider`), and thus
    # `try_files $uri $uri/ /index.php$request_uri`
    # always provides the desired behaviour.
    index index.php index.html /index.php$request_uri;

    # Rule borrowed from `.htaccess` to handle Microsoft DAV clients
    location = / {
      if ( $http_user_agent ~ ^DavClnt ) {
        return 302 /remote.php/webdav/$is_args$args;
      }
    }

    location = /robots.txt {
      allow all;
      log_not_found off;
      access_log off;
    }

    # Make a regex exception for `/.well-known` so that clients can still
    # access it despite the existence of the regex rule
    # `location ~ /(\.|autotest|...)` which would otherwise handle requests
    # for `/.well-known`.
    location ^~ /.well-known {
      # The rules in this block are an adaptation of the rules
      # in `.htaccess` that concern `/.well-known`.

      location = /.well-known/carddav {
        return 301 /remote.php/dav/;
      }
      location = /.well-known/caldav {
        return 301 /remote.php/dav/;
      }

      location /.well-known/acme-challenge {
        try_files $uri $uri/ =404;
      }
      location /.well-known/pki-validation {
        try_files $uri $uri/ =404;
      }

      # Let Nextcloud's API for `/.well-known` URIs handle all other
      # requests by passing them to the front-end controller.
      return 301 /index.php$request_uri;
    }

    # Rules borrowed from `.htaccess` to hide certain paths from clients
    location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/) {
      return 404;
    }
    location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console) {
      return 404;
    }

    # Ensure this block, which passes PHP files to the PHP process, is above the blocks
    # which handle static assets (as seen below). If this block is not declared first,
    # then Nginx will encounter an infinite rewriting loop when it prepends `/index.php`
    # to the URI, resulting in a HTTP 500 error response.
    location ~ \.php(?:$|/) {
      # Required for legacy support
      rewrite ^/(?!index|remote|public|cron|core\/ajax\/update|status|ocs\/v[12]|updater\/.+|oc[ms]-provider\/.+|.+\/richdocumentscode\/proxy) /index.php$request_uri;

      fastcgi_split_path_info ^(.+?\.php)(/.*)$;
      set $path_info $fastcgi_path_info;

      try_files $fastcgi_script_name =404;

      include fastcgi_params;
      fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      fastcgi_param PATH_INFO $path_info;
      #fastcgi_param HTTPS on;

      fastcgi_param modHeadersAvailable true; # Avoid sending the security headers twice
      fastcgi_param front_controller_active true; # Enable pretty urls
      fastcgi_pass php-handler;

      fastcgi_intercept_errors on;
      fastcgi_request_buffering off;
    }

    location ~ \.(?:css|js|svg|gif)$ {
      try_files $uri /index.php$request_uri;
      expires 6M; # Cache-Control policy borrowed from `.htaccess`
      access_log off; # Optional: Don't log access to assets
    }

    location ~ \.woff2?$ {
      try_files $uri /index.php$request_uri;
      expires 7d; # Cache-Control policy borrowed from `.htaccess`
      access_log off; # Optional: Don't log access to assets
    }

    # Rule borrowed from `.htaccess`
    location /remote {
      return 301 /remote.php$request_uri;
    }

    location / {
      try_files $uri $uri/ /index.php$request_uri;
    }
  }
}
```

- **Step 4:** Start the application.

```bash
docker-compose up -d
```
