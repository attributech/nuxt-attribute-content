import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { setupE2ETests, cleanupSharedPageCache } from './utils'

describe('Menu Items E2E Tests', async () => {
  await setupE2ETests()

  const MENU_PAGE_PATH = '/menu-items'
  let cachedHtml: string

  afterAll(async () => {
    await cleanupSharedPageCache()
  })

  // Cache HTML for multiple tests to avoid repeated fetches
  const getPageHtml = async () => {
    if (!cachedHtml) {
      cachedHtml = await $fetch(MENU_PAGE_PATH)
    }
    return cachedHtml
  }

  describe.concurrent('HTML Structure and Content Tests', () => {
    it('should render the menu-items page with correct structure', async () => {
      const html = await getPageHtml()

      // Check that the page renders with correct heading and sections
      expect(html).toContain('useMenuItems()')
      expect(html).toContain('Main Menu Items')
      expect(html).toContain('Raw Menu Data')
    })

    it('should display menu content correctly', async () => {
      const html = await getPageHtml()

      // Check for menu structure (either items or no items message)
      const hasMenuItems = html.includes('<ul') && html.includes('<li')
      const hasNoItemsMessage = html.includes('No menu items found')

      // One of these should be true
      expect(hasMenuItems || hasNoItemsMessage).toBe(true)

      // If menu items exist, they should have proper link structure
      if (hasMenuItems) {
        expect(html).toContain('<a')
        expect(html).toContain('href=')
      }
    })

    it('should display raw menu data as properly formatted JSON', async () => {
      const html = await getPageHtml()

      // Check that JSON data is displayed in proper format
      expect(html).toMatch(/<pre[^>]*>/)
      expect(html).toMatch(/<code[^>]*>/)
    })

    it('should use useMenuItems composable without errors', async () => {
      const html = await getPageHtml()

      // The page should render without errors, indicating the composable works
      expect(html).toContain('useMenuItems()')
      expect(html).not.toContain('Error:')
      expect(html).not.toContain('TypeError')
    })
  })
})
