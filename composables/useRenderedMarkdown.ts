import { useNuxtApp } from 'nuxt/app'

interface MarkdownRenderer {
  render(text: string): string
}

export default function useRenderedMarkdown() {
  /**
   * Renders markdown text to HTML using the Nuxt Content markdown-it instance
   * @param text - The markdown text to render
   * @returns The rendered HTML string
   * @example
   * renderMarkdown("# Hello\nWorld") // returns "<h1>Hello</h1><p>World</p>"
   */
  function renderMarkdown(text: string): string {
    // Handle edge cases
    if (!text || typeof text !== 'string') {
      return ''
    }

    // Clean up escaped newlines
    // @TODO This hack can be removed once this has been merged:
    // https://github.com/nuxt/content/pull/3320
    const cleanedText = text.replaceAll('\\n', '\n')

    // Get the Nuxt app instance and access the markdown-it renderer
    const nuxtApp = useNuxtApp()
    const markdownRenderer = nuxtApp.$mdit as MarkdownRenderer

    // Render the markdown to HTML
    return markdownRenderer.render(cleanedText)
  }

  // Keep the original name for backward compatibility
  const renderedMarkdown = renderMarkdown

  return {
    renderMarkdown,
    renderedMarkdown,
  }
}
