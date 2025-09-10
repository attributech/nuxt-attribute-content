import { expect } from 'vitest'
import type { Page } from '@playwright/test'

/**
 * Standard icon size configurations
 */
export const ICON_SIZE_CONFIGS = [
  { size: 's', selector: '.icon--size-s', expectedWidth: 18, expectedHeight: 18 },
  { size: 'm', selector: '.icon--size-m', expectedWidth: 32, expectedHeight: 32 },
  { size: 'l', selector: '.icon--size-l', expectedWidth: 64, expectedHeight: 64 },
]

/**
 * Common icon names for testing
 */
export const COMMON_ICON_NAMES = ['arrow-left', 'arrow-right']

/**
 * HTML assertions for icon testing
 */
export function assertGridLayout(html: string) {
  expect(html).toContain('class="icon-grid"')
  expect(html).toContain('class="icon-item"')
}

/**
 * Browser-based icon testing utilities
 */
export async function verifyIconDimensions(page: Page, selector: string, expectedWidth: number, expectedHeight: number) {
  await page.waitForSelector(selector, { timeout: 3000 })

  const dimensions = await page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (!element) return null
    const styles = window.getComputedStyle(element)
    return {
      width: Number.parseInt(styles.width),
      height: Number.parseInt(styles.height),
    }
  }, selector)

  expect(dimensions).toBeTruthy()
  expect(dimensions!.width).toBe(expectedWidth)
  expect(dimensions!.height).toBe(expectedHeight)
}

export async function verifySizeProgression(page: Page, sizeConfigs: Array<{ selector: string, expectedSize: number }>) {
  // Wait for all selectors to be available first
  await Promise.all(
    sizeConfigs.map(config =>
      page.waitForSelector(config.selector, { timeout: 3000 }),
    ),
  )

  // Then verify all dimensions concurrently
  const promises = sizeConfigs.map(async (config) => {
    const size = await page.evaluate((sel) => {
      const element = document.querySelector(sel)
      if (!element) return 0
      const styles = window.getComputedStyle(element)
      return Number.parseInt(styles.width)
    }, config.selector)

    expect(size).toBe(config.expectedSize)
    return size
  })

  const sizes = await Promise.all(promises)

  // Verify size progression (each size should be larger than the previous)
  for (let i = 1; i < sizes.length; i++) {
    expect(sizes[i]).toBeGreaterThan(sizes[i - 1])
  }
}

/**
 * Concurrent icon size testing with dimension verification and size progression
 */
export async function verifyConcurrentIconSizes(page: Page, sizeConfigs: Array<{ selector: string, expectedWidth: number, expectedHeight: number }>) {
  // Wait for all selectors to be available first
  await Promise.all(
    sizeConfigs.map(config =>
      page.waitForSelector(config.selector, { timeout: 3000 }),
    ),
  )

  // Then verify all dimensions concurrently
  const promises = sizeConfigs.map(async (config) => {
    const dimensions = await page.evaluate((sel) => {
      const element = document.querySelector(sel)
      if (!element) return null
      const styles = window.getComputedStyle(element)
      return {
        width: Number.parseInt(styles.width),
        height: Number.parseInt(styles.height),
      }
    }, config.selector)

    expect(dimensions).toBeTruthy()
    expect(dimensions!.width).toBe(config.expectedWidth)
    expect(dimensions!.height).toBe(config.expectedHeight)

    return dimensions!.width
  })

  const sizes = await Promise.all(promises)

  // Verify size progression (each size should be larger than the previous)
  for (let i = 1; i < sizes.length; i++) {
    expect(sizes[i]).toBeGreaterThan(sizes[i - 1])
  }
}
