import { defineProcessor } from 'nuxt-svg-icon-sprite/processors'
import { optimize } from 'svgo'
import { parse } from 'node-html-parser'

/**
 * Runs svgo on svg
 */
export const svgoProcessor = defineProcessor(() => {
  return (svg) => {
    const result = optimize(svg.toString(), {
      multipass: true,
    })
    const dom = parse(result.data)
    const optimizedSvg = dom.querySelector('svg')
    const svgContents = optimizedSvg?.innerHTML
    if (svgContents !== undefined) {
      svg.innerHTML = svgContents
    }
  }
})
