<script setup lang="ts">  
  import EditCategories from '@/components/Setup/Categories/EditCategories.vue'
  import AddCategories from '../components/Setup/Categories/AddCategories.vue'
  import AddCards from '../components/Setup/Cards/AddCards.vue'
  import EditCards from '../components/Setup/Cards/EditCards.vue'

</script>

<template>  
  <v-container class="text-center bg-grey-lighten-3">      
      <v-row>
        <v-col xs="12" sm="12" md="6" lg="6">
          <AddCategories/>
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6">
          <EditCategories/>
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6">
          <AddCards/>
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6">
          <EditCards/>
        </v-col>
      </v-row>       
  </v-container>
  
 
</template>
