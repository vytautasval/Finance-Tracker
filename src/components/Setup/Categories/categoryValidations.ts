import { computed } from 'vue'
import type { Categories } from '../../usedTypes'

export const entryNotEmpty = (theCategory: string) =>
  computed(() => {
    return theCategory.length > 0 && theCategory.length <= 30
  })
export const entryNotUsed = (theCategory: string, categories: Categories) =>
  computed(() => {
    return categories
      ? !categories.list.some(
          (category) => category.name.toLowerCase() === theCategory.toLowerCase()
        )
      : false
  })
export const entryAvailable = (theCategory: string, categories: Categories) =>
  computed(() => {
    return entryNotEmpty(theCategory).value && entryNotUsed(theCategory, categories).value
  })
