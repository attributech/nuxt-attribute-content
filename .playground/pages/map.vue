<template>
  <div>
    <h1>&lt;AttributeMap&gt;</h1>
    <AttributeMap
      :coordinates
      :zoom
      class="map"
    />
    <AttributeMap
      :coordinates
      :zoom
      class="map"
      :icon
    />
    <AttributeMap
      :tile-layer-style
      :coordinates
      :zoom
      class="map"
    />
  </div>
</template>

<script setup lang="ts">
const tileLayerStyle = 'mapbox/satellite-v9'
const coordinates = [47.0005, 8.0005]
const zoom = 17
const icon = {
  size: [32, 32],
  anchor: [16, 32],
  url: '/location.svg',
}
</script>

<style>
.map {
  aspect-ratio: 16 / 9;
}
</style>
