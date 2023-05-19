<script setup lang="ts"></script>

<template>
	<div class="">
		<Carousel :items-to-show="2.5" :wrap-around="true">
			<Slide v-for="slide in 10" :key="slide">
				<div class="carousel__item">{{ slide }}</div>
			</Slide>

			<template #addons>
				<Navigation />
			</template>
		</Carousel>
	</div>
</template>

<style lang="scss"></style>
