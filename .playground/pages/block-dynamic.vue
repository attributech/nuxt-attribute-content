<template>
  <div>
    <h1>&lt;AttributeDynamicComponent&gt;</h1>
    <div
      v-for="(item, key) in data"
      :key="key"
    >
      <AttributeDynamicComponent :item />
    </div>
  </div>
</template>

<script setup lang="ts">
const data = {
  title1: { type: 'title', title: 'Heading 1', level: 1 },
  title2: { type: 'title', title: 'Heading 2', level: 2 },
  title3: { type: 'title', title: 'Heading 3', level: 3 },
}
</script>
