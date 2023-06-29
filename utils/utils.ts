export function removePrefix(str: string, prefix: string) {
	if (str.startsWith(prefix)) {
		return str.slice(prefix.length)
	}
	return str
}

export function isObjectEmpty(obj: Object) {
	return Object.keys(obj).length === 0
}

// 將 "" 或 null 轉為 undefined，若為布林值 false 則保持原狀
export function replaceFalsyWithUndefined(obj: any, options: { omits: string[] } = { omits: [] }): any {
	const { omits } = options

	if (typeof obj !== 'object' || obj === null) {
		return obj
	}

	const result: any = {}
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key) && !omits.includes(key)) {
			const value = obj[key]
			if (typeof value === 'boolean' && value === false) {
				result[key] = false
			} else if (Array.isArray(value)) {
				if (!value.length) {
					result[key] = undefined
				}
				result[key] = value
			} else {
				result[key] = value ? replaceFalsyWithUndefined(value, options) : undefined
			}
		}
	}

	return result
}

export function genRandomString(length: number) {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

export function formatNumberWithCommas(num: number | undefined | null | string): string {
	if (typeof num === 'string') {
		num = Number(num)
	}
	if (num === undefined || num === null) return '0'
	return num.toLocaleString()
}

// https://medium.com/@chienrongkhor/%E5%A6%82%E4%BD%95%E5%88%A9%E7%94%A8javascript%E5%88%A4%E6%96%B7%E7%B6%B2%E9%A0%81%E6%98%AF%E5%90%A6%E5%9C%A8in-app%E7%80%8F%E8%A6%BD%E5%99%A8-webview-%E9%96%8B%E8%B5%B7-ae8aeb209270
export function isWebview() {
	const useragent = navigator.userAgent
	const rules = ['WebView', '(iPhone|iPod|iPad)(?!.*Safari/)', 'Android.*(Instagram|Line|FBAN|FBAV)']
	const regex = new RegExp(`(${rules.join('|')})`, 'ig')
	return Boolean(useragent.match(regex))
}

export function getLocalStorageKey() {
	return 'sunshine'
}
