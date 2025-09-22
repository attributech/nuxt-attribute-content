<template>
  <main>
    <h1>Nuxt Attribute Content - Playground</h1>
    <p>Explore the different components and features of this package:</p>

    <section class="navigation">
      <div class="feature-grid">
        <a
          href="/icon"
          class="feature-card"
        >
          <AttributeIcon name="arrow-right" />
          <h3>AttributeIcon</h3>
          <p>Icon component with various icon options</p>
        </a>

        <a
          href="/responsive-image"
          class="feature-card"
        >
          <h3>AttributeResponsiveImage</h3>
          <p>Responsive image component with optimized loading</p>
        </a>

        <a
          href="/title"
          class="feature-card"
        >
          <h3>ModulesTitle</h3>
          <p>Flexible title components with dynamic heading levels</p>
        </a>

        <a
          href="/menu-items"
          class="feature-card"
        >
          <h3>useMenuItems()</h3>
          <p>Composable for fetching and managing menu items</p>
        </a>

        <a
          href="/rendered-markdown"
          class="feature-card"
        >
          <h3>useRenderedMarkdown()</h3>
          <p>Composable for rendering markdown content</p>
        </a>

        <a
          href="/block-dynamic"
          class="feature-card"
        >
          <h3>AttributeDynamicComponent</h3>
          <p>A component to render dynamic componets based on data</p>
        </a>

        <a
          href="/map"
          class="feature-card"
        >
          <h3>AttributeMap</h3>
          <p>Interactive map component with markers and customizable tiles</p>
        </a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped>
main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  background: white;
}

.feature-card:hover {
  border-color: #0066cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.1);
}

.feature-card h3 {
  color: #333;
  margin: 15px 0 10px 0;
  font-family: monospace;
  font-size: 18px;
}

.feature-card p {
  color: #666;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}
</style>
