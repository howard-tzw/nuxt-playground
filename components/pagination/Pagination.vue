<script lang="ts" setup>
interface Props {
	page: number
	total: number
	size: number
	showInfo?: boolean
}
const props = withDefaults(defineProps<Props>(), {
	showInfo: false,
})

const emit = defineEmits(['update:page'])

const totalPage = computed(() => {
	return Math.ceil(props.total / props.size)
})

function changePage(page: number) {
	if (page === totalPage.value + 1) return
	if (page === 0) return

	emit('update:page', page)
}
</script>

<template>
	<div>
		<!-- desktop -->
		<div class="hidden md:flex md:flex-1 md:flex-col md:items-center md:space-y-10">
			<!-- 頁數資訊 -->
			<div v-if="showInfo" class="md:self-end">
				<p>第 {{ page }} 頁，共 {{ totalPage }} 頁，{{ total }} 筆</p>
			</div>
			<!-- 按鈕 -->
			<div class="flex space-x-4" aria-label="Pagination">
				<!-- 到第一頁 -->
				<button :class="{ 'text-gray-400': page === 1 }" :disabled="page === 1" @click="changePage(1)">
					<Icon name="ic:sharp-keyboard-double-arrow-left" />
				</button>

				<!-- 上一頁 -->
				<button :class="{ 'text-gray-400': page === 1 }" :disabled="page === 1" @click="changePage(page - 1)">
					<Icon name="ic:sharp-keyboard-arrow-left" />
				</button>

				<PaginationLink
					v-if="page - 2 >= 1"
					:text="(page - 2).toString()"
					:active="false"
					:disabled="false"
					@click="changePage(page - 2)"
				/>

				<PaginationLink
					v-if="page - 1 >= 1"
					:text="(page - 1).toString()"
					:active="false"
					:disabled="false"
					@click="changePage(page - 1)"
				/>

				<!-- active -->
				<PaginationLink :text="page.toString()" :active="true" :disabled="false" @click="changePage(page)" />

				<!-- active 之後 -->
				<PaginationLink
					v-if="page + 1 <= totalPage"
					:text="(page + 1).toString()"
					:active="false"
					:disabled="false"
					@click="changePage(page + 1)"
				/>

				<PaginationLink
					v-if="page + 2 <= totalPage"
					:text="(page + 2).toString()"
					:active="false"
					:disabled="false"
					@click="changePage(page + 2)"
				/>

				<PaginationLink
					v-if="!(page - 2 >= 1) && page + 3 <= totalPage"
					:text="(page + 3).toString()"
					:active="false"
					:disabled="false"
					@click="changePage(page + 3)"
				/>

				<PaginationLink
					v-if="!(page - 1 >= 1) && page + 4 <= totalPage"
					:text="(page + 4).toString()"
					:active="false"
					:disabled="false"
					@click="changePage(page + 4)"
				/>

				<!-- 下一頁 -->
				<button
					:class="{ 'text-gray-400': page === totalPage }"
					:disabled="page === totalPage"
					@click="changePage(page + 1)"
				>
					<Icon name="ic:sharp-keyboard-arrow-right" />
				</button>

				<!-- 到最後一頁 -->
				<button
					:class="{ 'text-gray-400': page === totalPage }"
					:disabled="page === totalPage"
					@click="changePage(totalPage)"
				>
					<Icon name="ic:sharp-keyboard-double-arrow-right" />
				</button>
			</div>
		</div>

		<!-- mobile -->
		<div class="flex flex-col items-center justify-center space-y-4 md:hidden">
			<p v-if="showInfo" class="text-sm">第 {{ page }} 頁，共 {{ totalPage }} 頁，{{ total }} 筆</p>
			<div class="grid grid-cols-5 gap-2">
				<!-- 到第一頁 -->
				<button :class="{ 'text-gray-400': page === 1 }" :disabled="page === 1" @click="changePage(1)">
					<Icon name="ic:sharp-keyboard-double-arrow-left" />
				</button>

				<!-- 上一頁 -->
				<button :class="{ 'text-gray-400': page === 1 }" :disabled="page === 1" @click="changePage(page - 1)">
					<Icon name="ic:sharp-keyboard-arrow-left" />
				</button>

				<!-- active -->
				<PaginationLink :text="page.toString()" :active="true" :disabled="false" @click="changePage(page)" />

				<!-- 下一頁 -->
				<button
					:class="{ 'text-gray-400': page === totalPage }"
					:disabled="page === totalPage"
					@click="changePage(page + 1)"
				>
					<Icon name="ic:sharp-keyboard-arrow-right" />
				</button>

				<!-- 到最後一頁 -->
				<button
					:class="{ 'text-gray-400': page === totalPage }"
					:disabled="page === totalPage"
					@click="changePage(totalPage)"
				>
					<Icon name="ic:sharp-keyboard-double-arrow-right" />
				</button>
			</div>
		</div>
	</div>
</template>
