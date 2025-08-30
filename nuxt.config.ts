import { removeSizes, forceCurrentColor } from 'nuxt-svg-icon-sprite/processors'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-svg-icon-sprite', '@nuxt/content', '@nuxt/image'],
  devtools: { enabled: true },
  image: {
    screens: {
      xs: 320,
      sm: 480,
      md: 640,
      lg: 960,
      xl: 1280,
      xxl: 1536,
      xxxl: 1920,
      xxxxl: 2560,
      xxxxxl: 3840,
    },
    densities: [1],
    inject: true,
  },
  svgIconSprite: {
    sprites: {
      default: {
        importPatterns: ['./assets/icons/*.svg'],
        processSpriteSymbol: [removeSizes(), forceCurrentColor()],
      },
    },
  },
})
