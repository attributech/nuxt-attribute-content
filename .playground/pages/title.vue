<template>
  <div>
    <h1>&lt;ModuleTitle&gt;</h1>
    <ModuleTitle
      v-for="(item, key) in data"
      :key="key"
      :title="item.title"
      :level="item.level"
    />
  </div>
</template>

<script setup lang="ts">
const data = {
  title1: { title: 'Heading 1', level: 1 },
  title2: { title: 'Heading 2', level: 2 },
  title3: { title: 'Heading 3', level: 3 },
}
</script>
