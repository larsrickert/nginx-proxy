# Setup UFW firewall

To add another layer of security to your self-hosted linux server we recommend setting up a firewall that only allows connections to the ports that your applications need.

We will use the UFW (Uncomplicated Firewall) which is pre-installed on Ubuntu linux. If it's not installed on your server you can do so with:

```bash
apt-get install ufw -y
```

## Default rules

By default we want to allow all outgoing traffic and deny all incoming traffic from the internet. SSH should always be allowed to connect to your server. You can do so with:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
```

## Application rules

Now we explicitly allow the ports / connections that our applications need. Basically you want to allow every port / application that you bind with `ports:` in any of your `docker-compose.yml`.
You can either use the application / protocol name (e.g. http and https) or use the port directly (e.g. 80 and 443).

```bash
sudo ufw allow http
sudo ufw allow https
```

::: info Update when deploying new applications
Keep in mind that you may have to allow more ports when you deploy new applications that bind to your system with `ports:` in your `docker-compose.yml`.

For applications that only use the nginx-proxy you don't have to change anything because they just expose a port for the nginx-proxy but don't bind it.
:::

## Enable the firewall

Now that you are set up you can enable the firewall with:

```bash
sudo ufw enable
```

and check its status with:

```bash
sudo ufw status verbose
```
