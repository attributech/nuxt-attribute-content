<template>
  <div>
    <h1>useMenuItems()</h1>
    <section>
      <h2>Main Menu Items</h2>
      <ul v-if="main?.items && main.items.length > 0">
        <li
          v-for="item in main.items"
          :key="item.path"
        >
          <a :href="item.path">{{ item.title }}</a>
        </li>
      </ul>
      <p v-else>
        No menu items found
      </p>
    </section>

    <section>
      <h2>Raw Menu Data</h2>
      <pre><code>{{ JSON.stringify(main, null, 2) }}</code></pre>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchMenuItems } = useMenuItems()

const main = await fetchMenuItems('main')
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

a {
  text-decoration: none;
  color: #0066cc;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
}

code {
  font-family: 'Courier New', monospace;
}
</style>
