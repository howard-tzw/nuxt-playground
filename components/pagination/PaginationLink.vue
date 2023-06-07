<script lang="ts" setup>
interface Props {
	text: string
	active: boolean
	disabled: boolean
}
const props = defineProps<Props>()
</script>

<template>
	<button
		class="btn-outline btn-sm btn-circle hover:btn-active"
		:class="active ? 'btn-active shadow-xl' : ''"
		:disabled="disabled"
	>
		{{ props.text }}
	</button>
</template>
