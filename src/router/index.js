import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../Views/HomePage.vue'
import PlanningPage from '../Views/PlanningPage.vue'
import LoginPage from '../Views/LoginPage.vue'
import SignupPage from '../Views/SignupPage.vue'
import StartBuilding from '../Views/Startbuilding.vue'
import WordEditor from '../Views/WordEditor.vue'
import ForgotPassword from '../Views/ForgotPassword.vue'
import Dashboard from '../Views/Dashboard.vue'
import AIAssistant from '../Views/Aiassistant.vue'
import TermsOfService from '../Views/TermsOfService.vue'
import PrivacyPolicy from '../Views/PrivacyPolicy.vue'
import { authService } from '../services/auth.js'

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
      component: LoginPage,
      meta: { public: true }
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignupPage,
      meta: { public: true }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: { public: true }
    },
    {
      path: '/startbuilding',
      name: 'StartBuilding',
      component: StartBuilding
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/ai-assistant',
      name: 'AIAssistant',
      component: AIAssistant
    },
    {
      path: '/editor/:id?',
      name: 'WordEditor',
      component: WordEditor
    },
    {
      path: '/terms-of-service',
      name: 'TermsOfService',
      component: TermsOfService,
      meta: { public: true }
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy,
      meta: { public: true }
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 96 }
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authenticated = authService.isLoggedIn()

  if (!to.meta.public && !authenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'SignUp') && authenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router