import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import LoginMedicoView from '@/views/LoginMedicoView.vue'
import CadastroMedicoView from '@/views/CadastroMedicoView.vue'

// https://nexus-saude-app.web.app

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/loginMedico',
      name: 'loginMedico',
      component: LoginMedicoView
    },
    {
      path: '/cadastromedico',
      name: 'CadastroMedico',
      component: CadastroMedicoView
    },
  ]
})

export default router
