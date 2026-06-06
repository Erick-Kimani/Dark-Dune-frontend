import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../Views/HomePage.vue'
import PlanningPage from '../Views/PlanningPage.vue'
import LoginPage from '../Views/LoginPage.vue'
import SignupPage from '../Views/SignupPage.vue'
import CreatefilePage from '../Views/CreatefilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/planning',
      name: 'Planning',
      component: PlanningPage
    },  
    {
      path: '/login',
      name: 'Login',  
      component: LoginPage
    },  
    {
      path: '/signup',
      name: 'SignUp', 
      component: SignupPage 
    },
    {
      path: '/createfile',
      name: 'CreateFile',
      component: CreatefilePage
    }
  ]
})

export default router