# Basic authentication

You might want to protect some applications that you deploy with the nginx-proxy using basic authentication (username + password) so that not everyone can access it. Nginx supports this out-of-the-box with a little bit of configuration.

- **Step 1:** Create `htpasswd` folder.

```bash
mkdir htpasswd
```

- **Step 2:** Extend `docker-compose.yml` of nginx-proxy.

```yaml
version: "3"

services:
  nginx-proxy:
    image: jwilder/nginx-proxy:alpine
    # ...
    volumes:
      - ./htpasswd:/etc/nginx/htpasswd
      # ...

  # ...
```

- **Step 3:** Inside `htpasswd` create a file with the name of the domain that you want to protect.

```bash
touch htpasswd/secret.example.com
```

- **Step 4:** Install `apache2-utils` to generate encrypted password.

The created file requires an encrypted password in a specific format. Install `apache2-util` with

```bash
sudo apt install apache2-utils
```

- **Step 5:** Generate username:password.

```bash
htpasswd -nb myUsername myPassword
```

Copy the generated command line output to the file created in step 3 and safe it.

- **Step 6:** Restart nginx-proxy.

```bash
docker-compose up -d
```

When you now open the domain specified in step 3, you will be prompted to enter your username and password.
