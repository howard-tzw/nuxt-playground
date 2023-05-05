<template>
	<div class="mx-auto p-10 border border-red-500">
		<!-- 在 grid 設定高度 -->
		<div class="grid grid-cols-1 gap-5 lg:grid-cols-6">
			<!-- left -->
			<!-- 這裡設定 overflow-y-scroll -->
			<div class="lg:col-span-2 border">
				<div class="overflow-y-scroll h-full">
					<div class="h-[400px]">
						<section class="my-section border">
							<div class="h-[600px] bg-blue-300">Experience</div>
						</section>
					</div>
				</div>
			</div>
			<!-- right -->
			<div class="flex h-full flex-col space-y-5 lg:col-span-4">
				<section class="my-section border flex h-full flex-col">
					<div class="h-[120px]">Chart</div>
				</section>
				<section class="my-section border flex h-full flex-col">
					<div class="h-[120px]">Chart</div>
				</section>
				<section class="my-section border flex h-full flex-col">
					<div class="h-[120px]">Chart</div>
				</section>
			</div>
		</div>
	</div>
</template>
