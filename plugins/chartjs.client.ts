import { Chart, registerables } from 'chart.js'

import 'chartjs-adapter-date-fns'

// vue-chartjs
import { Bar, Line, Pie, Bubble } from 'vue-chartjs'

export default defineNuxtPlugin(nuxtApp => {
	Chart.register(...registerables)

	nuxtApp.vueApp.component('Bar', Bar)
	nuxtApp.vueApp.component('Line', Line)
	nuxtApp.vueApp.component('Pie', Pie)
	nuxtApp.vueApp.component('Bubble', Bubble)

	return {
		provide: { Chart },
	}
})
