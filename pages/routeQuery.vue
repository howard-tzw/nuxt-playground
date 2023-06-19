<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { RouteParamValueRaw, useRoute, useRouter } from 'vue-router'

const size = 16
const total = 100

const search = useRouteQuery('search')
const page = useRouteQuery('page', '1', { transform: Number }) // or transforming value

watch(page, () => {
	console.log('page changed', page.value)
})

function onClickNext() {
	page.value++
}
</script>

<template>
	<div class="p-10 text-center">
		<div class="my-10">
			<Pagination v-model:page="page" show-info :size="size" :total="total" />
		</div>
		<p>{{ page }}</p>
		<input type="text" v-model="search" class="input input-bordered" />
	</div>
</template>
