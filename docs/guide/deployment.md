# Deploy applications

::: warning Disclaimer
For the following instructions we assume that you are using docker-compose for your applications.
:::

::: info Deployment
In fact, this documentation that you are just reading is also deployed using the `nginx-proxy`. You can check out its `docker-compose.yml` on [GitHub](https://github.com/larsrickert/nginx-proxy/blob/docs/docker-compose.yml).
:::

For deploying any application with the nginx-proxy you first need to create a Dockerfile / docker-compose setup that suits your application. Since this is very application-dependent we can't give you instructions on this. But you will most likely find examples on the internet.

Beside the general Docker setup of your application there are three main aspects that you must follow to deploy your application with the nginx-proxy.

## Add the `nginx-proxy` network to your service(s)

There are two ways to achieve this:

1. Set the `nginx-proxy` network as default network for all services in your `docker-compose.yml`. This approach is the easier once since you don't need to add the `nginx-proxy` and `default` network to every service that you want to deploy with the nginx-proxy

```yml
version: '3'

services:
  # ...

networks:
  default:
    name: nginx-proxy
    external: true
```

2. Only set the network to the service that is should be exposed over the internet. The rest of the services belong to the internal network of your `docker-compose.yml`

```yml
version: '3'

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

## Add the required environment variables

Now you need to define which service should be deployed with which domain. Add the following environment variables to your service in the `docker-compose.yml` (replacing `blog.example.com` with the domain that you want to deploy to):

- `VIRTUAL_HOST`: Domain under that your application should be reachable
- `LETSENCRYPT_HOST`: Domain that a SSL certificate should be requested for

```yml
version: '3'

services:
  my-app:
    # ...
    environment:
      VIRTUAL_HOST: blog.example.com
      LETSENCRYPT_HOST: blog.example.com
```

## Ports

Lastly it's important that you don't bind the service port (e.g. 80 or 443) to your linux server because they are used / blocked by the nginx-proxy itself.
Instead, you need to expose the application port in either your `Dockerfile` or `docker-compose.yml`.

If you use an official Docker image it most likely already exposes a port so you don't need to expose it again. If your application doesn't expose a port you can do so with:

```yml
version: '3'

services:
  my-app:
    # ...
    expose:
      - 80
```

Port `80` is just an example here. If you e.g. have an API that runs on port `3000` you need to expose this port instead.

### Working with multiple exposed ports

If your application only exposes one port the nginx-proxy will automatically use this port. However, if you expose multiple ports you need to explicitly define which port you want to bind to the domain. Therefore you need to define the `VIRTUAL_PORT` environment variable:

```yml
version: '3'

services:
  my-app:
    # if multiple ports are exposed, e.g. 80 and 3000
    environment:
      VIRTUAL_PORT: 3000
```

## Deploy multiple applications with a single `docker-compose.yml`

You can even deploy multiple applications with one single `docker-compose.yml`. Just add the `nginx-proxy` as described above, set the `VIRTUAL_HOST` and `LETSENCRYPT_HOST` environment variables and expose the application port on every service that you want to deploy.

```yml
version: '3'

services:
  my-app:
    # ...
    environment:
      VIRTUAL_HOST: blog.example.com
      LETSENCRYPT_HOST: blog.example.com

  my-other-app:
    # ...
    environment:
      VIRTUAL_HOST: blog2.example.com
      LETSENCRYPT_HOST: blog2.example.com#

networks:
  default:
    name: nginx-proxy
    external: true
```
