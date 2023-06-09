<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const total = 10
const size = 2

const route = useRoute()
const page = ref(1)

type Post = {
	userId: number
	id: number
	title: string
	body: string
}

const { data, pending, refresh } = await useLazyAsyncData<Post[]>(
	`posts-${page.value}`,
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

// 沒有意義，因為離開這頁後 watch 就被清掉了
watch(
	route,
	() => {
		console.log('route changed')
	},
	{
		deep: true,
	},
)

// 可作為首次載入時對 page 給定預設值
watchImmediate(
	() => route.query,
	() => {
		console.log('watch route.query')
		page.value = +(route.query.page as string) || 1

		// 這裡移出去，就不需要用 immediate 了
		if (route.query.page === '1') {
			navigateTo({ replace: true })
		}
	},
)

// 這裡就不能夠使用 immediate，不然整個網頁會掛掉
watch(page, async () => {
	console.log('watch page')
	refresh()
	navigateTo({ query: page.value !== 1 ? { page: page.value } : undefined })
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
		<NuxtLink to="/">Home</NuxtLink>
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
