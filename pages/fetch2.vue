<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<p v-if="pending">loading...</p>
		<div>data: {{ data }}</div>
		<div>
			error: <span class="text-red-500">{{ error?.message }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
// @feat 取得 400 Bad Request 的錯誤訊息
const url = '/bad-request'

const { data, pending, error } = await useAsyncData(
	() => {
		return apiFetch(url, {
			onResponseError({ request, response, options }) {
				throw new Error(response._data.error)
			},
		})
	},
	{
		server: false,
		lazy: true,
	},
)

console.log('data', data.value)
</script>
