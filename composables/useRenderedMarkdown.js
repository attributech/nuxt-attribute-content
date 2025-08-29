import { useNuxtApp } from '#app'

export default function () {
  function renderedMarkdown(text) {
    // @TODO This hack can be removed once this has been merged:
    // https://github.com/nuxt/content/pull/3320
    let cleanedText = text
    cleanedText = cleanedText.replaceAll('\\n', '\n')
    return useNuxtApp().$mdit.render(cleanedText)
  }
  return {
    renderedMarkdown,
  }
}
