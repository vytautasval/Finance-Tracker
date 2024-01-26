<script setup lang="ts">
import { ref, inject, computed } from 'vue'

import type { Card, Cards} from '../../usedTypes'
import { entryAvailable, numericalInputCheckCard } from './cardValidations'


const newCard = ref(0)
const cards = inject('cards') as Cards

const isEntryAvailable = computed(() => entryAvailable(newCard.value, cards).value)

/** Creates new card and sets it in local storage. */
const addNewCard = () => {    
    const cardEntry: Card = {
        lastDigits: newCard.value,        
        amount: 0,
        retired: false
    }
    
    if (cards) {
        cards.list.push(cardEntry)
        localStorage.setItem('cards', JSON.stringify(cards.list))
    }    

    newCard.value = 0   
}

</script>
<template>
    <v-card class="pa-4 bg-yellow-lighten-2">
        <v-card-title>
            Enter a new card below.
        </v-card-title>
        <v-card-subtitle class="pb-2">
            Insert only the last 4 digits of your card.
        </v-card-subtitle>
        <v-form @submit.prevent="addNewCard">
            <v-text-field @paste.prevent maxLength=4 label="Create new card.." @keypress="numericalInputCheckCard" placeholder="1234" required v-model="newCard">
            </v-text-field>
            <v-btn class="bg-yellow-lighten-2 rounded-pill" :disabled="!isEntryAvailable" type="submit">Submit</v-btn>
        </v-form>
    </v-card>  
</template>