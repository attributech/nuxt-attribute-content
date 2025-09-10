import { describe, it, expect, afterAll } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { setupE2ETests, cleanupSharedPageCache } from './utils'

describe('Playground E2E Tests', async () => {
  await setupE2ETests()

  let pageCache = new Map<string, string>()

  afterAll(async () => {
    await cleanupSharedPageCache()
    pageCache.clear()
  })

  // Cache HTML for multiple tests to avoid repeated fetches
  const getCachedHtml = async (path: string) => {
    if (!pageCache.has(path)) {
      const html = await $fetch(path)
      pageCache.set(path, html)
    }
    return pageCache.get(path)!
  }

  describe.concurrent('Navigation Hub Tests', () => {
    it('should render the index page as navigation hub', async () => {
      const html = await getCachedHtml('/')

      // Check that the page renders with proper navigation structure
      expect(html).toContain('Nuxt Attribute Content - Playground')
      expect(html).toContain('Explore the different components and features')
    })

    it('should display all navigation links to feature pages', async () => {
      const html = await getCachedHtml('/')

      // Check that all navigation links are present
      const expectedLinks = [
        'href="/icon"',
        'href="/responsive-image"',
        'href="/menu-items"',
        'href="/rendered-markdown"'
      ]

      expectedLinks.forEach(link => {
        expect(html).toContain(link)
      })
    })

    it('should display feature descriptions for all components', async () => {
      const html = await getCachedHtml('/')

      // Check that feature descriptions are present
      const expectedFeatures = [
        'AttributeIcon',
        'AttributeResponsiveImage',
        'useMenuItems()',
        'useRenderedMarkdown()'
      ]

      expectedFeatures.forEach(feature => {
        expect(html).toContain(feature)
      })
    })
  })

  describe.concurrent('Feature Page Accessibility Tests', () => {
    it('should render the icon page with core content', async () => {
      const html = await getCachedHtml('/icon')

      // Check essential content without redundant icon testing
      expect(html).toContain('&lt;AttributeIcon&gt;')
      expect(html).toContain('icon--')
    })

    it('should render the menu-items page with core functionality', async () => {
      const html = await getCachedHtml('/menu-items')

      // Check essential functionality
      expect(html).toContain('useMenuItems()')
      expect(html).toContain('Main Menu Items')
    })

    it('should render the rendered-markdown page with core sections', async () => {
      const html = await getCachedHtml('/rendered-markdown')

      // Check essential sections
      expect(html).toContain('useRenderedMarkdown()')
      expect(html).toContain('Rendered Markdown from Content')
      expect(html).toContain('Custom Markdown Example')
    })
  })
})
