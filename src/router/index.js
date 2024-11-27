import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CadastroView from '@/views/CadastroView.vue'
import ConsultasView from '@/views/ConsultasView.vue'
import ContatoView from '@/views/ContatoView.vue'  
import SobreView from '@/views/SobreView.vue'    

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
      path: '/cadastro',
      name: 'Cadastro',
      component: CadastroView
    },
    {
      path: '/contato',
      name: 'contato',
      component: ContatoView
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: SobreView  
    },
    {
      path: '/consultas',
      name: 'Consultas',
      component: ConsultasView
    },
  ]
})

export default router
