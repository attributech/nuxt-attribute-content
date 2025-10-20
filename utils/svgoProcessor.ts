import { defineProcessor } from 'nuxt-svg-icon-sprite/processors'
import { optimize } from 'svgo'

/**
 * Runs svgo on svgs
 */
export const svgoProcessor = defineProcessor(() => {
  return (svg) => {
    const result = optimize(svg.innerHTML, {
      multipass: true,
    })
    svg.innerHTML = result.data
  }
})
