import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
	plugins: [pluginReact()],
	server: {
		port: 8888,
	},
	output: {
		// assetPrefix: './',
		polyfill: 'usage',
	},
	performance: {
		removeConsole: import.meta.env.PROD,
	},
})
