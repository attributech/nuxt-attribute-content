<template>
  <AttributeTitle
    :title
    :level
    class="title"
    :class="classes"
  />
</template>

<script setup lang="ts">
interface Props {
  title: string
  level: number
}

const props = defineProps<Props>()

const classes = computed(() => {
  return [`title--level-${props.level}`]
})
</script>
