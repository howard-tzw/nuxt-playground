<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { customLegendPlugin } from '~/plugins/chartjs.client'

const props = withDefaults(
	defineProps<{
		chartData: ChartData
		pending: boolean
		error: any
		chartId?: string
	}>(),
	{
		chartId: 'bubble-chart',
	},
)

function convertToRadius(count: number, max: number) {
	if (count === 0) return 0
	/**
	 * TL;DR 對每個 count 乘以 (30-3)/(max-1) + 3
	 * radius 3 為最小的點半徑
	 * radius 30 為最大的點半徑
	 * max 為最大的值，即以半徑 30 呈現
	 */
	return (count * (30 - 3)) / (max - 1) + 3
}

const bubbleChartData = computed<ChartData>(() => {
	// 先在 datasets 中找到最大點的值
	const max = getMaxR(props.chartData.datasets)

	const datasets = props.chartData.datasets.map(dataset => {
		return {
			...dataset,
			data: dataset.data.map(point => {
				return {
					x: point.x,
					y: point.y,
					r: convertToRadius(point.r, max),
				}
			}),
		}
	})

	return {
		labels: props.chartData.labels,
		datasets,
	}
})

function getMaxR(datasets: ChartData['datasets']) {
	return datasets.reduce((acc, dataset) => {
		const m = Math.max(...dataset.data.map(d => d.r))
		if (m > acc) {
			acc = m
		}
		return acc
	}, 0)
}

/**
 * @feat Custom Legend
 */
const chartLegendRef = ref(null)
const legends = ref<{ text: string; color: string; selected: boolean }[]>([])

const chartOptions: ChartOptions = {
	responsive: true,
	maintainAspectRatio: false, // Maintain the original canvas aspect ratio (width / height) when resizing. https://www.chartjs.org/docs/latest/api/interfaces/CoreChartOptions.html#maintainaspectratio
	plugins: {
		// @ts-ignore
		customLegend: {
			chartLegendRef,
			legends,
			nextTick,
		},
		legend: {
			display: false,
		},
		// https://www.chartjs.org/docs/latest/configuration/tooltip.html
		tooltip: {
			...tooltipConfig,
			callbacks: {
				title: ctx => {
					return ctx[0].raw.x
				},
				label: function (ctx) {
					const label = ctx.dataset.label || ''
					// 找到這個點位在 dataset 的哪個位置，定位在原始資料即可找出正確件數
					return `${label}：${props.chartData.datasets[ctx.datasetIndex].data[ctx.dataIndex].r} 件`
				},
			},
		},
	},
	scales: {
		x: {
			min: '1996', // x 軸顯示最早年份
			type: 'time',
			time: {
				unit: 'year',
			},
			ticks: {
				maxRotation: 0,
			},
		},
		y: {
			type: 'linear',
			grid: {
				display: false,
			},
			ticks: {
				display: false,
			},

			// max: 0.5,
			// min: -0.5,
			// display: false,
		},
	},
	interaction: {
		mode: 'nearest',
		axis: 'xy',
		intersect: false,
	},
}

const chartStyle = {
	height: '100%',
	width: '100%',
	position: 'relative',
}
</script>

<template>
	<div class="section-container">
		<div class="section-header gap-1">
			<div class="section-title flex items-center">
				<slot></slot>
			</div>
			<ChartLegend ref="chartLegendRef" :legends="legends" />
		</div>

		<div>
			<ClientOnly>
				<Loading v-if="pending && !chartData.datasets.length"></Loading>
				<Error v-else-if="error" :error="error"></Error>
				<Bubble
					v-else
					:style="chartStyle"
					:chart-id="chartId"
					:data="bubbleChartData"
					:options="chartOptions"
					:plugins="[customLegendPlugin]"
				/>
			</ClientOnly>
		</div>
	</div>
</template>
