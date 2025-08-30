<template>
  <main>
    <section>
      <AttributeIcon name="arrow-left" />
      <AttributeIcon name="arrow-right" />
    </section>
    <section>
      <ul>
        <li
          v-for="item in main?.items"
          :key="item.path"
        >
          <a :href="item.path">{{ item.title }}</a>
        </li>
      </ul>
    </section>
    <section>
      <div
        class="text"
        v-html="renderedMarkdown(text)"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
const { renderedMarkdown } = useRenderedMarkdown()
const { fetchMenuItems } = useMenuItems()

const main = await fetchMenuItems('main')

const content = await queryCollection('page').all()
const text = content[0]?.content?.[0]?.items?.[0]?.text || ''
</script>
