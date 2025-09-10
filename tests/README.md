# E2E Testing Guidelines & Best Practices

This document serves as the definitive guide for e2e testing in this project. It consolidates lessons learned from performance optimization and refactoring work to ensure consistent, maintainable, and efficient tests.

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

### **Vitest Best Practices**
```typescript
// ✅ Use concurrent execution for independent tests
describe.concurrent('HTML Structure Tests', () => {
  // Tests run in parallel
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
├── attributeIcon.e2e.test.ts          # Icon tests
├── attributeResponsiveImage.e2e.test.ts # Image tests
└── [other test files]
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

## 📊 **Current Performance Benchmarks**

Our optimized test suite achieves:
- **Total execution time**: ~30 seconds (61% improvement from 77s)
- **Responsive image tests**: ~27 seconds (51% improvement from 55s)
- **Icon tests**: ~20 seconds
- **Viewport tests**: Run concurrently in ~2 seconds (was 15+ seconds sequential)

## 🔧 **Available Utilities**

### **Core Utilities** (`setupE2ETests`, `createTestPage`, etc.)
- ✅ **Complex setup orchestration**
- ✅ **Browser resource management**  
- ✅ **Concurrent test execution helpers**

### **Responsive Image Utils** (`responsiveImageTestUtils.*`)
- ✅ **`verifyLoadedImageWidth()`** - Complex polling and validation
- ✅ **`assertResponsiveSrcset()`** - Meaningful loop logic for width checking
- ✅ **`assertDataAttributes()`** - Reusable attribute validation pattern
- ✅ **`getImageElement()`** - Consistent error handling, used multiple times

### **Icon Utils** (`iconTestUtils.*`)
- ✅ **`verifyIconDimensions()`** - Used multiple times, meaningful abstraction
- ✅ **`verifyConcurrentIconSizes()`** - Complex concurrent operations with size progression
- ✅ **`assertGridLayout()`** - Used multiple times, meaningful grouping

## 💡 **Writing New Tests**

### **HTML Structure Testing**
```typescript
it('should render correctly', async () => {
  const html = await getPageHtml()
  
  // ✅ Direct assertions with clear comments
  expect(html).toContain('<h1>Expected Title</h1>')
  expect(html).toContain('class="expected-class"')
  
  // ✅ Use utilities for complex operations only
  responsiveImageTestUtils.assertResponsiveSrcset(html, [320, 640, 1280])
})
```

### **Browser Testing**
```typescript
it('should work in browser', async () => {
  const page = await createTestPage('/my-page')
  
  try {
    // ✅ Direct operations for simple checks
    const img = await page.locator('img').first()
    const alt = await img.getAttribute('alt')
    expect(alt).toBe('Expected Alt')
    
    // ✅ Use utilities for complex operations
    await responsiveImageTestUtils.verifyLoadedImageWidth(page, 1920)
  } finally {
    await page.close()
  }
})
```

### **Concurrent Testing**
```typescript
// ✅ Use for independent, similar tests
it.concurrent.each(testCases)(
  'should handle $description',
  async (testCase) => {
    // Test implementation
  }
)
```

## 🚨 **Common Anti-Patterns to Avoid**

### **❌ Over-Abstraction**
```typescript
// DON'T do this - just makes code harder to read
responsiveImageTestUtils.assertWebpFormat(html)
responsiveImageTestUtils.assertQuality(html, 60)

// DO this instead - clear and direct
expect(html).toContain('f_webp')
expect(html).toContain('q_60')
```

### **❌ Premature Optimization**
```typescript
// DON'T optimize tests that are already fast
// Icon tests: 22s → 20s (9% improvement) with high complexity increase

// DO focus on slow tests with high impact
// Responsive tests: 55s → 27s (51% improvement) worth the complexity
```

### **❌ Hidden Complexity**
```typescript
// DON'T hide simple operations behind function calls
await verifyAltText(page, 'My Alt') // Need to look up what this does

// DO keep simple operations visible
const alt = await img.getAttribute('alt')
expect(alt).toBe('My Alt') // Immediately clear
```

## 🎉 **Success Metrics**

A well-designed test should be:
- **Fast to read** (< 30 seconds to understand)
- **Easy to debug** (failure point immediately visible)  
- **Quick to execute** (performance optimized)
- **Simple to maintain** (minimal unnecessary abstractions)
- **Self-documenting** (clear intent without deep investigation)

## 📚 **Additional Resources**

- **Vitest Documentation**: [https://vitest.dev](https://vitest.dev)
- **Playwright Best Practices**: [https://playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices)
- **Project Test Utilities**: See `tests/utils/README.md` for detailed API documentation

---

## 🏆 **Remember the Golden Rule**

> **"If it's not obviously better as a utility, it shouldn't be a utility."**

When in doubt, favor clarity and directness over abstraction. Your future self (and your teammates) will thank you.