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

	runtimeConfig: {
		public: {
			googleClientId: '546891899940-fob6s65qadnd5i4d0c8e2ghl9cuu15kq.apps.googleusercontent.com',
		},
	},
})
