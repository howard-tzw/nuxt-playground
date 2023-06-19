<script setup lang="ts">
const hello = computed((): string => {
	return 'Hello World'
})
</script>

<template>
	<div>{{ hello }}</div>
</template>
