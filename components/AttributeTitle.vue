<template>
  <component :is="htmlTag">
    {{ title }}
  </component>
</template>

<script setup lang="ts">
interface Props {
  title: string
  level: number
}

const props = defineProps<Props>()

const htmlTag = computed(() => {
  return `h${props.level}`
})
</script>
