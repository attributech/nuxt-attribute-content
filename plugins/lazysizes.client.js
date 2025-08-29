import lazySizes from 'lazysizes'
import { defineNuxtPlugin } from '#app'

import 'lazysizes/plugins/parent-fit/ls.parent-fit'

window.lazySizesConfig = window.lazySizesConfig || {}
window.lazySizesConfig.expFactor = 10
window.lazySizesConfig.loadMode = 3
window.lazySizesConfig.loadHidden = false

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('lazySizes', lazySizes)
})
