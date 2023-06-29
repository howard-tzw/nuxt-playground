<script setup lang="ts">
import { faker } from '@faker-js/faker'
import { ChartData, ChartOptions } from 'chart.js'

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
	// {
	// 	label: 'My Dataset 3',
	// 	data: mockData3,
	// 	backgroundColor: '#7ED321',
	// 	borderColor: '#7ED321',
	// },
	// {
	// 	label: 'My Dataset 4',
	// 	data: mockData4,
	// 	backgroundColor: '#D0021B',
	// 	borderColor: '#D0021B',
	// },
]

const borderWidth = 2 // 線的粗細度
const tension = 0.15 // 線的弧度，0 為折線

/**
 * legend 刪除時，方塊內的顏色會變灰色，而且只有 My Dataset 2 有此情況， why?
 */

const chartData = computed<ChartData>(() => {
	// mockDatasets.push({
	// 	label: 'My Dataset 4',
	// 	data: mockData4,
	// 	backgroundColor: '#D0021B',
	// 	borderColor: '#D0021B',
	// })

	const datasets = mockDatasets.map(dataset => {
		let bgColor = dataset.backgroundColor

		return {
			...dataset,
			tension,
			borderWidth,
			fill: true,
			borderColor: bgColor,
			backgroundColor: (context: any) => {
				const chart = context.chart

				const { ctx, chartArea, scales } = chart
				if (!chartArea) {
					return bgColor
				}

				const datasetIndex = context.datasetIndex
				const datasets = context.chart.data.datasets
				if (context.type === 'dataset') {
					return getGradient(0, datasets, datasetIndex, ctx, chartArea, scales, bgColor)
				}
				return bgColor
			},
		}
	})

	return {
		labels: labels,
		datasets,
	}
})

function getGradient(maxPosOffset: number, datasets, datasetIndex, ctx, chartArea, scales, hex: string) {
	const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom) // start x, start y, end x, end y
	const max = Math.max(...datasets[datasetIndex].data)
	const maxIndex = datasets[datasetIndex].data.indexOf(max)

	if (datasetIndex === 0) {
		console.warn('scales 0', scales.y)
	}
	if (datasetIndex === 1) {
		console.warn('scales 1', scales.y)
	}
	// 不知道為什麼，同一個 dataset 的同一個 max，在後三點的 getGradient 取出的 getPixelForValue 會跟之前取得不一樣，導致 divider 算出來超出合理範圍

	// 取得序列中最大值的 canvas y 軸位置 docs: https://www.chartjs.org/docs/latest/api/classes/Scale.html#getpixelforvalue
	// note: canvas 左上角為 (0, 0)
	const maxPos = scales.y.getPixelForValue(max, maxIndex)
	// const maxPos = chartArea.top

	console.log('datasetIndex, maxPos', datasetIndex, maxPos)

	const lowerPos = maxPos + maxPosOffset
	const gradientPos = lowerPos - chartArea.top
	const gradientPosPercentage = gradientPos / chartArea.height
	const percentageOffset = (1 - gradientPosPercentage) / 2

	// 暫時解決 divider 超出合理範圍的問題
	if (gradientPosPercentage < 0 || gradientPosPercentage > 1) {
		return null
	}

	if (datasetIndex === 0) {
		console.log('============ 0 ==============')
		console.log('top', chartArea.top)
		console.log('bottom', chartArea.bottom)
		console.log('height', chartArea.height)
		console.log('max', max)
		console.log('maxPos', maxPos)
		console.log('lowerPos', lowerPos)
		console.log('==========================')
	}

	if (datasetIndex === 1) {
		console.log('============ 1 ==============')
		console.log('top', chartArea.top)
		console.log('bottom', chartArea.bottom)
		console.log('height', chartArea.height)
		console.log('max', max)
		console.log('maxPos', maxPos)
		console.log('lowerPos', lowerPos)
		console.log('==========================')
	}

	gradientBg.addColorStop(0, convertHexToRGBA(hex, 1))
	gradientBg.addColorStop(gradientPosPercentage, convertHexToRGBA(hex, 1))
	gradientBg.addColorStop(gradientPosPercentage + percentageOffset, convertHexToRGBA(hex, 0.6))
	gradientBg.addColorStop(1, convertHexToRGBA(hex, 0.4))

	return gradientBg
}

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
	<div class="my-section">
		<div class="section-title">
			<p>Gradient Line Chart with Custom Legend</p>
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
