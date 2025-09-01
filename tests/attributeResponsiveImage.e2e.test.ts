import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

describe('AttributeResponsiveImage E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the responsive image page', async () => {
    const html = await $fetch('/responsive-image')

    // Check that the page renders with correct heading
    expect(html).toContain('<h1>&lt;AttributeResponsiveImage&gt;</h1>')
  })

  it('should render img element with lazyload class', async () => {
    const html = await $fetch('/responsive-image')

    // Check that the img element is present with lazyload class
    expect(html).toContain('<img')
    expect(html).toContain('class="lazyload"')
  })

  it('should have correct alt text', async () => {
    const html = await $fetch('/responsive-image')

    // Check that alt attribute is correctly set
    expect(html).toContain('alt="Placeholder"')
  })

  it('should generate responsive srcset with multiple sizes', async () => {
    const html = await $fetch('/responsive-image')

    // Check that data-srcset attribute is present
    expect(html).toContain('data-srcset=')

    // Check for different viewport sizes in srcset
    expect(html).toContain('320w')
    expect(html).toContain('480w')
    expect(html).toContain('640w')
    expect(html).toContain('960w')
    expect(html).toContain('1280w')
    expect(html).toContain('1536w')
    expect(html).toContain('1920w')
  })

  it('should use webp format for optimized images', async () => {
    const html = await $fetch('/responsive-image')

    // Check that webp format is used (HTML encoded as f_webp)
    expect(html).toContain('f_webp')
  })

  it('should apply quality optimization', async () => {
    const html = await $fetch('/responsive-image')

    // Check that quality parameter is set to 60
    expect(html).toContain('q_60')
  })

  it('should use IPX image transformation service', async () => {
    const html = await $fetch('/responsive-image')

    // Check that IPX transformation URLs are used
    expect(html).toContain('/_ipx/')
  })

  it('should have sizes attribute set to auto', async () => {
    const html = await $fetch('/responsive-image')

    // Check that sizes attribute is set to "auto" for lazysizes
    expect(html).toContain('sizes="auto"')
  })

  it('should have data attributes for aspect ratio and parent fit', async () => {
    const html = await $fetch('/responsive-image')

    // Check default values for data attributes
    expect(html).toContain('data-aspectratio="false"')
    expect(html).toContain('data-parent-fit="false"')
  })

  it('should reference the correct test image', async () => {
    const html = await $fetch('/responsive-image')

    // Check that the srcset contains references to test.png
    expect(html).toMatch(/data-srcset="[^"]*test\.png[^"]*"/)
  })

  it('should generate srcset with various widths for different screen sizes', async () => {
    const html = await $fetch('/responsive-image')

    // Check for high resolution variants
    expect(html).toContain('2560w')
    expect(html).toContain('3072w')
    expect(html).toContain('3840w')
    expect(html).toContain('5120w')
    expect(html).toContain('7680w')
  })

  it('should have proper lazy loading attributes', async () => {
    const html = await $fetch('/responsive-image')

    // Check that all necessary attributes for lazy loading are present
    expect(html).toContain('class="lazyload"')
    expect(html).toContain('data-srcset=')
    expect(html).toContain('sizes="auto"')
  })

  describe('Lazysizes Browser Tests', () => {
    it('should load images with lazysizes in browser', async () => {
      const page = await createPage('/responsive-image')

      // Wait for the page to load
      await page.waitForLoadState('networkidle')

      // Check if any img elements exist
      const allImages = await page.locator('img').count()
      expect(allImages).toBeGreaterThan(0)

      // Get the first (and should be only) image
      const img = page.locator('img').first()
      const isVisible = await img.isVisible()
      expect(isVisible).toBe(true)

      // Check that the image has correct alt text
      const alt = await img.getAttribute('alt')
      expect(alt).toBe('Placeholder')

      // Check that the image has data-srcset (from our component)
      const dataSrcset = await img.getAttribute('data-srcset')
      expect(dataSrcset).toBeTruthy()
      expect(dataSrcset).toContain('test.png')

      // Check that sizes attribute is processed by lazysizes (auto -> calculated value)
      const sizes = await img.getAttribute('sizes')
      expect(sizes).toMatch(/^\d+px$/) // Should be a calculated pixel value like "1264px"

      await page.close()
    })

    it('should generate correct srcset after lazy loading', async () => {
      const page = await createPage('/responsive-image')

      // Wait for lazysizes to load and process
      await page.waitForLoadState('networkidle')

      const img = page.locator('img').first()

      // Check the data-srcset attribute which contains the responsive image URLs
      const dataSrcset = await img.getAttribute('data-srcset')
      expect(dataSrcset).toBeTruthy()

      if (dataSrcset) {
        // Check that the data-srcset contains webp format
        expect(dataSrcset).toContain('f_webp')

        // Check that it contains multiple sizes
        expect(dataSrcset).toContain('320w')
        expect(dataSrcset).toContain('640w')
        expect(dataSrcset).toContain('1280w')

        // Check quality parameter
        expect(dataSrcset).toContain('q_60')
      }

      // Wait a bit for lazysizes processing
      await page.waitForTimeout(1000)

      // Check if lazysizes has processed the image by looking for srcset or src
      const srcset = await img.getAttribute('srcset')
      const src = await img.getAttribute('src')

      // Either srcset or src should be populated after lazysizes processing
      expect(srcset || src).toBeTruthy()

      await page.close()
    })

    it('should have correct image attributes after lazy loading', async () => {
      const page = await createPage('/responsive-image')

      await page.waitForLoadState('networkidle')

      const img = page.locator('img').first()

      // Check alt text is preserved
      const alt = await img.getAttribute('alt')
      expect(alt).toBe('Placeholder')

      // Check sizes attribute is processed by lazysizes (auto -> calculated value)
      const sizes = await img.getAttribute('sizes')
      expect(sizes).toMatch(/^\d+px$/) // Should be a calculated pixel value

      // Check that data attributes are preserved
      const aspectRatio = await img.getAttribute('data-aspectratio')
      const parentFit = await img.getAttribute('data-parent-fit')

      expect(aspectRatio).toBe('false')
      expect(parentFit).toBe('false')

      await page.close()
    })

    it('should load lazysizes library correctly', async () => {
      const page = await createPage('/responsive-image')

      await page.waitForLoadState('networkidle')

      // Check if lazysizes is available in the browser
      const lazySizesExists = await page.evaluate(() => {
        return typeof window.lazySizes !== 'undefined'
      })

      expect(lazySizesExists).toBe(true)

      // Check if lazysizes config is set
      const configExists = await page.evaluate(() => {
        return typeof window.lazySizesConfig !== 'undefined'
      })

      expect(configExists).toBe(true)

      // Check specific config values from the plugin
      const configValues = await page.evaluate(() => {
        return {
          expFactor: window.lazySizesConfig?.expFactor,
          loadMode: window.lazySizesConfig?.loadMode,
          loadHidden: window.lazySizesConfig?.loadHidden,
        }
      })

      expect(configValues.expFactor).toBe(10)
      expect(configValues.loadMode).toBe(3)
      expect(configValues.loadHidden).toBe(false)

      await page.close()
    })

    it('should load correct image size at 1920px browser width', async () => {
      const page = await createPage('/responsive-image')

      // Set browser viewport to 1920px width
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const img = page.locator('img').first()
      const currentSrc = await img.evaluate(el => (el as HTMLImageElement).currentSrc)

      // Extract the width from the loaded image URL
      const widthMatch = currentSrc?.match(/w_(\d+)/)
      const loadedWidth = widthMatch && widthMatch[1] ? Number.parseInt(widthMatch[1]) : 0

      // At 1920px viewport, should load exactly the 1920w image
      expect(loadedWidth).toBe(1920)
      expect(currentSrc || '').toContain('f_webp')
      expect(currentSrc || '').toContain('q_60')

      await page.close()
    })

    it('should load correct image size at 720px browser width', async () => {
      const page = await createPage('/responsive-image')

      // Set browser viewport to 720px width
      await page.setViewportSize({ width: 720, height: 1280 })
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      const img = page.locator('img').first()
      const currentSrc = await img.evaluate(el => (el as HTMLImageElement).currentSrc)

      // Extract the width from the loaded image URL
      const widthMatch = currentSrc?.match(/w_(\d+)/)
      const loadedWidth = widthMatch && widthMatch[1] ? Number.parseInt(widthMatch[1]) : 0

      // At 720px viewport, should load exactly the 1280w image
      expect(loadedWidth).toBe(1280)
      expect(currentSrc || '').toContain('f_webp')
      expect(currentSrc || '').toContain('q_60')

      await page.close()
    })
  })
})
