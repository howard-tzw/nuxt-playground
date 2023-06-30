<script setup lang="ts">
import { faker } from '@faker-js/faker'
import { ChartOptions, ScriptableContext } from 'chart.js'
import { getGradientBgColor } from '~/plugins/chartjs.client'
/**
 * Final Gradient Line Chart
 * @feat 一頁成型，不依賴其他函式
 * @feat 依照線圖高度進行排序（但 legend 排序也會依照這個排序，若要修改 legend 排序，參見 final-gradient-line-with-custom-legend）
 *
 * @bug 較高的 dataset 的 LegendItem 點選後，方塊內顏色會變黑，若有兩條線高度差不多，則兩個都要點，兩個就會一起變黑
 * 	- 問題出在 getPixelForValue(max, maxIndex)
 */

const labels = new Array(7).fill('').map(x => faker.lorem.words(1))

const mockData = [68, 60, 6, 0, 35, 49, 6]
const mockData2 = [38, 64, 0, 99, 51, 80, 38]
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

const chartData = computed(() => {
	let datasets = mockDatasets.map(dataset => {
		let bgColor = dataset.backgroundColor

		return {
			...dataset,
			borderWidth,
			tension,
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
			position: 'top',
			align: 'end',
			labels: {
				boxWidth: 10,
				boxHeight: 10,
			},
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

const chartStyle = {
	// height: '100%',
	width: '100%',
	position: 'relative',
}
</script>

<template>
	<div class="">
		<div class="p-5 text-center">
			<p>Gradient Line Chart</p>
		</div>
		<div>
			<ClientOnly>
				<div class="max-h-[300px]">
					<Line :style="chartStyle" chart-id="line-chart" :data="chartData" :options="chartOptions" />
				</div>
			</ClientOnly>
		</div>
	</div>
</template>
