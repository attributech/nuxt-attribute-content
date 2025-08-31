<template>
  <div>
    <h1>&lt;AttributeIcon&gt;</h1>
    <section>
      <h2>Basic Usage</h2>
      <div class="icon-grid">
        <div class="icon-item">
          <AttributeIcon name="arrow-left" />
          <span>arrow-left</span>
        </div>
        <div class="icon-item">
          <AttributeIcon name="arrow-right" />
          <span>arrow-right</span>
        </div>
      </div>
    </section>
    <section>
      <h2>Sizes</h2>
      <h3>s</h3>
      <div class="icon-grid">
        <div class="icon-item">
          <AttributeIcon name="arrow-left" size="s" />
          <span>arrow-left</span>
        </div>
        <div class="icon-item">
          <AttributeIcon name="arrow-right" size="s" />
          <span>arrow-right</span>
        </div>
      </div>
      <h3>m</h3>
      <div class="icon-grid">
        <div class="icon-item">
          <AttributeIcon name="arrow-left" size="m" />
          <span>arrow-left</span>
        </div>
        <div class="icon-item">
          <AttributeIcon name="arrow-right" size="m" />
          <span>arrow-right</span>
        </div>
      </div>
      <h3>l</h3>
      <div class="icon-grid">
        <div class="icon-item">
          <AttributeIcon name="arrow-left" size="l" />
          <span>arrow-left</span>
        </div>
        <div class="icon-item">
          <AttributeIcon name="arrow-right" size="l" />
          <span>arrow-right</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.icon-item span {
  margin-top: 10px;
  font-family: monospace;
  font-size: 14px;
  color: #666;
}
</style>
