<script setup lang="ts">
const { attributeContent } = useAppConfig();
</script>

<template>
  <div>
    <h1>Hello World!</h1>
    <pre>{{ attributeContent }}</pre>
  </div>
</template>
