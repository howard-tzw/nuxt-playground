<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<div>admin</div>
		<div>{{ data }}</div>
	</div>
</template>

<script setup lang="ts">
// 此路由只走 csr
// routeRules: {
// 		'/admin/**': { ssr: false },
// 	}

const url = '/secret'

const controller = new AbortController()

const { data, pending } = await useAsyncData(
	() => {
		return apiFetch(url, {
			signal: controller.signal,
		})
	},
	{
		server: true, // 就算這裡是 true 也沒用！
		lazy: true,
	},
)

onBeforeUnmount(() => {
	controller.abort()
})

console.log(data.value)
</script>
