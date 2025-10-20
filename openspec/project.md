# Project Context

## Purpose
A Nuxt layer that extends `@nuxt/content` with custom attribute-based components for rendering enhanced content elements like icons, responsive images, maps, and dynamic components. Designed to be published on NPM and extended by other Nuxt projects.

## Tech Stack
- **Framework**: Nuxt 4 (Vue 3, SSR/SSG)
- **Language**: TypeScript with strict type checking
- **Content**: @nuxt/content with markdown-it for rendering
- **Package Manager**: pnpm 10.15.1
- **Testing**: Vitest (unit & e2e with Playwright)
- **Styling**: PostCSS with postcss-nested and postcss-custom-media
- **Image Optimization**: @nuxt/image with nuxt-ipx-cache and nuxt-lazyimages
- **Icons**: nuxt-svg-icon-sprite with custom SVGO processor
- **Linting**: ESLint with @nuxt/eslint-config (stylistic + tooling rules)
- **Validation**: Zod v4
- **SEO**: @nuxtjs/seo
- **Maps**: @nuxtjs/leaflet (optional peer dependency)
- **Git Hooks**: Husky with Commitlint

## Project Conventions

### Documentation Lookups
- **Context7 MCP**: ALWAYS use Context7 MCP server for up-to-date documentation lookups
- **Requirements**: Context7 MCP server must be configured in Claude Code settings
  - Server URL: `https://mcp.context7.com/mcp`
  - Optional: `CONTEXT7_API_KEY` for higher rate limits
- **Available MCP tools** (when configured):
  - `mcp__context7__resolve-library-id`: Convert library names (e.g., "Nuxt", "Vue") to Context7 IDs
  - `mcp__context7__get-library-docs`: Fetch documentation using the resolved library ID
- **Usage Pattern**:
  1. Call `resolve-library-id` with the library name (e.g., `{"libraryName": "Nuxt"}`)
  2. Review results and select appropriate library ID (format: `/org/project` or `/org/project/version`)
  3. Call `get-library-docs` with the ID and optional topic/tokens parameters
- **When to Use**:
  - Before implementing Nuxt/Vue features
  - When unsure about API changes or best practices
  - For any framework-specific questions (Nuxt, Vue, PostCSS, Vitest, etc.)
- **Examples**:
  - Nuxt composables: `resolve-library-id("Nuxt")` → `get-library-docs("/nuxt/nuxt", topic="composables")`
  - Vue 3 features: `resolve-library-id("Vue")` → `get-library-docs("/vuejs/core")`
  - Vitest testing: `resolve-library-id("Vitest")` → `get-library-docs("/vitest-dev/vitest")`
- **Fallback**: If Context7 MCP is unavailable, use WebFetch/WebSearch for documentation lookups

### Code Style
- **TypeScript**: Full TypeScript coverage with `vue-tsc` type checking
- **ESLint**: Uses @nuxt/eslint-config with stylistic and tooling features enabled
- **Linting Workflow**: 
  - Always run `pnpm run lint` first to identify issues
  - Then run `pnpm run lint --fix` to auto-fix issues before manual intervention
  - Then fix remaining linter issues
- **Component Naming**: Multi-word requirement disabled (`vue/multi-word-component-names: off`)
- **Empty Object Types**: Allowed (`@typescript-eslint/no-empty-object-type: off`)
- **Composition API**: Script setup syntax with TypeScript interfaces for props
- **Naming Conventions**:
  - Components: PascalCase with "Attribute" prefix (e.g., `AttributeIcon`, `AttributeMap`)
  - Composables: camelCase with "use" prefix (e.g., `useCamelize`, `useRenderedMarkdown`)
  - Utils: camelCase for functions (e.g., `svgoProcessor`)
- **Exports**: Functions exported with both original and backward-compatible names where applicable

### Architecture Patterns
- **Nuxt Layer**: Structured as an extendable Nuxt layer for distribution via NPM
- **Component Pattern**: Vue 3 SFC with `<script setup>`, typed props interfaces, and scoped/global styles
- **Composables**: Reusable logic extracted to composables directory, returning named functions
- **CSS Custom Properties**: Components use CSS variables with fallbacks (e.g., `var(--icon-size--m, 24px)`)
- **PostCSS**: Nested CSS with BEM-like modifiers (e.g., `.icon--size-m`, `.icon--fill`)
- **Responsive Images**: Multi-breakpoint configuration with density optimization
- **SVG Processing**: Dual sprite system (optimized default + original) with configurable processors
- **Type Safety**: Explicit TypeScript interfaces for all props and composable returns
- **Edge Case Handling**: All utilities handle null, undefined, and non-string inputs gracefully

### Testing Strategy
- **Unit Tests**: Vitest for composables and utilities with comprehensive edge case coverage
- **E2E Tests**: Playwright tests via @nuxt/test-utils for component integration
- **Test Files**: Located in `/tests` directory with `.test.ts` or `.e2e.test.ts` extensions
- **Coverage**: Vitest coverage with HTML reporter available via `test:watch` script
- **Type Testing**: Separate `test:types` script runs vue-tsc on both main and playground
- **Test Philosophy**: Test edge cases including null/undefined, empty strings, and runtime type errors
- **CI Requirement**: Tests must pass before release (`pnpm run lint && pnpm run test`)

### Git Workflow
- **Commit Convention**: Conventional Commits enforced via commitlint
- **Config**: `@commitlint/config-conventional` standard
- **Branch Strategy**: `main` branch for releases
- **Pre-commit Hooks**: Husky configured to run validation
- **Release Process**: Handled manually by maintainer using `pnpm run release`
  - This runs: lint → test → changelogen → publish → git push with tags
  - **Note**: AI assistants should NOT run release commands - maintainer handles releases
- **Commit Format**: `type(scope): subject` (e.g., `feat(icons): adding svgo processor`)

## Domain Context
This layer enhances Nuxt Content by providing components that can be referenced within markdown content. It enables content authors to embed complex UI elements (icons, optimized images, interactive maps, dynamic components) using simple attributes in their markdown files. The layer integrates deeply with:
- **@nuxt/content's markdown-it renderer** for custom markdown processing
- **nuxt-svg-icon-sprite** for optimized SVG delivery
- **@nuxt/image** for responsive image optimization
- **nuxt3-interpolation** for enhanced content interpolation

The "Attribute" prefix distinguishes these content-enhancement components from standard UI components.

## Important Constraints
- **Nuxt 4 Compatibility**: Must maintain compatibility with Nuxt 4.x
- **Peer Dependencies**: @nuxtjs/leaflet is optional (peer dependency with meta)
- **Node Version**: Implicitly requires Node.js compatible with Nuxt 4
- **ESM Only**: Package type is `module` - no CommonJS support
- **TypeScript Strict Mode**: All code must pass strict TypeScript checks
- **Backward Compatibility**: Exported functions maintain original names alongside new names
- **CSS Variable Fallbacks**: All custom properties must have sensible fallbacks
- **Layer Distribution**: Must work as an extended layer in consuming projects

## External Dependencies
- **@nuxt/content**: Core dependency for markdown rendering and content management
- **@nuxt/image**: Image optimization and responsive image handling
- **nuxt-svg-icon-sprite**: SVG sprite generation and management
- **nuxt-ipx-cache**: Image caching layer for performance
- **nuxt-lazyimages**: Lazy loading implementation for images
- **nuxt3-interpolation**: Enhanced interpolation in content
- **@nuxtjs/leaflet**: Optional map integration via Leaflet.js
- **@nuxtjs/seo**: SEO meta tag management
- **markdown-it**: Markdown parser (accessed via @nuxt/content)
- **svgo**: SVG optimization library
- **better-sqlite3**: SQLite database for caching/storage
- **zod v4**: Runtime validation and schema definition
