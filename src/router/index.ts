import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SetupView from '../views/SetupView.vue'

const formattedDate = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  return `${year}-${month < 10 ? `0${month}` : month}`
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // Redirect is to route to the current month by default.
      redirect: () => {
        return { name: 'Date', params: { date: formattedDate() } }
      }
    },
    {
      path: '/:date',
      name: 'Date',
      component: HomeView,
      props: true
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupView
    }
  ]
})

export default router
