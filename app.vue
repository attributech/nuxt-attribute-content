<template>
  <h1>{{ attributeContent.name }}</h1>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { attributeContent } = useAppConfig()
</script>
