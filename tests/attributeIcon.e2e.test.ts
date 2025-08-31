import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

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

  it('should render icons with different size classes', async () => {
    const html = await $fetch('/icon')

    // Check that size-specific CSS classes are applied
    expect(html).toContain('icon--size-s')
    expect(html).toContain('icon--size-m')
    expect(html).toContain('icon--size-l')
  })

  it('should display size sections with proper headings', async () => {
    const html = await $fetch('/icon')

    // Check that size sections exist
    expect(html).toContain('Sizes')
    expect(html).toContain('>s</h3>')
    expect(html).toContain('>m</h3>')
    expect(html).toContain('>l</h3>')
  })

  it('should render icons with correct actual dimensions', async () => {
    const page = await createPage('/icon')

    try {
      // Wait for the page to load
      await page.waitForSelector('.icon--size-s')

      // Get the computed dimensions for each size
      const smallIconSize = await page.evaluate(() => {
        const element = document.querySelector('.icon--size-s')
        if (!element) return null
        const styles = window.getComputedStyle(element)
        return {
          width: Number.parseInt(styles.width),
          height: Number.parseInt(styles.height),
        }
      })

      const mediumIconSize = await page.evaluate(() => {
        const element = document.querySelector('.icon--size-m')
        if (!element) return null
        const styles = window.getComputedStyle(element)
        return {
          width: Number.parseInt(styles.width),
          height: Number.parseInt(styles.height),
        }
      })

      const largeIconSize = await page.evaluate(() => {
        const element = document.querySelector('.icon--size-l')
        if (!element) return null
        const styles = window.getComputedStyle(element)
        return {
          width: Number.parseInt(styles.width),
          height: Number.parseInt(styles.height),
        }
      })

      // Verify the actual dimensions match expected sizes
      expect(smallIconSize).toBeTruthy()
      expect(smallIconSize!.width).toBe(18)
      expect(smallIconSize!.height).toBe(18)

      expect(mediumIconSize).toBeTruthy()
      expect(mediumIconSize!.width).toBe(32)
      expect(mediumIconSize!.height).toBe(32)

      expect(largeIconSize).toBeTruthy()
      expect(largeIconSize!.width).toBe(64)
      expect(largeIconSize!.height).toBe(64)

      // Verify size progression (small < medium < large)
      expect(smallIconSize!.width).toBeLessThan(mediumIconSize!.width)
      expect(mediumIconSize!.width).toBeLessThan(largeIconSize!.width)
    }
    finally {
      await page.close()
    }
  })
})
