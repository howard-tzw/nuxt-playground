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

const answer = useState('answer', () => '')

const controller = new AbortController()

// 用 useAsyncData 難以實踐 server:true 且 lazy: true，但在 navigation 的時候，又要能夠依序取得 api。
// 困難點：需要依序取 api 的情況下，難以採用 ssr 同時又不阻礙路由 lazy: true 以增進使用者體驗。

// const { data: secret } = await useAsyncData(
// 	() => {
// 		// 只在 server side 呼叫 api
// 		if (process.client) return new Promise(resolve => resolve(''))
// 		return apiFetch('/secret', {
// 			signal: controller.signal,
// 		})
// 	},
// 	{
// 		server: true,
// 		lazy: true,
// 	},
// )

// console.log('secret', secret.value)

// const { data: answerData } = await useAsyncData(
// 	() => {
// 		if (process.client) return new Promise(resolve => resolve(''))
// 		return apiFetch('/answer', {
// 			params: {
// 				secret: secret.value,
// 			},
// 		})
// 	},
// 	{
// 		server: true,
// 		lazy: true,
// 	},
// )

// https://vuejs.org/api/composition-api-lifecycle.html#onserverprefetch
onServerPrefetch(async () => {
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

// useAysncData 厲害的地方，在於將 server 取過的資料，傳遞給 client side，使得 client side 不必再呼叫一次

onMounted(async () => {
	// 如何阻止 server side 已經呼叫過資料，而 client side 又呼叫一次？ 儲存到 pinia
	// 而且要讓 navigation 時一定會在 client side 呼叫
	console.log('onMounted')
	if (!answer.value) {
		const secret = await apiFetch('/secret', {
			signal: controller.signal,
		})

		answer.value = await apiFetch('/answer', {
			params: {
				secret,
			},
		})

		console.log('answer:', answer.value)
	}
})

onBeforeUnmount(() => {
	controller.abort()
})
</script>
