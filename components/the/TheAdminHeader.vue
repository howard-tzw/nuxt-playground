<script setup lang="ts">
import { AdminPage } from '~~/types/admin'

type Props = {
	pages: AdminPage[]
}

defineProps<Props>()

const route = useRoute()

const isDrawerOpen = ref(false)
const drawer = ref(null)

onClickOutside(drawer, () => (isDrawerOpen.value = false))

function menuActiveClass(path: string) {
	return `${route.path === path ? 'menu-link--active' : ''}`
}

/**
 * @feat 調整 header 消失的螢幕寬度
 * (desktop) header lg:flex
 * (mobile) header lg:hidden
 * admin.vue aside lg:flex
 */
</script>

<template>
	<div class="mb-[64px]">
		<header
			class="navbar fixed left-0 top-0 z-[var(--header-z-index)] hidden h-[64px] w-full bg-base-200 shadow-lg md:items-center lg:flex"
		>
			<div class="flex-1">
				<!-- logo -->
				<NuxtLink class="ml-4" to="/"> playground </NuxtLink>
			</div>
			<div class="w-10">
				<button>
					<Icon class="hover:text-gray-500" size="24" name="ic:outline-logout"></Icon>
				</button>
			</div>
		</header>

		<!-- mobile -->
		<header
			class="navbar fixed left-0 top-0 z-[var(--header-z-index)] flex h-[64px] w-full items-center bg-base-200 shadow-lg lg:hidden"
		>
			<div class="navbar-start">
				<label for="main-drawer" class="btn-ghost btn-square btn" @click="() => (isDrawerOpen = true)">
					<Icon name="ic:baseline-sort" size="24" />
				</label>

				<!-- Drawer Menu -->
				<aside
					ref="drawer"
					class="fixed left-0 top-0 z-30 h-full w-3/5 transform overflow-auto bg-white p-5 shadow-2xl transition-all duration-300 ease-in-out sm:w-[300px]"
					:class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
				>
					<button class="absolute right-0 top-0 mr-4 mt-4" @click="isDrawerOpen = false">
						<Icon size="20" name="ep-close"></Icon>
					</button>

					<div class="mt-6">
						<div class="flex flex-col gap-x-1" @click="() => (isDrawerOpen = false)">
							<NuxtLink
								v-for="page in pages"
								:key="page.name"
								class="menu-link md:justify-start"
								:to="page.to"
								:class="menuActiveClass(page.to)"
							>
								{{ page.name }}
							</NuxtLink>
						</div>
					</div>
				</aside>
			</div>

			<div class="navbar-center">
				<NuxtLink class="" to="/"> playground </NuxtLink>
			</div>
			<div class="navbar-end">
				<div class="w-10">
					<button>
						<Icon class="hover:text-gray-500" size="24" name="ic:outline-logout"></Icon>
					</button>
				</div>
			</div>
		</header>
	</div>
</template>

<style lang="scss"></style>
