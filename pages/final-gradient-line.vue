<script setup lang="ts">
import { faker } from '@faker-js/faker'
import { ChartOptions, ChartDataset, ScriptableContext, ChartArea, Scale } from 'chart.js'

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
	 */

	console.log(datasets)

	// 從每個 dataset 內取出最大值，比較 datasets 的最大值，讓有最大的最大值的 dataset 在最後面
	datasets = datasets.slice().sort((a, b) => {
		const maxA = Math.max(...(a.data as number[]))
		const maxB = Math.max(...(b.data as number[]))
		return maxA - maxB
	})

	console.log('sorted', datasets)

	return {
		labels: labels,
		datasets,
	}
})

/**
 * ===================== Copy to chartjs.client.ts <start> =====================
 */

// import { ChartDataset, ScriptableContext, ChartArea, Scale } from 'chart.js'

function isValidHexColor(color: string) {
	const pattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/
	return pattern.test(color)
}

function getGradientBgColor(context: ScriptableContext<any>, bgColor: string) {
	if (!isValidHexColor(bgColor)) {
		throw new Error('getGradientBgColor: bgColor must be hex')
	}

	const chart = context.chart

	const { ctx, chartArea, scales } = chart
	if (!chartArea) {
		return bgColor
	}

	const datasetIndex = context.datasetIndex
	const datasets = context.chart.data.datasets
	if (context.type === 'dataset') {
		return getGradient(datasets, datasetIndex, ctx, chartArea, scales, bgColor)
	}
	return bgColor
}

function getGradient(
	datasets: ChartDataset[],
	datasetIndex: number,
	ctx: CanvasRenderingContext2D,
	chartArea: ChartArea,
	scales: { [key: string]: Scale },
	hex: string,
) {
	if (!isValidHexColor(hex)) {
		throw new Error('getGradient: hex must be 6 digit')
	}

	const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom) // start x, start y, end x, end y
	const max = Math.max(...(datasets[datasetIndex].data as number[]))
	const maxIndex = datasets[datasetIndex].data.indexOf(max)

	// 取得序列中最大值的 canvas y 軸位置 docs: https://www.chartjs.org/docs/latest/api/classes/Scale.html#getpixelforvalue
	// note: canvas 左上角為 (0, 0)
	const maxPos = scales.y.getPixelForValue(max, maxIndex)

	const gradientPos = maxPos - chartArea.top
	const gradientPosPercentage = gradientPos / chartArea.height
	const percentageOffset = (1 - gradientPosPercentage) / 2

	// divider 超出合理範圍
	if (gradientPosPercentage < 0 || gradientPosPercentage > 1) {
		return null
	}

	gradientBg.addColorStop(0, convertHexToRGBA(hex, 0.5))
	gradientBg.addColorStop(gradientPosPercentage, convertHexToRGBA(hex, 0.5))
	gradientBg.addColorStop(gradientPosPercentage + percentageOffset, convertHexToRGBA(hex, 0.3))
	gradientBg.addColorStop(1, convertHexToRGBA(hex, 0.1))

	return gradientBg
}

/**
 * ===================== Copy to chartjs.client.ts <end> =====================
 */

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
	<div class="my-section">
		<div class="section-title">
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
