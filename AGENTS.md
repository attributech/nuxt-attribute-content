<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Nuxt Documentation
If you want to look up information for Nuxt, use the `context7` mcp. It provides the library `/nuxt/nuxt`. DO not look up other libraries for nuxt documentation using `mcp__context7__resolve-library-id` for nuxt. Do not use the `nuxt` mcp and it's `search_nuxt_docs` tool for looking up nuxt documentation.

## Nuxt Modules
If you want to look up information about modules for Nuxt, use the `nuxt` mcp. It provides the `list_nuxt_modules` tool.

## Other Documentation
Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.
