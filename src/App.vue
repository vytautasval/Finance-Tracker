<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <v-app>
  <header>
    
    <v-container class="text-center bg-grey-lighten-3">
      <nav justify="center">        
        <v-btn variant="plain" to="/">Home</v-btn>
        <v-btn variant="plain" to="/setup">Setup</v-btn>
      </nav>
    </v-container>
    
  </header>

  <RouterView />
</v-app>
</template>

