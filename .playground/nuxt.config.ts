import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  extends: ['..'],
  modules: ['@nuxt/eslint'],

  components: [
    {
      path: '../components/blocks',
      prefix: 'Block',
      global: true,
    },
    {
      path: '~/blocks',
      prefix: 'Block',
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
