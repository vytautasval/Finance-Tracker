<script setup lang="ts">
import { ref, nextTick, inject, computed, type Ref } from 'vue'
import type { Card, Cards, Operations} from '../../usedTypes'
import { entryAvailable, numericalInputCheckCard } from './cardValidations';

const cards = inject('cards') as Cards
const operations = inject('operations') as Operations
const dialog = ref()
const editingCard = ref()
const editingCardDigits = ref()
const isEntryAvailable = computed(() => entryAvailable(editingCardDigits.value, cards).value)

const selectedCardIndex: Ref<number> = ref(0)

const initialCard = ref()

/** Sets card and card.lastDigits to proxy values. */
const setupActions = async (card: Card, index: number) => {    
    selectedCardIndex.value = index

    editingCard.value = card
    editingCardDigits.value = card.lastDigits    

    initialCard.value = card.lastDigits
}
/** Focuses on the input field once it has loaded. */
const selectCard = async() => {
    await nextTick()
    const inputField = document.getElementById('text-field')
    if (inputField) {
        inputField.focus()
    } 
}

/** Writes the new value to localStorage and sets the proxy back to null. */
const updateCard = () => {
    
    if (editingCardDigits.value && isEntryAvailable.value) {
        cards.list[selectedCardIndex.value].lastDigits = editingCardDigits.value

        operations.list = operations.list.map(operation => {
            if (operation.card === initialCard.value) {
                return {...operation, card: editingCardDigits.value}
            }
            return operation
        })
        localStorage.setItem('operations', JSON.stringify(operations.list))
        localStorage.setItem('cards', JSON.stringify(cards.list))    
        
    }
    editingCard.value = null
    editingCardDigits.value = 0
}
/** Retires selected card based on index from localStorage. */
const retireCard = (index: number) => {    
    if (!cards.list[index].retired) {
        cards.list[index].retired = true
    } else {
        cards.list[index].retired = false
    }        
     localStorage.setItem('cards', JSON.stringify(cards.list))
}

</script>

<template> 
    <v-card class="pa-4 bg-yellow-lighten-2 ">
        <v-card-title>
            Active cards:
        </v-card-title>
        <v-card-subtitle class="pb-2" v-if="cards.list.length > 0">
            Click the pencil to edit, or the eye to retire a card.
        </v-card-subtitle>
        <v-card-subtitle class="pb-2" v-else>
            No cards available.
        </v-card-subtitle>
        <template v-for="(card, index) in cards.list" :key="card.name">
            <v-chip 
            class="black ma-1" 
            variant="elevated" v-if="!card.retired">        
            {{ card.lastDigits }}            
            <v-btn
            class="ma-2" 
            @click="setupActions(card, index), dialog = true, selectCard()" 
            size="medium" color="white" icon="mdi-pencil" variant="plain"></v-btn>
            <v-btn 
            @click="setupActions(card, index), retireCard(index)" 
            size="medium" color="white" icon="mdi-eye-off" variant="plain"></v-btn>
        </v-chip>   
        </template>

        <template v-if="cards.list.some((card) => card.retired)">
            <v-card-title>
                Retired cards:
            </v-card-title>
            <v-card-subtitle class="pb-2">
            Click again to reactivate.
            </v-card-subtitle>        
            <template
            v-for="(card, index) in cards?.list" :key="card.lastDigits">
                <v-chip
                class="black ma-1" 
                variant="elevated"
                v-if="card.retired">
                    {{ card.lastDigits }}
                    <v-btn
                    class="ma-2" 
                    @click="setupActions(card, index), retireCard(index)" 
                    size="medium" color="white" icon="mdi-eye" variant="plain"></v-btn>
                </v-chip>
            </template>  
        </template> 
        <v-dialog v-model="dialog" width="400">
            <v-card class="pa-4 bg-grey-lighten-3">
                <v-card-title>
                    Edit card:
                </v-card-title>
                <v-form 
                @keypress.enter="updateCard(), dialog = false" 
                @submit.prevent="updateCard(), dialog = false">
                    <v-text-field
                    @paste.prevent
                    maxLength=4
                    @keypress="numericalInputCheckCard"
                    v-model="editingCardDigits"
                    label="Enter a card.."
                    id="text-field">
                    </v-text-field>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn class="bg-yellow-lighten-2 rounded-pill" :disabled="!isEntryAvailable" type="submit">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-dialog>
        
        
    </v-card>
</template>
