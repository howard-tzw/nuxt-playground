<script setup lang="ts">
import { ref } from 'vue'
const isDrawerOpen = ref(false)
const drawer = ref(null)
</script>

<template>
	<header
		class="fixed w-full top-0 left-0 z-[var(--header-z-index)] hidden bg-base-200 shadow-lg md:flex md:items-center md:justify-center"
	>
		<div class="flex-1">
			<!-- logo -->
			<NuxtLink class="ml-4" to="/">
				<IconSunshine />
			</NuxtLink>
		</div>
		<div>
			<div>menu</div>
		</div>
	</header>
	<!-- Mobile Header -->
	<header
		class="fixed w-full top-0 left-0 z-[var(--header-z-index)] bg-base-200 shadow-lg md:hidden flex items-center justify-center"
	>
		<div class="navbar-start">
			<label for="main-drawer" class="btn-ghost btn-square btn" @click="() => (isDrawerOpen = true)">
				<IconBars />
			</label>

			<!-- Drawer -->
			<aside
				ref="drawer"
				class="fixed left-0 top-0 z-[var(--drawer-z-index)] h-full w-3/5 transform overflow-auto bg-white p-5 shadow-2xl transition-all ease-in-out"
				:class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
			>
				<button class="absolute right-0 top-0 mr-4 mt-4" @click="isDrawerOpen = false">
					<Icon size="20" name="ep-close"></Icon>
				</button>

				<div class="mt-6">menu</div>
			</aside>
		</div>

		<div class="navbar-center">
			<NuxtLink class="" to="/">
				<IconSunshine />
			</NuxtLink>
		</div>
		<div class="navbar-end"></div>
	</header>
</template>
