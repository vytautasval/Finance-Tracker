export interface Category {
  name: string
  amount: number
  retired: boolean
}
export interface Categories {
  list: Category[]
}

export interface Card {
  lastDigits: number
  amount: number
  retired: boolean
}
export interface Cards {
  list: Card[]
}
export interface OperationEntry {
  name: string
  amount: number
  date: string
  category: string
  card: number | null
}
export interface Operations {
  list: OperationEntry[]
}
