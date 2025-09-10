import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import {
  setupE2ETests,
  createTestPage,
  getCachedPage,
  cleanupSharedPageCache,
  iconTestUtils,
} from './utils'

describe('AttributeIcon E2E Tests', async () => {
  await setupE2ETests()

  const ICON_PAGE_PATH = '/icon'
  let cachedHtml: string

  // Cleanup shared resources after all tests
  afterAll(async () => {
    await cleanupSharedPageCache()
  })

  // Cache HTML for multiple tests to avoid repeated fetches
  const getPageHtml = async () => {
    if (!cachedHtml) {
      cachedHtml = await $fetch(ICON_PAGE_PATH)
    }
    return cachedHtml
  }

  describe.concurrent('HTML Structure Tests', () => {
    it('should render the icon page with correct structure', async () => {
      const html = await getPageHtml()

      // Check page structure
      expect(html).toContain('&lt;AttributeIcon&gt;')
      expect(html).toContain('Basic Usage')

      // Check grid layout
      expect(html).toContain('class="icon-grid"')
      expect(html).toContain('class="icon-item"')
    })

    it('should display all common icons', async () => {
      const html = await getPageHtml()

      // Check that all common icons are present
      iconTestUtils.COMMON_ICON_NAMES.forEach((iconName) => {
        expect(html).toContain(`icon--${iconName}`)
        expect(html).toContain(iconName)
      })

      // Check icon labels
      iconTestUtils.COMMON_ICON_NAMES.forEach((label) => {
        expect(html).toContain(`>${label}</span>`)
      })
    })

    it('should have proper grid layout and semantic structure', async () => {
      const html = await getPageHtml()

      // Check grid layout
      expect(html).toContain('class="icon-grid"')
      expect(html).toContain('class="icon-item"')

      // Check minimum icon items
      const iconItemMatches = html.match(/class="[^"]*icon-item[^"]*"/g)
      expect(iconItemMatches).toBeTruthy()
      expect(iconItemMatches!.length).toBeGreaterThanOrEqual(2)
    })

    it('should render icons with different size classes', async () => {
      const html = await getPageHtml()
      const sizes = iconTestUtils.ICON_SIZE_CONFIGS.map(config => config.size)

      // Check size classes
      sizes.forEach((size) => {
        expect(html).toContain(`icon--size-${size}`)
      })

      // Check size sections
      expect(html).toContain('Sizes')
      sizes.forEach((size) => {
        expect(html).toContain(`>${size}</h3>`)
      })
    })
  })

  describe('Browser Tests', () => {
    describe.concurrent('Icon Rendering', () => {
      it('should render icons with correct actual dimensions and size progression', async () => {
        const page = await createTestPage(ICON_PAGE_PATH)

        try {
          // Use optimized concurrent testing for all icon sizes
          await iconTestUtils.verifyConcurrentIconSizes(
            page,
            iconTestUtils.ICON_SIZE_CONFIGS.map(config => ({
              selector: config.selector,
              expectedWidth: config.expectedWidth,
              expectedHeight: config.expectedHeight,
            })),
          )
        }
        finally {
          await page.close()
        }
      })

      it('should display icons correctly in all size variants', async () => {
        const page = await createTestPage(ICON_PAGE_PATH)

        try {
          // Wait for all selectors to be visible concurrently
          const visibilityPromises = iconTestUtils.ICON_SIZE_CONFIGS.map(async (config) => {
            const element = page.locator(config.selector).first()
            await element.waitFor({ state: 'visible', timeout: 3000 })
            const isVisible = await element.isVisible()
            expect(isVisible).toBe(true)
            return config.selector
          })

          await Promise.all(visibilityPromises)
        }
        finally {
          await page.close()
        }
      })

      it('should verify individual icon dimensions with optimized performance', async () => {
        const page = await createTestPage(ICON_PAGE_PATH)

        try {
          // Test each size configuration with direct dimension checking
          const dimensionPromises = iconTestUtils.ICON_SIZE_CONFIGS.map(async (config) => {
            await page.waitForSelector(config.selector, { timeout: 3000 })

            const dimensions = await page.evaluate((sel) => {
              const element = document.querySelector(sel)
              if (!element) return null
              const styles = window.getComputedStyle(element)
              return {
                width: Number.parseInt(styles.width),
                height: Number.parseInt(styles.height),
              }
            }, config.selector)

            expect(dimensions).toBeTruthy()
            expect(dimensions!.width).toBe(config.expectedWidth)
            expect(dimensions!.height).toBe(config.expectedHeight)
          })

          await Promise.all(dimensionPromises)
        }
        finally {
          await page.close()
        }
      })
    })
  })
})
