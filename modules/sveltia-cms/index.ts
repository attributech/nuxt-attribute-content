import { defineNuxtModule, useLogger, resolvePath } from 'nuxt/kit'
import { build } from 'vite'
import fs from 'node:fs'
import { viteConfigCms } from './vite.config.cms'

/*
 * Builds sveltia cms when nuxt is being built.
 */
export default defineNuxtModule({
  meta: {
    name: 'sveltia-cms',
    configKey: 'sveltiaCms',
  },
  setup(options, nuxt) {
    nuxt.hook('build:before', async () => {
      const resolvedPath = await resolvePath(viteConfigCms.root as string)
      if (!fs.existsSync(resolvedPath)) {
        const logger = useLogger()
        logger.warn(`sveltia-cms: Path "${resolvedPath}" doesn't exist. Build was skipped.`)
        return
      }
      // Enable watch for development mode
      if (nuxt.options.dev === true && viteConfigCms.build !== undefined) {
        viteConfigCms.build.watch = {}
      }
      await build(viteConfigCms)
    })
  },
})
