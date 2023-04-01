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

console.log('server no await')

// 1. prerender 會 parallel fetch api
// 2. navigation: 會 parallel fetch api

const url = '/timeout'

const controller = new AbortController()

const { data, pending } = useAsyncData(
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

const { data: data2 } = useAsyncData(
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

const { data: data3 } = useAsyncData(
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

onMounted(() => {
	console.log(data.value, data2.value, data3.value)
})

onBeforeUnmount(() => {
	controller.abort()
})
</script>
