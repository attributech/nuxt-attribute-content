# E2E Testing Guidelines & Best Practices

This document serves as the definitive guide for e2e testing in this project. It consolidates lessons learned from comprehensive performance optimization and refactoring work to ensure consistent, maintainable, and efficient tests.

## 🎯 **Core Philosophy**

### **The Golden Rule**
> **"If it's not obviously better as a utility, it shouldn't be a utility."**

Optimize for **readability and maintainability** over premature abstraction. Simple operations should stay simple.

## ⚡ **Quick Guidelines**

### **❌ DON'T Create Utilities For:**
- Single `expect()` statements
- Operations used only once
- Simple HTML content checks
- Wrapping basic Playwright operations
- Adding abstraction that makes code harder to read

### **✅ DO Create Utilities For:**
- Complex logic (5+ meaningful lines)
- Operations used 2+ times
- Error handling and validation logic
- Browser orchestration (viewport testing, etc.)
- Business logic that needs consistency

### **🎯 Performance Priorities**
1. **Focus on the 20% that gives 80% improvement** (e.g., concurrent viewport tests)
2. **Use `describe.concurrent()` and `it.concurrent.each()`** for independent tests
3. **Apply smart wait strategies** instead of fixed timeouts
4. **Reuse browser contexts** where safe
5. **Cache HTML** for multiple assertions
6. **Consolidate redundant tests** into meaningful groups

## 📋 **Utility Function Checklist**

Before creating a new utility function, ask yourself:

- [ ] **Is this used more than once?**
- [ ] **Is this more than 3-4 lines of meaningful logic?**
- [ ] **Does this improve readability vs inline code?**
- [ ] **Would a new developer understand this better as a utility or inline?**
- [ ] **Does this provide meaningful abstraction beyond just wrapping expect()?**
- [ ] **Am I solving a real complexity problem or just hiding simple operations?**

If you answer "No" to any of these questions, **keep it inline**.

## 👍 **Good vs Bad Examples**

### **✅ Good Utility Example**
```typescript
// Complex logic, used multiple times, meaningful abstraction
export async function verifyLoadedImageWidth(page: Page, expectedWidth: number) {
  const img = await getImageElement(page)
  
  // Wait for image to be loaded with smart polling
  const currentSrc = await page.waitForFunction(() => {
    const imgEl = document.querySelector('img')
    return imgEl?.currentSrc || imgEl?.src
  }, { timeout: 5000 })

  const srcValue = await currentSrc.evaluate(src => src)
  const widthMatch = srcValue?.match(/w_(\d+)/)
  const loadedWidth = widthMatch?.[1] ? Number.parseInt(widthMatch[1]) : 0

  expect(loadedWidth).toBe(expectedWidth)
}
```
**Why this is good:** Complex polling logic, format validation, used 7+ times

### **❌ Bad Utility Example**
```typescript
// Just wrapping a single expect - keep this inline!
export function assertAltText(html: string, altText: string) {
  expect(html).toContain(`alt="${altText}"`)
}
```
**Why this is bad:** Single expect wrapper, no meaningful abstraction, harder to read than inline

### **✅ Better: Keep Simple Operations Inline**
```typescript
it('should have correct alt text', async () => {
  const html = await getPageHtml()
  
  // Clear, direct, immediately understandable
  expect(html).toContain('alt="Placeholder"')
})
```

## 🚀 **Performance Best Practices**

### **Test Consolidation Strategies**
```typescript
// ✅ Consolidate related assertions into single tests
it('should render page with correct structure and content', async () => {
  const html = await getPageHtml()
  
  // Group related assertions
  expect(html).toContain('useMenuItems()')
  expect(html).toContain('Main Menu Items')
  expect(html).toContain('Raw Menu Data')
})

// ❌ Avoid separate tests for each simple assertion
it('should contain title', () => { /* ... */ })
it('should contain subtitle', () => { /* ... */ })
it('should contain content', () => { /* ... */ })
```

### **Vitest Best Practices**
```typescript
// ✅ Use concurrent execution for independent tests
describe.concurrent('HTML Structure Tests', () => {
  // Tests run in parallel within the describe block
})

// ✅ Use parameterized testing for similar scenarios
it.concurrent.each(VIEWPORT_TEST_CASES)(
  'should work at $description',
  async (testCase) => {
    // All viewport tests run concurrently
  }
)

// ✅ Proper resource management
afterAll(async () => {
  await cleanupSharedPageCache()
})

// ✅ Cache HTML for multiple assertions
let cachedHtml: string
const getPageHtml = async () => {
  if (!cachedHtml) {
    cachedHtml = await $fetch(PAGE_PATH)
  }
  return cachedHtml
}
```

### **Playwright Best Practices**
```typescript
// ✅ Smart wait strategies
await page.waitForFunction(() => condition, { timeout: 5000 })

// ❌ Avoid fixed timeouts
await page.waitForTimeout(2000) // Only when absolutely necessary

// ✅ Parallel operations where safe
await Promise.all([
  page.waitForSelector('.selector1'),
  page.waitForSelector('.selector2'),
  page.waitForSelector('.selector3')
])
```

## 🏗 **Project Structure**

```
tests/
├── README.md                          # This file - main testing guide
├── utils/
│   ├── index.ts                       # Clean namespaced exports
│   ├── testHelpers.ts                 # Core utilities & performance helpers
│   ├── responsiveImageHelpers.ts      # Complex image testing functions
│   └── iconHelpers.ts                 # Complex icon testing functions
├── attributeIcon.e2e.test.ts          # Icon tests (7 tests)
├── attributeResponsiveImage.e2e.test.ts # Image tests (13 tests)
├── menuItems.e2e.test.ts              # Menu tests (4 tests, optimized)
├── playground.e2e.test.ts             # Navigation tests (6 tests, optimized)
├── renderedMarkdown.e2e.test.ts       # Markdown tests (6 tests, optimized)
└── useCamelize.test.ts                # Unit tests (11 tests)
```

### **Import Pattern**
```typescript
import { 
  setupE2ETests, 
  createTestPage, 
  runConcurrentViewportTests,
  responsiveImageTestUtils, 
  iconTestUtils 
} from './utils'
```

## 📊 **Performance Achievements**

Our comprehensive optimization work has achieved significant performance improvements:

### **Overall Performance Gains**
- **Total execution time**: ~37 seconds (down from original ~77s)
- **Test execution time**: ~127 seconds (down from ~135s)
- **Test suite now passing consistently** with zero context conflicts

### **Individual Test File Performance**
- **attributeResponsiveImage.e2e.test.ts**: ~33 seconds (still the most complex due to browser viewport testing)
- **attributeIcon.e2e.test.ts**: ~24 seconds (concurrent HTML structure tests)
- **menuItems.e2e.test.ts**: ~23 seconds (consolidated from 10 to 4 tests)
- **renderedMarkdown.e2e.test.ts**: ~23 seconds (consolidated from 16 to 6 tests)  
- **playground.e2e.test.ts**: ~22 seconds (optimized caching and structure)
- **useCamelize.test.ts**: ~5ms (unit tests - consistently fast)

### **Test Consolidation Achievements**
- **menuItems.e2e.test.ts**: 10 tests → 4 tests (60% reduction)
- **renderedMarkdown.e2e.test.ts**: 16 tests → 6 tests (62% reduction)  
- **playground.e2e.test.ts**: 6 redundant tests → 6 optimized tests (same count, better structure)
- **Overall test count**: 63 tests → 47 tests (25% reduction) with **same coverage**

### **Key Optimization Strategies Applied**
1. **HTML Caching**: Single fetch per test file instead of multiple fetches per test
2. **Test Consolidation**: Combined related assertions into meaningful test groups
3. **Concurrent Execution**: Used `describe.concurrent()` where safe
4. **Shared Setup**: Centralized `setupE2ETests()` to prevent duplicate Nuxt instances
5. **Smart Resource Management**: Proper cleanup and cache management

## 🔧 **Available Utilities**

### **Core Utilities** (`testHelpers.ts`)
- ✅ **`setupE2ETests()`** - Centralized e2e setup to prevent conflicts
- ✅ **`createTestPage()`** - Browser page creation with smart loading
- ✅ **`runConcurrentViewportTests()`** - Concurrent viewport testing orchestration  
- ✅ **`cleanupSharedPageCache()`** - Resource cleanup utility
- ✅ **`waitForCondition()`** - Smart polling with exponential backoff
- ✅ **`batchOperations()`** - Batched async operations for performance

### **Responsive Image Utils** (`responsiveImageHelpers.ts`)
- ✅ **`verifyLoadedImageWidth()`** - Complex polling and validation (used 8+ times)
- ✅ **`assertResponsiveSrcset()`** - Meaningful loop logic for width checking
- ✅ **`assertDataAttributes()`** - Reusable attribute validation pattern
- ✅ **`getImageElement()`** - Consistent error handling and visibility checks

### **Icon Utils** (`iconHelpers.ts`)
- ✅ **`verifyIconDimensions()`** - Dimension checking with proper wait strategies
- ✅ **`verifyConcurrentIconSizes()`** - Complex concurrent operations with size progression
- ✅ **`ICON_SIZE_CONFIGS`** - Centralized configuration data
- ✅ **`COMMON_ICON_NAMES`** - Reusable test data

## 💡 **Writing New Tests**

### **HTML Structure Testing**
```typescript
describe.concurrent('HTML Structure Tests', () => {
  it('should render with complete structure and content', async () => {
    const html = await getPageHtml()
    
    // ✅ Group related assertions efficiently
    expect(html).toContain('<h1>Expected Title</h1>')
    expect(html).toContain('class="expected-class"')
    expect(html).toContain('Main Content Section')
    
    // ✅ Use utilities for complex operations only
    responsiveImageTestUtils.assertResponsiveSrcset(html, [320, 640, 1280])
  })
})
```

### **Browser Testing**
```typescript
describe('Browser Tests', () => {
  it('should work correctly with proper functionality', async () => {
    const page = await createTestPage('/my-page')
    
    try {
      // ✅ Group related browser operations
      const img = await page.locator('img').first()
      const alt = await img.getAttribute('alt')
      expect(alt).toBe('Expected Alt')
      
      const isVisible = await img.isVisible()
      expect(isVisible).toBe(true)
      
      // ✅ Use utilities for complex operations
      await responsiveImageTestUtils.verifyLoadedImageWidth(page, 1920)
    } finally {
      await page.close()
    }
  })
})
```

### **Concurrent Testing**
```typescript
// ✅ Use for independent, similar tests
it.concurrent.each(testCases)(
  'should handle $description viewport correctly',
  async (testCase) => {
    // All test cases run in parallel
    const page = await createTestPage('/test-page', {
      width: testCase.width,
      height: testCase.height
    })
    
    try {
      await verifyViewportBehavior(page, testCase)
    } finally {
      await page.close()
    }
  }
)
```

## 🚨 **Common Anti-Patterns to Avoid**

### **❌ Over-Testing with Redundant Tests**
```typescript
// DON'T create separate tests for every small detail
it('should have title')
it('should have subtitle') 
it('should have content')
it('should have footer')
// ^ 4 separate tests, 4 separate HTML fetches

// DO consolidate into meaningful groups
it('should render complete page structure', async () => {
  const html = await getPageHtml() // Single fetch
  expect(html).toContain('title')
  expect(html).toContain('subtitle')
  expect(html).toContain('content')
  expect(html).toContain('footer')
})
```

### **❌ Over-Abstraction**
```typescript
// DON'T do this - just makes code harder to read
responsiveImageTestUtils.assertWebpFormat(html)
responsiveImageTestUtils.assertQuality(html, 60)

// DO this instead - clear and direct
expect(html).toContain('f_webp')
expect(html).toContain('q_60')
```

### **❌ Context Conflicts**
```typescript
// DON'T use aggressive concurrency that causes conflicts
// These settings caused "Context conflict" errors:
// fileParallelism: true, isolate: false, sequence: { concurrent: true }

// DO use conservative, stable settings
// Default vitest config with selective describe.concurrent()
```

### **❌ Hidden Complexity**
```typescript
// DON'T hide simple operations behind function calls
await verifyAltText(page, 'My Alt') // Need to look up what this does

// DO keep simple operations visible and direct
const alt = await img.getAttribute('alt')
expect(alt).toBe('My Alt') // Immediately clear
```

## 🏆 **Lessons Learned**

### **Major Insights from Optimization Work**
1. **Test consolidation provides bigger gains than micro-optimizations** (25% test reduction)
2. **HTML caching eliminates redundant network requests** (single fetch per test file)
3. **Aggressive concurrency can cause stability issues** (context conflicts)
4. **Simple, direct tests are easier to debug and maintain**
5. **Focus optimization efforts on slow tests, not already-fast ones**

### **What Worked Well**
- ✅ Consolidating 10-16 simple tests into 4-6 comprehensive tests
- ✅ Using `describe.concurrent()` for independent HTML structure tests  
- ✅ Caching HTML content within test files
- ✅ Centralized setup to prevent duplicate Nuxt instances
- ✅ Smart waiting strategies over fixed timeouts

### **What Didn't Work**
- ❌ Aggressive vitest concurrency settings (caused context conflicts)
- ❌ Over-abstracting simple HTML assertions
- ❌ Complex global state management for test setup
- ❌ Trying to optimize already-fast unit tests

## 🎉 **Success Metrics**

A well-designed test should be:
- **Fast to read** (< 30 seconds to understand)
- **Easy to debug** (failure point immediately visible)  
- **Quick to execute** (performance optimized through consolidation)
- **Simple to maintain** (minimal unnecessary abstractions)
- **Self-documenting** (clear intent without deep investigation)
- **Stable** (no context conflicts or flaky behavior)

## 📚 **Additional Resources**

- **Vitest Documentation**: [https://vitest.dev](https://vitest.dev)
- **Playwright Best Practices**: [https://playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices)
- **Project Test Utilities**: See `tests/utils/README.md` for detailed API documentation

---

## 🏆 **Remember the Golden Rule**

> **"If it's not obviously better as a utility, it shouldn't be a utility."**

When in doubt, favor clarity and directness over abstraction. Focus on meaningful test consolidation and performance wins over micro-optimizations. Your future self (and your teammates) will thank you.

---

## 📈 **Performance Summary**

**Before Optimization:**
- ~77 seconds total execution time
- 63 tests across all files
- Multiple redundant HTML fetches
- Many single-assertion tests

**After Optimization:**
- ~37 seconds total execution time (**51% improvement**)
- 47 tests with same coverage (**25% reduction**)
- Single HTML fetch per test file
- Consolidated, meaningful test groups
- Stable, consistent test execution