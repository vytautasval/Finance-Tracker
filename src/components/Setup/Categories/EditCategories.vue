<script setup lang="ts">
import { ref, nextTick, inject, computed, type Ref } from 'vue'
import type { Category, Categories, Operations } from '@/utilities/types'
import { entryAvailable } from './categoryValidations'

const categories = inject('categories') as Categories
const operations = inject('operations') as Operations
const editingCategory = ref()
const editingCategoryName = ref()
const dialog = ref()
const isEntryAvailable = computed(() => entryAvailable(editingCategoryName.value, categories).value)

const selectedCategoryIndex: Ref<number> = ref(0)

const initialCategory = ref()

/** Sets category and category.name to proxy values. */
const setupActions = async (category: Category, index: number) => {
  selectedCategoryIndex.value = index
  editingCategory.value = category
  editingCategoryName.value = category.name

  initialCategory.value = category.name
}
/** Focuses on the input field once it has loaded. */
const selectCategory = async () => {
  await nextTick()
  const inputField = document.getElementById('text-field')
  if (inputField) {
    inputField.focus()
  }
}

/** Writes the new value to localStorage and sets the proxy back to null. */
const updateCategory = () => {
  if (editingCategoryName.value && isEntryAvailable.value) {
    categories.list[selectedCategoryIndex.value].name =
      editingCategoryName.value.charAt(0).toUpperCase() + editingCategoryName.value.slice(1)
    operations.list = operations.list.map((operation) => {
      if (operation.category === initialCategory.value) {
        return { ...operation, category: editingCategoryName.value }
      }
      return operation
    })

    localStorage.setItem('operations', JSON.stringify(operations.list))
    localStorage.setItem('categories', JSON.stringify(categories.list))
  }
  editingCategory.value = null
  editingCategoryName.value = ''
}

/** Retires selected category based on index from localStorage. */
const retireCategory = (index: number) => {
  if (!categories.list[index].retired) {
    categories.list[index].retired = true
  } else {
    categories.list[index].retired = false
  }
  localStorage.setItem('categories', JSON.stringify(categories.list))
}
</script>

<template>
  <v-card class="pa-4 bg-yellow-lighten-2">
    <v-card-title class="bold"> Active categories: </v-card-title>
    <v-card-subtitle class="pb-2" v-if="categories.list.length > 0">
      Click the pencil to edit, or the eye to retire a category.
    </v-card-subtitle>
    <v-card-subtitle class="pb-2" v-else> No categories available. </v-card-subtitle>
    <template v-for="(category, index) in categories.list" :key="index">
      <v-chip class="black ma-1" variant="elevated" v-if="!category.retired">
        {{ category.name }}
        <v-btn
          class="ma-2"
          @click="setupActions(category, index), (dialog = true), selectCategory()"
          size="medium"
          color="white"
          icon="mdi-pencil"
          variant="plain"
        ></v-btn>
        <v-btn
          @click="setupActions(category, index), retireCategory(index)"
          size="medium"
          color="white"
          icon="mdi-eye-off"
          variant="plain"
        ></v-btn>
      </v-chip>
    </template>

    <template v-if="categories.list.some((category) => category.retired)">
      <v-card-title> Retired categories: </v-card-title>
      <v-card-subtitle class="pb-2"> Click again to reactivate. </v-card-subtitle>
      <template v-for="(category, index) in categories?.list" :key="category.name">
        <v-chip class="black ma-1" variant="elevated" v-if="category.retired">
          {{ category.name }}
          <v-btn
            class="ma-2"
            @click="setupActions(category, index), retireCategory(index)"
            size="medium"
            color="white"
            icon="mdi-eye"
            variant="plain"
          ></v-btn>
        </v-chip>
      </template>
    </template>
    <v-dialog v-model="dialog" width="400">
      <v-card class="pa-4 bg-grey-lighten-3">
        <v-card-title> Edit category: </v-card-title>
        <v-form
          @keypress.enter="updateCategory(), (dialog = false)"
          @submit.prevent="updateCategory(), (dialog = false)"
        >
          <v-text-field v-model="editingCategoryName" label="Enter a category.."> </v-text-field>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn
                class="bg-yellow-lighten-2 rounded-pill"
                :disabled="!isEntryAvailable"
                type="submit"
              >
                Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>
