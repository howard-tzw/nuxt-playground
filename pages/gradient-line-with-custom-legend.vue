<script setup lang="ts">
import { faker } from '@faker-js/faker'
import { ChartData, ChartOptions } from 'chart.js'

const labels = new Array(7).fill('').map(x => faker.lorem.words(1))

const mockData = [68, 60, 6, 30, 35, 49, 6]
const mockData2 = [38, 64, 9, 99, 51, 80, 38]

const randomData = new Array(7).fill(0).map(x => faker.datatype.number({ min: 0, max: 100 }))

const mockDatasets = ref([
	{
		label: 'My Dataset 2',
		data: mockData,
		fill: false,
		borderColor: '#7CB5D7',
		tension: 0.1,
	},
	{
		label: 'My Dataset 1',
		data: mockData2,
		fill: false,
		borderColor: '#FD7E56',
		tension: 0.1,
	},
])

console.log(mockDatasets.value[0].data, mockDatasets.value[1].data)

const lineTension = 0.3 // 線的弧度，0 為折線
const borderWidth = 1 // 線的粗細度

const chartData = computed<ChartData>(() => {
	const datasets = mockDatasets.value.map(dataset => ({
		...dataset,
		lineTension,
		borderWidth,
		backgroundColor: context => {
			const chart = context.chart

			const { ctx, chartArea, scales } = chart
			if (!chartArea) {
				return null
			}

			const datasetIndex = context.datasetIndex
			const datasets = context.chart.data.datasets
			if (context.type === 'dataset') {
				return getGradient(30, datasets, datasetIndex, ctx, chartArea, scales, dataset.borderColor)
			}

			return dataset.borderColor
		},
		fill: true,
	}))

	return {
		labels: labels,
		datasets,
	}
})

function getGradient(maxPosOffset: number, datasets, datasetIndex, ctx, chartArea, scales, hex: string) {
	const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom) // start x, start y, end x, end y
	const max = Math.max(...datasets[datasetIndex].data)

	// 不知道為什麼，同一個 dataset 的同一個 max，在後三點的 getGradient 取出的 getPixelForValue 會跟之前取得不一樣，導致 divider 算出來超出合理範圍
	const maxPos = scales.y.getPixelForValue(max)
	const lowerPos = maxPos + maxPosOffset
	const gradientPos = lowerPos - chartArea.top
	const gradientPosPercentage = gradientPos / chartArea.height
	const percentageOffset = (1 - gradientPosPercentage) / 2

	// 暫時解決 divider 超出合理範圍的問題
	if (gradientPosPercentage < 0 || gradientPosPercentage > 1) {
		return null
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
	height: '100%',
	width: '200%',
	position: 'relative',
}
</script>

<template>
	<div class="dashboard">
		<div class="dashboard-row">
			<div class="my-section">
				<div class="section-title">
					<p>Gradient Line Chart with Custom Legend</p>
				</div>
				<ClientOnly>
					<div>
						<Line :style="chartStyle" chart-id="line-chart" :data="chartData" :options="chartOptions" />
					</div>
				</ClientOnly>
			</div>
		</div>
	</div>
</template>
