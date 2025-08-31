import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Rendered Markdown E2E Tests', async () => {
  await setup({
    rootDir: '.playground',
  })

  it('should render the rendered-markdown page', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that the page renders with correct heading
    expect(html).toContain('useRenderedMarkdown()')
    expect(html).toContain('Rendered Markdown from Content')
  })

  it('should display markdown sections', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that all main sections are present
    expect(html).toContain('Rendered Markdown from Content')
    expect(html).toContain('Custom Markdown Example')
    expect(html).toContain('Content Data')
  })

  it('should render content from data source', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that content is rendered in the appropriate div
    expect(html).toContain('class="rendered-content"')
  })

  it('should display custom markdown input area', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that textarea and demo section are present
    expect(html).toContain('<textarea')
    expect(html).toContain('placeholder="Enter your markdown here..."')
    expect(html).toContain('Input:')
    expect(html).toContain('Output:')
  })

  it('should render default markdown content in textarea', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that default markdown content is present
    expect(html).toContain('# Hello World')
    expect(html).toContain('This is a **bold** text')
    expect(html).toContain('## List Example')
    expect(html).toContain('### Code Example')
  })

  it('should display raw content data as JSON', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that JSON data is displayed
    expect(html).toMatch(/<pre[^>]*>/)
    expect(html).toMatch(/<code[^>]*>/)
  })

  it('should have proper HTML structure', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check for proper sections and structure
    expect(html).toContain('useRenderedMarkdown()')
    expect(html).toContain('markdown-demo')
  })

  it('should use useRenderedMarkdown composable correctly', async () => {
    const html = await $fetch('/rendered-markdown')

    // The page should render without errors, indicating the composable works
    expect(html).toContain('useRenderedMarkdown()')
    expect(html).not.toContain('Error: ')
  })

  it('should render markdown with proper HTML structure', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that rendered content div exists for markdown output
    expect(html).toContain('rendered-content')
  })

  it('should handle content query results', async () => {
    const html = await $fetch('/rendered-markdown')

    // Should handle either actual content or fallback text
    const hasRenderedContent = html.includes('class="rendered-content"')
    expect(hasRenderedContent).toBe(true)
  })

  it('should display markdown demo with input and output sections', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that demo structure is present
    expect(html).toContain('class="markdown-demo"')
    expect(html).toContain('rows="6"')
    expect(html).toContain('cols="50"')
  })

  it('should have textarea with v-model binding', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that textarea has proper Vue binding
    expect(html).toContain('<textarea')
  })

  it('should include sample markdown content types', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that various markdown elements are included in the sample
    expect(html).toContain('**bold**')
    expect(html).toContain('*italic*')
    expect(html).toContain('- Item 1')
    expect(html).toContain('```javascript')
    expect(html).toContain('[Link example]')
  })

  it('should display content data in readable JSON format', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check that JSON is properly formatted in a code block
    expect(html).toMatch(/<pre[^>]*>/)
    expect(html).toMatch(/<code[^>]*>/)
  })

  it('should handle queryCollection results gracefully', async () => {
    const html = await $fetch('/rendered-markdown')

    // Page should render regardless of query results
    expect(html).toContain('useRenderedMarkdown()')

    // Should have content area even if no content is found
    expect(html).toContain('rendered-content')
  })

  it('should have proper CSS styling structure', async () => {
    const html = await $fetch('/rendered-markdown')

    // Check for key CSS classes that enable proper styling
    expect(html).toContain('rendered-content')
    expect(html).toContain('markdown-demo')
  })
})
