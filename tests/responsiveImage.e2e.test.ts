import { describe, it, expect, afterAll } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'
import type { Page } from 'playwright-core'

/**
 * Responsive Image E2E Tests
 *
 * IMPORTANT: Bot Detection Behavior in Tests
 * ------------------------------------------
 * Unlazy's bot detection identifies Playwright as a bot (via browser capability checks,
 * not user agent). In bot mode, `auto-sizes` calculates a fixed `sizes` value that
 * doesn't update per viewport. This is EXPECTED behavior for SEO purposes (bots get
 * full-quality images immediately).
 *
 * As a result, these tests:
 * - DO verify: HTML structure, srcset generation, image loading success, format/quality
 * - DO NOT verify: Different images loading at different viewports (impossible in bot mode)
 *
 * Manual testing in real browsers (Firefox, Chrome) confirms `auto-sizes` works perfectly.
 */
describe('Responsive Image E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
    browser: true,
    browserOptions: {
      type: 'firefox',
    },
  })

  const pages: Page[] = []

  afterAll(async () => {
    // Clean up any created pages
    for (const page of pages) {
      try {
        await page.close()
      }
      catch {
        // Ignore errors during cleanup
      }
    }
  })

  describe('HTML Structure', () => {
    it('should generate correct srcset and attributes', async () => {
      const html = await $fetch('/responsive-image')

      // Verify basic structure
      expect(html).toContain('<img')
      expect(html).toContain('alt="Placeholder"')

      // Verify srcset is generated with expected widths
      expect(html).toContain('320w')
      expect(html).toContain('640w')
      expect(html).toContain('1280w')
      expect(html).toContain('1920w')

      // Verify image optimization
      expect(html).toContain('f_webp')
      expect(html).toContain('q_60')
      expect(html).toContain('/_ipx/')

      // Verify test image reference
      expect(html).toMatch(/test\.png/)
    })
  })

  describe('Browser Image Loading', () => {
    /**
     * Test that images load successfully in the browser.
     * Due to bot detection, we cannot test viewport-specific image selection,
     * but we can verify that images load with correct attributes and optimization.
     */
    it('should load images with correct attributes and optimization', async () => {
      const page = await createPage('/responsive-image')
      pages.push(page) // Track for cleanup

      // Wait for page to load
      await page.waitForLoadState('load')
      await page.waitForLoadState('networkidle')

      // Give unlazy extra time to process
      await page.waitForTimeout(3000)

      // Get image information
      const imageInfo = await page.evaluate(() => {
        const img = document.querySelector('img')
        if (!img) return null

        return {
          currentSrc: img.currentSrc,
          src: img.src,
          srcset: img.getAttribute('srcset'),
          sizes: img.getAttribute('sizes'),
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          complete: img.complete,
        }
      })

      expect(imageInfo).not.toBeNull()

      // Verify image loaded successfully
      expect(imageInfo!.complete).toBe(true)
      expect(imageInfo!.currentSrc).toBeTruthy()

      // Verify correct attributes
      expect(imageInfo!.alt).toBe('Placeholder')

      // Verify srcset contains all expected widths
      expect(imageInfo!.srcset).toContain('320w')
      expect(imageInfo!.srcset).toContain('640w')
      expect(imageInfo!.srcset).toContain('1280w')
      expect(imageInfo!.srcset).toContain('1920w')

      // Verify image optimization settings
      expect(imageInfo!.currentSrc).toContain('f_webp')
      expect(imageInfo!.currentSrc).toContain('q_60')
      expect(imageInfo!.currentSrc).toContain('test.png')

      // Verify sizes attribute is set (bot mode sets a fixed value)
      expect(imageInfo!.sizes).toBeTruthy()
    })

    /**
     * Test image quality and format settings
     */
    it('should apply correct image quality and format', async () => {
      const page = await createPage('/responsive-image')
      pages.push(page)

      await page.waitForLoadState('load')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(3000)

      const currentSrc = await page.evaluate(() => {
        const img = document.querySelector('img')
        return img ? img.currentSrc : null
      })

      expect(currentSrc).toBeTruthy()

      // Verify WebP format
      expect(currentSrc).toContain('f_webp')

      // Verify quality setting
      expect(currentSrc).toContain('q_60')

      // Verify it's using the IPX image optimization
      expect(currentSrc).toContain('/_ipx/')
    })
  })
})
