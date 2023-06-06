// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

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
