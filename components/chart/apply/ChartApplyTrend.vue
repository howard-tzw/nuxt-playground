<script setup lang="ts">
import type { ChartData, ChartOptions, ScriptableContext } from 'chart.js'
import { getGradientBgColor } from '~/plugins/chartjs.client'
import { customLegendPlugin } from '~/plugins/chartjs.client'

const props = withDefaults(
	defineProps<{
		chartData: ChartData
		pending: boolean
		error: any
		chartId?: string
		isLog?: boolean
		addTotalLine?: boolean
	}>(),
	{
		chartId: 'line-chart',
		isLog: false,
		addTotalLine: true,
	},
)

const borderWidth = 0.5 // 線的粗細度
const tension = 0.15 // 線的弧度，0 為折線

const lineChartData = computed(() => {
	let datasets = props.chartData.datasets

	// 加入總和線
	if (props.addTotalLine && !datasets.find(dataset => dataset.label === '總和')) {
		const totalSeries = datasets.reduce((acc, dataset) => {
			dataset.data.forEach((x, i) => {
				acc[i] += x
			})
			return acc
		}, Array(datasets[0].data.length).fill(0))

		// 總和線
		datasets.push({
			label: '總和',
			data: totalSeries,
			backgroundColor: totalColor,
			borderColor: totalColor,
		})
	}

	datasets = datasets.map(dataset => {
		const bgColor = dataset.backgroundColor as string
		return {
			...dataset,
			borderColor: bgColor,
			borderWidth,
			tension,
			fill: true, // 線的下方填滿顏色
			backgroundColor: (context: ScriptableContext<any>) => getGradientBgColor(context, bgColor),
		}
	})

	// 從每個 dataset 內取出最大值，讓有最大的最大值的 dataset 在最後面
	datasets = datasets.slice().sort((a, b) => {
		const maxA = Math.max(...(a.data as number[]))
		const maxB = Math.max(...(b.data as number[]))
		return maxA - maxB
	})

	const res = {
		labels: props.chartData.labels,
		datasets,
	}

	return res
})

/**
 * @feat ======================== Custom Legend ========================
 */

type Legend = {
	text: string
	color: string
	selected: boolean
}

const chartLegendRef = ref()
const legends = ref<Legend[]>([])

function legendSortFn(a: Legend, b: Legend) {
	if (a.text === '民事') {
		return -1
	}
	if (b.text === '民事') {
		return 1
	}
	if (a.text === '刑事') {
		return -1
	}
	if (b.text === '刑事') {
		return 1
	}
	if (a.text === '行政') {
		return -1
	}
	if (b.text === '行政') {
		return 1
	}
	if (a.text === '總和') {
		return -1
	}
	if (b.text === '總和') {
		return 1
	}
	return 0
}

const chartOptions: ChartOptions = {
	responsive: true,
	maintainAspectRatio: false, // Maintain the original canvas aspect ratio (width / height) when resizing. https://www.chartjs.org/docs/latest/api/interfaces/CoreChartOptions.html#maintainaspectratio
	scales: {
		x: {
			grid: {
				display: false, // 隱藏 x 軸網格線
			},
			ticks: {
				maxRotation: 0,
			},
		},
		y: {
			type: props.isLog ? 'logarithmic' : undefined,
			min: 0,
			ticks: {
				precision: 0,
				callback: value => {
					return formatNumberWithCommas(value)
				},
				// stepSize: 100, // https://www.chartjs.org/docs/latest/axes/cartesian/linear.html#step-size
			},
			beginAtZero: true,
			suggestedMin: 1, // log type 才需要這樣
			suggestedMax: 100, // 讓 default 的 y axis max tick 為 100 而不是 1
			// max: 1000,
		},
	},
	plugins: {
		// @ts-ignore
		customLegend: {
			chartLegendRef,
			legends,
			nextTick,
		},
		legend: {
			display: false,
			position: 'top',
			align: 'end',
			labels: {
				boxWidth: 10,
				boxHeight: 10,
			},
		},
		tooltip: {
			...tooltipConfig,
		},
	},
	// hide points https://stackoverflow.com/questions/35073734/hide-points-in-chartjs-linegraph
	// @todo 游標滑到點位要能夠輕易顯示資訊，但又要隱藏圓點
	elements: {
		point: {
			radius: 0,
		},
	},
	// tooltip interaction modes
	// https://www.chartjs.org/docs/latest/configuration/interactions.html#modes
	interaction: {
		mode: 'nearest',
		axis: 'xy',
		intersect: false,
	},
}

/**
 * notes on max vs. suggestedMax
 *  - 如果超出 max 就不會顯示
 *  - 如果超出 suggestedMax 還是會顯示
 */

const chartStyle = {
	width: '100%',
	position: 'relative',
}
// Notes: 使用 width, height 調整圖表的比例，可能在 RWD 拉動跟載入頁面時的 breakpoint 差異而使圖表大小不一致
</script>

<template>
	<div class="section-container">
		<div class="section-header gap-1">
			<div class="section-title flex">
				<slot></slot>
			</div>
			<!-- ======================== Custom Legend ======================== -->
			<ChartLegend ref="chartLegendRef" :legends="legends" :sort-fn="legendSortFn" />
		</div>

		<!-- Note: 線圖會拉很長，因此限制最大高度 -->
		<div class="section-content flex h-full flex-col justify-center">
			<div class="max-h-[200px]">
				<ClientOnly>
					<Loading v-if="pending && !chartData.datasets.length" />
					<Error v-else-if="error" :error="error" />
					<Line
						v-else
						:style="chartStyle"
						:chart-id="chartId"
						:data="lineChartData"
						:options="chartOptions"
						:plugins="[customLegendPlugin]"
					/>
				</ClientOnly>
			</div>
		</div>
	</div>
</template>
