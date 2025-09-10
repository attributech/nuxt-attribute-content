import { expect } from 'vitest'
import type { Page } from 'playwright-core'

/**
 * Common responsive image widths used in tests
 */
export const ALL_RESPONSIVE_WIDTHS = [320, 480, 640, 960, 1280, 1536, 1920, 2560, 3072, 3840, 5120, 7680]

/**
 * Viewport test case configuration
 */
export interface ViewportTestCase {
  width: number
  height: number
  expectedImageWidth: number
  description: string
}

/**
 * Common viewport test cases for responsive images
 */
export const VIEWPORT_TEST_CASES: ViewportTestCase[] = [
  {
    width: 320,
    height: 480,
    expectedImageWidth: 320,
    description: '320px mobile viewport',
  },
  {
    width: 640,
    height: 480,
    expectedImageWidth: 640,
    description: '640px mobile viewport',
  },
  {
    width: 1280,
    height: 1080,
    expectedImageWidth: 1280,
    description: '1280px tablet viewport',
  },
  {
    width: 1920,
    height: 1080,
    expectedImageWidth: 1920,
    description: '1920px desktop viewport',
  },
  {
    width: 3840,
    height: 1080,
    expectedImageWidth: 3840,
    description: '3840px 4K viewport',
  },
]

/**
 * Assertions for responsive image HTML testing
 */

export function assertResponsiveSrcset(html: string, widths: number[]) {
  expect(html).toContain('data-srcset=')
  widths.forEach((width) => {
    expect(html).toContain(`${width}w`)
  })
}

export function assertDataAttributes(html: string, attributes: Record<string, string>) {
  Object.entries(attributes).forEach(([key, value]) => {
    expect(html).toContain(`data-${key}="${value}"`)
  })
}

/**
 * Browser-based responsive image testing utilities
 */
export async function getImageElement(page: Page) {
  const img = page.locator('img').first()
  const isVisible = await img.isVisible()
  expect(isVisible).toBe(true)
  return img
}

export async function verifyDataAttributes(page: Page, expectedAttributes: Record<string, string>) {
  const img = await getImageElement(page)

  for (const [key, value] of Object.entries(expectedAttributes)) {
    const actual = await img.getAttribute(`data-${key}`)
    expect(actual).toBe(value)
  }
}

export async function verifyLoadedImageWidth(page: Page, expectedWidth: number, expectedFormats: string[] = ['f_webp', 'q_60']) {
  const img = await getImageElement(page)

  // Wait for image to be loaded with a reasonable timeout
  await img.waitFor({ state: 'attached' })
  await page.waitForLoadState('networkidle')

  // Use more efficient polling instead of fixed timeout
  const currentSrc = await page.waitForFunction(() => {
    const imgEl = document.querySelector('img')
    return imgEl?.currentSrc || imgEl?.src
  }, { timeout: 5000 })

  const srcValue = await currentSrc.evaluate((src: string) => src)

  // Extract width from URL
  const widthMatch = (srcValue as string)?.match(/w_(\d+)/)
  const loadedWidth = widthMatch?.[1] ? Number.parseInt(widthMatch[1]) : 0

  expect(loadedWidth).toBe(expectedWidth)

  // Verify formats
  expectedFormats.forEach((format) => {
    expect(srcValue || '').toContain(format)
  })
}

/**
 * Concurrent viewport testing helper
 */
export async function verifyConcurrentViewportLoading(
  pages: { page: Page, expectedWidth: number, testCase: ViewportTestCase }[],
) {
  const promises = pages.map(async ({ page, expectedWidth, testCase }) => {
    try {
      await verifyLoadedImageWidth(page, expectedWidth)
      return { success: true, testCase }
    }
    catch (error) {
      return { success: false, testCase, error }
    }
  })

  const results = await Promise.all(promises)

  // Check all results and throw descriptive errors if any failed
  const failures = results.filter(r => !r.success)
  if (failures.length > 0) {
    const failureMessages = failures.map(f => `${f.testCase.description}: ${f.error}`).join('\n')
    throw new Error(`Viewport tests failed:\n${failureMessages}`)
  }
}
