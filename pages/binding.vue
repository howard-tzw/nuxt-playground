<script setup lang="ts">
const groupId = ref(1)
const courtId = ref(2)

const selectedCourt = ref({
	id: 2,
	groupId: 1,
})

const foo = ref('hello')

const selectedCourtComputed = computed({
	get: () => {
		foo.value = 'world'
		return {
			id: 3,
			groupId: 3,
		}
	},
	set: val => {
		selectedCourtComputed.value.id = val.id
		selectedCourtComputed.value.groupId = val.groupId
	},
})

const selectedCourtCustomRef = customRef((track, trigger) => {
	return {
		get() {
			track()
			return {
				id: courtId.value,
				groupId: groupId.value,
			}
		},
		set(val) {
			courtId.value = val.id
			groupId.value = val.groupId

			trigger()
		},
	}
})

const selectedCourtRef = useCourtRef({
	id: courtId.value,
	groupId: groupId.value,
})

function useCourtRef(value: { id: number; groupId: number }) {
	return customRef((track, trigger) => {
		return {
			get() {
				track()
				return value
			},
			set(val) {
				courtId.value = val.id
				groupId.value = val.groupId
				value = val
				trigger()
			},
		}
	})
}

function updateSelectedCourt() {
	// give selectedCourt two random number
	selectedCourtRef.value = {
		id: Math.floor(Math.random() * 10),
		groupId: Math.floor(Math.random() * 10),
	}
}
</script>

<template>
	<div>
		<ul>
			<li>{{ foo }}</li>
			<li>courtId {{ courtId }}</li>
			<li>groupId {{ groupId }}</li>
			<li>{{ selectedCourt }}</li>
			<li>Computed {{ selectedCourtComputed }}</li>
			<li>CustomRef {{ selectedCourtCustomRef }}</li>
			<li>CourtRef {{ selectedCourtRef }}</li>
		</ul>

		<div class="flex flex-row gap-4">
			<button class="btn btn-base" @click="groupId++">Change groupId</button>
			<button class="btn btn-base" @click="courtId++">Change courtId</button>
			<button class="btn btn-base" @click="updateSelectedCourt">Update selectedCourt</button>
		</div>
	</div>
</template>
