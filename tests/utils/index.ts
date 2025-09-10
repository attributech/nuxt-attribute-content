// Core utilities
// Responsive image testing - namespaced export
import * as responsiveImageFunctions from './responsiveImageHelpers'

// Icon testing - namespaced export
import * as iconFunctions from './iconHelpers'

export {
  setupE2ETests,
  createTestPage,
  runViewportTests,
  runConcurrentViewportTests,
  getCachedPage,
  cleanupSharedPageCache,
} from './testHelpers'
export type { ViewportTestCase } from './testHelpers'
export const responsiveImageTestUtils = responsiveImageFunctions
export const iconTestUtils = iconFunctions

// Re-export types that might be needed
export type { ViewportTestCase as ResponsiveImageViewportTestCase } from './responsiveImageHelpers'
