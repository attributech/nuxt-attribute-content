<template>
  <component
    :is="htmlTag"
    class="title"
    :class="classes"
  >
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

const classes = computed(() => {
  return [`title--level-${props.level}`]
})
</script>
