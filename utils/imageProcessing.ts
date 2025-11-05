import { resolvePath } from '@nuxt/kit'
import { readFile } from 'node:fs/promises'
import { imageMeta, type ImageMeta } from 'image-meta'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { rgbaToThumbHash } from 'thumbhash'
import type { ImageItem } from '../types'

export async function processImage(imageItem: ImageItem): Promise<ImageItem> {
  const imageData = await readImage(imageItem.src)
  const metadata = getImageMetadata(imageData)
  const thumbhash = await generateThumbhash(imageData)
  imageItem.thumbhash = thumbhash
  imageItem.metadata = metadata
  return imageItem
}

export function getImageMetadata(imageData: Buffer<ArrayBufferLike>): ImageMeta {
  try {
    return imageMeta(imageData)
  }
  catch {
    throw new Error(`Failed to get image metadata.`)
  }
}

export async function readImage(path: string): Promise<Buffer<ArrayBufferLike>> {
  try {
    const filePath = await resolvePath(`public${path}`)
    return await readFile(filePath)
  }
  catch {
    throw new Error(`Failed to read image: ${path}`)
  }
}

export async function generateThumbhash(bufferBody: Buffer<ArrayBufferLike>, maxSize = 100) {
  try {
    const image = await loadImage(bufferBody)
    const { width, height } = image
    const scale = Math.min(maxSize / width, maxSize / height)
    const resizedWidth = Math.floor(width * scale)
    const resizedHeight = Math.floor(height * scale)

    const canvas = createCanvas(resizedWidth, resizedHeight)
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, resizedWidth, resizedHeight)

    const imageData = context.getImageData(0, 0, resizedWidth, resizedHeight)
    const rgba = new Uint8Array(imageData.data.buffer)
    const binaryThumbHash = rgbaToThumbHash(imageData.width, imageData.height, rgba)

    return Buffer.from(binaryThumbHash).toString('base64')
  }
  catch {
    throw new Error(`Failed to generate thumbhash.`)
  }
}
