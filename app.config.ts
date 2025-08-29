export default defineAppConfig({
  attributeContent: {
    name: 'Nuxt Attribute Content',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    attributeContent?: {
      /** Project name */
      name?: string
    }
  }
}
