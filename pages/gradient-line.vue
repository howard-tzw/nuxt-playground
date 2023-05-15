<script setup lang="ts">
import { faker } from '@faker-js/faker'

const labels = new Array(7).fill('').map(x => faker.lorem.words(1))

const chartData = computed(() => ({
	labels,
	// 排序前面的圖也會在前面
	datasets: [
		{
			label: 'My Dataset 2',
			data: new Array(7).fill(0).map(x => faker.datatype.number({ min: 0, max: 70 })),
			fill: false,
			borderColor: '#7CB5D7',
			tension: 0.1,
		},
		{
			label: 'My Dataset 1',
			data: new Array(7).fill(0).map(x => faker.datatype.number({ min: 0, max: 100 })),
			fill: false,
			borderColor: '#FD7E56',
			tension: 0.1,
		},
	],
}))
</script>

<template>
	<div class="dashboard">
		<div class="dashboard-row">
			<div class="my-section">
				<div class="section-title">
					<p>Gradient Line Chart</p>
				</div>
				<ClientOnly>
					<GradientChartLine v-bind="chartData" />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>
