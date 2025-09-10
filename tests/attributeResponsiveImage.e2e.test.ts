import { describe, it, afterAll, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import {
  setupE2ETests,
  createTestPage,
  runConcurrentViewportTests,
  cleanupSharedPageCache,
  responsiveImageTestUtils,
} from './utils'

describe('AttributeResponsiveImage E2E Tests', async () => {
  await setupE2ETests({
    browserOptions: {
      type: 'firefox',
    },
  })

  const RESPONSIVE_IMAGE_PATH = '/responsive-image'
  let cachedHtml: string

  // Cleanup shared resources after all tests
  afterAll(async () => {
    await cleanupSharedPageCache()
  })

  // Cache HTML for multiple tests to avoid repeated fetches
  const getPageHtml = async () => {
    if (!cachedHtml) {
      cachedHtml = await $fetch(RESPONSIVE_IMAGE_PATH)
    }
    return cachedHtml
  }

  describe('HTML Structure Tests', () => {
    it('should render the responsive image page with correct structure', async () => {
      const html = await getPageHtml()

      // Check page structure
      expect(html).toContain('<h1>&lt;AttributeResponsiveImage&gt;</h1>')

      // Check lazy loading setup
      expect(html).toContain('<img')
      expect(html).toContain('class="lazyload"')
      expect(html).toContain('alt="Placeholder"')
    })

    it('should generate responsive srcset with all required sizes', async () => {
      const html = await getPageHtml()
      responsiveImageTestUtils.assertResponsiveSrcset(html, responsiveImageTestUtils.ALL_RESPONSIVE_WIDTHS)
    })

    it('should have optimized image configuration', async () => {
      const html = await getPageHtml()

      // Check image optimizations
      expect(html).toContain('f_webp')
      expect(html).toContain('q_60')
      expect(html).toContain('/_ipx/')
    })

    it('should have proper lazy loading attributes', async () => {
      const html = await getPageHtml()

      // Check lazy loading attributes
      expect(html).toContain('sizes="auto"')
      responsiveImageTestUtils.assertDataAttributes(html, {
        'aspectratio': 'false',
        'parent-fit': 'false',
      })
    })

    it('should reference the correct test image', async () => {
      const html = await getPageHtml()
      expect(html).toMatch(/data-srcset="[^"]*test\.png[^"]*"/)
    })
  })

  describe('Lazysizes Browser Tests', () => {
    describe.concurrent('Browser Functionality', () => {
      it('should load and display images correctly', async () => {
        const page = await createTestPage(RESPONSIVE_IMAGE_PATH)

        try {
          const img = await responsiveImageTestUtils.getImageElement(page)

          // Check alt text
          const alt = await img.getAttribute('alt')
          expect(alt).toBe('Placeholder')

          // Check data-srcset content
          const dataSrcset = await img.getAttribute('data-srcset')
          expect(dataSrcset).toBeTruthy()
          const expectedContent = ['test.png', 'f_webp', '320w', '640w', '1280w', 'q_60']
          expectedContent.forEach((content) => {
            expect(dataSrcset).toContain(content)
          })

          // Check sizes attribute is processed by lazysizes
          const sizes = await img.getAttribute('sizes')
          expect(sizes).toMatch(/^\d+px$/)

          // Check data attributes
          responsiveImageTestUtils.assertDataAttributes(await page.content(), {
            'aspectratio': 'false',
            'parent-fit': 'false',
          })
        }
        finally {
          await page.close()
        }
      })

      it('should process images with lazysizes correctly', async () => {
        const page = await createTestPage(RESPONSIVE_IMAGE_PATH)

        try {
          const img = await responsiveImageTestUtils.getImageElement(page)
          await page.waitForTimeout(1000) // Wait for lazysizes processing

          const srcset = await img.getAttribute('srcset')
          const src = await img.getAttribute('src')
          expect(srcset || src).toBeTruthy()
        }
        finally {
          await page.close()
        }
      })
    })

    describe('Viewport Responsive Loading', () => {
      it.concurrent.each(responsiveImageTestUtils.VIEWPORT_TEST_CASES)(
        'should load correct image size for $description',
        async (testCase) => {
          const page = await createTestPage(RESPONSIVE_IMAGE_PATH, {
            width: testCase.width,
            height: testCase.height,
          })

          try {
            await responsiveImageTestUtils.verifyLoadedImageWidth(page, testCase.expectedImageWidth)
          }
          finally {
            await page.close()
          }
        },
      )

      it('should load correct image sizes across all viewports concurrently', async () => {
        await runConcurrentViewportTests(
          RESPONSIVE_IMAGE_PATH,
          responsiveImageTestUtils.VIEWPORT_TEST_CASES,
          async (page, testCase) => {
            await responsiveImageTestUtils.verifyLoadedImageWidth(page, testCase.expectedImageWidth)

            // Check alt text directly
            const img = await responsiveImageTestUtils.getImageElement(page)
            const alt = await img.getAttribute('alt')
            expect(alt).toBe('Placeholder')
          },
        )
      })
    })
  })
})
