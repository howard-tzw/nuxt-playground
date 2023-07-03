<script setup lang="ts">
const chartData = {
	labels: ['民事', '刑事', '行政'],
	datasets: [
		{
			backgroundColor: ['rgba(142,126,207,0.7)', 'rgba(253,126,86,0.7)', 'rgba(112,184,228,0.7)'],
			borderColor: ['rgba(142,126,207,0.7)', 'rgba(253,126,86,0.7)', 'rgba(112,184,228,0.7)'],
			borderWidth: 1,
			data: [2753, 844, 422],
		},
	],
}

const pieYearOptions = [
	{ name: '1996 ~ 2023 年度' },
	{ name: '1996', value: 1996 },
	{ name: '1997', value: 1997 },
	{ name: '1998', value: 1998 },
	{ name: '1999', value: 1999 },
	{ name: '2000', value: 2000 },
	{ name: '2001', value: 2001 },
	{ name: '2002', value: 2002 },
	{ name: '2003', value: 2003 },
	{ name: '2004', value: 2004 },
	{ name: '2005', value: 2005 },
	{ name: '2006', value: 2006 },
	{ name: '2007', value: 2007 },
	{ name: '2008', value: 2008 },
	{ name: '2009', value: 2009 },
	{ name: '2010', value: 2010 },
	{ name: '2011', value: 2011 },
	{ name: '2012', value: 2012 },
	{ name: '2013', value: 2013 },
	{ name: '2014', value: 2014 },
	{ name: '2015', value: 2015 },
	{ name: '2016', value: 2016 },
	{ name: '2017', value: 2017 },
	{ name: '2018', value: 2018 },
	{ name: '2019', value: 2019 },
	{ name: '2020', value: 2020 },
	{ name: '2021', value: 2021 },
	{ name: '2022', value: 2022 },
	{ name: '2023', value: 2023 },
]
</script>

<template>
	<div class="p-7">
		<ChartApplyPie
			title="承辦案件類型比例"
			:year-options="pieYearOptions"
			:chart-data="chartData"
			:pending="false"
			:error="null"
		/>
	</div>
</template>
