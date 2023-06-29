import { LegendItem, Chart } from 'chart.js'

export const tooltipBackgroundColor = 'rgba(255,255,255, 0.6)'

export const tooltipConfig = {
	padding: {
		top: 15,
		bottom: 15,
		left: 20,
		right: 20,
	},
	backgroundColor: tooltipBackgroundColor,
	titleColor: 'black',
	bodyColor: 'black',
	borderColor: 'black',
	borderWidth: 0.1,
	titleFont: {
		weight: 'normal',
	},
	cornerRadius: 20,
	caretSize: 0,
}

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
				color: item.fillStyle,
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

/**
 *
 * @param maxPosOffset
 * @param datasets
 * @param datasetIndex
 * @param ctx
 * @param chartArea
 * @param scales
 * @param hex 必須是 6 位數的 hex
 */
export function getGradient(
	maxPosOffset: number,
	datasets: any,
	datasetIndex: any,
	ctx: any,
	chartArea: any,
	scales: any,
	hex: string,
) {
	if (hex.length !== 7) {
		throw new Error('getGradient: hex must be 6 digit')
	}
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
