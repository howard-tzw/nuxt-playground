<script setup lang="ts">
const page = ref(1)
const items = ref(Array(2000))
</script>

<template>
	<div class="p-10 flex justify-center">
		<UPagination
			v-model="page"
			:ui="{
				wrapper: 'flex items-center gap-0.5',
				rounded: 'rounded-full min-w-[32px] justify-center',
			}"
			:active-button="{ variant: 'solid', color: 'white' }"
			:inactive-button="{ variant: 'ghost', color: 'black' }"
			:max="7"
			:page-count="10"
			size="sm"
			:total="items.length"
		>
			<template #prev="{ onClick }">
				<UTooltip text="Previous page">
					<UButton
						icon="i-heroicons-arrow-small-left-20-solid"
						color="primary"
						:ui="{ rounded: 'rounded-full' }"
						class="mr-2"
						@click="onClick"
					/>
				</UTooltip>
			</template>

			<template #next="{ onClick }">
				<UTooltip text="Next page">
					<UButton
						icon="i-heroicons-arrow-small-right-20-solid"
						color="primary"
						:ui="{ rounded: 'rounded-full' }"
						class="ml-2"
						@click="onClick"
					/>
				</UTooltip>
			</template>
		</UPagination>
	</div>
</template>
