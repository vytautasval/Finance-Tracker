<script setup lang="ts">
import { ref, computed, inject  } from 'vue'
import type { Ref } from 'vue'
import formatDate from '@/components/formatDate'  
import type { OperationEntry, Operations, Categories, Cards} from '../../usedTypes'
import { nameEntryValid, amountEntryValid, numericalInputCheck } from './operationValidations'
import {filteredCards, cardSelection, filteredCategories, categorySelection} from '../filtrations'

const operations = inject('operations') as Operations
const categories = inject('categories') as Categories
const cards = inject('cards') as Cards

const newOperation: Ref<string> = ref('')
const newAmount: Ref<number> = ref(0)
const newDate: Ref<string> = ref(formatDate(new Date()))

const newCategory: Ref<string> = ref(
    filteredCategories(categories).value && filteredCategories(categories).value.length > 0 
    ? filteredCategories(categories).value[0].name 
    : ''
)  
const newCard: Ref<number | null> = ref(
filteredCards(cards).value && filteredCards(cards).value.length > 0 
    ? filteredCards(cards).value[0].lastDigits 
    : null
)

const InOutSwitch = ref()

const selectableCards = computed(() => cardSelection(cards).value)
const selectableCategories = computed(() => categorySelection(categories).value)

const isEntryValid = computed(() => nameEntryValid(newOperation.value).value)
const isAmountValid = computed(() => amountEntryValid(newAmount.value).value)
const isCardNotNull = computed(() => newCard.value !== null)

/** Adds new operation amount to selected card total */
function addCardAmount() {

    const selectedCardObject = computed(() => cards.list.find(card => card.lastDigits === newCard.value)) 
    
    if (selectedCardObject.value) {
        const i = cards.list.findIndex(card => card.lastDigits === selectedCardObject.value!.lastDigits)
        
        cards.list[i].amount += Number(newAmount.value!)       
        localStorage.setItem('cards', JSON.stringify(cards.list))
    }
}
/** Adds new operation amount to selected category total */
function addCategoryAmount() {
    const selectedCategoryObject = computed(() => categories.list.find(category => category.name === newCategory.value)) 
    
    if (selectedCategoryObject.value) {
        const i = categories.list.findIndex(category => category.name === selectedCategoryObject.value!.name)
        
        categories.list[i].amount += Number(newAmount.value!)       
        localStorage.setItem('categories', JSON.stringify(categories.list))
    }
}

/** Writes new operation to localStorage. Also calls updates on cards and categories. */
const addNewOperation = () => {
    

    if (document.getElementById('outflow')) {
        newAmount.value = -
        Math.abs(newAmount.value)
        }

        const operationEntry: OperationEntry = {
        name: newOperation.value,        
        amount: newAmount.value,        
        date: newDate.value,
        category: newCategory.value,
        card: newCard.value
    }
    
    if (operations) {
        operations.list.push(operationEntry)
        localStorage.setItem('operations', JSON.stringify(operations.list))
    }
    addCardAmount()
    addCategoryAmount()

    newOperation.value = ''
    newAmount.value = 0
    newCategory.value = ''
    newDate.value = formatDate(new Date())
    newCard.value = null
    
}

</script>
<template>
    <v-btn class="ma-2 bg-yellow-lighten-2 rounded-pill" size="x-large">New Operation
    <v-dialog activator="parent" width="400">
        <v-card class="pa-4 bg-grey-lighten-3">
            <v-row justify="center">
                <v-col cols="auto">
                    <v-card-title>Enter new operation:</v-card-title>
                </v-col>
            </v-row>
            <v-row justify="center">                
                <v-col cols="auto">                    
                    <v-switch v-model="InOutSwitch" inset base-color="red"  color="success" :label="InOutSwitch === true ? 'Inflow' : 'Outflow'"></v-switch>
                </v-col>
            </v-row>            
            <v-form @submit.prevent="addNewOperation">
                <v-text-field label="Enter an operation.." placeholder="electricity" required v-model="newOperation">
                </v-text-field>
                <v-text-field 
                @paste.prevent v-if="InOutSwitch" @keypress="numericalInputCheck" 
                label="Enter the amount.." placeholder="15.75" required v-model="newAmount">
                </v-text-field>
                <v-text-field 
                v-else id="outflow" @paste.prevent @keypress="numericalInputCheck" 
                label="Enter the amount.." placeholder="15.75" required v-model="newAmount">
                </v-text-field>
                <v-select label="Select category.." :items="selectableCategories" required v-model="newCategory">
                </v-select>
                <v-text-field label="Select date.." type="date" min="2023-01-01" required v-model="newDate">                    
                </v-text-field>
                <v-select label="Select card.." :items="selectableCards" required v-model="newCard">
                </v-select>
                <v-row justify="center">
                    <v-col cols="auto">
                        <v-btn class="bg-yellow-lighten-2 rounded-pill" :disabled="!isEntryValid || !isAmountValid || !isCardNotNull" type="submit">Submit</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>   
    </v-dialog>
</v-btn>
    
</template>
