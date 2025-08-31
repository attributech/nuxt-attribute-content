<template>
  <div
    class="icon"
    :class="classObject"
  >
    <SpriteSymbol :name="name" />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  name: string
  fill?: boolean
  size?: string
  modifier?: string
}

const props = withDefaults(defineProps<Props>(), {
  fill: false,
  size: 'm',
})

const classObject = reactive({
  [`icon--${props.name}`]: true,
  'icon--fill': props.fill,
  [`icon--size-${props.size}`]: true,
})

if (props.modifier) {
  classObject[`icon--${props.modifier}`] = true
}
</script>

<style lang="postcss">
.icon {
  display: inline-flex;
  align-items: center;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    margin-bottom: 0;
  }

  &--size-s {
    width: var(--icon-size--s, 16px);
    height: var(--icon-size--s, 16px);
  }

  &--size-m {
    width: var(--icon-size--m, 24px);
    height: var(--icon-size--m, 24px);
  }

  &--size-l {
    width: var(--icon-size--l, 32px);
    height: var(--icon-size--l, 32px);
  }
}
</style>
