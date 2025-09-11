<template>
  <div>
    <h1>&lt;BlockTitle&gt;</h1>
    <BlockTitle :fields="data.title1" />
    <BlockTitle :fields="data.title2" />
    <BlockTitle :fields="data.title3" />
  </div>
</template>

<script setup lang="ts">
const data = {
  title1: { title: 'Heading 1', level: 1 },
  title2: { title: 'Heading 2', level: 2 },
  title3: { title: 'Heading 3', level: 3 },
}
</script>
