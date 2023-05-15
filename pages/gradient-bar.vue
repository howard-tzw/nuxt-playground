<script setup lang="ts">
const data = ref({
	labels: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	datasets: [
		{
			label: 'Data One',
			backgroundColor: context => {
				const chart = context.chart
				const dataIndex = context.dataIndex
				const datasetIndex = context.datasetIndex
				const datasets = context.chart.data.datasets

				const { ctx, chartArea, scales } = chart
				if (!chartArea) {
					return null
				}
				return getGradient(datasets, dataIndex, datasetIndex, ctx, chartArea, scales)
			},
			data: [40, 20, 12, 70, 10, 40, 80, 100, 40, 20, 12, 11],
			barThickness: 50,
		},
	],
})

function getGradient(datasets, dataIndex, datasetIndex, ctx, chartArea, scales) {
	const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom) // start x, start y, end x, end y

	// console.log(chartArea.top) // 239.6 === chartArea.bottom - chartArea.top
	// Returns the location of the given data point. Value can either be an index or a numerical value The coordinate (0, 0) is at the upper-left corner of the canvas

	// @todo 必須能夠區分不同 bar 的高度 (ex. 40) 並給定不同的漸層策略，就能製作依據數值變化的漸層背景
	const upperPos = scales.y.getPixelForValue(datasets[datasetIndex].data[dataIndex])
	const lowerPos = upperPos + 10
	// console.log('40', scales.y.getPixelForValue(40)) // 175
	// console.log('20', scales.y.getPixelForValue(20)) // 223
	// console.log(223 - chartArea.top) // 223 - 32
	const offset = lowerPos - chartArea.top
	const divider = offset / chartArea.height

	// console.log(divider)

	// // 191

	// console.log(191 / 239.6)

	// console.log('this', scales.y.getPixelForValue(20) - scales.y.getPixelForValue(40)) // 47

	// console.log(scales.y.getPixelForTick(0)) // 不確定這是抓到什麼

	const d2 = (1 - divider) / 2

	gradientBg.addColorStop(0, convertHexToRGBA('#FF0000', 0.8))
	gradientBg.addColorStop(divider, convertHexToRGBA('#FF0000', 0.8))
	gradientBg.addColorStop(divider + d2, convertHexToRGBA('#FF0000', 0.6))
	gradientBg.addColorStop(1, convertHexToRGBA('#FF0000', 0.4))

	// @todo 必須能夠區分「不同的 dataset」並給定不同的漸層策略，就能製作多個 dataset 的漸層背景

	return gradientBg
}

const options = {
	responsive: true,
	maintainAspectRatio: false,
}
</script>

<template>
	<div class="p-5">
		<ClientOnly>
			<Bar :data="data" :options="options" :height="300" :width="100" />
		</ClientOnly>
	</div>
</template>
