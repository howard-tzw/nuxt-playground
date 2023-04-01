<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<p>{{ answer }}</p>
	</div>
</template>

<script setup lang="ts">
console.log('2-step-fetch')

const controller = new AbortController()

const answer = ref()

// 純 csr 呼叫
onMounted(async () => {
	console.log('onMounted')
	const secret = await apiFetch('/secret', {
		signal: controller.signal,
	})

	answer.value = await apiFetch('/answer', {
		params: {
			secret,
		},
	})

	console.log('answer:', answer.value)
})

// 這會在 ssr 和 csr 各呼叫一次，且一定 lazy: false
// console.log('onMounted')
// const secret = await apiFetch('/secret', {
// 	signal: controller.signal,
// })

// answer.value = await apiFetch('/answer', {
// 	params: {
// 		secret,
// 	},
// })

console.log('answer:', answer.value)

onBeforeUnmount(() => {
	// controller.abort()
})
</script>
