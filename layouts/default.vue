<template>
	<div>
		<NuxtLoadingIndicator :height="20" />

		<slot />

		<div v-if="loading">Page Loading...</div>
	</div>
</template>

<script lang="ts" setup>
const nuxtApp = useNuxtApp()
const loading = ref(false)
nuxtApp.hook('page:start', () => {
	loading.value = true
})
nuxtApp.hook('page:finish', () => {
	loading.value = false
})
</script>
