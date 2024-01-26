import { computed } from "vue"
import type { Cards, Categories, Operations } from "../usedTypes"

/* Filters through cards that are not retired. */
export const filteredCards = (cards: Cards) => computed(() => {
    const result = cards.list.filter((card) => card.retired === false)
    if (result.length > 0) {
        return result
    }
    return []
})
/* Returns an array of all unretired card.lastDigits. */
export const cardSelection = (cards: Cards) => computed(() => {
    if (filteredCards(cards).value) {
        return filteredCards(cards).value.map(card => card.lastDigits)
    }
    return []
   })
/* Filters through categories that are not retired. */
export const filteredCategories = (categories: Categories) => computed(() => {
    const result = categories.list.filter((category) => category.retired === false)
    if (result.length > 0) {
        return result
    }
    return []
})
/* Returns an array of all unretired category.name. */
export const categorySelection = (categories: Categories) => computed(() => {
    if (filteredCategories(categories).value) {
        return filteredCategories(categories).value!.map(category => category.name)
    }
    return []
})

export const filteredOperations = (operations: Operations, currentDate: Date) => computed(() => {
    const resultDates = operations.list.filter((operation) => {
        const operationDate = new Date(operation.date)
        return operationDate.getFullYear() === currentDate.getFullYear() &&
        operationDate.getMonth() === currentDate.getMonth()        
    })
    const resultOutflows = resultDates.filter((operation) => operation.amount < 0)

    if (resultOutflows.length > 0) {
        return resultOutflows
    }
    return []
})
export const operationSelection = (operations: Operations, currentDate: Date) => computed(() => {
    if (filteredOperations(operations, currentDate).value) {
        return filteredOperations(operations, currentDate).value!.map(operation => operation.amount)
    }
    return []
})
export const totalAmountByCategory = (operations: Operations, currentDate: Date, category: string) => computed(() => {
    const filteredDates = operations.list.filter((operation) => {
      const operationDate = new Date(operation.date);
      return operation.category === category && operationDate.getFullYear() ===
       currentDate.getFullYear() && operationDate.getMonth() === currentDate.getMonth()
    })
    const filteredOutflows = filteredDates.filter((operation) => operation.amount < 0)
    return filteredOutflows.reduce((total, operation) => total + operation.amount, 0)
  })