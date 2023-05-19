import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.component('VCarousel', Carousel)
	nuxtApp.vueApp.component('VSlide', Slide)
	nuxtApp.vueApp.component('VPagination', Pagination)
	nuxtApp.vueApp.component('VNavigation', Navigation)
})
