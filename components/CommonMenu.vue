<script lang="ts" setup>
/**
 * 第一層 div 要滿足網頁 menu 跟 mobile 版 drawer 的 menu
 */

const route = useRoute()

function menuActiveClass(path: string) {
	return `${route.path.startsWith(path) ? 'menu-link--active' : ''}`
}

function menuActiveBorderClass(path: string) {
	return `${route.path.startsWith(path) ? 'border--active' : ''}`
}

/**
 * @bug 暫時解決 issue 64，手機版從任一頁的底部使用 drawer 進到裁判書查詢，有時不會 scroll to top（推測可能原因為 tabs layout 導致
 */
function onClickLink() {
	setTimeout(() => {
		window.scrollTo({ top: 0, left: 0 })
	}, 100)
}
</script>

<template>
	<div class="flex flex-col md:flex md:flex-row md:space-x-1" @click="onClickLink">
		<NuxtLink class="menu-link" to="/judges" :class="menuActiveClass('/judges')">
			<p>認識法官</p>
			<div :class="menuActiveBorderClass('/judges')"></div>
		</NuxtLink>

		<!-- deprecated -->
		<!-- <NuxtLink class="menu-link" to="/comment" :class="menuActiveClass('/comment')">
			<p>評價法官</p>
			<div :class="menuActiveBorderClass('/comment')"></div>
		</NuxtLink> -->

		<NuxtLink class="menu-link" to="/courts" :class="menuActiveClass('/courts')">
			<p>認識法院</p>
			<div :class="menuActiveBorderClass('/courts')"></div>
		</NuxtLink>

		<NuxtLink class="menu-link" to="/decisions" :class="menuActiveClass('/decisions')">
			<p>裁判書查詢</p>
			<div :class="menuActiveBorderClass('/decisions')"></div>
		</NuxtLink>

		<NuxtLink class="menu-link" to="/comments" :class="menuActiveClass('/comments')">
			<p>評價查詢</p>
			<div :class="menuActiveBorderClass('/comments')"></div>
		</NuxtLink>
	</div>
</template>

<style lang="scss">
.border--active {
	@screen md {
		position: absolute;
		bottom: -6px;
		text-align: center;
		border-bottom: 8px solid transparent;
		background-image: linear-gradient(white, white), linear-gradient(90.23deg, #9addfc -0.4%, #a7a4f1 106.95%);
		width: 80px;
		border-radius: 20px;
		box-shadow: 0px 2.1672px 10.836px rgba(0, 0, 0, 0.1);
		background-origin: border-box;
		background-clip: content-box, border-box;
	}
}

.disabled-link {
	pointer-events: none;
	cursor: default;
	opacity: 0.6;
}
</style>
