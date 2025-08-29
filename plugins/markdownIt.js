import MarkdownIt from 'markdown-it'
import { defineNuxtPlugin } from '#app'

const markdownIt = new MarkdownIt({
  html: true,
  xhtmlOut: false,
  breaks: true,
  langPrefix: 'language-',
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
})

markdownIt.linkify.set({ fuzzyEmail: false })

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender = markdownIt.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target')
  const relIndex = tokens[idx].attrIndex('rel')

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank'])
  }
  else {
    tokens[idx].attrs[aIndex][1] = '_blank'
  }

  if (relIndex < 0) {
    tokens[idx].attrPush(['rel', 'noopener noreferrer'])
  }
  else {
    tokens[idx].attrs[relIndex][1] = 'noopener noreferrer'
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self)
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('mdit', markdownIt)
})
