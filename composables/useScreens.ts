import { useBreakpoints } from '@vueuse/core'

export const useScreens = () => {
	const appConfig = useAppConfig()
	const breakpoints = useBreakpoints(appConfig.theme.screens)

	const isMobile = computed(() => {
		return breakpoints.smallerOrEqual('sm').value
	})

	const isBelowMdBreakpoint = computed(() => {
		return breakpoints.smallerOrEqual('md').value
	})

	return {
		isMobile,
		isBelowMdBreakpoint,
	}
}
