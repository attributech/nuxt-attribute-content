import { removeSizes, forceCurrentColor } from 'nuxt-svg-icon-sprite/processors'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-svg-icon-sprite', '@nuxt/content'],
  devtools: { enabled: true },
  svgIconSprite: {
    sprites: {
      default: {
        importPatterns: ['./assets/icons/*.svg'],
        processSpriteSymbol: [removeSizes(), forceCurrentColor()],
      },
    },
  },
})
