<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import type { Ref } from 'vue'
import type { Cards } from '@/utilities/types'
import { filteredCards, cardSelection } from '@/utilities/filtrations'

const cards = inject('cards') as Cards

const selectableCards = computed(() => cardSelection(cards).value)

const selectedCard: Ref<number | null> = ref(
  filteredCards(cards).value && filteredCards(cards).value.length > 0
    ? filteredCards(cards).value[0].lastDigits
    : 0
)
const selectedCardObject = computed(() =>
  cards.list.find((card) => card.lastDigits === selectedCard.value)
)
const finalCard = computed(() => `${selectedCardObject.value!.amount}€`)
</script>
<template>
  <v-card class="bg-yellow-lighten-2" title="Total Balance:">
    <v-card-subtitle> Total balance by card. </v-card-subtitle>
    <v-card-subtitle v-if="cards.list.length === 0">
      Please add a card in "Setup" first.
    </v-card-subtitle>
    <v-card-actions class="align-start">
      <v-select
        :disabled="!selectedCard"
        label="Select card.."
        :items="selectableCards"
        v-model="selectedCard"
      ></v-select>
      <v-card-text
        class="text-h4 font-weight-bold"
        :id="Math.sign(selectedCardObject ? selectedCardObject.amount : 0) === 1 ? 'green' : 'red'"
      >
        {{ selectedCardObject ? finalCard : '' }}</v-card-text
      >
    </v-card-actions>
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
