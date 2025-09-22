import { describe, it, expect, afterAll } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { setupE2ETests, createTestPage, cleanupSharedPageCache } from './utils'

describe('AttributeMap E2E Tests', async () => {
  await setupE2ETests()

  const MAP_PAGE_PATH = '/map'
  let cachedHtml: string

  afterAll(async () => {
    await cleanupSharedPageCache()
  })

  // Cache HTML for multiple tests to avoid repeated fetches
  const getPageHtml = async () => {
    if (!cachedHtml) {
      cachedHtml = await $fetch(MAP_PAGE_PATH)
    }
    return cachedHtml
  }

  describe.concurrent('HTML Structure Tests', () => {
    it('should render the map page with correct structure', async () => {
      const html = await getPageHtml()

      // Check page structure - the component is rendered but not as literal text
      expect(html).toContain('<h1>&lt;AttributeMap&gt;</h1>')

      // Check that multiple map instances are rendered
      const mapMatches = html.match(/class="map"/g)
      expect(mapMatches).toBeTruthy()
      expect(mapMatches!.length).toBeGreaterThanOrEqual(3) // Should have at least 3 map instances
    })

    it('should render maps with correct CSS classes and styling', async () => {
      const html = await getPageHtml()

      // Check for map CSS class
      expect(html).toContain('class="map"')

      // Check for aspect ratio styling (rendered without spaces)
      expect(html).toContain('aspect-ratio:16/9')
    })

    it('should contain essential page elements', async () => {
      const html = await getPageHtml()

      // Check for basic HTML structure
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<div id="__nuxt">')

      // Check for map containers with proper styling
      expect(html).toContain('style="width:100%;height:100%;"')
    })
  })

  describe('Browser Tests', () => {
    describe.concurrent('Map Rendering', () => {
      it('should render maps with correct dimensions', async () => {
        const page = await createTestPage(MAP_PAGE_PATH)

        try {
          // Wait for maps to load
          await page.waitForSelector('.map', { timeout: 10000 })

          // Check that all map elements are visible
          const mapElements = await page.locator('.map').all()
          expect(mapElements.length).toBeGreaterThanOrEqual(3)

          // Verify each map is visible
          for (const mapElement of mapElements) {
            await mapElement.waitFor({ state: 'visible', timeout: 5000 })
            const isVisible = await mapElement.isVisible()
            expect(isVisible).toBe(true)
          }
        }
        finally {
          await page.close()
        }
      })

      it('should have correct aspect ratio styling', async () => {
        const page = await createTestPage(MAP_PAGE_PATH)

        try {
          await page.waitForSelector('.map', { timeout: 10000 })

          // Check aspect ratio on first map
          const aspectRatio = await page.evaluate(() => {
            const mapElement = document.querySelector('.map')
            if (!mapElement) return null
            const styles = window.getComputedStyle(mapElement)
            return styles.aspectRatio
          })

          expect(aspectRatio).toBe('16 / 9')
        }
        finally {
          await page.close()
        }
      })

      it('should render Leaflet map containers', async () => {
        const page = await createTestPage(MAP_PAGE_PATH)

        try {
          // Wait for Leaflet maps to initialize
          await page.waitForSelector('.leaflet-container', { timeout: 10000 })

          // Check that Leaflet containers exist
          const leafletContainers = await page.locator('.leaflet-container').all()
          expect(leafletContainers.length).toBeGreaterThanOrEqual(3)

          // Verify Leaflet containers are properly initialized
          for (const container of leafletContainers) {
            const isVisible = await container.isVisible()
            expect(isVisible).toBe(true)

            // Check for essential Leaflet classes
            const hasLeafletClass = await container.evaluate(el =>
              el.classList.contains('leaflet-container'),
            )
            expect(hasLeafletClass).toBe(true)
          }
        }
        finally {
          await page.close()
        }
      })

      it('should render map markers', async () => {
        const page = await createTestPage(MAP_PAGE_PATH)

        try {
          // Wait for markers to appear
          await page.waitForSelector('.leaflet-marker-icon', { timeout: 10000 })

          // Check that markers exist
          const markers = await page.locator('.leaflet-marker-icon').all()
          expect(markers.length).toBeGreaterThanOrEqual(2) // Should have markers from different map instances

          // Verify markers are visible
          for (const marker of markers) {
            const isVisible = await marker.isVisible()
            expect(isVisible).toBe(true)
          }
        }
        finally {
          await page.close()
        }
      })
    })

    describe('Map Functionality', () => {
      it('should have maps with disabled interactions', async () => {
        const page = await createTestPage(MAP_PAGE_PATH)

        try {
          await page.waitForSelector('.leaflet-container', { timeout: 10000 })

          // Check that zoom controls are not present (disabled)
          const zoomControls = await page.locator('.leaflet-control-zoom').all()
          expect(zoomControls.length).toBe(0)

          // Check that dragging is disabled by attempting to drag
          const firstMap = page.locator('.leaflet-container').first()
          await firstMap.hover()

          // The map should have leaflet-drag-target class removed or dragging disabled
          const isDragDisabled = await firstMap.evaluate((el) => {
            return !el.classList.contains('leaflet-grab')
              && !el.classList.contains('leaflet-dragging')
          })
          expect(isDragDisabled).toBe(true)
        }
        finally {
          await page.close()
        }
      })

      it('should render page header correctly', async () => {
        const page = await createTestPage(MAP_PAGE_PATH)

        try {
          await page.waitForSelector('h1', { timeout: 5000 })

          // Look for the specific h1 that contains the escaped AttributeMap text
          const headerElements = await page.locator('h1').all()
          let foundCorrectHeader = false

          for (const header of headerElements) {
            const text = await header.textContent()
            if (text && text.includes('<AttributeMap>')) {
              foundCorrectHeader = true
              break
            }
          }

          expect(foundCorrectHeader).toBe(true)
        }
        finally {
          await page.close()
        }
      })
    })

    describe('Map Tiles and Loading', () => {
      it('should attempt to load map tiles', async () => {
        const page = await createTestPage(MAP_PAGE_PATH)

        try {
          // Wait for Leaflet containers first
          await page.waitForSelector('.leaflet-container', { timeout: 10000 })

          // Give more time for tiles to load, but don't fail if they don't load
          // (since this might depend on network connectivity or API keys)
          try {
            await page.waitForSelector('.leaflet-tile-container', { timeout: 8000 })

            // Check that tile containers exist
            const tileContainers = await page.locator('.leaflet-tile-container').all()
            expect(tileContainers.length).toBeGreaterThan(0)
          }
          catch {
            // If tiles don't load, just verify the containers are set up correctly
            const leafletContainers = await page.locator('.leaflet-container').all()
            expect(leafletContainers.length).toBeGreaterThanOrEqual(3)
          }
        }
        finally {
          await page.close()
        }
      })
    })
  })
})
