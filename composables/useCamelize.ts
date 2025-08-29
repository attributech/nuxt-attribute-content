export default function useCamelize() {
  /**
   * Converts a dash-separated string to PascalCase
   * @param input - The dash-separated string to convert (e.g., "hello-world")
   * @returns The PascalCase string (e.g., "HelloWorld")
   * @example
   * toPascalCase("hello-world") // returns "HelloWorld"
   * toPascalCase("my-component-name") // returns "MyComponentName"
   */
  function toPascalCase(input: string): string {
    // Handle edge cases
    if (!input || typeof input !== 'string') {
      return ''
    }

    // Split the string at dash characters and filter out empty parts
    const wordParts = input.split('-').filter(part => part.length > 0)

    // Convert each word: first character to uppercase, rest to lowercase
    const pascalCaseWords = wordParts.map(capitalizeFirstLetter)

    // Join all words together
    return pascalCaseWords.join('')
  }

  /**
   * Capitalizes the first letter of a word and keeps the rest as-is
   * @param word - The word to capitalize
   * @returns The word with first letter capitalized
   */
  function capitalizeFirstLetter(word: string): string {
    if (word.length === 0) {
      return ''
    }

    const firstCharacter = word[0]?.toUpperCase() ?? ''
    const remainingCharacters = word.substring(1)

    return firstCharacter + remainingCharacters
  }

  // Keep the original name for backward compatibility
  const camelize = toPascalCase

  return {
    camelize,
    toPascalCase,
    capitalizeFirstLetter,
  }
}
