<template>
	<div>
		<NuxtLink to="/">Home</NuxtLink>
		<p v-if="pending">loading...</p>
		<div>data: {{ data }}</div>
		<div>error: {{ error }}</div>
	</div>
</template>

<script setup lang="ts">
// @feat 取消自動重新請求

const url = '/500'

const { data, pending, error } = await useAsyncData(
	() => {
		return apiFetch(url, { retry: 0 })
	},
	{
		server: false,
		lazy: true,
	},
)

console.log(data.value)
</script>
