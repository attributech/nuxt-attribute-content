import { expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import type { Page } from '@playwright/test'

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
export function assertResponsiveImageHeading(html: string, expectedHeading: string) {
  expect(html).toContain(expectedHeading)
}

export function assertLazyLoadClass(html: string) {
  expect(html).toContain('<img')
  expect(html).toContain('class="lazyload"')
}

export function assertAltText(html: string, altText: string) {
  expect(html).toContain(`alt="${altText}"`)
}

export function assertResponsiveSrcset(html: string, widths: number[]) {
  expect(html).toContain('data-srcset=')
  widths.forEach((width) => {
    expect(html).toContain(`${width}w`)
  })
}

export function assertWebpFormat(html: string) {
  expect(html).toContain('f_webp')
}

export function assertQuality(html: string, quality: number) {
  expect(html).toContain(`q_${quality}`)
}

export function assertIPXTransformation(html: string) {
  expect(html).toContain('/_ipx/')
}

export function assertSizesAttribute(html: string, value: string) {
  expect(html).toContain(`sizes="${value}"`)
}

export function assertDataAttributes(html: string, attributes: Record<string, string>) {
  Object.entries(attributes).forEach(([key, value]) => {
    expect(html).toContain(`data-${key}="${value}"`)
  })
}

export function assertReferencesImage(html: string, imageName: string) {
  expect(html).toMatch(new RegExp(`data-srcset="[^"]*${imageName}[^"]*"`))
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

export async function verifyAltText(page: Page, expectedAlt: string) {
  const img = await getImageElement(page)
  const alt = await img.getAttribute('alt')
  expect(alt).toBe(expectedAlt)
}

export async function verifyDataSrcset(page: Page, expectedContent: string[]) {
  const img = await getImageElement(page)
  const dataSrcset = await img.getAttribute('data-srcset')
  expect(dataSrcset).toBeTruthy()

  expectedContent.forEach((content) => {
    expect(dataSrcset).toContain(content)
  })
}

export async function verifySizesProcessed(page: Page) {
  const img = await getImageElement(page)
  const sizes = await img.getAttribute('sizes')
  expect(sizes).toMatch(/^\d+px$/) // Should be calculated pixel value
}

export async function verifyDataAttributes(page: Page, expectedAttributes: Record<string, string>) {
  const img = await getImageElement(page)

  for (const [key, value] of Object.entries(expectedAttributes)) {
    const actual = await img.getAttribute(`data-${key}`)
    expect(actual).toBe(value)
  }
}

export async function verifyImageLoaded(page: Page) {
  const img = await getImageElement(page)
  await page.waitForTimeout(1000) // Wait for lazysizes processing

  const srcset = await img.getAttribute('srcset')
  const src = await img.getAttribute('src')
  expect(srcset || src).toBeTruthy()
}

export async function verifyLoadedImageWidth(page: Page, expectedWidth: number, expectedFormats: string[] = ['f_webp', 'q_60']) {
  const img = await getImageElement(page)
  await page.waitForTimeout(2000) // Extra wait for responsive loading

  const currentSrc = await img.evaluate(el => (el as HTMLImageElement).currentSrc)

  // Extract width from URL
  const widthMatch = currentSrc?.match(/w_(\d+)/)
  const loadedWidth = widthMatch?.[1] ? Number.parseInt(widthMatch[1]) : 0

  expect(loadedWidth).toBe(expectedWidth)

  // Verify formats
  expectedFormats.forEach((format) => {
    expect(currentSrc || '').toContain(format)
  })
}
