<template>
  <div>
    <h1>&lt;AttributeResponsiveImage&gt;</h1>
    <h2>auto-sizes</h2>
    <AttributeResponsiveImage
      src="/files/test.png"
      alt="Placeholder"
      :width="1920"
      :height="1080"
      thumbhash="PQgCBID3KaV4h3iPYYcAAAAAAA=="
    />
    <h2>sizes="200vw"</h2>
    <AttributeResponsiveImage
      src="/files/test.png"
      alt="Placeholder"
      :width="1920"
      :height="1080"
      sizes="200vw"
      thumbhash="PQgCBID3KaV4h3iPYYcAAAAAAA=="
    />
  </div>
</template>

<script setup lang="ts">
</script>
