<script lang="ts">
export default { inheritAttrs: false }
</script>

<script setup lang="ts">
import { useField } from '@vorms/core'

type Props = {
	name: string
	label?: string
	type?: string
	placeholder?: string
	validate?(value: unknown): string | void | Promise<string | void>
	inputClass?: string
	displayError?: boolean
	min?: string
	max?: string
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	type: 'text',
	placeholder: '',
	validate: undefined,
	inputClass: '',
	displayError: true,
	min: undefined,
	max: undefined,
	disabled: false,
})

// defineEmits(['focus'])

// const nameRef = toRef(props, 'name')

// const { value, attrs, error } = useField<string>(nameRef, {
// 	validate(value) {
// 		return props.validate?.(value)
// 	},
// })

// const inputRef = ref()
// defineExpose({
// 	inputRef,
// })

const emit = defineEmits(['update:modalValue'])
const modalValue = ref('')
</script>

<template>
	<div class="w-full">
		<label v-show="label" class="label">
			<span class="label-text-alt text-lg">{{ label }}</span>
		</label>
		<input
			:min="min"
			:max="max"
			v-model="modalValue"
			class="form-text-input"
			:class="inputClass"
			:type="props.type"
			:placeholder="placeholder"
			v-bind="$attrs"
			:disabled="disabled"
		/>
		<label v-if="displayError" class="label">
			<span v-show="error" class="label-text-alt text-red-500">{{ error }}</span>
			<!-- @todo 預設文字空間，避免錯誤訊息出現導致位移過多 -->
			<!-- <span class="label-text-alt sm:invisible">x</span> -->
		</label>
	</div>
</template>

<style lang="scss" scoped>
.form-text-input {
	padding-left: 15px;
}
</style>
