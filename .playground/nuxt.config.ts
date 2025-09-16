import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/eslint'],

  components: [
    {
      path: '../components/modules',
      prefix: 'Module',
      global: true,
    },
    {
      path: '~/blocks',
      prefix: 'Module',
      global: true,
    },
    '~/components',
  ],
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  },
})
