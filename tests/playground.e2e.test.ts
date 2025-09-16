import { describe, it, expect, afterAll } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { setupE2ETests, cleanupSharedPageCache } from './utils'

describe('Playground E2E Tests', async () => {
  await setupE2ETests()

  const pageCache = new Map<string, string>()

  afterAll(async () => {
    await cleanupSharedPageCache()
    pageCache.clear()
  })

  // Cache HTML for multiple tests to avoid repeated fetches
  const getCachedHtml = async (path: string) => {
    if (!pageCache.has(path)) {
      const html = await $fetch(path) as string
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

      // Check that all navigation links are present (including new /title link)
      const expectedLinks = [
        'href="/icon"',
        'href="/responsive-image"',
        'href="/title"',
        'href="/menu-items"',
        'href="/rendered-markdown"',
        'href="/block-dynamic"',
      ]

      expectedLinks.forEach((link) => {
        expect(html).toContain(link)
      })
    })

    it('should display feature descriptions for all components', async () => {
      const html = await getCachedHtml('/')

      // Check that feature descriptions are present (including AttributeTitle)
      const expectedFeatures = [
        'AttributeIcon',
        'AttributeResponsiveImage',
        'AttributeTitle',
        'useMenuItems()',
        'useRenderedMarkdown()',
        'AttributeDynamicComponent',
      ]

      expectedFeatures.forEach((feature) => {
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
      expect(html).toContain('icon--arrow-left')
      expect(html).toContain('icon--arrow-right')
    })

    it('should render the title page', async () => {
      const html = await getCachedHtml('/title')

      // Check that the page renders with correct heading
      expect(html).toContain('&lt;AttributeTitle&gt;')

      // Check that title components are rendered with correct heading levels
      expect(html).toContain('<h1>Heading 1</h1>')
      expect(html).toContain('<h2>Heading 2</h2>')
      expect(html).toContain('<h3>Heading 3</h3>')
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
