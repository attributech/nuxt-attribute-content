<template>
  <LMap
    :zoom="zoom"
    :center="center"
    :options="{
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    }"
    :use-global-leaflet="false"
  >
    <LTileLayer
      :url="tileLayerUrl"
      attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
      layer-type="base"
      name="OpenStreetMap"
    />

    <l-marker
      v-if="icon !== null"
      :lat-lng="markerCoordinates"
    >
      <l-icon
        :icon-size
        :icon-anchor
        :icon-url="icon.url"
      />
    </l-marker>
    <l-marker
      v-else
      :lat-lng="markerCoordinates"
    />
  </LMap>
</template>

<script setup lang="ts">
import type L from 'leaflet'

interface IconConfig {
  size: L.PointExpression | number[]
  anchor: L.PointExpression | number[]
  url: string
}

interface Props {
  tileLayerStyle?: string
  coordinates: L.PointExpression | number[]
  zoom?: number
  icon?: IconConfig | null
}
const runtimeConfig = useRuntimeConfig()

const props = withDefaults(defineProps<Props>(), {
  tileLayerStyle: 'mapbox/light-v11',
  zoom: 17,
  icon: null,
})

const markerCoordinates = props.coordinates as L.LatLngExpression
const center = props.coordinates as L.PointExpression | undefined
const iconSize = props.icon?.size as L.PointExpression | undefined
const iconAnchor = props.icon?.anchor as L.PointExpression | undefined

// Mapbox docs: https://docs.mapbox.com/api/maps/static-tiles/
const tileLayerUrl = computed((): string => {
  return `https://api.mapbox.com/styles/v1/${props.tileLayerStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${runtimeConfig.public.mapbox.accessToken}`
})
</script>
