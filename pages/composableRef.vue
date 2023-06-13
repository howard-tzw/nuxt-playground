<script setup lang="ts">
import { toReactive } from '@vueuse/core'
import { MaybeRef } from 'nuxt/dist/app/compat/capi'

/**
 * 結論
 * - 要放入 composable 的參數，必須是 reactive，不能是 ref
 */

const foo = reactive({
	greeting: 'Hello',
})

watch(foo, () => {
	console.log('foo changed', foo)
})

const fooReactive2 = toReactive(foo)

watch(fooReactive2, () => {
	console.log('fooReactive2 changed', fooReactive2)
})

const { greeting } = useBar({
	greeting: toRef(foo, 'greeting'),
})

function toggleGreeting() {
	greeting.value = greeting.value === 'Hello' ? 'Hola' : 'Hello'
}

// ============= reactive =============

const fooReactive = reactive({
	greeting: 'Hello',
})

watch(fooReactive, () => {
	console.log('fooReactive changed', fooReactive)
})

// const { greeting } = useBar(fooReactive)

function toggleFooReactiveGreeting() {
	fooReactive.greeting = fooReactive.greeting === 'Hello' ? 'Hola' : 'Hello'
}

type UseBarOptions = {
	[K: string]: MaybeRef<string>
}

function useBar(options: UseBarOptions) {
	const bar = reactive(options)

	return {
		...toRefs(bar),
	}
}
</script>

<template>
	<div class="p-10 text-center flex flex-col gap-4">
		<p>{{ greeting }}</p>

		<button class="btn btn-sm" @click="toggleGreeting">update greeting</button>

		<button class="btn btn-sm" @click="toggleFooReactiveGreeting">update fooReactive greeting</button>
	</div>
</template>

<style></style>
