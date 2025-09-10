import { describe, it } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { setupE2ETests, createTestPage, runViewportTests, responsiveImageTestUtils } from './utils'

describe('AttributeResponsiveImage E2E Tests', async () => {
  await setupE2ETests({
    browserOptions: {
      type: 'firefox',
    },
  })

  const RESPONSIVE_IMAGE_PATH = '/responsive-image'
  let cachedHtml: string

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

      responsiveImageTestUtils.assertResponsiveImageHeading(html, '<h1>&lt;AttributeResponsiveImage&gt;</h1>')
      responsiveImageTestUtils.assertLazyLoadClass(html)
      responsiveImageTestUtils.assertAltText(html, 'Placeholder')
    })

    it('should generate responsive srcset with all required sizes', async () => {
      const html = await getPageHtml()
      responsiveImageTestUtils.assertResponsiveSrcset(html, responsiveImageTestUtils.ALL_RESPONSIVE_WIDTHS)
    })

    it('should have optimized image configuration', async () => {
      const html = await getPageHtml()

      responsiveImageTestUtils.assertWebpFormat(html)
      responsiveImageTestUtils.assertQuality(html, 60)
      responsiveImageTestUtils.assertIPXTransformation(html)
    })

    it('should have proper lazy loading attributes', async () => {
      const html = await getPageHtml()

      responsiveImageTestUtils.assertSizesAttribute(html, 'auto')
      responsiveImageTestUtils.assertDataAttributes(html, {
        'aspectratio': 'false',
        'parent-fit': 'false',
      })
    })

    it('should reference the correct test image', async () => {
      const html = await getPageHtml()
      responsiveImageTestUtils.assertReferencesImage(html, 'test.png')
    })
  })

  describe('Lazysizes Browser Tests', () => {
    it('should load and display images correctly', async () => {
      const page = await createTestPage(RESPONSIVE_IMAGE_PATH)

      try {
        await responsiveImageTestUtils.verifyAltText(page, 'Placeholder')
        await responsiveImageTestUtils.verifyDataSrcset(page, ['test.png', 'f_webp', '320w', '640w', '1280w', 'q_60'])
        await responsiveImageTestUtils.verifySizesProcessed(page)
        await responsiveImageTestUtils.verifyDataAttributes(page, {
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
        await responsiveImageTestUtils.verifyImageLoaded(page)
      }
      finally {
        await page.close()
      }
    })

    describe('Viewport Responsive Loading', () => {
      responsiveImageTestUtils.VIEWPORT_TEST_CASES.forEach((testCase) => {
        it(`should load correct image size for ${testCase.description}`, async () => {
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
        })
      })
    })

    // Alternative approach using the runViewportTests helper
    it('should load correct image sizes across all viewports', async () => {
      await runViewportTests(
        RESPONSIVE_IMAGE_PATH,
        responsiveImageTestUtils.VIEWPORT_TEST_CASES,
        async (page, testCase) => {
          await responsiveImageTestUtils.verifyLoadedImageWidth(page, testCase.expectedImageWidth)
          await responsiveImageTestUtils.verifyAltText(page, 'Placeholder')
        },
      )
    })
  })
})
