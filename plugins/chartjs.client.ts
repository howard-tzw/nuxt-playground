import {
	Chart,
	registerables,
	ScriptableContext,
	ChartDataset,
	ChartArea,
	Scale,
	LegendItem,
	ChartConfiguration,
} from 'chart.js'

import 'chartjs-adapter-date-fns'

// vue-chartjs
import { Bar, Line, Pie, Bubble } from 'vue-chartjs'

export default defineNuxtPlugin(nuxtApp => {
	Chart.register(...registerables)

	nuxtApp.vueApp.component('Bar', Bar)
	nuxtApp.vueApp.component('Line', Line)
	nuxtApp.vueApp.component('Pie', Pie)
	nuxtApp.vueApp.component('Bubble', Bubble)

	return {
		provide: { Chart },
	}
})

// Copy to sunshine/plugins/chartjs.client.ts

/**
 * @feat Custom Legend
 */
export const customLegendPlugin = {
	id: 'customLegend',
	async afterUpdate(
		chart: Chart,
		_args: Object,
		options: { chartLegendRef: Ref<any>; legends: Ref<any[]>; nextTick: () => Promise<void> },
	) {
		const { chartLegendRef, legends, nextTick } = options

		const items = chart.options.plugins?.legend?.labels?.generateLabels?.(chart)

		if (!items) {
			throw new Error('customLegendPlugin: Failed to generate labels from chart in customLegend plugin')
		}

		items.forEach((item: LegendItem, i: number) => {
			legends.value[i] = {
				text: item.text,
				color: item.strokeStyle,
				selected: !item.hidden,
			}
		})

		await nextTick()

		const el = chartLegendRef.value.legendRef
		if (!el) throw new Error('customLegendPlugin: Failed to get legend element')

		const nodes = el.children as HTMLCollection

		items.forEach((item, i) => {
			// 利用 item.text 對應的 node.innerText 來綁定 click 事件
			const node = Array.from(nodes).find(node => (node as HTMLElement).innerText === item.text) as HTMLElement
			if (!node) throw new Error('customLegendPlugin: Failed to find legend node')

			node.onclick = () => {
				const { type } = chart.config as ChartConfiguration

				if (type === 'pie' || type === 'doughnut') {
					// Pie and doughnut charts only have a single dataset and visibility is per item
					chart.toggleDataVisibility(item.index as number)
					legends.value[i].selected = item.hidden
				} else {
					if (item.datasetIndex === undefined) {
						return
					}
					chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
					legends.value[i].selected = chart.isDatasetVisible(item.datasetIndex)
				}

				chart.update()
			}
		})
	},
}

// Copy the following to sunshine/utils/chart.ts

/**
 * Gradient color for line chart
 */
export function getGradientBgColor(context: ScriptableContext<'line'>, bgColor: string) {
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

	// 若 divider 超出合理範圍
	if (gradientPosPercentage < 0 || gradientPosPercentage > 1) {
		return hex
	}

	gradientBg.addColorStop(0, convertHexToRGBA(hex, 0.5))
	gradientBg.addColorStop(gradientPosPercentage, convertHexToRGBA(hex, 0.5))
	gradientBg.addColorStop(gradientPosPercentage + percentageOffset, convertHexToRGBA(hex, 0.3))
	gradientBg.addColorStop(1, convertHexToRGBA(hex, 0.1))

	return gradientBg
}

function isValidHexColor(color: string) {
	const pattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/
	return pattern.test(color)
}

/**
 * Gradient color for bar chart
 */
export function getBarGradientBgColor(context: ScriptableContext<'bar'>, bgColor: string) {
	if (!isValidHexColor(bgColor)) {
		throw new Error('getBarGradientBgColor: bgColor must be hex')
	}

	const chart = context.chart

	const { ctx, chartArea, scales } = chart
	if (!chartArea) {
		return bgColor
	}

	const dataIndex = context.dataIndex
	const datasetIndex = context.datasetIndex
	const datasets = context.chart.data.datasets

	return getBarGradient(datasets, dataIndex, datasetIndex, ctx, chartArea, scales, bgColor)
}

function getBarGradient(
	datasets: ChartDataset[],
	dataIndex: number,
	datasetIndex: number,
	ctx: CanvasRenderingContext2D,
	chartArea: ChartArea,
	scales: { [key: string]: Scale },
	hex: string,
) {
	const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
	const upperPos = scales.y.getPixelForValue(datasets[datasetIndex].data[dataIndex] as number)
	const lowerPos = upperPos + 10
	const offset = lowerPos - chartArea.top

	const divider = offset / chartArea.height
	const d2 = (1 - divider) / 2

	if (divider < 0 || divider > 1) {
		return hex
	}

	if (divider + d2 < 0 || divider + d2 > 1) {
		return hex
	}

	gradientBg.addColorStop(0, convertHexToRGBA(hex, 0.8))
	gradientBg.addColorStop(divider, convertHexToRGBA(hex, 0.8))
	gradientBg.addColorStop(divider + d2, convertHexToRGBA(hex, 0.6))
	gradientBg.addColorStop(1, convertHexToRGBA(hex, 0.4))

	return gradientBg
}
