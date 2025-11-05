export interface ImageFormat {
  format: string
  quality: number
}

export interface ImageConfiguration {
  formats: ImageFormat[]
}

export type ImageConfigValue = ImageConfiguration | (() => ImageConfiguration)

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

// It is always important to ensure you import/export something when augmenting a type
export {}
