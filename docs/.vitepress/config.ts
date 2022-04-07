import { defineConfig } from 'vitepress';

export default defineConfig({
	lang: 'en-US',
	title: 'nginx-proxy',
	description:
		'Easily deploy anything that can be run in docker and connect it to a domain on your linux server.',
	lastUpdated: true,

	themeConfig: {
		repo: 'larsrickert/nginx-proxy',
		docsDir: 'docs',
		docsBranch: 'docs',
		editLinks: true,
		editLinkText: 'Edit this page on GitHub',
		lastUpdated: 'Last Updated',
		logo: 'https://avatars.githubusercontent.com/u/67898185?v=4',

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
			// {
			// 	text: 'Example applications',
			// 	children: [],
			// },
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
