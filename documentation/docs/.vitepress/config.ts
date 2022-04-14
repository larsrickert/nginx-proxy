import { defineConfig } from 'vitepress';

export default defineConfig({
	lang: 'en-US',
	title: 'nginx-proxy',
	description:
		'Combination of Open Source tools that enable you to easily deploy any (web) application that runs with Docker on your own linux server.',
	lastUpdated: true,

	themeConfig: {
		repo: 'larsrickert/nginx-proxy',
		docsDir: 'documentation/docs',
		docsBranch: 'main',
		editLinks: true,
		editLinkText: 'Edit this page on GitHub',
		lastUpdated: 'Last Updated',
		logo: 'https://avatars.githubusercontent.com/u/67898185?v=4',
		algolia: {
			appId: '5M2ESV3G5L',
			apiKey: '4a956d78850feecd952338c6bf8f14dc',
			indexName: 'nginx-proxy',
		},

		sidebar: [
			{
				text: 'Introduction',
				children: [
					{
						text: 'What is nginx-proxy?',
						link: '/',
					},
					{
						text: 'Getting Started',
						link: '/guide/getting-started',
					},
					{
						text: 'Deploy applications',
						link: '/guide/deployment',
					},
				],
			},
			{
				text: 'CLI',
				children: [
					{
						text: 'Usage',
						link: '/cli/usage',
					},
					{
						text: 'Commands',
						link: '/cli/commands',
					},
					{
						text: 'GitHub Actions',
						link: '/cli/github-actions',
					},
				],
			},
			{
				text: 'Utilities',
				children: [
					{
						text: 'Setup linux server and domain',
						link: '/utilities/setup-server-and-domain',
					},
					{
						text: 'Setup UFW firewall',
						link: '/utilities/firewall',
					},
					{
						text: 'Using SSH keys',
						link: '/utilities/ssh-keys',
					},
				],
			},
		],
	},
});
