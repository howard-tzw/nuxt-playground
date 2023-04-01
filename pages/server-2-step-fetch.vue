<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<p v-if="pending">loading...</p>
		<div>data {{ data }}</div>
		<div>data2 {{ data2 }}</div>
		<div>data3 {{ data3 }}</div>
	</div>
</template>

<script setup lang="ts">
// prerender
// 要測兩種情況：
// 1. 直接重新整理: prerender
// 2. navigation: csr

console.log('server-2-step-fetch')

// 1. prerender 會按序 fetch api => 容易卡死畫面的主因
// 2. navigation: 如果 lazy 皆為 true 會 parallel fetch api，如果皆為 false 則是按序

const url = '/timeout'

const controller = new AbortController()

const { data, pending } = await useAsyncData(
	() => {
		return apiFetch(url, {
			signal: controller.signal,
		})
	},
	{
		server: true,
		lazy: true,
	},
)

console.log('data', data.value)

const { data: data2 } = await useAsyncData(
	() => {
		return apiFetch('timeout2', {
			signal: controller.signal,
		})
	},
	{
		server: true,
		lazy: true,
	},
)

console.log('data2', data.value)

const { data: data3 } = await useAsyncData(
	() => {
		return apiFetch('timeout3', {
			signal: controller.signal,
		})
	},
	{
		server: true,
		lazy: true,
	},
)

console.log('data3', data.value)

onBeforeUnmount(() => {
	controller.abort()
})
</script>
