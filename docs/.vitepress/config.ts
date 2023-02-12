import { defineConfig } from "vitepress";
import pkg from "../../package.json";

export default defineConfig({
  lang: "en-US",
  title: "nginx-proxy",
  description: pkg.description,
  lastUpdated: true,

  themeConfig: {
    logo: "/logo.png",
    socialLinks: [
      {
        icon: "github",
        link: pkg.repository.url,
      },
    ],
    editLink: {
      pattern: `${pkg.repository.url}/edit/main/docs/:path`,
    },
    algolia: {
      appId: "5M2ESV3G5L",
      apiKey: "4a956d78850feecd952338c6bf8f14dc",
      indexName: "nginx-proxy",
    },
    nav: [
      {
        text: "Report bug",
        link: `${pkg.repository.url}/issues/new`,
      },
    ],
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
        collapsed: false,
        items: [
          {
            text: "Installation",
            link: "/cli/installation",
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
        collapsed: false,
        items: [
          {
            text: "Mailserver",
            link: "/examples/mailserver",
          },
          {
            text: "Nextcloud",
            link: "/examples/nextcloud",
          },
          {
            text: "Redirect",
            link: "/examples/redirect",
          },
          {
            text: "Server monitoring",
            link: "/examples/monitoring",
          },
          {
            text: "Static site",
            link: "/examples/static",
          },
          {
            text: "WordPress",
            link: "/examples/wordpress",
          },
        ],
      },
      {
        text: "Utilities",
        collapsed: false,
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
