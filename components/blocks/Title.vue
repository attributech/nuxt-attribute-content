<template>
  <ModulesTitle :title="fields.title" :level="fields.level" />
</template>

<script setup lang="ts">
interface Fields {
  title: string
  level: number
}

defineProps<{
  fields: Fields
}>()
</script>
