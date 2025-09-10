import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { setupE2ETests, cleanupSharedPageCache } from './utils'

describe('Rendered Markdown E2E Tests', async () => {
  await setupE2ETests()

  const MARKDOWN_PAGE_PATH = '/rendered-markdown'
  let cachedHtml: string

  afterAll(async () => {
    await cleanupSharedPageCache()
  })

  // Cache HTML for multiple tests to avoid repeated fetches
  const getPageHtml = async () => {
    if (!cachedHtml) {
      cachedHtml = await $fetch(MARKDOWN_PAGE_PATH)
    }
    return cachedHtml
  }

  describe.concurrent('HTML Structure and Content Tests', () => {
    it('should render the rendered-markdown page with correct structure', async () => {
      const html = await getPageHtml()

      // Check that the page renders with correct heading and main sections
      expect(html).toContain('useRenderedMarkdown()')
      expect(html).toContain('Rendered Markdown from Content')
      expect(html).toContain('Custom Markdown Example')
      expect(html).toContain('Content Data')
    })

    it('should display markdown demo with proper input/output structure', async () => {
      const html = await getPageHtml()

      // Check that textarea and demo section are present
      expect(html).toContain('<textarea')
      expect(html).toContain('placeholder="Enter your markdown here..."')
      expect(html).toContain('Input:')
      expect(html).toContain('Output:')
      expect(html).toContain('class="markdown-demo"')
      expect(html).toContain('rows="6"')
      expect(html).toContain('cols="50"')
    })

    it('should render content with proper HTML structure', async () => {
      const html = await getPageHtml()

      // Check for proper sections and structure
      expect(html).toContain('class="rendered-content"')
      expect(html).toContain('rendered-content')
    })

    it('should display sample markdown content with various elements', async () => {
      const html = await getPageHtml()

      // Check that various markdown elements are included in the sample
      const markdownElements = [
        '# Hello World',
        'This is a **bold** text',
        '## List Example',
        '### Code Example',
        '**bold**',
        '*italic*',
        '- Item 1',
        '```javascript',
        '[Link example]'
      ]

      markdownElements.forEach(element => {
        expect(html).toContain(element)
      })
    })

    it('should display raw content data as properly formatted JSON', async () => {
      const html = await getPageHtml()

      // Check that JSON data is displayed in proper format
      expect(html).toMatch(/<pre[^>]*>/)
      expect(html).toMatch(/<code[^>]*>/)
    })

    it('should use useRenderedMarkdown composable without errors', async () => {
      const html = await getPageHtml()

      // The page should render without errors, indicating the composable works
      expect(html).toContain('useRenderedMarkdown()')
      expect(html).not.toContain('Error: ')

      // Should handle content query results gracefully
      expect(html).toContain('rendered-content')
    })
  })
})
