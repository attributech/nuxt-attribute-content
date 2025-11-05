import type { ImageConfiguration } from '../types'

export default defineAppConfig({
  attributeContent: {
    name: 'Nuxt Attribute Content (overwritten)',
    images: (): ImageConfiguration => {
      const images = {
        formats: [
          {
            format: 'avif',
            quality: 70,
          },
          {
            format: 'webp',
            quality: 85,
          },
        ],
      }
      return images
    },
  },
})
