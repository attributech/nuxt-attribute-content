<template>
  <UnLazyImage
    :src
    :src-set
    :alt="alt"
    :width
    :height
    :loading
    auto-sizes
    :thumbhash="thumbhash"
    :style
  />
</template>

<script setup lang="ts">
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
  sizes: '100vw',
  loading: 'lazy',
})

const srcSet = computed<string>(() => {
  const img = useImage()
  return img.getSizes(props.src, {
    sizes:
      'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw xxxl:100vw xxxxl:100vw xxxxxl:100vw',
    modifiers: {
      format: 'webp',
      quality: 60,
    },
  }).srcset
})

const style = computed<string | false>(() => {
  if (props.width !== undefined && props.height !== undefined) {
    return `aspect-ratio: ${props.width}/${props.height};`
  }
  return false
})
</script>
