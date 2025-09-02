import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  name: 'lazySizesConfig',
  setup() {
    window.lazySizesConfig = window.lazySizesConfig || {}
    window.lazySizesConfig.expFactor = 10
    window.lazySizesConfig.loadMode = 3
    window.lazySizesConfig.loadHidden = false
  },
})
