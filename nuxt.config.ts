import { removeSizes } from 'nuxt-svg-icon-sprite/processors'
import { svgoProcessor } from './utils/svgoProcessor'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-svg-icon-sprite',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/eslint',
    'nuxt-ipx-cache',
    'nuxt3-interpolation',
    '@unlazy/nuxt',
  ],
  $meta: {
    name: 'nuxt-attribute-content',
  },
  devtools: { enabled: true },
  content: {
    build: {
      transformers: [
        '#layers/nuxt-attribute-content/transformers/imageProcessing',
      ],
    },
  },
  runtimeConfig: {
    public: {
      mapbox: {
        accessToken: '',
      },
    },
  },
  compatibilityDate: '2025-09-01',
  postcss: {
    plugins: {
      'postcss-nested': {},
      'postcss-custom-media': {},
    },
  },
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
        importPatterns: ['./assets/icons/**/*.svg'],
        processSpriteSymbol: [
          removeSizes(),
          svgoProcessor(),
        ],
      },
      original: {
        importPatterns: ['./assets/icons/**/*.svg'],
      },
    },
  },
})
