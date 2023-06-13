<script setup lang="ts">
import { toReactive } from '@vueuse/core'
import { MaybeRef } from 'nuxt/dist/app/compat/capi'

/**
 * 測試：
 * - 將 ref 傳進 composable，ref 在外面改變，composable 內的 reactive 要跟著改變
 *
 * 結論：
 * - 將 computed 傳進 composable 是可以的，但要注意 computed 是不能更改的
 */

const foo = ref({
	greeting: 'Hello',
})

function toggleFooGreeting() {
	foo.value.greeting = foo.value.greeting === 'Hello' ? 'Hola' : 'Hello'
}

watch(foo, () => {
	console.log('foo changed', foo)
})

const { greeting } = useBar({
	greeting: computed(() => foo.value.greeting),
})

watch(greeting, () => {
	console.log('greeting external changed', greeting)
})

const toggleBarGreeting = () => {
	greeting.value = greeting.value === 'Hello' ? 'Hola' : 'Hello'
}

type UseBarOptions = {
	[K: string]: MaybeRef<string>
}

function useBar(options: UseBarOptions) {
	const bar = reactive(options)

	watch(bar, () => {
		console.log('bar internal changed', bar)
	})

	return {
		...toRefs(bar),
	}
}
</script>

<template>
	<div class="p-10 text-center flex flex-col gap-4">
		<p>{{ foo.greeting }}</p>

		<button class="btn btn-sm" @click="toggleFooGreeting">update foo greeting</button>
		<button class="btn btn-sm" @click="toggleBarGreeting">update bar greeting</button>
	</div>
</template>

<style></style>
