import { defineConfig } from 'vitepress';

export default defineConfig({
	lang: 'en',
	title: 'nginx-proxy',
	description:
		'Easily deploy anything that can be run in docker and connect it to a domain on your linux server.',
	lastUpdated: true,
	themeConfig: {
		repo: 'larsrickert/nginx-proxy',
		logo: 'https://avatars.githubusercontent.com/u/67898185?v=4',
		docsBranch: 'docs',
		docsDir: 'docs',
		editLinks: true,
		editLinkText: 'Edit this page on GitHub',
		lastUpdated: 'Last Updated',
		// nav: [{ text: 'Test', link: '/test' }],
		sidebar: [
			{
				text: 'Introduction',
				children: [
					{
						text: 'What is nginx-proxy?',
						link: 'index',
					},
					{
						text: 'Getting Started',
						link: 'guide/getting-started',
					},
					{
						text: 'Deploy applications',
						link: 'guide/deployment',
					},
				],
			},
			{
				text: 'Examples',
				children: [],
			},
			{
				text: 'Utilities',
				children: [
					{
						text: 'Setup linux server and domain',
						link: 'utilities/setup-server-and-domain',
					},
				],
			},
		],
	},
});
