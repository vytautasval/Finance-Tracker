import { createApp, reactive } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
    components,
    directives    
  })
const app = createApp(App)

const storedHabits = localStorage.getItem('habits')
app.provide('habits', reactive({    
    list: storedHabits ? JSON.parse(storedHabits) : []
}))

const storedCategories = localStorage.getItem('categories')
app.provide('categories', reactive({
  list: storedCategories ? JSON.parse(storedCategories) : []
}))

const storedCards = localStorage.getItem('cards')
app.provide('cards', reactive({
  list: storedCards ? JSON.parse(storedCards) : []
}))

const storedOperations = localStorage.getItem('operations')
app.provide('operations', reactive({
  list: storedOperations ? JSON.parse(storedOperations) : []
}))

app.use(router).use(vuetify)

app.mount('#app')
