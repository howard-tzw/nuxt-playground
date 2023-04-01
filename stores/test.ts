import { defineStore } from 'pinia'

export const useTimeout = defineStore('timeout', () => {
	const msg = ref('')

	const url = 'http://localhost:5000/api/v1/timeout'

	async function getMsg() {
		if (msg.value) return msg.value
		const data = await $fetch(url)
		msg.value = data
		return data
	}

	return {
		msg,
		getMsg,
	}
})
