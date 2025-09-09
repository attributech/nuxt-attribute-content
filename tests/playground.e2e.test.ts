import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Playground E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the index page as navigation hub', async () => {
    const html = await $fetch('/')

    // Check that the page renders
    expect(html).toContain('Nuxt Attribute Content - Playground')
    expect(html).toContain('Explore the different components and features')
  })

  it('should display navigation links to feature pages', async () => {
    const html = await $fetch('/')

    // Check that navigation links are present
    expect(html).toContain('href="/icon"')
    expect(html).toContain('href="/responsive-image"')
    expect(html).toContain('href="/title"')
    expect(html).toContain('href="/menu-items"')
    expect(html).toContain('href="/rendered-markdown"')
  })

  it('should display feature descriptions', async () => {
    const html = await $fetch('/')

    // Check that feature descriptions are present
    expect(html).toContain('AttributeIcon')
    expect(html).toContain('AttributeResponsiveImage')
    expect(html).toContain('Title Components')
    expect(html).toContain('useMenuItems()')
    expect(html).toContain('useRenderedMarkdown()')
  })

  it('should render the icon page', async () => {
    const html = await $fetch('/icon')

    // Check that the icon page renders with correct heading
    expect(html).toContain('&lt;AttributeIcon&gt;')

    // Check that AttributeIcon components are rendered
    expect(html).toContain('icon--arrow-left')
    expect(html).toContain('icon--arrow-right')
  })

  it('should render the title page', async () => {
    const html = await $fetch('/title')

    // Check that the page renders with correct heading
    expect(html).toContain('&lt;BlockTitle&gt;')

    // Check that title components are rendered with correct heading levels
    expect(html).toContain('<h1 class="title title--level-1">Heading 1</h1>')
    expect(html).toContain('<h2 class="title title--level-2">Heading 2</h2>')
    expect(html).toContain('<h3 class="title title--level-3">Heading 3</h3>')
  })

  it('should render the menu-items page', async () => {
    const html = await $fetch('/menu-items')

    // Check that the page renders with correct heading
    expect(html).toContain('useMenuItems()')

    // Check that menu items are rendered if they exist
    expect(html).toContain('Main Menu Items')
  })

  it('should render the rendered-markdown page', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that the page renders with correct heading
    expect(html).toContain('useRenderedMarkdown()')

    // Check that markdown sections are present
    expect(html).toContain('Rendered Markdown from Content')
    expect(html).toContain('Custom Markdown Example')
  })
})
