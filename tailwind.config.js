/** @type {import('tailwindcss').Config} */
const breakpoints = require('./breakpoints.json')

module.exports = {
	content: [
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./composables/**/*.{js,ts}',
		'./plugins/**/*.{js,ts}',
		'./app.{js,ts,vue}',
		'./content/**/*.md',
	],
	theme: {
		screens: breakpoints,
		extend: {
			colors: {
				primary: {
					DEFAULT: '#333333',
				},
				// 同步 styles/vars --color-secondary
				secondary: {
					DEFAULT: '#0e9cff',
				},
			},
		},
		// backgroundSize: {
		// 	auto: 'auto',
		// 	cover: 'cover',
		// 	contain: 'contain',
		// 	'50%': '50%',
		// 	16: '4rem',
		// },
	},
	plugins: [],
}
