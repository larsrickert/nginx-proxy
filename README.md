# nginx-proxy

nginx-proxy is a combination of Open Source tools that enable you to easily deploy any (web) application that runs with Docker on your own linux server. Technically it is an automated nginx reverse proxy. The nginx-proxy will automatically detect your docker applications, will make them available under your specified domain such as `blog.example.com` and automatically requests and manages / renews Let’s Encrypt SSL certificates.

This nginx-proxy uses [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) and is based on the [jwilder/nginx-proxy](https://hub.docker.com/r/jwilder/nginx-proxy) Docker image.

<br />

# [Documentation](https://nginxproxy.lars-rickert.de/)

<br />

## Example use case

Imagine you just created a cool website or API that is now ready to be published to the world. While looking for a provider to deploy your application(s) you may find free providers like [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/).

While they are great to deploy static content (e.g. plain HTML, CSS and JavaScript files) for free you will quickly recognize that e.g. server side applications are harder to deploy, cannot be deployed at all or you are not satisfied with the application speed. So you will have to look out for another provider for some of your applications.

On the other side there are paid Cloud providers like AWS, Google Cloud or Azure Cloud. But personally, we think they are not very beginner friendly (even for more experienced developers) and more expensive / overkill.

The goal of nginx-proxy is to have **ONE** easy, fast and cheap deployment solution for **ANY** application. This is where nginx-proxy comes into play. It will give you a self-hosted (and therefore performant) deployment solution with full-control.

Once set up you will be able to deploy any Docker application in just a few minutes (or less) with automatically managed SSL certificates.
