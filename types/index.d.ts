import type { ImageMeta } from 'image-meta'

export interface ImageFormat {
  format: string
  quality: number
}

export interface ImageConfiguration {
  formats: ImageFormat[]
}

export type ImageConfigValue = ImageConfiguration | (() => ImageConfiguration)

export interface ImageItem {
  src: string
  metadata?: ImageMeta
  thumbhash?: string
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    attributeContent?: {
      name?: string
      images?: ImageConfigValue
    }
  }
  interface AppConfig {
    attributeContent: {
      name: string
      images: ImageConfiguration
    }
  }
}
