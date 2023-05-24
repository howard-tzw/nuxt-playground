<script setup lang="ts">
import type { Chart, ChartData, ChartOptions, LegendItem } from 'chart.js'

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

const lineTension = 0.15 // 線的弧度，0 為折線
const borderWidth = 1 // 線的粗細度

const chartData = computed<ChartData>(() => {
	const datasets = props.datasets.map(dataset => {
		return {
			lineTension,
			borderWidth,
			...dataset,
		}
	})

	return {
		labels: props.labels,
		datasets,
	}
})
const legendRef = ref()
const legends = ref<{ text: string; color: string; selected: boolean }[]>([])

const chartOptions: ChartOptions = {
	responsive: true,
	maintainAspectRatio: false, // Maintain the original canvas aspect ratio (width / height) when resizing. https://www.chartjs.org/docs/latest/api/interfaces/CoreChartOptions.html#maintainaspectratio
	scales: {
		x: {
			grid: {
				display: false, // 隱藏 x 軸網格線
			},
		},
		y: {
			min: 0,
			ticks: {
				// precision: 0,
				// stepSize: 100, // https://www.chartjs.org/docs/latest/axes/cartesian/linear.html#step-size
			},
			beginAtZero: true,

			suggestedMin: 1,
			// suggestedMax: 1000,
			// max: 1000,
		},
	},

	plugins: {
		legend: {
			display: false,
		},
		customLegend: {
			legendRef: legendRef,
			legends: legends,
			nextTick: nextTick,
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
 * @feat custom legend
 */

const customLegendPlugin = {
	id: 'customLegend',
	async afterUpdate(
		chart: Chart,
		_args: Object,
		options: { legendRef: Ref<HTMLElement>; legends: Ref<any[]>; nextTick: () => Promise<void> },
	) {
		const items = chart.options.plugins?.legend?.labels?.generateLabels?.(chart)

		if (!items) {
			throw new Error('Failed to generate labels from chart in customLegend plugin')
		}

		console.log(items)

		items.map((item: any, i: number) => {
			if (!options.legends.value[i]) {
				options.legends.value[i] = {
					text: item.text,
					color: item.strokeStyle,
					selected: true,
				}
			}
		})

		await options.nextTick()

		const el = options.legendRef.value
		const nodes = el.children as HTMLCollection

		items.forEach((item, i) => {
			;(nodes[i] as HTMLElement).onclick = () => {
				if (item.datasetIndex === undefined) {
					return
				}
				chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
				options.legends.value[i].selected = chart.isDatasetVisible(item.datasetIndex)

				chart.update()
			}
		})
	},
}

/**
 * notes on max vs. suggestedMax
 *  - 如果超出 max 就不會顯示
 *  - 如果超出 suggestedMax 還是會顯示
 */

const chartStyle = {
	height: '100%',
	width: '100%',
	position: 'relative',
}
</script>

<template>
	<div>
		<!-- legend -->
		<ul ref="legendRef" class="legend">
			<li class="legend-li" v-for="legend in legends" :key="legend.text">
				<div
					class="inline-flex h-5 w-5 items-center justify-center rounded border mr-2"
					:style="{
						'border-color': legend.color,
					}"
				>
					<div
						v-if="legend.selected"
						class="h-4 w-4 rounded border"
						:style="{ 'background-color': legend.color }"
					></div>
				</div>
				<p class="legend-text">{{ legend.text }}</p>
			</li>
		</ul>
		<!-- chart -->
		<div>
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
