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
    try {
      await page.close()
    }
    catch (error) {
      // Ignore errors during cleanup
    }
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

/**
 * Smart waiting utility that polls for conditions with exponential backoff
 */
export async function waitForCondition<T>(
  condition: () => Promise<T>,
  options: {
    timeout?: number
    interval?: number
    maxInterval?: number
    description?: string
  } = {},
): Promise<T> {
  const {
    timeout = 10000,
    interval = 100,
    maxInterval = 1000,
    description = 'condition',
  } = options

  const startTime = Date.now()
  let currentInterval = interval

  while (Date.now() - startTime < timeout) {
    try {
      const result = await condition()
      if (result) {
        return result
      }
    }
    catch (error) {
      // Continue polling on errors
    }

    await new Promise(resolve => setTimeout(resolve, currentInterval))
    currentInterval = Math.min(currentInterval * 1.2, maxInterval)
  }

  throw new Error(`Timeout waiting for ${description} after ${timeout}ms`)
}

/**
 * Batch operations for better performance
 */
export async function batchOperations<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  batchSize: number = 3,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(operation))
    results.push(...batchResults)
  }

  return results
}

/**
 * Performance monitoring utility for tests
 */
export class TestPerformanceMonitor {
  private startTime: number = 0
  private metrics: Record<string, number> = {}

  start() {
    this.startTime = performance.now()
  }

  mark(label: string) {
    this.metrics[label] = performance.now() - this.startTime
  }

  getMetrics() {
    return { ...this.metrics }
  }

  logMetrics() {
    console.log('Test Performance Metrics:', this.metrics)
  }
}
