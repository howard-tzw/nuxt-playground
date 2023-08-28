<script lang="ts" setup>
import { ModalsContainer } from 'vue-final-modal'
import { AdminPage } from '~~/types/admin'

useHead({
	title: '後台管理',
})

const pages: AdminPage[] = [
	{
		name: 'Admin',
		to: '/admin',
		icon: 'ic:outline-perm-identity',
	},
	{
		name: '關於我們',
		to: '/admin/about-us',
		icon: 'ic:outline-article',
	},
]

const route = useRoute()

function activeClass(path: string) {
	return `${route.path === path ? 'bg-gray-100' : ''}`
}
</script>

<template>
	<div class="flex min-h-screen flex-col">
		<TheAdminHeader :pages="pages" />
		<section class="page-bg-color flex flex-1 flex-col">
			<div class="flex flex-1 flex-row">
				<!-- Notes: navbar's height equal to 64px -->
				<aside
					class="my-shadow sticky top-[64px] hidden h-full min-h-[calc(100vh-64px)] min-w-[13rem] bg-white lg:flex"
				>
					<div class="h-full w-full overflow-y-auto px-3 py-4">
						<ul class="space-y-1 font-medium">
							<li v-for="page in pages" :key="page.name">
								<NuxtLink
									:to="page.to"
									class="flex items-center rounded-lg p-4 text-gray-900 hover:bg-gray-100"
									:class="activeClass(page.to)"
								>
									<Icon
										class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
										:name="page.icon"
									></Icon>
									<span class="ml-3">{{ page.name }}</span>
								</NuxtLink>
							</li>
						</ul>
					</div>
				</aside>

				<!-- overflow-hidden 才可讓 table 呈現 RWD -->
				<main class="box-border flex flex-1 flex-col overflow-hidden p-5">
					<slot></slot>
				</main>
			</div>
		</section>
		<ModalsContainer />
	</div>
</template>
