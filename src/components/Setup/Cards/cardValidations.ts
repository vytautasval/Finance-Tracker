import { computed } from 'vue'
import type { Cards } from '../../usedTypes'

export const entryNotUsed = (theCard: number, cards: Cards) =>
  computed(() => {
    return cards ? !cards.list.some((card) => card.lastDigits === theCard) : false
  })
export const entryNotEmpty = (theCard: number) =>
  computed(() => {
    return theCard.toString().length === 4
  })

export const entryAvailable = (theCard: number, cards: Cards) =>
  computed(() => {
    return entryNotEmpty(theCard).value && entryNotUsed(theCard, cards).value
  })

export const numericalInputCheckCard = (event: KeyboardEvent) => {
  const char = event.key
  const regex = /^[0-9]$/
  if (!regex.test(char)) {
    event.preventDefault()
  }
}
