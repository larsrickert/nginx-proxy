# WordPress

This example creates a [WordPress](https://wordpress.org/) website/blog.

::: warning Make the example your own
In general you don't have to change anything in the below example to make it work for you. However, we highly recommend to take a closer look to the lines marked with a `TODO: CHANGE ME` comment.
:::

## Installation

### Step 1: Create a `docker-compose.yml` file

```yaml
version: "3"

services:
  db:
    image: mariadb:10
    restart: always
    env_file: .env
    volumes:
      - ./data/db:/var/lib/mysql

  wordpress:
    image: wordpress:6-php8.2
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: "${MYSQL_USER?:}"
      WORDPRESS_DB_PASSWORD: "${MYSQL_PASSWORD?:}"
      WORDPRESS_TABLE_PREFIX: "${WORDPRESS_TABLE_PREFIX}"
      VIRTUAL_HOST: "${DOMAIN?:}"
      LETSENCRYPT_HOST: "${DOMAIN?:}"
    depends_on:
      - db
    links:
      - db
    volumes:
      - ./data/wp-content:/var/www/html/wp-content
      # wordpress max upload size
      - ./uploads.ini:/usr/local/etc/php/conf.d/uploads.ini
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
MYSQL_DATABASE=wordpress
# TODO: CHANGE ME:
MYSQL_ROOT_PASSWORD=somePassword
# TODO: CHANGE ME:
MYSQL_USER=wordpress
# TODO: CHANGE ME:
MYSQL_PASSWORD=somePassword

# can be used to change the wordpress db prefix
# WORDPRESS_TABLE_PREFIX=wp_

# Domain that the application should be deployed to
# TODO: CHANGE ME:
DOMAIN=blog.example.com
```

### Step 3: Create a `uploads.ini` file to increase file upload size

The default upload size is very small (around 2 MB) so we want to increase it to allow bigger file/image uploads. Make sure that "client_max_body_size" in "proxy.conf" file of nginx-proxy is high enough for the below size. See [Step 5 of the nginx-proxy installation guide](/guide/getting-started#step-5-optional-create-a-proxy-conf-file-for-custom-nginx-configuration) for the `proxy.conf`.

```apache
; Change max upload size
; Make sure that "client_max_body_size" in "proxy.conf" of nginx-proxy is high enough for
; the below settings
upload_max_filesize = 64M
post_max_size = 64M
```

### Step 4: Start the application

```bash
docker-compose up -d
```

When you directly open your domain after first running the above command, you may get a database connection error. In this case, just wait a few seconds and then try again. The database needs some time to initialize.
