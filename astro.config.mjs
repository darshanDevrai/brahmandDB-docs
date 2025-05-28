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
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/darshanDevrai/brahmand' }],
			sidebar: [
				{
					label: 'Introduction',
					items: [
						{ label: 'What Is Brahmand?', slug: 'introduction/intro' },
						{ label: 'Architecture', slug: 'introduction/architecture' },
						{ label: 'Graph Data Modeling', slug: 'introduction/graph_data_modelling' },
						{ label: 'How Brahmand Models and Stores Graph Data?', slug: 'introduction/graph_data_storage' },
						{ label: 'How Queries Work?', slug: 'introduction/query' },
						{ label: 'Data Types and Functions', slug: 'introduction/data_types' },
					],
				},
				{
					label: 'Get Started',
					items: [
						{ label: 'Installation', slug: 'get_started/install' },
						{ label: 'Query Interface', slug: 'get_started/query_interface' },
					],
				},
				{
					label: 'Tutorials',
					items: [
						{ label: 'Create your first graph', slug: 'tutorials/create_your_first_graph' },
						{ label: 'Import Data', slug: 'tutorials/import_data' },
						{ label: 'Query Data', slug: 'tutorials/query_data' },
					],
				},
				{
                    label: 'Roadmap',
                    link: '/roadmap',
                },
			],
		}),
	],
});
