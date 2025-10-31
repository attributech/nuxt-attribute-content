// Core utilities
// Responsive image testing - namespaced export

// Icon testing - namespaced export
import * as iconFunctions from './iconHelpers'

export {
  setupE2ETests,
  createTestPage,
  runConcurrentViewportTests,
  getCachedPage,
  cleanupSharedPageCache,
} from './testHelpers'
export type { ViewportTestCase } from './testHelpers'
export const iconTestUtils = iconFunctions
