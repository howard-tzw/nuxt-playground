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
