import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('AttributeIcon E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the icon page', async () => {
    const html = await $fetch('/icon')

    // Check that the page renders with correct heading
    expect(html).toContain('&lt;AttributeIcon&gt;')
    expect(html).toContain('Basic Usage')
  })

  it('should display arrow-left icon', async () => {
    const html = await $fetch('/icon')

    // Check that AttributeIcon component is rendered with correct classes
    expect(html).toContain('icon--arrow-left')
    expect(html).toContain('arrow-left')
  })

  it('should display arrow-right icon', async () => {
    const html = await $fetch('/icon')

    // Check that AttributeIcon component is rendered with correct classes
    expect(html).toContain('icon--arrow-right')
    expect(html).toContain('arrow-right')
  })

  it('should have proper grid layout structure', async () => {
    const html = await $fetch('/icon')

    // Check that the grid layout elements are present
    expect(html).toContain('class="icon-grid"')
    expect(html).toContain('class="icon-item"')
  })

  it('should display icon names as labels', async () => {
    const html = await $fetch('/icon')

    // Check that icon names are displayed as labels
    expect(html).toContain('>arrow-left</span>')
    expect(html).toContain('>arrow-right</span>')
  })

  it('should have proper CSS classes for styling', async () => {
    const html = await $fetch('/icon')

    // Check that styling classes are applied
    expect(html).toMatch(/class="[^"]*icon-grid[^"]*"/)
    expect(html).toMatch(/class="[^"]*icon-item[^"]*"/)
  })

  it('should render multiple icon items in the grid', async () => {
    const html = await $fetch('/icon')

    // Count the number of icon items (should be at least 2)
    const iconItemMatches = html.match(/class="[^"]*icon-item[^"]*"/g)
    expect(iconItemMatches).toBeTruthy()
    expect(iconItemMatches!.length).toBeGreaterThanOrEqual(2)
  })

  it('should have proper semantic HTML structure', async () => {
    const html = await $fetch('/icon')

    // Check for proper HTML structure
    expect(html).toContain('Basic Usage')
    expect(html).toContain('icon-grid')
  })
})
