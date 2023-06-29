<script lang="ts" setup>
type Props = {
	error: any
}

const props = defineProps<Props>()

// 只會抓 csr api error，並只會顯示 Failed to fetch()，沒有更多訊息

/**
 * 待確定：顯示 Error 時，需使用 error.message 而不是 error，才能避免 error 發生時，出現 Hydration text content mismatch 的問題
 */

/**
 * @todo https://pjchender.dev/javascript/js-error-handling/
 */

const displayError = computed(() => {
	return props.error instanceof Error ? props.error.message : props.error
})
</script>

<template>
	<div class="flex justify-center text-gray-400">
		<p>發生錯誤</p>
		<CommonInfoPopper>
			<div class="popper">
				<p class="break-words">{{ displayError }}</p>
			</div>
		</CommonInfoPopper>
	</div>
</template>

<style lang="scss"></style>
