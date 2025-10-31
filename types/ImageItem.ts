import type { ImageMeta } from 'image-meta'

export interface ImageItem {
  src: string
  metadata?: ImageMeta
  thumbhash?: string
}
