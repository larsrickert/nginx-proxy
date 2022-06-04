import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",
  title: "nginx-proxy",
  description:
    "Combination of Open Source tools that enable you to easily deploy any application that runs with Docker on your own linux server.",
  lastUpdated: true,

  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/larsrickert/nginx-proxy",
      },
      {
        icon: "discord",
        link: "https://discord.com/users/251414332955557889",
      },
    ],
    editLink: {
      repo: "larsrickert/nginx-proxy",
    },
    logo: "../assets/logo.png",
    algolia: {
      appId: "5M2ESV3G5L",
      apiKey: "4a956d78850feecd952338c6bf8f14dc",
      indexName: "nginx-proxy",
    },

    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "What is nginx-proxy?",
            link: "/",
          },
          {
            text: "Getting Started",
            link: "/guide/getting-started",
          },
          {
            text: "Deploy applications",
            link: "/guide/deployment",
          },
          {
            text: "Basic authentication",
            link: "/guide/basic-authentication",
          },
        ],
      },
      {
        text: "CLI",
        collapsible: true,
        items: [
          {
            text: "Usage",
            link: "/cli/usage",
          },
          {
            text: "Commands",
            link: "/cli/commands",
          },
          {
            text: "GitHub Actions",
            link: "/cli/github-actions",
          },
        ],
      },
      {
        text: "Examples",
        collapsible: true,
        items: [
          {
            text: "WordPress",
            link: "/examples/wordpress",
          },
          {
            text: "Mailserver",
            link: "/examples/mailserver",
          },
          {
            text: "Redirect",
            link: "/examples/redirect",
          },
          {
            text: "Static site",
            link: "/examples/static",
          },
          {
            text: "Server monitoring",
            link: "/examples/monitoring",
          },
          {
            text: "Nextcloud",
            link: "/examples/nextcloud",
          },
        ],
      },
      {
        text: "Utilities",
        collapsible: true,
        items: [
          {
            text: "Setup linux server and domain",
            link: "/utilities/setup-server-and-domain",
          },
          {
            text: "Setup UFW firewall",
            link: "/utilities/firewall",
          },
          {
            text: "Using SSH keys",
            link: "/utilities/ssh-keys",
          },
        ],
      },
    ],
  },
});
