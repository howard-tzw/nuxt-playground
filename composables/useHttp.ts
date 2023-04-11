// ofetch docs: https://github.com/unjs/ofetch

export default function useHttp() {
	const config = useRuntimeConfig()
	const apiBase = config.public.apiBase

	// apiBase = 'http://localhost:5000/api'

	const get = globalThis.$fetch.create({
		baseURL: `${apiBase}`,
		retry: 1,

		onResponseError: ({ response }) => {
			console.error('response: ', response)

			// 找不到 api 路由的情況
			if (response.status === 404) {
				throw new Error(`404 Not Found \n ${response.url} `)
			}

			// 顯示 api 的錯誤訊息
			if (response._data) {
				throw new Error(prettyJson(response._data))
			}

			throw new Error(`${response.status} ${response.statusText}`)
		},
		onRequestError: ({ request }) => {
			// ex. client 沒有網路的時候
			console.error('request: ', request)
		},
	})

	return {
		get,
	}
}

function prettyJson(obj: any) {
	return JSON.stringify(obj, null, 4).slice(1, -1).trim()
}
