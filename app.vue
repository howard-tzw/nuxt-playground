<script setup lang="ts">
const sayHi = () => {
	console.log('hi')
}
</script>

<template>
	<div>
		<BaseButton @click="sayHi" />
	</div>
</template>
