<template>
  <component
    :is="componentName"
    v-bind="{ ...item }"
  />
</template>

<script setup lang="ts">
interface Item {
  type: string
  [key: string]: unknown
}

interface Props {
  item?: Item
}

const props = withDefaults(defineProps<Props>(), {
  item: () => ({} as Item),
})

const { toPascalCase } = useCamelize()

const componentName = computed<string>(() => {
  return `Modules${toPascalCase(props.item.type)}`
})
</script>
