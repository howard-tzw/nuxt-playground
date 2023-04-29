/** @type {import('tailwindcss').Config} */
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
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
		},
		// backgroundSize: {
		// 	auto: 'auto',
		// 	cover: 'cover',
		// 	contain: 'contain',
		// 	'50%': '50%',
		// 	16: '4rem',
		// },
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light'],
	},
}
