<script setup lang="ts">
const todoId = ref(1)
const data = ref(null)
const foo = ref(0)

// 只會對有取值的 reactive 做反應 ex. todoId，因此不會追蹤 data
// Note: watchEffect only tracks dependencies during its synchronous execution.
// 如果是 async function，不會追蹤放在 await 之後的 reactive 變數
watchEffect(async () => {
	console.log(foo.value)

	await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId.value}`)
		.then(res => res.json())
		.then(res => {
			data.value = res
		})
	console.log('watchEffect')
})

function changeId() {
	todoId.value++
}

function resetData() {
	data.value = null
}

function addFoo() {
	foo.value++
}

/**
 * if you need to watch several properties in a nested data structure,
 * watchEffect() may prove more efficient than a deep watcher,
 * as it will only track the properties that are used in the callback,
 * rather than recursively tracking all of them.
 */
</script>

<template>
	<div>
		<p>{{ todoId }}</p>
		<button class="btn btn-base" @click="changeId">Change ID</button>
		<p>{{ data }}</p>

		<button class="btn btn-base" @click="resetData">Reset</button>

		{{ foo }}
		<button class="btn btn-base" @click="addFoo">add foo</button>
	</div>
</template>
