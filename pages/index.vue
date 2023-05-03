<script setup lang="ts">
const router = useRouter()

const childRoutes = computed(() => {
	return router.options.routes.filter(r => r.path.startsWith('/'))
})

function removePrefix(str: string, prefix: string) {
	if (str.startsWith(prefix)) {
		return str.slice(prefix.length)
	}
	return str
}
</script>

<template>
	<div>
		<p class="p-10 text-center text-3xl">playground</p>
		<div class="flex flex-col items-center justify-center p-10">
			<div v-for="route in childRoutes" :key="route.name">
				<NuxtLink :to="route.path" class="hover:text-blue-400">{{ route.path }}</NuxtLink>
			</div>
		</div>
	</div>
</template>
