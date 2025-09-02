import lazySizes from 'lazysizes'
import { defineNuxtPlugin } from '#app'

import 'lazysizes/plugins/parent-fit/ls.parent-fit'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('lazySizes', lazySizes)
})
