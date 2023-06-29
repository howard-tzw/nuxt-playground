<script setup lang="ts">
const lineChartData = ref({
	labels: [
		1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
		2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
	],
	datasets: [
		{
			label: '民事',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 672, 765, 517, 352, 313, 0],
			backgroundColor: '#8E7ECF',
			borderColor: '#8E7ECF',
		},
		{
			label: '刑事',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 291, 236, 148, 16, 26, 25, 13, 3, 0],
			backgroundColor: '#FD7E56',
			borderColor: '#FD7E56',
		},
		{
			label: '行政',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 38, 58, 61, 98, 92, 56, 0, 19, 0],
			backgroundColor: '#F5A623',
			borderColor: '#F5A623',
		},
	],
})
const yearStatPending = ref(false)
const yearStatError = ref(null)
</script>

<template>
	<div>
		<div class="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-2">
			<!-- 案件趨勢 Line -->
			<section class="my-section">
				<ChartApplyTrend :chart-data="lineChartData" :pending="yearStatPending" :error="yearStatError">
					<p>案件趨勢</p>
				</ChartApplyTrend>
			</section>

			<!-- 結案時間點 Heatmap -->
			<div class="my-section">
				<p>ChartApplyHeatmap</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.my-section {
	@extend .my-card--base;
	@apply min-h-[250px] w-full px-5 py-7 sm:p-7 lg:p-8;
}
</style>
