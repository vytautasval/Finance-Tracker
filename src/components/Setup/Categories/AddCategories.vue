<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'
import type { Category, Categories } from '@/utilities/types'
import { entryAvailable } from './categoryValidations'

const newCategory: Ref<string> = ref('')
const categories = inject('categories') as Categories

const isEntryAvailable = computed(() => entryAvailable(newCategory.value, categories).value)

/** Creates new category and sets it in local storage. */
const addNewCategory = () => {
  const categoryEntry: Category = {
    name: newCategory.value.charAt(0).toUpperCase() + newCategory.value.slice(1),
    amount: 0,
    retired: false
  }

  if (categories) {
    categories.list.push(categoryEntry)
    localStorage.setItem('categories', JSON.stringify(categories.list))
  }

  newCategory.value = ''
}
</script>
<template>
  <v-card class="pa-4 bg-yellow-lighten-2">
    <v-card-title> Enter a new category below. </v-card-title>
    <v-card-subtitle class="pb-2"> Up to 30 characters. </v-card-subtitle>
    <v-form @submit.prevent="addNewCategory">
      <v-text-field
        label="Create new category.."
        placeholder="leisure"
        required
        v-model="newCategory"
      >
      </v-text-field>
      <v-btn class="bg-yellow-lighten-2 rounded-pill" :disabled="!isEntryAvailable" type="submit"
        >Submit</v-btn
      >
    </v-form>
  </v-card>
</template>
