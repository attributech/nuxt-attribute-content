import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'

export const viteConfigCms: UserConfig = {
  root: './admin',
  base: '/admin/',
  build: {
    outDir: '../public/admin',
    chunkSizeWarningLimit: 10000,
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/preview': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/preview/, ''),
      },
      '/_nuxt': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/_ipx': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}

export default defineConfig((): UserConfig => {
  return viteConfigCms
})
