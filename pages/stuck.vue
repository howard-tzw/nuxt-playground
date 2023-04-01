<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<div>data {{ data }}</div>
		<div>data2 {{ data2 }}</div>
		<div>data3 {{ data3 }}</div>
	</div>
</template>

<script setup lang="ts">
const url = '/timeout'

const controller = new AbortController()

// 會 stuck

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

// 不會 stuck
// const data = ref()
// const data2 = ref()
// const data3 = ref()

// onMounted(() => {
// 	apiFetch(url).then(res => (data.value = res))
// 	apiFetch('/timeout2').then(res => (data2.value = res))
// 	apiFetch('timeout3').then(res => (data3.value = res))
// })

onBeforeUnmount(() => {
	console.log('onBeforeUnmount')
	controller.abort()
	// clearNuxtData()
})

console.log(data.value)
</script>
