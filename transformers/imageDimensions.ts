import { defineTransformer, type TransformedContent } from '@nuxt/content'
import { resolvePath } from '@nuxt/kit'
import { readFile } from 'node:fs/promises'
import { imageMeta, type ImageMeta } from 'image-meta'

interface ImageItem {
  src: string
  metadata?: ImageMeta
}

export default defineTransformer({
  name: 'imageDimensions',
  extensions: ['.yml'],
  transform: async function (content: TransformedContent) {
    await setImageDimensions(content)
    return content
  },
})

const setImageDimensions = async (data: Record<string, unknown>) => {
  for (const property in data) {
    let item = data[property]
    if (item instanceof Object) {
      item = await setImageDimensions(item as Record<string, unknown>)
    }
    if (item && item instanceof Object && 'src' in item) {
      const imageItem = item as ImageItem
      try {
        const filePath = await resolvePath(`public${imageItem.src}`)
        const imageData = await readFile(filePath)
        imageItem.metadata = imageMeta(imageData)
      }
      catch {
        throw new Error(`Failed to parse image: ${imageItem.src}`)
      }
    }
    data[property] = item
  }
  return data
}
