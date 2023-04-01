<template>
	<div>
		<NuxtLink to="/">Back</NuxtLink>
		<p>{{ answer }}</p>
	</div>
</template>

<script setup lang="ts">
console.log('2-step-fetch-ssr')

// lazy: true 一定導致 api 請求為 parallel
// 就算 lazy 改成 true，server 如果是 false 的話，也會是 parallel
// lazy: false 有個缺點，是就算 data 已經抓過資料，只有導向該頁面，server side 就會重新抓一次，勢必會阻礙路由，此時使用者體驗不好

const controller = new AbortController()

const { data: secret } = await useAsyncData(
	() => {
		if (process.client) return new Promise(resolve => resolve(''))
		return apiFetch('/secret', {
			signal: controller.signal,
		})
	},
	{
		server: true,
		lazy: true,
	},
)

console.log('secret', secret.value)

const { data: answer } = await useAsyncData(
	() => {
		if (process.client) return new Promise(resolve => resolve(''))
		return apiFetch('/answer', {
			params: {
				secret: secret.value,
			},
		})
	},
	{
		server: true,
		lazy: true,
	},
)

console.log('answer:', answer.value)

onMounted(async () => {
	if (answer.value) return
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

onBeforeUnmount(() => {
	controller.abort()
})
</script>
