import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import mkcert from 'vite-plugin-mkcert';
import glsl from 'vite-plugin-glsl';
import ViteFonts from 'vite-plugin-fonts';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'~/': `${path.resolve(__dirname, 'src')}/`
		}
	},
	server: {
		https: true
	},
	plugins: [
		ViteFonts({
			google: {
				families: [
					{
						name: 'Roboto',
						styles: 'wght@100;300;400;700;900'
					}
				]
			}
		}),
		WindiCSS(),
		mkcert(),
		glsl(),
		vue()
	]
});
