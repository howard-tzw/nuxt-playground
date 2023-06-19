import { describe, it, expect } from 'vitest'
import Test from '../test.vue'
import { mount } from '@vue/test-utils'
// import { setup, $fetch } from '@nuxt/test-utils'

describe('Hello', async () => {
	it('should compute hello', () => {
		const wrapper = mount(Test)
		expect(wrapper.vm.hello).toBe('Hello World')
	})
})
