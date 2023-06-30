<script setup lang="ts">
import { ScriptableContext } from 'chart.js'
import { getBarGradientBgColor } from '~/plugins/chartjs.client'

const data = ref({
	labels: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	datasets: [
		{
			label: 'Data One',
			backgroundColor: (context: ScriptableContext<'bar'>) => getBarGradientBgColor(context, '#FF0000'),
			data: [40, 20, 12, 70, 10, 40, 80, 100, 40, 20, 12, 11],
			barThickness: 50,
		},
	],
})

const options = {
	responsive: true,
	maintainAspectRatio: false,
}
</script>

<template>
	<div class="p-5">
		<ClientOnly>
			<Bar :data="data" :options="options" :height="300" :width="100" />
		</ClientOnly>
	</div>
</template>
