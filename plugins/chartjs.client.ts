import { Chart, registerables, ScriptableContext, ChartDataset, ChartArea, Scale, LegendItem } from 'chart.js'

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

/**
 * @feat custom legend
 */
export const customLegendPlugin = {
	id: 'customLegend',
	async afterUpdate(
		chart: Chart,
		_args: Object,
		options: { chartLegendRef: Ref<any>; legends: Ref<any[]>; nextTick: () => Promise<void> },
	) {
		const items = chart.options.plugins?.legend?.labels?.generateLabels?.(chart)

		if (!items) {
			throw new Error('Failed to generate labels from chart in customLegend plugin')
		}

		items.forEach((item: LegendItem, i: number) => {
			options.legends.value[i] = {
				text: item.text,
				color: item.strokeStyle,
				selected: !item.hidden,
			}
		})

		await options.nextTick()

		const el = options.chartLegendRef.value.legendRef
		if (!el) throw new Error('Failed to get legend element')

		const nodes = el.children as HTMLCollection

		items.forEach((item, i) => {
			;(nodes[i] as HTMLElement).onclick = () => {
				const { type } = chart.config
				if (type === 'pie' || type === 'doughnut') {
					// Pie and doughnut charts only have a single dataset and visibility is per item
					chart.toggleDataVisibility(item.index as number)
					options.legends.value[i].selected = item.hidden
				} else {
					if (item.datasetIndex === undefined) {
						return
					}
					chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex))
					options.legends.value[i].selected = chart.isDatasetVisible(item.datasetIndex)
				}

				chart.update()
			}
		})
	},
}

export function getGradientBgColor(context: ScriptableContext<any>, bgColor: string) {
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

/**
 *
 * @param datasets
 * @param datasetIndex
 * @param ctx
 * @param chartArea
 * @param scales
 * @param hex 必須是 6 位數的 hex
 */
function getGradient(
	datasets: ChartDataset[],
	datasetIndex: number,
	ctx: CanvasRenderingContext2D,
	chartArea: ChartArea,
	scales: { [key: string]: Scale },
	hex: string,
) {
	if (hex.length !== 7) {
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
