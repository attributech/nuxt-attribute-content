import { describe, it, expect } from 'vitest'
import useCamelize from '../composables/useCamelize'

describe('useCamelize', () => {
  const { camelize, toPascalCase, capitalizeFirstLetter } = useCamelize()

  describe('toPascalCase', () => {
    it('should convert dash-separated string to PascalCase', () => {
      expect(toPascalCase('hello-world')).toBe('HelloWorld')
      expect(toPascalCase('my-component-name')).toBe('MyComponentName')
      expect(toPascalCase('test-case')).toBe('TestCase')
    })

    it('should handle single words', () => {
      expect(toPascalCase('hello')).toBe('Hello')
      expect(toPascalCase('test')).toBe('Test')
    })

    it('should handle multiple consecutive dashes', () => {
      expect(toPascalCase('hello--world')).toBe('HelloWorld')
      expect(toPascalCase('test---case')).toBe('TestCase')
    })

    it('should handle leading and trailing dashes', () => {
      expect(toPascalCase('-hello-world')).toBe('HelloWorld')
      expect(toPascalCase('hello-world-')).toBe('HelloWorld')
      expect(toPascalCase('-hello-world-')).toBe('HelloWorld')
    })

    it('should handle edge cases', () => {
      expect(toPascalCase('')).toBe('')
      expect(toPascalCase('-')).toBe('')
      expect(toPascalCase('--')).toBe('')
    })

    it('should handle non-string inputs gracefully', () => {
      // @ts-expect-error Testing runtime behavior with null
      expect(toPascalCase(null)).toBe('')
      // @ts-expect-error Testing runtime behavior with undefined
      expect(toPascalCase(undefined)).toBe('')
      // @ts-expect-error Testing runtime behavior with number
      expect(toPascalCase(123)).toBe('')
    })
  })

  describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter of a word', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello')
      expect(capitalizeFirstLetter('world')).toBe('World')
      expect(capitalizeFirstLetter('test')).toBe('Test')
    })

    it('should handle single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A')
      expect(capitalizeFirstLetter('z')).toBe('Z')
    })

    it('should handle empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('')
    })

    it('should preserve rest of the word', () => {
      expect(capitalizeFirstLetter('helloWORLD')).toBe('HelloWORLD')
      expect(capitalizeFirstLetter('tEST')).toBe('TEST')
    })
  })

  describe('camelize (backward compatibility)', () => {
    it('should work the same as toPascalCase', () => {
      expect(camelize('hello-world')).toBe('HelloWorld')
      expect(camelize('my-component-name')).toBe('MyComponentName')
      expect(camelize).toBe(toPascalCase)
    })
  })
})
