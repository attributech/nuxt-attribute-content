<template>
  <component
    :is="componentName(item.type)"
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

withDefaults(defineProps<Props>(), {
  item: () => ({} as Item),
})

const { toPascalCase } = useCamelize()

function componentName(name: string): string {
  return `Modules${toPascalCase(name)}`
}
</script>
