# Deploy applications

::: warning Disclaimer
For the following instructions we assume that you are using docker-compose for your applications.

Although you can place your applications in any folder on your linux server, we recommend creating an `applications` folder inside your `nginx-proxy` folder to group your applications.
:::

For deploying any application with the nginx-proxy you first need to create a Dockerfile / docker-compose setup that suits your application. Since this is very application-dependent we can't give you instructions on this. But you will most likely find examples on the internet.

In fact, this documentation that you are just reading is also deployed using the `nginx-proxy`. You can check out its `docker-compose.yml` on [GitHub](https://github.com/larsrickert/nginx-proxy/blob/main/docker-compose.yml).

Beside the general Docker setup of your application there are three main aspects that you must follow to deploy your application with the nginx-proxy. Let's take a look at them below.

## Add the `nginx-proxy` network to your service(s)

Add the following network definitions to the service(s) that you want to deploy with `nginx-proxy`. Note: If you e.g. have an app and a database service you most likely only want to deploy the app itself (and connect it to a domain), so you don't need to at the networks to your database service.

```yaml
version: "3"

services:
  my-app:
    # ...
    networks:
      - default
      - nginx-proxy

networks:
  default:
  nginx-proxy:
    external: true
```

::: info
Although you could set the `nginx-proxy` network as default network for all services in your `docker-compose.yml`, we recommend not to do so and use the above approach instead. Setting the `nginx-proxy` network as default would lead to less isolated applications and will expose services that you only need internally to all other applications.

If you only have one service though you can simplify the `docker-compose.yml` by removing the network definitions on the service and change networks to:

```yaml
networks:
  default:
    name: nginx-proxy
    external: true
```

:::

## Add the required environment variables

Now you need to define which service should be deployed with which domain. Add the following environment variables to your service in the `docker-compose.yml` (replacing `blog.example.com` with the domain that you want to deploy to):

- `VIRTUAL_HOST`: Domain under that your application should be reachable
- `LETSENCRYPT_HOST`: Domain that a SSL certificate should be requested for

```yaml
version: "3"

services:
  my-app:
    # ...
    environment:
      VIRTUAL_HOST: blog.example.com
      LETSENCRYPT_HOST: blog.example.com
```

::: info SSL certificates
After you started your application for the first time with a new domain you might get a `NET::ERR_CERT_COMMON_NAME_INVALID` error in your browser when you try to directly open the domain in your browser. The reason for this is that the SSL certificate for the domain takes a few seconds to be requested from Let's Encrypt. Just reload your browser after a few seconds.
:::

## Ports

Lastly it's important that you don't bind the service port (e.g. 80 or 443) to your linux server because they are used / blocked by the nginx-proxy itself.
Instead, you need to expose the application port in either your `Dockerfile` or `docker-compose.yml`.

The `nginx-proxy` will then redirect incoming requests to your domain to the exposed port.

If you use an official Docker image it most likely already exposes a port so you don't need to expose it again. If your application doesn't expose a port you can do so with:

```yaml
version: "3"

services:
  my-app:
    # ...
    expose:
      - 80
```

Port `80` is just an example here. If you e.g. have an API that runs on port `3000` you need to expose this port instead.

### Working with multiple exposed ports

If your application only exposes one port the nginx-proxy will automatically use this port. However, if you expose multiple ports you need to explicitly define which port you want to bind to the domain. Therefore you need to define the `VIRTUAL_PORT` environment variable:

```yaml
version: "3"

services:
  my-app:
    # if multiple ports are exposed, e.g. 80 and 3000
    environment:
      VIRTUAL_PORT: 3000
```

## Deploy multiple applications with a single `docker-compose.yml`

You can even deploy multiple applications within one single `docker-compose.yml`. Just add the `nginx-proxy` network as described above, set the `VIRTUAL_HOST` and `LETSENCRYPT_HOST` environment variables and expose the application port on **every service** that you want to deploy.

```yaml
version: "3"

services:
  my-app:
    # ...
    environment:
      VIRTUAL_HOST: blog.example.com
      LETSENCRYPT_HOST: blog.example.com
    networks:
      - default
      - nginx-proxy

  my-other-app:
    # ...
    environment:
      VIRTUAL_HOST: blog2.example.com
      LETSENCRYPT_HOST: blog2.example.com
    networks:
      - default
      - nginx-proxy

networks:
  default:
  nginx-proxy:
    external: true
```
