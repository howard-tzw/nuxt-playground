<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { Plugin } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { customLegendPlugin } from '~/plugins/chartjs.client'

/**
 * About datalables
 * https://github.com/chartjs/chartjs-plugin-datalabels/issues/49
 */

/**
 * How to Always Show Tooltip on Pie Chart
 * https://www.youtube.com/watch?v=bDst745vCck
 */

/**
 * External custom tooltips
 * https://www.chartjs.org/docs/latest/configuration/tooltip.html#external-custom-tooltips
 */
const props = withDefaults(
	defineProps<{
		title: string
		yearOptions: { name: string; value: number | undefined }[]
		chartId?: string
		chartData: ChartData
		pending?: boolean
		error?: any
		datalabels?: boolean
	}>(),
	{
		chartId: 'pie-chart',
		pending: false,
		error: null,
		datalabels: false,
	},
)
defineEmits(['update:year'])

// const selectedYear = ref(props.year)

/**
 * @feat Custom Legend
 */
const chartLegendRef = ref(null)
const legends = ref<{ text: string; color: string; selected: boolean }[]>([])

const chartOptions: ChartOptions = {
	responsive: true,
	maintainAspectRatio: false,

	plugins: {
		// @ts-ignore
		customLegend: {
			chartLegendRef,
			legends,
			nextTick,
		},
		legend: {
			display: false,
			position: 'bottom',
			align: 'center',
			labels: {
				boxWidth: 10,
				boxHeight: 10,
			},
		},
		// https://www.chartjs.org/docs/latest/configuration/tooltip.html
		tooltip: {
			...tooltipConfig,
			padding: 20,
			callbacks: {
				title: () => {
					return ''
				},
				label: function (ctx) {
					const label = ctx.label || ''
					return `${label}：${ctx.formattedValue} 件`
				},
			},
		},
		datalabels: {
			labels: {
				position: 'outside',
				textMargin: 10,
			},
		},
	},
}

const chartStyle = {
	height: '100%',
	width: '100%',
	position: 'relative',
}

const showYear = computed(() => {
	return !props.pending && !props.error
})

const chartPlugins = computed(() => {
	const plugins: Plugin[] = [customLegendPlugin]
	if (props.datalabels) {
		plugins.push(ChartDataLabels)
	}
	return plugins
})
</script>

<template>
	<div class="section-container">
		<div class="section-header">
			<p class="section-title">{{ title }}</p>
			<p v-if="showYear">{{ yearOptions[0].name }}</p>
		</div>
		<div class="section-content">
			<ClientOnly>
				<!-- @todo 無法在有舊資料時，不顯示 loading -->
				<!-- 若判斷 data 有無來顯示 loading，會在 navigate 取得新資料後，pie 突然放大 -->
				<Loading v-if="pending && chartData.datasets[0].data.every(x => x === 0)" />
				<Error v-else-if="error" :error="error" />
				<NoData v-else-if="chartData.datasets[0].data.every(x => x === 0)" />
				<div v-else>
					<!-- Notes: 包這層會影響圓餅 RWD 時的大小！ -->
					<div class="h-52">
						<Pie
							:style="chartStyle"
							:chart-id="chartId"
							:data="chartData"
							:options="chartOptions"
							:plugins="chartPlugins"
						/>
					</div>
				</div>
			</ClientOnly>
			<ChartLegend ref="chartLegendRef" :legends="legends" class="mt-4 justify-center" />
		</div>
	</div>
</template>
