<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<div>data {{ data }}</div>
		<div>data2 {{ data2 }}</div>
		<div>data3 {{ data3 }}</div>
	</div>
</template>

<script setup lang="ts">
console.log('client-2-step-fetch')

const url = '/timeout'

const controller = new AbortController()

const data = ref(null)
const data2 = ref(null)

onMounted(async () => {
	console.log('onMounted')
	data2.value = await apiFetch('/timeout2', {
		signal: controller.signal,
	})

	console.log('data2', data2.value)

	data.value = await apiFetch(url, {
		signal: controller.signal,
	})

	console.log('data1', data.value)
})

const { data: data3 } = await useAsyncData(
	() => {
		return apiFetch('/timeout3', {
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
