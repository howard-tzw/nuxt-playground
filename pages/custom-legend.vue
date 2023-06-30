<script setup lang="ts">
import { faker } from '@faker-js/faker'

const labels = new Array(7).fill('').map(x => faker.lorem.words(1))

const chartData = computed(() => ({
	labels,
	datasets: [
		{
			label: 'My Dataset 1',
			data: [65, 59, 80, 81, 56, 55, 40],
			fill: false,
			borderColor: 'rgb(75, 192, 192)',
			tension: 0.1,
		},
		{
			label: 'My Dataset 2',
			data: new Array(7).fill(0).map(x => faker.datatype.number({ min: 0, max: 100 })),
			fill: false,
			borderColor: 'rgb(75, 40, 192)',
			tension: 0.1,
		},
		{
			label: 'My Dataset 3',
			data: new Array(7).fill(0).map(x => faker.datatype.number({ min: 0, max: 100 })),
			fill: false,
			borderColor: 'rgb(23, 80, 12)',
			tension: 0.1,
		},
	],
}))
</script>

<template>
	<div class="">
		<div class="p-3 text-center">
			<p>Custom Legend</p>
		</div>
		<ClientOnly>
			<ChartLineForCustomLegend v-bind="chartData" />
		</ClientOnly>
	</div>
</template>
