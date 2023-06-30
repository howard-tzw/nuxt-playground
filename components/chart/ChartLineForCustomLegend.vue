<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { customLegendPlugin } from '~/plugins/chartjs.client'

/**
 * @feat 由於 datasets 的順序會影響 legend 的順序，legendSortFn 可以自訂 legend 的排序
 */

const props = withDefaults(
	defineProps<{
		chartId?: string
		labels: ChartData['labels']
		datasets: ChartData['datasets']
	}>(),
	{
		chartId: 'line-chart',
	},
)

const tension = 0.15 // 線的弧度，0 為折線
const borderWidth = 1 // 線的粗細度

const chartData = computed<ChartData>(() => {
	let datasets = props.datasets.map(dataset => {
		return {
			tension,
			borderWidth,
			...dataset,
		}
	})

	// sort datasets by Dataset number as 3, 1, 2
	datasets = datasets.slice().sort((a, b) => {
		const aDatasetNumber = Number(a.label?.split(' ')[2])
		const bDatasetNumber = Number(b.label?.split(' ')[2])
		// 2 -> 1 -> 3
		if (aDatasetNumber === 2) return 1
		if (aDatasetNumber === 1) return -1
		if (aDatasetNumber === 3) return -1
		return 0
	})

	return {
		labels: props.labels,
		datasets,
	}
})

/**
 * @feat Custom Legend
 */

type Legend = {
	text: string
	color: string
	selected: boolean
}

const chartLegendRef = ref()
const legends = ref<Legend[]>([])

function legendSortFn(a: Legend, b: Legend) {
	if (a.text > b.text) return 1
	if (a.text < b.text) return -1
	return 0
}

const chartOptions: ChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			grid: {
				display: false, // 隱藏 x 軸網格線
			},
		},
		y: {
			min: 0,
			beginAtZero: true,
			suggestedMin: 1,
		},
	},

	plugins: {
		legend: {
			display: false,
		},
		/**
		 * Custom Legend
		 */
		customLegend: {
			chartLegendRef,
			legends,
			nextTick,
		},
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	interaction: {
		mode: 'nearest',
		axis: 'xy',
		intersect: false,
	},
}

const chartStyle = {
	width: '100%',
	position: 'relative',
}
</script>

<template>
	<div class="p-7">
		<!-- legend -->
		<ChartLegend ref="chartLegendRef" :legends="legends" :sort-fn="legendSortFn" />

		<!-- chart -->
		<div class="max-h-[300px]">
			<Line
				:style="chartStyle"
				:chart-id="chartId"
				:data="chartData"
				:options="chartOptions"
				:plugins="[customLegendPlugin]"
				height="50"
				width="100"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.legend {
	display: flex;
	flex-direction: row;
	margin: 0px;
	padding: 0px;
}
.legend-li {
	align-items: center;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	margin-left: 10px;
}
.legend-box {
	background: rgba(255, 99, 132, 0.2);
	border-color: rgb(255, 99, 132);
	border-width: 3px;
	padding: 3px;
	display: inline-block;
	height: 20px;
	margin-right: 10px;
	width: 20px;
}

.legend-box2 {
	background: rgba(33, 111, 132, 0.2);
	border-color: rgba(33, 111, 132, 0.2);
	border-width: 3px;
	padding: 3px;
	display: inline-block;
	height: 20px;
	margin-right: 10px;
	width: 20px;
}
.legend-text {
	color: rgb(102, 102, 102);
	margin: 0px;
	padding: 0px;
}
</style>
