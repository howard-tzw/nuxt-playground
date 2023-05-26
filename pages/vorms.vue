<script setup lang="ts">
import { useForm } from '@vorms/core'

const sugarOptions = ['no', 'light', 'half', 'half', 'standard']

const route = useRoute()

const routeQuery = reactive({
	drink: route.query.drink as string,
	sugar: route.query.sugar as string | 'light',
})

watch(
	routeQuery,
	() => {
		console.log('routeQuery changed')
		navigateTo({
			replace: true,
			query: { ...routeQuery },
		})
	},
	{
		deep: true,
	},
)

const refs = toRefs(routeQuery)

const test = reactive(refs)

const {
	register,
	handleSubmit,
	handleReset,
	values: form,
} = useForm({
	initialValues: refs,
	onSubmit(data) {
		console.log(data)
	},
})

watch(
	form,
	() => {
		console.log('form changed')
	},
	{
		deep: true,
	},
)

const { value: drink, attrs: drinkFieldAttrs } = register('drink')
const { value: sugar, attrs: sugarFieldAttrs } = register('sugar')

const num = ref(0)
watch(num, () => {
	console.log('num changed')
})
</script>

<template>
	<form @submit="handleSubmit" @reset="handleReset" class="flex flex-col gap-4 p-10">
		<label>Drink</label>
		<input class="input input-bordered" v-model="test.drink" type="text" v-bind="drinkFieldAttrs" />

		<label>Sugar level</label>
		<select class="select select-bordered" v-model="sugar" v-bind="sugarFieldAttrs">
			<option v-for="item in sugarOptions" :key="item" :value="item">
				{{ item }}
			</option>
		</select>

		<button class="btn" type="reset">Reset</button>
		<button class="btn" type="submit">Submit</button>

		<BaseInput
			class="w-full"
			v-model="num"
			input-class="base-input base-input--rwd"
			name="era"
			placeholder="年度"
			:display-error="false"
			type="number"
		/>
	</form>
</template>
