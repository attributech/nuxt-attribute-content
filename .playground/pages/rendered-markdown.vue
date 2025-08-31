<template>
  <div>
    <h1>useRenderedMarkdown()</h1>
    <section>
      <h2>Rendered Markdown from Content</h2>
      <div class="rendered-content" v-html="renderedMarkdown(text)" />
    </section>

    <section>
      <h2>Custom Markdown Example</h2>
      <div class="markdown-demo">
        <h3>Input:</h3>
        <textarea v-model="customMarkdown" rows="6" cols="50" placeholder="Enter your markdown here..." />
        <h3>Output:</h3>
        <div class="rendered-content" v-html="renderedMarkdown(customMarkdown)" />
      </div>
    </section>

    <section>
      <h2>Content Data</h2>
      <pre><code>{{ JSON.stringify(content, null, 2) }}</code></pre>
    </section>
  </div>
</template>

<script setup lang="ts">
const { renderedMarkdown } = useRenderedMarkdown()

const content = await queryCollection('page').all()
const text = content[0]?.content?.[0]?.items?.[0]?.text || 'No content found'

const customMarkdown = ref(`# Hello World

This is a **bold** text and this is *italic*.

## List Example
- Item 1
- Item 2
- Item 3

### Code Example
\`\`\`javascript
console.log('Hello, World!');
\`\`\`

[Link example](https://nuxt.com)
`)
</script>

<style scoped>
.rendered-content {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
  background: white;
  min-height: 100px;
}

.markdown-demo {
  margin: 20px 0;
}

.markdown-demo h3 {
  margin: 20px 0 10px 0;
  color: #333;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  resize: vertical;
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

/* Styling for rendered markdown content */
.rendered-content :deep(h1),
.rendered-content :deep(h2),
.rendered-content :deep(h3) {
  color: #333;
  margin-top: 0;
}

.rendered-content :deep(p) {
  line-height: 1.6;
  margin: 10px 0;
}

.rendered-content :deep(ul) {
  padding-left: 20px;
}

.rendered-content :deep(li) {
  margin: 5px 0;
}

.rendered-content :deep(code) {
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.rendered-content :deep(pre) {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.rendered-content :deep(a) {
  color: #0066cc;
  text-decoration: none;
}

.rendered-content :deep(a:hover) {
  text-decoration: underline;
}
</style>
