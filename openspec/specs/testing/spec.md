# testing Specification

## Purpose
TBD - created by archiving change fix-responsive-image-tests. Update Purpose after archive.
## Requirements
### Requirement: E2E Tests for Responsive Images with Unlazy
The test suite SHALL verify that responsive images with auto-sizes load correctly, accounting for unlazy's bot detection behavior in Playwright test environment.

#### Scenario: HTML structure validation
- **GIVEN** a responsive image component with srcset and auto-sizes
- **WHEN** the HTML is fetched from the server
- **THEN** it SHALL contain a valid srcset with multiple width descriptors (320w, 640w, 1280w, 1920w, etc.)
- **AND** it SHALL contain image optimization parameters (webp format, quality settings)
- **AND** it SHALL contain correct alt text and accessibility attributes

#### Scenario: Browser image loading verification
- **GIVEN** a page with responsive images using auto-sizes
- **WHEN** rendered in Playwright (which is detected as a bot by unlazy)
- **THEN** tests SHALL verify images load successfully
- **AND** tests SHALL verify correct image format (webp) and quality settings
- **AND** tests SHALL verify alt text and accessibility
- **AND** tests SHALL NOT expect different images at different viewports (bot detection prevents viewport-specific loading)

#### Scenario: Bot detection awareness in tests
- **GIVEN** unlazy detects Playwright as a bot environment
- **WHEN** auto-sizes is used
- **THEN** unlazy calculates a fixed sizes value for SEO purposes
- **AND** the same image loads at all viewports in tests
- **AND** this is expected behavior, not a bug
- **THEREFORE** tests SHALL account for this by not asserting viewport-specific image widths

### Requirement: Test Simplicity and Maintainability
E2E tests for responsive images SHALL use a simple, maintainable structure without complex utilities.

#### Scenario: Simple test structure
- **GIVEN** unlazy's lazy loading behavior requires proper timing
- **WHEN** implementing tests
- **THEN** tests SHALL use simple structure without shared page caches
- **AND** tests SHALL wait appropriately for unlazy to process images (3s timeout)
- **AND** tests SHALL clearly separate HTML structure tests from browser behavior tests
- **AND** tests SHALL avoid complex test utilities that can cause timing issues

#### Scenario: Clear test organization
- **GIVEN** the need to verify multiple aspects of responsive images
- **WHEN** organizing tests
- **THEN** tests SHALL be grouped into: HTML Structure tests and Browser Image Loading tests
- **AND** each test SHALL have a clear, focused purpose
- **AND** tests SHALL include documentation explaining bot detection behavior

### Requirement: Component Behavior Preservation
The `AttributeResponsiveImage` component SHALL continue using auto-sizes for optimal behavior in real browsers.

#### Scenario: Auto-sizes in production
- **GIVEN** auto-sizes works perfectly in real browsers (Firefox, Chrome, Safari, etc.)
- **WHEN** users access the site with real browsers
- **THEN** auto-sizes SHALL calculate optimal sizes attribute dynamically
- **AND** appropriate images SHALL load per viewport
- **AND** this provides best user experience
- **THEREFORE** component SHALL keep auto-sizes prop (no changes to production code)

#### Scenario: Bot detection is feature, not bug
- **GIVEN** unlazy detects bots (including Playwright) for SEO optimization
- **WHEN** a bot accesses responsive images
- **THEN** unlazy immediately loads full-quality images
- **AND** this ensures proper indexing by search engines
- **AND** this is intended behavior by unlazy library
- **THEREFORE** tests SHALL be written to accommodate this, not try to circumvent it

