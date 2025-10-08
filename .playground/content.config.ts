import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod/v4'

export default defineContentConfig({
  collections: {
    page: defineCollection({
      source: 'page/**.yml',
      type: 'page',
      schema: z.object({
        title: z.string(),
        content: z.array(z.any()),
        headerImages: z.array(z.any()),
      }),
    }),
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
