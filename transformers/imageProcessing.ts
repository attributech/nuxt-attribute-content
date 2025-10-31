import { defineTransformer, type TransformedContent } from '@nuxt/content'
import { processImage } from '../utils/imageProcessing'
import type { ImageItem } from '../types/ImageItem'

export default defineTransformer({
  name: 'imageProcessing',
  extensions: ['.yml'],
  transform: async function (content: TransformedContent) {
    await processContent(content)
    return content
  },
})

const processContent = async (data: Record<string, unknown>) => {
  for (const property in data) {
    let item = data[property]
    if (item instanceof Object) {
      item = await processContent(item as Record<string, unknown>)
    }
    if (item && item instanceof Object && 'src' in item) {
      item = await processImage(item as ImageItem)
    }
    data[property] = item
  }
  return data
}
