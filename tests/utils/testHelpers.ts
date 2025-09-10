import { setup, createPage } from '@nuxt/test-utils/e2e'
import type { Page } from '@playwright/test'
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
 * Create a page with common setup and automatic cleanup
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
