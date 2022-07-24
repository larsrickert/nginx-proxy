# What is nginx-proxy?

`nginx-proxy` is a combination of Open Source tools that enable you to easily deploy any (web) application that runs with Docker on your own linux server. Technically it is an automated nginx reverse proxy. The nginx-proxy will automatically detect your docker applications, will make them available under your specified domain such as `blog.example.com` and automatically request, manage and renew Let’s Encrypt SSL certificates.

This `nginx-proxy` uses [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) and uses the [jwilder/nginx-proxy](https://hub.docker.com/r/jwilder/nginx-proxy) Docker image.

## Why? Example use case

Imagine you just created a cool website or API that is now ready to be published to the world. While looking for a provider to deploy your application(s) you may find free providers like [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/).

While they are great to deploy static content (e.g. plain HTML, CSS and JavaScript files) for free, we personally recognized that e.g. server side applications are harder to deploy, cannot be deployed at all or we were not satisfied with the application speed.

On the other side there are paid Cloud providers like AWS, Google Cloud or Azure Cloud. But personally, we think they are not very beginner friendly or are more expensive / overkill for personal projects.

The goal of `nginx-proxy` is to have **ONE** easy, fast and cheap deployment solution for **ANY** application. This is where nginx-proxy comes into play. It will give you a self-hosted deployment solution with full-control.

Once set up you will be able to deploy any Docker application in just a few minutes (or less) with automatically managed SSL certificates. In addition, we provide a CLI that you can use to automatically (re)deploy your applications when you push changes to your Git repository.

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/67898185',
    name: 'Lars Rickert',
    title: 'Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/larsrickert' },
      { icon: 'discord', link: 'https://discord.com/users/251414332955557889' },
    ]
  },
    {
    avatar: 'https://avatars.githubusercontent.com/u/16415986',
    name: 'Marcel Wolf',
    title: 'Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/Mawobi' },
      { icon: 'discord', link: 'https://discord.com/users/244824803003858944' }
    ]
  },
]
</script>

## Need help?

If you face problems setting up the `nginx-proxy` or applications, feel free to contact us.

<VPTeamMembers size="small" :members="members" />
