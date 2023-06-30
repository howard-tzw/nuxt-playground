<script setup lang="ts">
import { faker } from '@faker-js/faker'
import { ChartOptions, ScriptableContext } from 'chart.js'
import { getGradientBgColor } from '~/plugins/chartjs.client'
import { customLegendPlugin } from '~/plugins/chartjs.client'

const labels = new Array(7).fill('').map(x => faker.lorem.words(1))

const mockData = [134, 672, 765, 517, 352, 313, 0]
const mockData2 = [148, 16, 26, 25, 13, 3, 0]
const mockData3 = [61, 98, 92, 56, 0, 19, 0]
const mockData4 = [20, 10, 30, 40, 20, 10, 20]

const randomData = new Array(7).fill(0).map(x => faker.datatype.number({ min: 0, max: 100 }))

const mockDatasets = [
	{
		label: 'My Dataset 1',
		data: mockData,
		backgroundColor: '#F5A623',
		borderColor: '#F5A623',
	},
	{
		label: 'My Dataset 2',
		data: mockData2,
		backgroundColor: '#4A90E2',
		borderColor: '#4A90E2',
	},
	{
		label: 'My Dataset 3',
		data: mockData3,
		backgroundColor: '#7ED321',
		borderColor: '#7ED321',
	},
	{
		label: 'My Dataset 4',
		data: mockData4,
		backgroundColor: '#D0021B',
		borderColor: '#D0021B',
	},
]

const borderWidth = 0.5 // 線的粗細度
const tension = 0.15 // 線的弧度，0 為折線

/**
 * legend 刪除時，方塊內的顏色會變灰色，而且只有 My Dataset 2 有此情況， why?
 */

const chartData = computed(() => {
	let datasets = mockDatasets.map(dataset => {
		let bgColor = dataset.backgroundColor

		return {
			...dataset,
			tension,
			borderWidth,
			fill: true,
			borderColor: bgColor,
			backgroundColor: (context: ScriptableContext<any>) => getGradientBgColor(context, bgColor),
		}
	})

	/**
	 * @feat 依照線圖高度進行排序
	 * 從每個 dataset 內取出最大值，比較 datasets 的最大值，讓有最大的最大值的 dataset 在最後面
	 */
	datasets = datasets.slice().sort((a, b) => {
		const maxA = Math.max(...(a.data as number[]))
		const maxB = Math.max(...(b.data as number[]))
		return maxA - maxB
	})

	return {
		labels: labels,
		datasets,
	}
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
	if (a.text > b.text) return 1
	if (a.text < b.text) return -1
	return 0
}

const chartOptions: ChartOptions = {
	responsive: true,
	maintainAspectRatio: false, // Maintain the original canvas aspect ratio (width / height) when resizing. https://www.chartjs.org/docs/latest/api/interfaces/CoreChartOptions.html#maintainaspectratio
	scales: {
		x: {
			grid: {
				display: false,
			},
		},
		y: {
			min: 0,
			beginAtZero: true,
			suggestedMin: 1,
		},
	},
	plugins: {
		/**
		 * @feat ======================== Custom Legend ========================
		 */
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
		// 未使用 custom legend，一般 legend + 漸層效果就會出現問題
	},
	// hide points https://stackoverflow.com/questions/35073734/hide-points-in-chartjs-linegraph
	// @todo 游標滑到點位要能夠輕易顯示資訊，但又要隱藏圓點

	// tooltip interaction modes
	// https://www.chartjs.org/docs/latest/configuration/interactions.html#modes
	interaction: {
		mode: 'nearest',
		axis: 'xy',
		intersect: false,
	},
}

const chartStyle = {
	// height: '100%',
	width: '100%',
	position: 'relative',
}
</script>

<template>
	<div class="">
		<div class="p-5 text-center">
			<p>Gradient Line Chart with Custom Legend</p>
		</div>

		<!-- ======================== Custom Legend ======================== -->
		<ChartLegend ref="chartLegendRef" :legends="legends" :sort-fn="legendSortFn" />

		<div>
			<ClientOnly>
				<div class="max-h-[300px]">
					<Line
						:style="chartStyle"
						chart-id="line-chart"
						:data="chartData"
						:options="chartOptions"
						:plugins="[customLegendPlugin]"
					/>
				</div>
			</ClientOnly>
		</div>
	</div>
</template>
