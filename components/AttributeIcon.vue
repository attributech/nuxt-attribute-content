<template>
  <div class="icon" :class="classObject">
    <SpriteSymbol :name="name" />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  name: string
  fill?: boolean
  modifier?: string
}

const props = withDefaults(defineProps<Props>(), {
  fill: false,
})

const classObject = reactive({
  [`icon--${props.name}`]: true,
  'icon--fill': props.fill,
})

if (props.modifier) {
  classObject[`icon--${props.modifier}`] = true
}
</script>

<style lang="postcss">
.icon {
  width: var(--icon-size--s);
  height: var(--icon-size--s);
  display: inline-flex;
  align-items: center;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    margin-bottom: 0;
  }
}
</style>
