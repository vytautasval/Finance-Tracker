<script setup lang="ts">
import { inject, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Operations, Categories } from '@/utilities/types'
import { operationSelection, totalAmountByCategory } from '@/utilities/filtrations'

const route = useRoute()
const router = useRouter()

const operations = inject('operations') as Operations
const categories = inject('categories') as Categories

/** Refreshes the current date if any changes occur.
 * Sets it as the current route param. */
const currentDate = computed(
  () => new Date(typeof route.params.date === 'string' ? route.params.date : new Date())
)

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const totalMonthlyAmount = computed(() =>
  operationSelection(operations, currentDate.value).value.reduce(
    (accumulator, operation) => accumulator + operation,
    0
  )
)

/** Reformats date if it changes. */
const formattedDate = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}-${month < 10 ? `0${month}` : month}`
})

/** Checks if next month is a further date than the current real date. Returns boolean. */
const isNextMonthInFuture = computed(() => {
  const nextMonth = new Date(currentDate.value.getTime())
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  return nextMonth > new Date()
})

/** Subtracts one from the currently selected month and pushes the new date to router. */
const goToPreviousMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  router.push({ name: 'Date', params: { date: formattedDate.value } })
}

/** Adds one to the currently selected month and pushes the new date to router.
 * Also calls IsNextMonthInFuture function to disable going to dates in the future.
 */
const goToNextMonth = () => {
  if (!isNextMonthInFuture.value) {
    currentDate.value.setMonth(currentDate.value.getMonth() + 1)
    router.push({ name: 'Date', params: { date: formattedDate.value } })
  }
}
</script>
<template>
  <v-card class="mt-2 bg-yellow-lighten-2">
    <v-card-title> Monthly Expenses: </v-card-title>
    <v-card-subtitle> Expenses by month. </v-card-subtitle>

    <v-card-title class="text-h5">
      {{ monthNames[currentDate.getMonth()] }}, {{ currentDate.getFullYear() }}</v-card-title
    >

    <v-card-text class="ma-2 text-h4 font-weight-bold" :id="totalMonthlyAmount === 0 ? '' : 'red'">
      {{ totalMonthlyAmount }}€
    </v-card-text>
    <v-btn
      elevation="2"
      class="mb-4 me-2 rounded-pill bg-yellow-lighten-2"
      @click="goToPreviousMonth"
    >
      Previous Month</v-btn
    >
    <v-btn
      elevation="2"
      class="mb-4 ms-2 rounded-pill bg-yellow-lighten-2"
      @click="goToNextMonth"
      :disabled="isNextMonthInFuture"
    >
      Next Month</v-btn
    >

    <v-table class="bg-yellow-lighten-5">
      <thead>
        <tr>
          <th class="text-center font-weight-bold">Category</th>
          <th class="text-center font-weight-bold">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories.list" :key="index">
          <td>{{ category.name }}</td>
          <td
            :id="
              totalAmountByCategory(operations, currentDate, category.name).value === 0 ? '' : 'red'
            "
          >
            {{ totalAmountByCategory(operations, currentDate, category.name).value }}€
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>
<style scoped>
#red {
  color: red;
}
</style>
