import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Playground E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the index page', async () => {
    const html = await $fetch('/')

    // Check that the page renders
    expect(html).toContain('<main>')
  })

  it('should display icons', async () => {
    const html = await $fetch('/')

    // Check that AttributeIcon components are rendered with correct classes
    expect(html).toContain('icon--arrow-left')
    expect(html).toContain('icon--arrow-right')
  })

  it('should render menu navigation', async () => {
    const html = await $fetch('/')

    // Check that the menu items are rendered
    expect(html).toContain('Home')
    expect(html).toContain('About')
    expect(html).toContain('Contact')

    // Check that menu items have proper HTML structure
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>')
    expect(html).toContain('href="/"')
  })

  it('should process markdown content', async () => {
    const html = await $fetch('/')

    // Check that the markdown content section is rendered
    expect(html).toContain('class="text"')

    // Check that the content from the YAML file is processed
    expect(html).toContain('Lorem')
    expect(html).toContain('Ispum')
    expect(html).toContain('Dolor')
    expect(html).toContain('Amet')
  })
})
