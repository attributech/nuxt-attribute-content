import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  extends: ['..'],
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/leaflet',
  ],
  components: {
    global: true,
    dirs: ['~/components'],
  },
  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://nuxt-attribute-content.vercel.app/',
  },
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  },
  linkChecker: {
    failOnError: false,
  },
})
