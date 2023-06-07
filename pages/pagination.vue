<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const total = 10
const size = 2

const page = useRouteQuery('page', '1', { transform: Number })

type Post = {
	userId: number
	id: number
	title: string
	body: string
}

const { data, pending, refresh } = await useLazyAsyncData<Post[]>(
	'posts',
	async () => {
		await new Promise(resolve => setTimeout(resolve, 500))
		return await $fetch(`https://jsonplaceholder.typicode.com/posts`, {
			query: {
				_page: page.value,
				_limit: size,
			},
		})
	},
	{
		server: false,
	},
)

watch(page, () => {
	refresh()
})

const items = computed(() => {
	if (data.value) {
		return data.value
	}
	return []
})
</script>

<template>
	<div class="p-10">
		<div class="my-10">
			<Pagination v-model:page="page" show-info :size="size" :total="total" />
		</div>

		<div v-if="pending" class="text-center">loading...</div>
		<ul v-else-if="items" class="flex flex-col gap-3">
			<li v-for="item in items" :key="item.id">
				{{ item }}
			</li>
		</ul>
	</div>
</template>

<style></style>
