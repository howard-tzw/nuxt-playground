<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<p v-if="pending">loading...</p>
		<div>Hello World {{ data }}</div>
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

onBeforeUnmount(() => {
	controller.abort()
})

console.log(data.value)
</script>
