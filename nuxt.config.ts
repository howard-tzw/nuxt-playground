// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss', 'nuxt-headlessui', '@pinia/nuxt'],

	// Optionally change the default prefix.
	headlessui: {
		prefix: 'Headless',
	},
	routeRules: {
		'/admin/**': { ssr: false },
	},
	tailwindcss: {
		cssPath: '~/styles/tailwind.css',
		configPath: 'tailwind.config',
		injectPosition: 'last', // https://tailwindcss.nuxtjs.org/getting-started/options#injectposition
	},
	css: ['~/styles/main.scss'],
	runtimeConfig: {
		public: {
			googleClientId: '546891899940-fob6s65qadnd5i4d0c8e2ghl9cuu15kq.apps.googleusercontent.com',
			apiBase: 'http://localhost:5000/api/v1',
		},
	},
	app: {
		head: {
			title: '',
			meta: [
				{
					charset: 'utf-8',
				},
				{
					name: 'viewport',
					content:
						'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover',
					// Disable Auto Zoom in Input "Text" tag https://stackoverflow.com/a/13706151/19799243
				},
				{
					name: 'description',
					content: '',
				},
				{
					name: 'author',
					content: '',
				},
			],
		},
	},
})
