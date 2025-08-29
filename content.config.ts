import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    menu: defineCollection({
      source: 'menu/**.yml',
      type: 'data',
      schema: z.object({
        items: z.array(
          z.object({
            title: z.string(),
            path: z.string(),
          }),
        ),
      }),
    }),
  },
})
