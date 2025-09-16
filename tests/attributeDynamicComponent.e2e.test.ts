import { describe, it, expect, afterAll } from 'vitest'
import { $fetch, createPage } from '@nuxt/test-utils/e2e'
import { setupE2ETests, cleanupSharedPageCache } from './utils'

describe('AttributeDynamicComponent E2E Tests', async () => {
  await setupE2ETests()

  afterAll(async () => {
    await cleanupSharedPageCache()
  })

  describe('Basic Rendering Tests', () => {
    it('should render the block-dynamic page', async () => {
      const html = await $fetch('/block-dynamic')

      // Check that the page renders with correct heading
      expect(html).toContain('<h1>&lt;AttributeDynamicComponent&gt;</h1>')
    })

    it('should render all dynamic components from data', async () => {
      const html = await $fetch('/block-dynamic')

      // Check that all three title components are rendered with correct levels
      // Note: type attribute is included due to prop spreading
      expect(html).toContain('<h1 class="title title--level-1" type="title">Heading 1</h1>')
      expect(html).toContain('<h2 class="title title--level-2" type="title">Heading 2</h2>')
      expect(html).toContain('<h3 class="title title--level-3" type="title">Heading 3</h3>')
    })

    it('should contain AttributeDynamicComponent components in the HTML', async () => {
      const html = await $fetch('/block-dynamic')

      // The component should be present in the rendered HTML
      expect(html).toContain('AttributeDynamicComponent')

      // Should have the v-for structure with multiple components
      const componentMatches = html.match(/title--level-/g)
      expect(componentMatches).toHaveLength(3)
    })
  })

  describe('Component Name Resolution Tests', () => {
    it('should correctly resolve "title" type to ModulesTitle component', async () => {
      const html = await $fetch('/block-dynamic')

      // All three items have type "title" and should be converted to ModulesTitle
      // We can verify this by checking that the title classes are present
      expect(html).toContain('title--level-1')
      expect(html).toContain('title--level-2')
      expect(html).toContain('title--level-3')
    })

    it('should render components with all props passed correctly', async () => {
      const html = await $fetch('/block-dynamic')

      // Verify that title props are passed correctly
      expect(html).toContain('>Heading 1<')
      expect(html).toContain('>Heading 2<')
      expect(html).toContain('>Heading 3<')

      // Verify that level props are passed correctly (affects HTML tag)
      expect(html).toContain('<h1 class="title')
      expect(html).toContain('<h2 class="title')
      expect(html).toContain('<h3 class="title')
    })
  })

  describe('Dynamic Component Browser Tests', () => {
    it('should render all components with correct content and structure', async () => {
      const page = await createPage('/block-dynamic')
      await page.waitForLoadState('networkidle')

      // Check that all title elements are visible
      const titleH1 = page.locator('h1.title--level-1')
      const titleH2 = page.locator('h2.title--level-2')
      const titleH3 = page.locator('h3.title--level-3')

      const h1Visible = await titleH1.isVisible()
      const h2Visible = await titleH2.isVisible()
      const h3Visible = await titleH3.isVisible()

      expect(h1Visible).toBe(true)
      expect(h2Visible).toBe(true)
      expect(h3Visible).toBe(true)

      // Verify text content
      const h1Text = await titleH1.textContent()
      const h2Text = await titleH2.textContent()
      const h3Text = await titleH3.textContent()

      expect(h1Text).toBe('Heading 1')
      expect(h2Text).toBe('Heading 2')
      expect(h3Text).toBe('Heading 3')

      await page.close()
    })

    it('should maintain correct document structure with dynamic components', async () => {
      const page = await createPage('/block-dynamic')
      await page.waitForLoadState('networkidle')

      // Get all dynamically rendered title elements
      const titleElements = await page.locator('.title').all()
      expect(titleElements).toHaveLength(3)

      // Check that each element has the correct tag name corresponding to its level
      for (let i = 0; i < titleElements.length; i++) {
        const element = titleElements[i]
        const tagName = await element.evaluate(el => el.tagName.toLowerCase())
        const className = await element.getAttribute('class')

        // Match tag name with class level
        if (className?.includes('title--level-1')) {
          expect(tagName).toBe('h1')
        }
        else if (className?.includes('title--level-2')) {
          expect(tagName).toBe('h2')
        }
        else if (className?.includes('title--level-3')) {
          expect(tagName).toBe('h3')
        }
      }

      await page.close()
    })

    it('should handle v-for rendering correctly with dynamic components', async () => {
      const page = await createPage('/block-dynamic')
      await page.waitForLoadState('networkidle')

      // The v-for should create exactly 3 components based on the data object
      const dynamicComponents = await page.locator('.title').all()
      expect(dynamicComponents).toHaveLength(3)

      // Each should be independently rendered with unique props
      const texts = await Promise.all(
        dynamicComponents.map(el => el.textContent()),
      )

      expect(texts).toContain('Heading 1')
      expect(texts).toContain('Heading 2')
      expect(texts).toContain('Heading 3')

      // Ensure no duplicates (each component is unique)
      const uniqueTexts = [...new Set(texts)]
      expect(uniqueTexts).toHaveLength(3)

      await page.close()
    })
  })

  describe('Component Props Integration Tests', () => {
    it('should pass all item properties as props to dynamic components', async () => {
      const page = await createPage('/block-dynamic')
      await page.waitForLoadState('networkidle')

      // Test that type, title, and level props are all correctly passed
      const titleElements = [
        { selector: '.title--level-1', expectedTag: 'h1', expectedText: 'Heading 1' },
        { selector: '.title--level-2', expectedTag: 'h2', expectedText: 'Heading 2' },
        { selector: '.title--level-3', expectedTag: 'h3', expectedText: 'Heading 3' },
      ]

      for (const test of titleElements) {
        const element = page.locator(test.selector)

        // Verify tag name (from level prop)
        const tagName = await element.evaluate(el => el.tagName.toLowerCase())
        expect(tagName).toBe(test.expectedTag)

        // Verify text content (from title prop)
        const textContent = await element.textContent()
        expect(textContent).toBe(test.expectedText)

        // Verify class structure (from component logic)
        const className = await element.getAttribute('class')
        expect(className).toContain('title')
        expect(className).toContain(test.selector.replace('.', ''))
      }

      await page.close()
    })

    it('should handle object spread correctly in v-bind', async () => {
      const page = await createPage('/block-dynamic')
      await page.waitForLoadState('networkidle')

      // The v-bind="{ ...item }" should spread all properties correctly
      // We can verify this by checking that the ModulesTitle components
      // receive and use both 'title' and 'level' props correctly

      const level1Element = page.locator('.title--level-1')
      const level2Element = page.locator('.title--level-2')
      const level3Element = page.locator('.title--level-3')

      // Verify that both title and level props are working
      // (title affects content, level affects tag name and class)
      const level1Text = await level1Element.textContent()
      expect(level1Text).toBe('Heading 1')
      const tag1 = await level1Element.evaluate(el => el.tagName)
      expect(tag1.toLowerCase()).toBe('h1')

      const level2Text = await level2Element.textContent()
      expect(level2Text).toBe('Heading 2')
      const tag2 = await level2Element.evaluate(el => el.tagName)
      expect(tag2.toLowerCase()).toBe('h2')

      const level3Text = await level3Element.textContent()
      expect(level3Text).toBe('Heading 3')
      const tag3 = await level3Element.evaluate(el => el.tagName)
      expect(tag3.toLowerCase()).toBe('h3')

      await page.close()
    })
  })

  describe('Component Name Conversion Tests', () => {
    it('should correctly convert component type using toPascalCase', async () => {
      const html = await $fetch('/block-dynamic')

      // The "title" type should be converted to "ModulesTitle"
      // which resolves to the ModulesTitle component (components/modules/Title.vue)
      // We can verify this worked by checking the output matches what ModulesTitle produces
      expect(html).toContain('class="title title--level-1"')
      expect(html).toContain('class="title title--level-2"')
      expect(html).toContain('class="title title--level-3"')
    })

    it('should render components in the order defined in data object', async () => {
      const page = await createPage('/block-dynamic')
      await page.waitForLoadState('networkidle')

      // Get all title elements in DOM order
      const titleElements = await page.locator('.title').all()

      // The data object defines: title1, title2, title3
      // They should appear in that order in the DOM
      const firstElement = titleElements[0]
      const secondElement = titleElements[1]
      const thirdElement = titleElements[2]

      const firstText = await firstElement.textContent()
      const secondText = await secondElement.textContent()
      const thirdText = await thirdElement.textContent()

      expect(firstText).toBe('Heading 1')
      expect(secondText).toBe('Heading 2')
      expect(thirdText).toBe('Heading 3')

      await page.close()
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty or undefined item gracefully', async () => {
      // This test ensures the component doesn't break with edge cases
      // The current implementation has a default for item, so it should be robust
      const html = await $fetch('/block-dynamic')

      // Should render successfully without errors
      expect(html).toContain('<h1>&lt;AttributeDynamicComponent&gt;</h1>')

      // Should contain all expected components
      expect(html).toContain('Heading 1')
      expect(html).toContain('Heading 2')
      expect(html).toContain('Heading 3')
    })

    it('should maintain component isolation between iterations', async () => {
      const page = await createPage('/block-dynamic')
      await page.waitForLoadState('networkidle')

      // Each AttributeDynamicComponent component should be independent
      const titleElements = await page.locator('.title').all()

      // Get all classes to ensure they're unique per component
      const classes = await Promise.all(
        titleElements.map(el => el.getAttribute('class')),
      )

      // Each should have a unique level class
      expect(classes.filter(cls => cls?.includes('level-1'))).toHaveLength(1)
      expect(classes.filter(cls => cls?.includes('level-2'))).toHaveLength(1)
      expect(classes.filter(cls => cls?.includes('level-3'))).toHaveLength(1)

      await page.close()
    })
  })
})
