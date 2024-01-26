<script setup lang="ts">
  import AddOperation from '@/components/Home/Operations/AddOperation.vue'
  import EditOperation from '@/components/Home/Operations/EditOperation.vue'
  import DisplayByCard from '@/components/Home/BalanceActions/DisplayByCard.vue';
  import DisplayByMonth from '@/components/Home/BalanceActions/DisplayByMonth.vue';
  </script>

<template>  
  <v-container class="text-center bg-grey-lighten-3">      
      <v-row>
        <v-col cols="12">
          <AddOperation/>
        </v-col>
        <v-col xs="12" sm="12" md="4" lg="4">
          <DisplayByCard/>
          <DisplayByMonth/> 
        </v-col>
        <v-col xs="12" sm="12" md="8" lg="8">
          <EditOperation/>
        </v-col>
      </v-row>
  </v-container>
</template>
