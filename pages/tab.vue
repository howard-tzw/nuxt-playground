<script lang="ts" setup>
import IconHouseUser from '~~/components/icon/IconHouseUser.vue'
import IconChartLine from '~~/components/icon/IconChartLine.vue'
import IconLeaderboard from '~~/components/icon/IconLeaderboard.vue'
const route = useRoute()

const tabs = computed(() => {
	return [
		{
			name: '基本查詢',
			to: '/admin',
			isActive: route.path === '/tab',
			icon: IconHouseUser,
		},
		{
			name: '統計圖表',
			to: '/admin',
			isActive: route.path.startsWith(`/decisions/stat`),
			icon: IconChartLine,
		},
		{
			name: '數量統計',
			to: '/admin',
			isActive: route.path.startsWith(`/decisions/total`),
			icon: IconLeaderboard,
		},
	]
})
</script>

<template>
	<div>
		<NuxtLayout name="tabs" :tabs="tabs">
			<div class="padding-x--rwd h-[calc(2000px)]">hello world</div>
		</NuxtLayout>
	</div>
</template>
