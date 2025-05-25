// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://brahmanddb.com/',
	integrations: [
		starlight({
			title: 'Brahmand',
			// customCss: [
			// 	// Relative path to your custom CSS file
			// 	'./src/styles/custom.css',
			//   ],
			  logo: {
				src: './public/logo.svg',
			  },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
                    label: 'Home',
                    link: '/home',
                },
				{
					label: 'Install Brahmand',
					items: [
						{ label: 'Installation', slug: 'installation/install' },
					],
				},
				// {
				// 	label: 'Guides',
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: 'Example Guide', slug: 'guides/example' },
				// 	],
				// },
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
});
