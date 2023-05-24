<script lang="ts" setup>
const url = ref('http://localhost:5000/api/v1/abort-async-data')

let controller: AbortController = new AbortController()

const { data, pending, execute, error } = await useAsyncData(
	'decision',
	() => {
		// controller?.abort?.()
		// controller = typeof AbortController !== 'undefined' ? new AbortController() : ({} as AbortController)

		return $fetch(url.value, { signal: controller.signal })
	},
	{
		lazy: true,
		server: false,
		immediate: false,
	},
)

// const { data, pending, execute, error } = useFetch(url, {
// 	lazy: true,
// 	server: false,
// 	immediate: false,
// })

const items = computed(() => {
	if (data.value) {
		return data.value.items
	}
	return []
})

function onSearch() {
	execute()
}

function onCancel() {
	controller?.abort?.()
}

function toggleUrl() {
	if (url.value === 'http://localhost:5000/api/v1/abort-async-data') {
		url.value = 'http://localhost:5000/api/v1/abort-async-data2'
	} else {
		url.value = 'http://localhost:5000/api/v1/abort-async-data'
	}
}
</script>

<template>
	<div class="p-52">
		<div class="flex flex-row gap-2">
			<button class="btn" @click="toggleUrl">Toggle URL</button>
			<button class="btn" @click="onSearch">Search</button>
			<button class="btn" @click="onCancel">Cancel</button>
		</div>

		<p>{{ pending ? 'loading' : '' }}</p>
		<p>Error: {{ error }}</p>

		<div v-for="item in items" :key="item.id">
			<div>{{ item.url }}</div>
		</div>
	</div>
</template>
