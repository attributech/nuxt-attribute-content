import { queryCollection, useAsyncData } from '@nuxt/content'

export default function () {
  async function fetchMenuItems(menu) {
    return await queryCollection('menu')
      .where('stem', '=', `menu/${menu}`)
      .first()
  }
  async function fetchMenus() {
    return await queryCollection('menu').all()
  }

  async function fetchMenuItemsAsync(menu) {
    const path = `menu/${menu}`
    return await useAsyncData(
      path,
      async () =>
        await queryCollection('menu').where('stem', '=', path).first(),
    )
  }

  return {
    fetchMenuItems,
    fetchMenus,
    fetchMenuItemsAsync,
  }
}
