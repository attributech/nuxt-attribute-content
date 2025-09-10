# Test Utils Documentation

This directory contains shared utilities and helpers for e2e testing to eliminate code duplication and improve test maintainability.

## Overview

The refactoring approach focuses on:

1. **Centralized Setup**: Common test setup configurations
2. **Reusable Assertions**: Function-based assertions for common test patterns
3. **Browser Test Helpers**: Simplified page interaction and verification
4. **Parameterized Testing**: Data-driven tests for similar scenarios
5. **Modular Organization**: Separate files for different testing concerns
6. **Performance Optimization**: Concurrent execution and smart resource management

## Files

### Core Files
- `testHelpers.ts` - Core utilities for setup and page management
- `responsiveImageHelpers.ts` - Functions for responsive image testing
- `iconHelpers.ts` - Functions for icon testing
- `index.ts` - Clean exports for easy importing

## Key Components

### Setup Utilities

#### `setupE2ETests(options)`

Centralized setup for all e2e tests with full Playwright setup options support.

```typescript
// Basic setup
await setupE2ETests()

// Setup with specific browser
await setupE2ETests({
  browserOptions: {
    type: 'firefox'
  }
})
```

#### `createTestPage(path, viewport?)`

Create a page with automatic setup and optional viewport configuration.

```typescript
const page = await createTestPage('/responsive-image', { width: 1920, height: 1080 })

// Or use optimized version for better performance
const page = await createOptimizedTestPage('/responsive-image', { width: 1920, height: 1080 })
```

### Assertion Functions

#### Responsive Image Assertions

Namespaced functions for responsive image HTML testing.

```typescript
import { $fetch } from '@nuxt/test-utils/e2e'
import { responsiveImageTestUtils } from './utils'

const html = await $fetch('/my-page')

responsiveImageTestUtils.assertResponsiveImageHeading(html, '<h1>My Page</h1>')
responsiveImageTestUtils.assertLazyLoadClass(html)
responsiveImageTestUtils.assertAltText(html, 'Image alt text')
responsiveImageTestUtils.assertResponsiveSrcset(html, [320, 640, 1280])
responsiveImageTestUtils.assertWebpFormat(html)
responsiveImageTestUtils.assertQuality(html, 60)
```

Available functions:
- `responsiveImageTestUtils.assertResponsiveImageHeading(html, heading)` - Check for page heading
- `responsiveImageTestUtils.assertLazyLoadClass(html)` - Verify lazyload class presence
- `responsiveImageTestUtils.assertAltText(html, altText)` - Check alt attribute
- `responsiveImageTestUtils.assertResponsiveSrcset(html, widths[])` - Verify srcset widths
- `responsiveImageTestUtils.assertWebpFormat(html)` - Check for WebP format
- `responsiveImageTestUtils.assertQuality(html, quality)` - Verify image quality setting
- `responsiveImageTestUtils.assertIPXTransformation(html)` - Check for IPX service usage
- `responsiveImageTestUtils.assertSizesAttribute(html, value)` - Verify sizes attribute
- `responsiveImageTestUtils.assertDataAttributes(html, attributes)` - Check data attributes
- `responsiveImageTestUtils.assertReferencesImage(html, imageName)` - Verify image reference

#### Browser Image Testing Functions

Helper functions for browser-based image testing with Playwright.

```typescript
import { responsiveImageTestUtils } from './utils'

await responsiveImageTestUtils.verifyAltText(page, 'Image alt')
await responsiveImageTestUtils.verifyDataSrcset(page, ['test.png', 'f_webp'])
await responsiveImageTestUtils.verifyLoadedImageWidth(page, 1920)
```

Available functions:
- `responsiveImageTestUtils.getImageElement(page)` - Get the image element locator
- `responsiveImageTestUtils.verifyAltText(page, expectedAlt)` - Check alt text
- `responsiveImageTestUtils.verifyDataSrcset(page, expectedContent[])` - Verify data-srcset content
- `responsiveImageTestUtils.verifySizesProcessed(page)` - Check if sizes attribute is processed
- `responsiveImageTestUtils.verifyDataAttributes(page, attributes)` - Verify data attributes
- `responsiveImageTestUtils.verifyImageLoaded(page)` - Confirm image has loaded
- `responsiveImageTestUtils.verifyLoadedImageWidth(page, width, formats?)` - Check loaded image dimensions

### Parameterized Testing

#### `runViewportTests(path, testCases, testFn)`

Run the same test function across multiple viewport configurations.

```typescript
import { runViewportTests, responsiveImageTestUtils } from './utils'

await runViewportTests(
  '/responsive-image',
  responsiveImageTestUtils.VIEWPORT_TEST_CASES,
  async (page, testCase) => {
    await responsiveImageTestUtils.verifyLoadedImageWidth(page, testCase.expectedImageWidth)
  }
)
```

#### Predefined Test Data

- `responsiveImageTestUtils.ALL_RESPONSIVE_WIDTHS` - All responsive widths used in tests
- `responsiveImageTestUtils.VIEWPORT_TEST_CASES` - Standard viewport test configurations
- `iconTestUtils.ICON_SIZE_CONFIGS` - Icon size test configurations
- `iconTestUtils.COMMON_ICON_NAMES` - Standard icon names for testing

### Performance Optimization Functions

#### Optimized Responsive Image Functions
- `responsiveImageTestUtils.verifyLoadedImageWidthOptimized()` - Faster image width verification
- `runConcurrentViewportTests()` - Parallel viewport testing

#### Optimized Icon Functions  
- `iconTestUtils.verifyIconDimensionsOptimized()` - Faster dimension verification
- `iconTestUtils.verifyConcurrentIconSizes()` - Parallel size verification

## Usage Patterns

### Basic HTML Testing

```typescript
import { $fetch } from '@nuxt/test-utils/e2e'
import { responsiveImageTestUtils } from './utils'

describe('Component Tests', () => {
  let cachedHtml: string
  
  const getPageHtml = async () => {
    if (!cachedHtml) {
      cachedHtml = await $fetch('/my-page')
    }
    return cachedHtml
  }

  it('should have correct structure', async () => {
    const html = await getPageHtml()
    
    responsiveImageTestUtils.assertResponsiveImageHeading(html, 'Expected Heading')
    responsiveImageTestUtils.assertLazyLoadClass(html)
  })
})
```

### Browser Testing

```typescript
import { createTestPage, responsiveImageTestUtils } from './utils'

describe('Browser Tests', () => {
  it('should work in browser', async () => {
    const page = await createTestPage('/my-page')
    
    try {
      await responsiveImageTestUtils.verifyAltText(page, 'Image alt')
      await responsiveImageTestUtils.verifyImageLoaded(page)
    } finally {
      await page.close()
    }
  })
})
```

### Viewport Testing

```typescript
import { createTestPage, responsiveImageTestUtils } from './utils'

describe('Responsive Tests', () => {
  responsiveImageTestUtils.VIEWPORT_TEST_CASES.forEach(testCase => {
    it(`should work at ${testCase.description}`, async () => {
      const page = await createTestPage('/page', {
        width: testCase.width,
        height: testCase.height,
      })
      
      try {
        await responsiveImageTestUtils.verifyLoadedImageWidth(page, testCase.expectedImageWidth)
      } finally {
        await page.close()
      }
    })
  })
})
```

### Concurrent Testing (Performance Optimized)

```typescript
import { responsiveImageTestUtils } from './utils'

describe('Responsive Tests', () => {
  // Concurrent parameterized tests for better performance
  it.concurrent.each(responsiveImageTestUtils.VIEWPORT_TEST_CASES)(
    'should work at $description',
    async (testCase) => {
      const page = await createOptimizedTestPage('/page', {
        width: testCase.width,
        height: testCase.height,
      })
      
      try {
        await responsiveImageTestUtils.verifyLoadedImageWidthOptimized(page, testCase.expectedImageWidth)
      } finally {
        await page.close()
      }
    }
  )

  // Concurrent viewport testing helper
  it('should test all viewports concurrently', async () => {
    await runConcurrentViewportTests(
      '/page',
      responsiveImageTestUtils.VIEWPORT_TEST_CASES,
      async (page, testCase) => {
        await responsiveImageTestUtils.verifyLoadedImageWidthOptimized(page, testCase.expectedImageWidth)
      }
    )
  })
})
```

## Performance Optimizations

### Results Achieved
- **61% faster total test execution** (77s → 30s)
- **51% faster responsive image tests** (55s → 27s)  
- **Viewport tests 7x faster** (15s → 2s for all viewports)
- **Concurrent test execution** where safe

### Optimization Techniques
1. **Concurrent Test Execution**: Using `describe.concurrent()` and `it.concurrent.each()`
2. **Smart Wait Strategies**: Polling instead of fixed timeouts
3. **Parallel Browser Operations**: Multiple operations with `Promise.all()`
4. **Resource Management**: Shared page caching and cleanup
5. **Efficient Page Creation**: Optimized browser context usage

## Benefits of This Approach

1. **Reduced Duplication**: Common patterns are abstracted into reusable functions
2. **Consistent Testing**: Standardized setup and assertion patterns  
3. **Better Performance**: HTML caching reduces unnecessary network requests
4. **Maintainability**: Changes to common patterns only need to be made in one place
5. **Readability**: Tests focus on what's being tested rather than how
6. **Type Safety**: TypeScript interfaces ensure correct usage
7. **Modular Organization**: Separate files for different testing concerns
8. **Function-based**: Simple function calls instead of complex class hierarchies
9. **High Performance**: Concurrent execution and optimized wait strategies
10. **Best Practices**: Follows Vitest and Playwright performance guidelines

## Migration Guide

When refactoring existing tests:

1. Replace individual setup calls with `setupE2ETests()`
2. Cache HTML content using `$fetch()` for multiple assertions on the same page
3. Use assertion functions instead of individual expect statements  
4. **Replace repetitive browser tests** with parameterized versions
5. **Use helper functions** for complex browser interactions
6. **Import specific functions** from organized helper modules
7. **Apply performance optimizations** using concurrent execution patterns
8. **Use optimized functions** for better test performance

## Examples

See `attributeResponsiveImage.e2e.test.ts` for a complete example of the refactored approach.