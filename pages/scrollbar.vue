<template>
	<div class="flex min-h-screen flex-col">
		<header class="navbar h-[64px] sticky top-0 z-10 hidden bg-base-200 shadow-lg md:flex">
			<div class="flex-1"></div>
			<div></div>
		</header>

		<!-- Notes: 這裡千萬不能加 overflow-hidden 否則會讓 dashboard sidebar sticky 失效 -->
		<main class="page-bg-color flex-1">
			<div class="dashboard-padding-x">
				<!-- Note: md 的時候會 wrap -->
				<div class="flex flex-col flex-wrap md:flex-row">
					<!-- Notes: navbar's height equal to 64px -->
					<aside
						class="flex p-5 pb-0 md:sticky md:top-[64px] md:h-[calc(100vh-64px)] md:w-72 md:pb-5 xl:w-80 border"
					>
						sidebar
					</aside>

					<main class="flex flex-1 flex-col py-5 md:sticky md:top-[64px] md:h-[calc(100vh-64px)] md:pl-0">
						<div class="dashboard-wrapper h-full">
							<div class="border h-full relative overflow-y-auto">
								<div class="h-full w-full absolute">
									<div class="space-y-5">
										<section class="my-section h-[1200px] bg-red-400 opacity-20">section</section>
									</div>
								</div>
							</div>
						</div>
					</main>

					<slot></slot>
				</div>
			</div>
		</main>

		<footer class="h-[300px] bg-blue-200">footer</footer>
	</div>
</template>

<style lang="scss">
.page-bg-color {
	background-color: #fafafa;
}
.dashboard-padding-x {
	@apply sm:px-5 md:px-5 lg:px-7 xl:px-14;
}

// Note: md 的時候會 wrap
@media (min-width: 768px) {
	.dashboard-wrapper {
		box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05), 0px 4px 20px rgba(0, 0, 0, 0.05);
		background: #ffffff;
		border-radius: 30px;

		@apply p-5;
	}

	.dashboard-scrollbar {
		scrollbar-width: thin; /* Firefox */
	}

	.dashboard-scrollbar::-webkit-scrollbar {
		width: 2px;
	}

	// @feat 調整 scrollbar track 的長度，避免它超出 dashboard-wrapper
	// https://stackoverflow.com/a/64066313/19799243
	.dashboard-scrollbar::-webkit-scrollbar-track {
		margin-top: 36px;
		margin-bottom: 36px;
	}

	.dashboard-scrollbar::-webkit-scrollbar-button {
		background: #ccc;
	}

	.dashboard-scrollbar::-webkit-scrollbar-track-piece {
		background: #f7f6f6;
	}

	.dashboard-scrollbar::-webkit-scrollbar-thumb {
		background: #bab9b9;
	}
}
</style>
