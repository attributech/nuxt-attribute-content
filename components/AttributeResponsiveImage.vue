<template>
  <img
    :data-src="src"
    :data-srcset="srcset"
    :data-aspectratio="aspectRatio"
    :data-parent-fit="parentFit"
    data-sizes="auto"
    :alt="alt"
    class="lazyload"
    :width
    :height
  >
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  sizes?: string
  loading?: string
  width?: number
  height?: number
  aspectRatio?: string | boolean
  parentFit?: string | boolean
}

const props = withDefaults(defineProps<Props>(), {
  sizes: '100vw',
  loading: 'lazy',
  aspectRatio: false,
  parentFit: false,
})

const srcset = computed<string>(() => {
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
</script>
