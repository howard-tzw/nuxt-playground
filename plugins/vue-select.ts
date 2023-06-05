import VueSelect from 'vue3-select'

import 'vue3-select/dist/vue-select.css'

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.component('VSelect', VueSelect)
})
