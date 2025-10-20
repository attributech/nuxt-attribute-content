import { defineProcessor } from 'nuxt-svg-icon-sprite/processors'
import { optimize } from 'svgo'
import { parse } from 'node-html-parser'

/**
 * Runs svgo on sprite
 */
export const svgoProcessor = defineProcessor(() => {
  return (sprite) => {
    const result = optimize(sprite.toString(), {
      multipass: true,
    })
    const dom = parse(result.data)
    const optimizedSvg = dom.querySelector('svg')
    const spriteContents = optimizedSvg?.innerHTML
    if (spriteContents !== undefined) {
      sprite.innerHTML = spriteContents
    }
  }
})
