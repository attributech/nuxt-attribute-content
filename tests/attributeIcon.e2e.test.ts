import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { setupE2ETests, createTestPage, iconTestUtils } from './utils'

describe('AttributeIcon E2E Tests', async () => {
  await setupE2ETests()

  const ICON_PAGE_PATH = '/icon'
  let cachedHtml: string

  // Cache HTML for multiple tests to avoid repeated fetches
  const getPageHtml = async () => {
    if (!cachedHtml) {
      cachedHtml = await $fetch(ICON_PAGE_PATH)
    }
    return cachedHtml
  }

  describe('HTML Structure Tests', () => {
    it('should render the icon page with correct structure', async () => {
      const html = await getPageHtml()

      iconTestUtils.assertIconHeading(html, '&lt;AttributeIcon&gt;')
      iconTestUtils.assertBasicUsageSection(html)
      iconTestUtils.assertGridLayout(html)
    })

    it('should display all common icons', async () => {
      const html = await getPageHtml()

      iconTestUtils.assertIcons(html, iconTestUtils.COMMON_ICON_NAMES)
      iconTestUtils.assertIconLabels(html, iconTestUtils.COMMON_ICON_NAMES)
    })

    it('should have proper grid layout and semantic structure', async () => {
      const html = await getPageHtml()

      iconTestUtils.assertGridLayout(html)
      iconTestUtils.assertMinimumIconItems(html, 2)
    })

    it('should render icons with different size classes', async () => {
      const html = await getPageHtml()
      const sizes = iconTestUtils.ICON_SIZE_CONFIGS.map(config => config.size)

      iconTestUtils.assertSizeClasses(html, sizes)
      iconTestUtils.assertSizeSections(html, sizes)
    })
  })

  describe('Browser Tests', () => {
    it('should render icons with correct actual dimensions', async () => {
      const page = await createTestPage(ICON_PAGE_PATH)

      try {
        // Test each size configuration
        for (const config of iconTestUtils.ICON_SIZE_CONFIGS) {
          await iconTestUtils.verifyIconDimensions(
            page,
            config.selector,
            config.expectedWidth,
            config.expectedHeight,
          )
        }
      }
      finally {
        await page.close()
      }
    })

    it('should have proper size progression (small < medium < large)', async () => {
      const page = await createTestPage(ICON_PAGE_PATH)

      try {
        await iconTestUtils.verifySizeProgression(
          page,
          iconTestUtils.ICON_SIZE_CONFIGS.map(config => ({
            selector: config.selector,
            expectedSize: config.expectedWidth,
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
        // Verify all size selectors exist and are visible
        for (const config of iconTestUtils.ICON_SIZE_CONFIGS) {
          const element = page.locator(config.selector).first()
          const isVisible = await element.isVisible()
          expect(isVisible).toBe(true)
        }
      }
      finally {
        await page.close()
      }
    })
  })
})
