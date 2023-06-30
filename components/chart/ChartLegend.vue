<script setup lang="ts">
const props = defineProps<{
	legends: {
		text: string
		color: string
		selected: boolean
	}[]
}>()

const legendRef = ref()

defineExpose({ legendRef })
</script>

<template>
	<ul ref="legendRef" class="flex flex-row flex-wrap gap-2">
		<li v-for="legend in legends" :key="legend.text" class="legend-li">
			<div
				class="mr-1 inline-flex h-4 w-4 items-center justify-center rounded border"
				:style="{
					'border-color': legend.color,
				}"
			>
				<div
					v-if="legend.selected"
					class="h-3 w-3 rounded border"
					:style="{ 'background-color': legend.color }"
				></div>
			</div>
			<p class="whitespace-nowrap text-sm text-gray-500">{{ legend.text }}</p>
		</li>
	</ul>
</template>

<style lang="scss">
.legend-li {
	align-items: center;
	cursor: pointer;
	display: flex;
	flex-direction: row;
}
</style>
