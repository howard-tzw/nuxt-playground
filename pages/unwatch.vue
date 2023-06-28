<script setup lang="ts">
const count = ref(0)

const unwatch = watch(count, (newVal, oldVal) => {
	console.log('watch', newVal, oldVal)
	if (count.value === 5) {
		unwatch()
	}
})
</script>

<template>
	<div>
		<p>{{ count }}</p>
		<button class="btn" @click="count++">Increment</button>
	</div>
</template>
