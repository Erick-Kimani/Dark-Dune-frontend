import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../Views/HomePage.vue'
import PlanningPage from '../Views/PlanningPage.vue'
import LoginPage from '../Views/LoginPage.vue'
import SignupPage from '../Views/SignupPage.vue'
import StartBuilding from '../Views/Startbuilding.vue'
import WordEditor from '../Views/WordEditor.vue'
import ForgotPassword from '../Views/ForgotPassword.vue'

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
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword
    },
    {
      path: '/startbuilding',
      name: 'StartBuilding',
      component: StartBuilding
    },
    {
      path: '/editor/:id',
      name: 'WordEditor',
      component: WordEditor
    }
  ]
})

export default router