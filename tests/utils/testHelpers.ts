import { setup, createPage } from '@nuxt/test-utils/e2e'
import type { Page, BrowserContext } from '@playwright/test'
import type { SetupOptions } from '@nuxt/test-utils/e2e'

/**
 * Common setup configuration for all e2e tests
 */
export async function setupE2ETests(options: SetupOptions = {}) {
  await setup({
    rootDir: '.playground',
    ...options,
  })
}

/**
 * Shared page cache for performance optimization
 */
const sharedPageCache = new Map<string, Page>()

/**
 * Get or create a cached page for performance
 */
export async function getCachedPage(path: string): Promise<Page> {
  const cacheKey = `${path}:default`
  if (!sharedPageCache.has(cacheKey)) {
    const page = await createPage(path)
    sharedPageCache.set(cacheKey, page)
  }
  return sharedPageCache.get(cacheKey)!
}

/**
 * Clean up shared page cache
 */
export async function cleanupSharedPageCache() {
  for (const page of sharedPageCache.values()) {
    await page.close()
  }
  sharedPageCache.clear()
}

/**
 * Create a page with optimized performance and common setup
 */
export async function createTestPage(path: string, viewport?: { width: number, height: number }): Promise<Page> {
  const page = await createPage(path)

  if (viewport) {
    await page.setViewportSize(viewport)
  }

  await page.waitForLoadState('networkidle')
  return page
}

/**
 * Test different viewport sizes with the same assertions
 */
export interface ViewportTestCase {
  width: number
  height: number
  expectedImageWidth: number
  description: string
}

export async function runViewportTests(
  path: string,
  testCases: ViewportTestCase[],
  testFn: (page: Page, testCase: ViewportTestCase) => Promise<void>,
) {
  for (const testCase of testCases) {
    const page = await createTestPage(path, {
      width: testCase.width,
      height: testCase.height,
    })

    try {
      await testFn(page, testCase)
    }
    finally {
      await page.close()
    }
  }
}

/**
 * Run viewport tests concurrently for better performance
 */
export async function runConcurrentViewportTests(
  path: string,
  testCases: ViewportTestCase[],
  testFn: (page: Page, testCase: ViewportTestCase) => Promise<void>,
) {
  const promises = testCases.map(async (testCase) => {
    const page = await createPage(path)

    try {
      await page.setViewportSize({
        width: testCase.width,
        height: testCase.height,
      })
      await page.waitForLoadState('networkidle')
      await testFn(page, testCase)
    }
    finally {
      await page.close()
    }
  })

  await Promise.all(promises)
}
