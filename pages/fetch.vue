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
// @feat 離開頁面時，自動取消 pending 中的請求

const url = '/timeout'

const controller = new AbortController()

const { data, pending } = await useAsyncData(
	() => {
		return apiFetch(url, {
			signal: controller.signal,
		})
	},
	{
		server: false,
		lazy: true,
	},
)

const { data: data2 } = await useAsyncData(
	() => {
		return apiFetch('timeout2', {
			signal: controller.signal,
		})
	},
	{
		server: false,
		lazy: true,
	},
)

const { data: data3 } = await useAsyncData(
	() => {
		return apiFetch('timeout3', {
			signal: controller.signal,
		})
	},
	{
		server: false,
		lazy: true,
	},
)

onBeforeUnmount(() => {
	controller.abort()
})

console.log(data.value)
</script>
