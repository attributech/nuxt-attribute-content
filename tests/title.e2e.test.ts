import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

describe('Title Components E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the title page', async () => {
    const html = await $fetch('/title')

    // Check that the page renders with correct heading
    expect(html).toContain('<h1>&lt;ModulesTitle&gt;</h1>')
  })

  it('should render all three title components with correct heading levels', async () => {
    const html = await $fetch('/title')

    // Check that all heading levels are rendered
    expect(html).toContain('<h1 class="title title--level-1">Heading 1</h1>')
    expect(html).toContain('<h2 class="title title--level-2">Heading 2</h2>')
    expect(html).toContain('<h3 class="title title--level-3">Heading 3</h3>')
  })

  describe('Title Component Browser Tests', () => {
    it('should have correct text content for each title', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // Check title texts - we need to find the ones with our specific classes
      const titleH1 = page.locator('h1.title--level-1')
      const titleH2 = page.locator('h2.title--level-2')
      const titleH3 = page.locator('h3.title--level-3')

      const h1Text = await titleH1.textContent()
      const h2Text = await titleH2.textContent()
      const h3Text = await titleH3.textContent()

      expect(h1Text).toBe('Heading 1')
      expect(h2Text).toBe('Heading 2')
      expect(h3Text).toBe('Heading 3')

      await page.close()
    })

    it('should have correct CSS classes applied', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      const titleH1 = page.locator('h1.title--level-1')
      const titleH2 = page.locator('h2.title--level-2')
      const titleH3 = page.locator('h3.title--level-3')

      // Check that elements exist with the correct classes
      const h1Visible = await titleH1.isVisible()
      const h2Visible = await titleH2.isVisible()
      const h3Visible = await titleH3.isVisible()

      expect(h1Visible).toBe(true)
      expect(h2Visible).toBe(true)
      expect(h3Visible).toBe(true)

      // Check that base title class is also present
      const h1Class = await titleH1.getAttribute('class')
      const h2Class = await titleH2.getAttribute('class')
      const h3Class = await titleH3.getAttribute('class')

      expect(h1Class).toContain('title')
      expect(h2Class).toContain('title')
      expect(h3Class).toContain('title')

      await page.close()
    })

    it('should render titles in correct hierarchical order', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // Get all title elements in document order
      const titleElements = await page.locator('h1.title--level-1, h2.title--level-2, h3.title--level-3').all()

      expect(titleElements).toHaveLength(3)

      // Check that they appear in the correct order (h1, then h2, then h3)
      const firstTitle = titleElements[0]
      const secondTitle = titleElements[1]
      const thirdTitle = titleElements[2]

      const firstText = await firstTitle.textContent()
      const secondText = await secondTitle.textContent()
      const thirdText = await thirdTitle.textContent()

      expect(firstText).toBe('Heading 1')
      expect(secondText).toBe('Heading 2')
      expect(thirdText).toBe('Heading 3')

      // Verify tag names
      const firstTagName = await firstTitle.evaluate(el => el.tagName.toLowerCase())
      const secondTagName = await secondTitle.evaluate(el => el.tagName.toLowerCase())
      const thirdTagName = await thirdTitle.evaluate(el => el.tagName.toLowerCase())

      expect(firstTagName).toBe('h1')
      expect(secondTagName).toBe('h2')
      expect(thirdTagName).toBe('h3')

      await page.close()
    })

    it('should handle dynamic level prop correctly', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // Verify that the level prop correctly generates the HTML tag
      const level1Title = page.locator('.title--level-1')
      const level2Title = page.locator('.title--level-2')
      const level3Title = page.locator('.title--level-3')

      const level1TagName = await level1Title.evaluate(el => el.tagName.toLowerCase())
      const level2TagName = await level2Title.evaluate(el => el.tagName.toLowerCase())
      const level3TagName = await level3Title.evaluate(el => el.tagName.toLowerCase())

      expect(level1TagName).toBe('h1')
      expect(level2TagName).toBe('h2')
      expect(level3TagName).toBe('h3')

      await page.close()
    })
  })

  describe('Title Component Integration Tests', () => {
    it('should properly pass props from BlockTitle to ModulesTitle', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // The integration works if we see the correct titles with correct levels
      // This tests the entire prop chain: page data -> BlockTitle -> ModulesTitle

      const titles = [
        { selector: '.title--level-1', expectedText: 'Heading 1', expectedTag: 'h1' },
        { selector: '.title--level-2', expectedText: 'Heading 2', expectedTag: 'h2' },
        { selector: '.title--level-3', expectedText: 'Heading 3', expectedTag: 'h3' },
      ]

      for (const title of titles) {
        const element = page.locator(title.selector)
        const text = await element.textContent()
        expect(text).toBe(title.expectedText)

        const tagName = await element.evaluate(el => el.tagName.toLowerCase())
        expect(tagName).toBe(title.expectedTag)
      }

      await page.close()
    })

    it('should render multiple title instances independently', async () => {
      const page = await createPage('/title')
      await page.waitForLoadState('networkidle')

      // Each BlockTitle should render independently with its own props
      const titleElements = await page.locator('.title').all()
      expect(titleElements).toHaveLength(3)

      // Check that each has unique content and class
      const texts = await Promise.all(titleElements.map(el => el.textContent()))
      const classes = await Promise.all(titleElements.map(el => el.getAttribute('class')))

      expect(texts).toContain('Heading 1')
      expect(texts).toContain('Heading 2')
      expect(texts).toContain('Heading 3')

      expect(classes.some(cls => cls?.includes('title--level-1'))).toBe(true)
      expect(classes.some(cls => cls?.includes('title--level-2'))).toBe(true)
      expect(classes.some(cls => cls?.includes('title--level-3'))).toBe(true)

      await page.close()
    })
  })
})
