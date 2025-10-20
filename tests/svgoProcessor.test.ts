import { describe, it, expect } from 'vitest'
import { svgoProcessor } from '../utils/svgoProcessor'

describe('svgoProcessor', () => {
  describe('valid SVG optimization', () => {
    it('should optimize a valid SVG string', () => {
      const unoptimizedSvg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="80" height="80" fill="red" />
  <!-- This is a comment that should be removed -->
</svg>`

      const mockSpriteObject = {
        innerHTML: unoptimizedSvg,
        toString() {
          return unoptimizedSvg
        },
      }

      const processor = svgoProcessor()
      processor(mockSpriteObject)

      // Verify the SVG was optimized (comments should be removed, and only innerHTML is stored)
      expect(mockSpriteObject.innerHTML).toBeTruthy()
      expect(mockSpriteObject.innerHTML.length).toBeLessThan(unoptimizedSvg.length)
      expect(mockSpriteObject.innerHTML).not.toContain('<!--')
      // After optimization, innerHTML contains only the inner contents (no <svg> tags)
      expect(mockSpriteObject.innerHTML).not.toContain('<svg')
      expect(mockSpriteObject.innerHTML).not.toContain('</svg>')
    })

    it('should maintain valid SVG structure', () => {
      const validSvg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/></svg>'

      const mockSpriteObject = {
        innerHTML: validSvg,
        toString() {
          return validSvg
        },
      }

      const processor = svgoProcessor()
      processor(mockSpriteObject)

      // Should still contain the circle element (innerHTML is just the inner content)
      expect(mockSpriteObject.innerHTML).toContain('<circle')
      expect(mockSpriteObject.innerHTML).toBeTruthy()
    })

    it('should apply multipass optimization', () => {
      const svgWithRedundancy = `<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px">
  <g>
    <g>
      <rect x="0" y="0" width="100" height="100" fill="#ff0000"/>
    </g>
  </g>
</svg>`

      const mockSpriteObject = {
        innerHTML: svgWithRedundancy,
        toString() {
          return svgWithRedundancy
        },
      }

      const processor = svgoProcessor()
      processor(mockSpriteObject)

      // Multipass should remove nested empty groups and optimize units
      expect(mockSpriteObject.innerHTML.length).toBeLessThan(svgWithRedundancy.length)
      // Check that basic optimization occurred
      expect(mockSpriteObject.innerHTML).toBeTruthy()
    })

    it('should produce deterministic output', () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50"/></svg>'

      const mockSpriteObject1 = {
        innerHTML: svg,
        toString() {
          return svg
        },
      }
      const mockSpriteObject2 = {
        innerHTML: svg,
        toString() {
          return svg
        },
      }

      const processor1 = svgoProcessor()
      const processor2 = svgoProcessor()

      processor1(mockSpriteObject1)
      processor2(mockSpriteObject2)

      expect(mockSpriteObject1.innerHTML).toBe(mockSpriteObject2.innerHTML)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string input', () => {
      const mockSpriteObject = {
        innerHTML: '',
        toString() {
          return ''
        },
      }

      const processor = svgoProcessor()

      expect(() => {
        processor(mockSpriteObject)
      }).not.toThrow()

      // innerHTML should remain empty or be set to empty
      expect(mockSpriteObject.innerHTML).toBeDefined()
    })

    it('should throw error for invalid SVG input', () => {
      const mockSpriteObject = {
        innerHTML: 'not valid svg at all',
        toString() {
          return 'not valid svg at all'
        },
      }

      const processor = svgoProcessor()

      // SVGO throws an error for invalid SVG
      expect(() => {
        processor(mockSpriteObject)
      }).toThrow()
    })

    it('should handle minimal SVG', () => {
      const minimalSvg = '<svg></svg>'
      const mockSpriteObject = {
        innerHTML: minimalSvg,
        toString() {
          return minimalSvg
        },
      }

      const processor = svgoProcessor()
      processor(mockSpriteObject)

      // innerHTML will be empty string since there's no content inside the svg
      expect(mockSpriteObject.innerHTML).toBeDefined()
    })
  })

  describe('processor integration', () => {
    it('should return a function that accepts a sprite object', () => {
      const processor = svgoProcessor()

      expect(typeof processor).toBe('function')
    })

    it('should modify sprite.innerHTML property', () => {
      const originalSvg = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="blue"/></svg>'
      const mockSpriteObject = {
        innerHTML: originalSvg,
        toString() {
          return originalSvg
        },
      }

      const processor = svgoProcessor()
      processor(mockSpriteObject)

      // innerHTML should be modified to contain only inner content
      expect(mockSpriteObject.innerHTML).not.toBe(originalSvg)
      expect(mockSpriteObject.innerHTML).toBeTruthy()
    })

    it('should work with sprite objects containing additional properties', () => {
      const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50"/></svg>'
      const mockSpriteObject = {
        innerHTML: svgContent,
        toString() {
          return svgContent
        },
        id: 'test-icon',
        metadata: { name: 'test' },
      }

      const processor = svgoProcessor()
      processor(mockSpriteObject)

      // Should process innerHTML without affecting other properties
      expect(mockSpriteObject.innerHTML).toBeTruthy()
      expect(mockSpriteObject.id).toBe('test-icon')
      expect(mockSpriteObject.metadata).toEqual({ name: 'test' })
    })

    it('should be chainable with other processors', () => {
      const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect/></svg>'
      const mockSpriteObject = {
        innerHTML: svgContent,
        toString() {
          return this.innerHTML
        },
      }

      // Simulate chaining with another processor
      const processor1 = svgoProcessor()
      const processor2 = () => (sprite: { innerHTML: string }) => {
        sprite.innerHTML = sprite.innerHTML.replace(/width="[^"]*"/, '')
      }

      processor1(mockSpriteObject)
      const result1 = mockSpriteObject.innerHTML

      processor2()(mockSpriteObject)
      const result2 = mockSpriteObject.innerHTML

      // Both processors should have executed
      expect(result1).toBeTruthy()
      expect(result2).not.toContain('width=')
    })
  })

  describe('multipass optimization verification', () => {
    it('should enable multipass option', () => {
      const svgWithMultipleOptimizationOpportunities = `<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad">
      <stop offset="0%" stop-color="red"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>
  <g transform="translate(0,0)">
    <rect x="0" y="0" width="100" height="100" fill="url(#grad)"/>
  </g>
</svg>`

      const mockSpriteObject = {
        innerHTML: svgWithMultipleOptimizationOpportunities,
        toString() {
          return svgWithMultipleOptimizationOpportunities
        },
      }

      const processor = svgoProcessor()
      processor(mockSpriteObject)

      // Multipass should have removed identity transform and optimized structure
      expect(mockSpriteObject.innerHTML.length).toBeLessThan(
        svgWithMultipleOptimizationOpportunities.length,
      )
      expect(mockSpriteObject.innerHTML).toBeTruthy()
    })
  })
})
