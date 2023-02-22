<template>
	<div>
		<ClientOnly>
			<GoogleLogin :callback="callback" prompt />
		</ClientOnly>
	</div>
</template>

<script setup>
const callback = response => {
	console.log(response)
}
</script>
