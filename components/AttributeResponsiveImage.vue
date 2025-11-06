<template>
  <UnLazyImage
    :src
    :src-set
    :alt
    :width
    :height
    :loading
    :auto-sizes="!sizes"
    :sizes
    :thumbhash
    :style
  />
</template>

<script setup lang="ts">
import type { ImageFormat } from '../types'

interface Props {
  src: string
  alt: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  width?: number
  height?: number
  thumbhash?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
})

const appConfig = useAppConfig()

const srcSet = computed<string | undefined>(() => {
  // @todo: see todo below regarding sources.
  // if (props.sizes) {
  const format = appConfig.attributeContent.images.formats.at(-1)
  if (format !== undefined) {
    return getSrcSet(format)
  }
  // }
  return undefined
})

const getSrcSet = (imageFormat: ImageFormat): string => {
  const img = useImage()
  return img.getSizes(props.src, {
    sizes:
      'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw xxxl:100vw xxxxl:100vw xxxxxl:100vw',
    modifiers: {
      format: imageFormat.format,
      quality: imageFormat.quality,
    },
  }).srcset
}

// @todo: using sources currently broken. too large images are being fetched
/*
interface ImageSource {
  type: string
  srcSet: string
  sizes?: string
}
const sources = computed<ImageSource[] | undefined>(() => {
  if (props.sizes) {
    return undefined
  }
  return appConfig.attributeContent.images.formats.map((imageFormat) => {
    return {
      type: `image/${imageFormat.format}`,
      srcSet: getSrcSet(imageFormat),
    }
  })
})
*/

const style = computed<false | string>(() => {
  if (props.width !== undefined && props.height !== undefined) {
    return `aspect-ratio: ${props.width}/${props.height};`
  }
  return false
})
</script>
