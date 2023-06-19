<script setup lang="ts">
import { customRef } from 'vue'

function useDebouncedRef<T>(value: T, delay = 200) {
	let timeout: any
	return customRef((track, trigger) => {
		return {
			get() {
				track()
				return value
			},
			set(newValue) {
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					value = newValue
					trigger()
				}, delay)
			},
		}
	})
}

const search = useDebouncedRef<string>('', 500)
</script>

<template>
	<div class="p-10 text-centers">
		<input type="text" class="input input-bordered" v-model="search" />
		<p>{{ search }}</p>
	</div>
</template>
