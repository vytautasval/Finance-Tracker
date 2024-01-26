<script setup lang="ts">
import { ref, inject, computed, nextTick } from 'vue'
import type { Ref } from 'vue'
import formatDate from '@/utilities/formatDate'
import type { OperationEntry, Operations, Categories, Cards } from '@/utilities/types'
import {
  filteredCards,
  cardSelection,
  filteredCategories,
  categorySelection
} from '@/utilities/filtrations'
import { nameEntryValid, amountEntryValid, numericalInputCheck } from './operationValidations'

const operations = inject('operations') as Operations
const categories = inject('categories') as Categories
const cards = inject('cards') as Cards

const dialog = ref()
const editingOperation = ref()
const editingName: Ref<string> = ref('')
const editingAmount: Ref<number> = ref(0)
const editingDate: Ref<string> = ref(formatDate(new Date()))

const editingCategory: Ref<string> = ref(
  filteredCategories(categories).value && filteredCategories(categories).value.length > 0
    ? filteredCategories(categories).value[0].name
    : ''
)
const editingCard: Ref<number | null> = ref(
  filteredCards(cards).value && filteredCards(cards).value.length > 0
    ? filteredCards(cards).value[0].lastDigits
    : null
)
const initialCard: Ref<number | null> = ref(null)
const initialAmount: Ref<number> = ref(0)
const initialCategory: Ref<string> = ref('')

const InOutSwitch = ref()

const selectedCardObject = computed(() =>
  cards.list.find((card) => card.lastDigits === editingCard.value)
)
const selectedCardIndex = computed(() =>
  cards.list.findIndex((card) => card.lastDigits === selectedCardObject.value!.lastDigits)
)

const selectedCategoryObject = computed(() =>
  categories.list.find((category) => category.name === editingCategory.value)
)
const selectedCategoryIndex = computed(() =>
  categories.list.findIndex((category) => category.name === selectedCategoryObject.value!.name)
)

const selectedOperationIndex: Ref<number> = ref(0)

const isAmountValid = computed(() => amountEntryValid(editingAmount.value).value)
const isEntryValid = computed(() => nameEntryValid(editingName.value).value)

/**
 * Sets up all of the proxy values based on the data in 'operationsEntry' object.
 * @param operationEntry An entry from the 'operations' array of objects. Obtained via loop.
 */
const setupActions = (operationEntry: OperationEntry, index: number) => {
  selectedOperationIndex.value = index

  editingOperation.value = operationEntry
  editingName.value = operationEntry.name
  editingAmount.value = Math.abs(operationEntry.amount)
  editingCategory.value = operationEntry.category
  editingDate.value = operationEntry.date
  editingCard.value = operationEntry.card

  initialCard.value = operationEntry.card
  initialAmount.value = operationEntry.amount
  initialCategory.value = operationEntry.category
}
const selectOperation = async () => {
  await nextTick()
  const inputField = document.getElementById('outflowe') || document.getElementById('inflowe')
  if (inputField) {
    inputField.focus()
  }
}

/**
 * Subtracts the latest operation from old card, and adds the new value to selected card.
 */
function adjustCardAmount() {
  const initialCardIndex = cards.list.findIndex((card) => card.lastDigits === initialCard.value)

  cards.list[initialCardIndex].amount -= initialAmount.value
  cards.list[selectedCardIndex.value].amount += editingAmount.value
  localStorage.setItem('cards', JSON.stringify(cards.list))
}
/**
 * Same as above, just for categories.
 */
function adjustCategoryAmount() {
  const initialCategoryIndex = categories.list.findIndex(
    (category) => category.name === initialCategory.value
  )

  categories.list[initialCategoryIndex].amount -= Number(initialAmount.value)
  categories.list[selectedCategoryIndex.value].amount += Number(editingAmount.value)
  localStorage.setItem('categories', JSON.stringify(categories.list))
}
/** Writes the new value to localStorage and sets the proxy back to null. */
const updateOperation = () => {
  if (isEntryValid.value && isAmountValid.value) {
    editingAmount.value = Math.abs(Number(editingAmount.value)) * (InOutSwitch.value ? 1 : -1)

    operations.list[selectedOperationIndex.value].name = editingName.value
    operations.list[selectedOperationIndex.value].amount = editingAmount.value
    operations.list[selectedOperationIndex.value].category = editingCategory.value
    operations.list[selectedOperationIndex.value].date = editingDate.value
    operations.list[selectedOperationIndex.value].card = editingCard.value

    localStorage.setItem('operations', JSON.stringify(operations.list))

    adjustCardAmount()
    adjustCategoryAmount()
  }
  editingOperation.value = null
  editingName.value = ''
  editingAmount.value = 0
  editingCategory.value = ''
  editingDate.value = formatDate(new Date())
  editingCard.value = null
}
/** Removes selected operation based on index from localStorage. Also subtracts the amount from card and category. */
const deleteOperation = (index: number, operationEntry: OperationEntry) => {
  initialAmount.value = operationEntry.amount

  if (operations) {
    cards.list[selectedCardIndex.value].amount -= Number(initialAmount.value)
    localStorage.setItem('cards', JSON.stringify(cards.list))

    categories.list[selectedCategoryIndex.value].amount -= Number(initialAmount.value)
    localStorage.setItem('categories', JSON.stringify(categories.list))

    operations.list.splice(index, 1)
    localStorage.setItem('operations', JSON.stringify(operations.list))
  }
}

const selectableCards = computed(() => cardSelection(cards).value)
const selectableCategories = computed(() => categorySelection(categories).value)
</script>
<template>
  <v-card class="bg-yellow-lighten-2">
    <v-card-title> Most Recent Operations: </v-card-title>
    <v-card-subtitle class="pb-2" v-if="operations.list.length > 0">
      Click the pencil to edit, or the 'X' to delete an operation.
    </v-card-subtitle>
    <v-card-subtitle class="pb-2" v-else> No operations available. </v-card-subtitle>
    <v-table class="bg-yellow-lighten-5">
      <thead>
        <tr>
          <th class="text-center font-weight-bold">Operation</th>
          <th class="text-center font-weight-bold">Amount</th>
          <th class="text-center font-weight-bold">Category</th>
          <th class="text-center font-weight-bold">Date</th>
          <th class="text-center font-weight-bold">Card used</th>
          <th class="text-center font-weight-bold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(operationEntry, index) in operations.list" :key="index">
          <td>{{ operationEntry.name }}</td>
          <td :id="Math.sign(operationEntry.amount) === 1 ? 'green' : 'red'">
            {{ operationEntry.amount }}€
          </td>
          <td>{{ operationEntry.category }}</td>
          <td>{{ operationEntry.date }}</td>
          <td>{{ operationEntry.card }}</td>
          <td>
            <v-btn
              @click="setupActions(operationEntry, index), (dialog = true), selectOperation()"
              class="bg-white"
              color="black"
              variant="plain"
              icon="mdi-pencil"
            ></v-btn>
            <v-btn
              @click="setupActions(operationEntry, index), deleteOperation(index, operationEntry)"
              class="bg-white"
              color="red"
              variant="plain"
              icon="mdi-close-thick"
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-dialog v-model="dialog" width="400">
      <v-card class="pa-4 bg-grey-lighten-3">
        <v-row justify="center">
          <v-col cols="auto">
            <v-card-title>Edit the operation:</v-card-title>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="auto">
            <v-switch
              v-model="InOutSwitch"
              inset
              base-color="red"
              color="success"
              :label="InOutSwitch === true ? 'Inflow' : 'Outflow'"
            ></v-switch>
          </v-col>
        </v-row>
        <v-form
          @keypress.enter="updateOperation(), (dialog = false)"
          @submit.prevent="updateOperation(), (dialog = false)"
        >
          <v-text-field label="Enter an operation.." v-model="editingName"></v-text-field>

          <v-text-field
            v-if="InOutSwitch"
            @paste.prevent
            @keypress="numericalInputCheck"
            label="Enter the amount.."
            id="inflowe"
            v-model="editingAmount"
          ></v-text-field>

          <v-text-field
            v-else
            @paste.prevent
            @keypress="numericalInputCheck"
            id="outflowe"
            label="Enter the amount.."
            v-model="editingAmount"
          ></v-text-field>

          <v-select
            label="Select category.."
            :items="selectableCategories"
            v-model="editingCategory"
          >
          </v-select>

          <v-text-field label="Enter the date.." type="date" v-model="editingDate"></v-text-field>

          <v-select label="Select card.." :items="selectableCards" v-model="editingCard">
          </v-select>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn
                class="bg-yellow-lighten-2 rounded-pill"
                :disabled="!isEntryValid || !isAmountValid"
                type="submit"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<style scoped>
#green {
  color: green;
}

#red {
  color: red;
}
</style>
