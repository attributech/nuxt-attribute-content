import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

describe('Title Components E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the title page', async () => {
    const html = await $fetch('/title')

    // Check that the page renders with correct heading
    expect(html).toContain('<h1>&lt;AttributeTitle&gt;</h1>')
  })

  it('should render all three title components with correct heading levels', async () => {
    const html = await $fetch('/title')

    // Check that all heading levels are rendered
    expect(html).toContain('<h1>Heading 1</h1>')
    expect(html).toContain('<h2>Heading 2</h2>')
    expect(html).toContain('<h3>Heading 3</h3>')
  })

  describe('Title Component Browser Tests', () => {
    it('should render title components without classes', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // Target specific AttributeTitle components by their content
      const titleH1 = page.getByRole('heading', { name: 'Heading 1' })
      const titleH2 = page.getByRole('heading', { name: 'Heading 2' })
      const titleH3 = page.getByRole('heading', { name: 'Heading 3' })

      // Check that elements exist and are visible
      const h1Visible = await titleH1.isVisible()
      const h2Visible = await titleH2.isVisible()
      const h3Visible = await titleH3.isVisible()

      expect(h1Visible).toBe(true)
      expect(h2Visible).toBe(true)
      expect(h3Visible).toBe(true)

      // Check that they have no CSS classes (simplified structure)
      const h1Class = await titleH1.getAttribute('class')
      const h2Class = await titleH2.getAttribute('class')
      const h3Class = await titleH3.getAttribute('class')

      expect(h1Class).toBeNull()
      expect(h2Class).toBeNull()
      expect(h3Class).toBeNull()

      await page.close()
    })

    it('should render titles in correct hierarchical order', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // Get AttributeTitle components by their specific content
      const heading1 = page.getByRole('heading', { name: 'Heading 1' })
      const heading2 = page.getByRole('heading', { name: 'Heading 2' })
      const heading3 = page.getByRole('heading', { name: 'Heading 3' })

      // Verify they exist and have correct tag names
      expect(await heading1.isVisible()).toBe(true)
      expect(await heading2.isVisible()).toBe(true)
      expect(await heading3.isVisible()).toBe(true)

      const h1TagName = await heading1.evaluate(el => el.tagName.toLowerCase())
      const h2TagName = await heading2.evaluate(el => el.tagName.toLowerCase())
      const h3TagName = await heading3.evaluate(el => el.tagName.toLowerCase())

      expect(h1TagName).toBe('h1')
      expect(h2TagName).toBe('h2')
      expect(h3TagName).toBe('h3')

      await page.close()
    })
  })

  describe('Title Component Integration Tests', () => {
    it('should render multiple title instances independently', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // Each AttributeTitle should render independently with its own props
      const heading1 = page.getByRole('heading', { name: 'Heading 1' })
      const heading2 = page.getByRole('heading', { name: 'Heading 2' })
      const heading3 = page.getByRole('heading', { name: 'Heading 3' })

      // Verify all three AttributeTitle components are rendered
      expect(await heading1.isVisible()).toBe(true)
      expect(await heading2.isVisible()).toBe(true)
      expect(await heading3.isVisible()).toBe(true)

      // Check that each has unique content
      const text1 = await heading1.textContent()
      const text2 = await heading2.textContent()
      const text3 = await heading3.textContent()

      expect(text1).toBe('Heading 1')
      expect(text2).toBe('Heading 2')
      expect(text3).toBe('Heading 3')

      await page.close()
    })
  })
})
