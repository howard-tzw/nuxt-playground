<script lang="ts" setup>
interface Props {
	text?: string
	height?: string
}
withDefaults(defineProps<Props>(), {
	text: '暫無資料',
	height: '',
})
</script>

<template>
	<section class="flex items-center justify-center" :class="height">
		<p class="text-center text-base text-gray-400">
			{{ text }}
		</p>
	</section>
</template>
