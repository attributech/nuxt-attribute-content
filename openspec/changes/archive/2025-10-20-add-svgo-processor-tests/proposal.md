# Change Proposal: Add SVGO Processor Tests

## Why
The `svgoProcessor` utility was recently added to optimize SVG sprites using SVGO, but lacks test coverage. Without tests, we cannot verify that the processor correctly optimizes SVGs, handles edge cases, or maintains backward compatibility as the codebase evolves.

## What Changes
- Add comprehensive unit tests for `svgoProcessor` utility
- Test SVG optimization behavior with valid SVG input
- Test edge cases (empty strings, invalid SVG, null/undefined)
- Test integration with nuxt-svg-icon-sprite processor pipeline
- Verify SVGO configuration (multipass optimization)

## Impact
- **Affected specs**: `svg-processing` (new capability)
- **Affected code**: 
  - `utils/svgoProcessor.ts` (existing)
  - `tests/svgoProcessor.test.ts` (new)
  - `nuxt.config.ts:52` (verified processor usage)
- **Breaking changes**: None
- **Dependencies**: Uses existing `vitest` and `svgo` packages
