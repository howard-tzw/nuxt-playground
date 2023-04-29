<script setup lang="ts">
type Props = {
	tabs: {
		name: string
		to: string
		isActive: boolean
		icon: Component
	}[]
}

defineProps<Props>()

/**
 * @feat [mobile] 切換 tab 的時候 scroll to top
 */
const route = useRoute()
watch(
	() => ({ ...route }),
	(_to, _from) => {
		if (process.client && isBelowMdBreakpoint.value) {
			window.scrollTo(0, 0)
		}
	},
)

/**
 * @feat 避免 mobile tabs 把 footer 的內容遮住
 */
const { isBelowMdBreakpoint } = useScreens()
const mobileTabsIsVisible = ref(false)

const resizeFooterClass = 'pb-[90px]'

watch(
	isBelowMdBreakpoint,
	() => {
		if (isBelowMdBreakpoint.value) {
			mobileTabsIsVisible.value = true

			if (process.client) {
				const footer = document.getElementById('footer')
				footer?.classList.add(resizeFooterClass)
			}
		} else {
			mobileTabsIsVisible.value = false

			if (process.client) {
				const footer = document.getElementById('footer')
				footer?.classList.remove(resizeFooterClass)
			}
		}
	},
	{
		immediate: true,
	},
)
</script>
<template>
	<div class="flex h-full flex-col">
		<!-- desktop tab links -->
		<div class="tabs mt-8 mb-4 hidden justify-center md:flex">
			<NuxtLink
				v-for="tab in tabs"
				:key="tab.to"
				:to="tab.to"
				:class="tab.isActive ? 'tab-active' : ''"
				class="tab-bordered tab tab-lg text-xl"
			>
				{{ tab.name }}
			</NuxtLink>
		</div>

		<!-- 沒有附加 classes 的 slot，僅用於 judge's dashboard -->
		<slot name="no-classes"></slot>

		<!-- default slot -->
		<div v-if="!$slots['no-classes']" class="overflow-hidden py-7 pb-7 sm:px-7 md:px-5 lg:px-7 xl:px-40">
			<slot></slot>
		</div>

		<!-- mobile tab links -->
		<div
			v-show="mobileTabsIsVisible"
			class="tab-shadow btm-nav btm-nav-md fixed z-[var(--tabs-z-index)] min-h-[76px] border"
		>
			<button v-for="tab in tabs" :key="tab.name" :class="tab.isActive ? 'active' : null">
				<NuxtLink :to="tab.to" class="flex w-full flex-col items-center">
					<component :is="tab.icon"></component>
					<span class="btm-nav-label">{{ tab.name }}</span>
				</NuxtLink>
			</button>
		</div>
	</div>
</template>

<style lang="scss">
.tab-shadow {
	-webkit-box-shadow: 0px -10px 10px rgba(50, 50, 50, 0.07);
	-moz-box-shadow: 0px -10px 10px rgba(50, 50, 50, 0.07);
	box-shadow: 0px -10px 10px rgba(50, 50, 50, 0.07);
}
</style>
