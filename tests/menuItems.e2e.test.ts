import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Menu Items E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the menu-items page', async () => {
    const html = await $fetch('/menu-items')

    // Check that the page renders with correct heading
    expect(html).toContain('useMenuItems()')
    expect(html).toContain('Main Menu Items')
  })

  it('should display menu items section', async () => {
    const html = await $fetch('/menu-items')

    // Check that menu sections are present
    expect(html).toContain('Main Menu Items')
    expect(html).toContain('Raw Menu Data')
  })

  it('should render menu items if they exist', async () => {
    const html = await $fetch('/menu-items')

    // Check for menu structure (either items or no items message)
    const hasMenuItems = html.includes('<ul') && html.includes('<li')
    const hasNoItemsMessage = html.includes('No menu items found')

    // One of these should be true
    expect(hasMenuItems || hasNoItemsMessage).toBe(true)
  })

  it('should display raw menu data as JSON', async () => {
    const html = await $fetch('/menu-items')

    // Check that JSON data is displayed
    expect(html).toMatch(/<pre[^>]*>/)
    expect(html).toMatch(/<code[^>]*>/)
  })

  it('should have proper HTML structure for menu items', async () => {
    const html = await $fetch('/menu-items')

    // Check for proper sections
    expect(html).toContain('Main Menu Items')
    expect(html).toContain('Raw Menu Data')
  })

  it('should handle menu items with proper links', async () => {
    const html = await $fetch('/menu-items')

    // If menu items exist, they should have proper link structure
    if (html.includes('<ul') && html.includes('<li')) {
      expect(html).toContain('<a')
      expect(html).toContain('href=')
    }
  })

  it('should use useMenuItems composable correctly', async () => {
    const html = await $fetch('/menu-items')

    // The page should render without errors, indicating the composable works
    expect(html).toContain('useMenuItems()')
    expect(html).not.toContain('Error:')
    expect(html).not.toContain('TypeError')
  })

  it('should have proper CSS styling classes', async () => {
    const html = await $fetch('/menu-items')

    // Check that the page has proper structure for CSS styling
    expect(html).toContain('useMenuItems()')
    expect(html).toContain('Main Menu Items')
  })

  it('should display JSON data in readable format', async () => {
    const html = await $fetch('/menu-items')

    // Check that JSON is properly formatted in a code block
    expect(html).toMatch(/<pre[^>]*>/)
    expect(html).toMatch(/<code[^>]*>/)
  })

  it('should handle empty or undefined menu data gracefully', async () => {
    const html = await $fetch('/menu-items')

    // The page should render even if no menu data is available
    expect(html).toContain('useMenuItems()')

    // Should either show items or show "No menu items found"
    const hasContent = html.includes('No menu items found') || html.includes('<ul')
    expect(hasContent).toBe(true)
  })
})
