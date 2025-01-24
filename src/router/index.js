import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CadastroView from '@/views/CadastroView.vue'
import ContatoView from '@/views/ContatoView.vue'  
import SobreView from '@/views/SobreView.vue'    
import MedicosView from '@/views/MedicosView.vue'
import DetalhesmedicosView from '@/views/DetalhesmedicosView.vue'
import AgendamentoConsultasView from '@/views/AgendamentoConsultasView.vue'
import ConsultasAgendandasView from '@/views/ConsultasAgendandasView.vue'
import PerfilMedico from '@/views/PerfilMedico.vue'
import PerfilPaciente from '@/views/PerfilPaciente.vue'
import AgendaMedica from '@/views/AgendaMedica.vue'





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
      path: '/consultasAgendadas',
      name: 'Consultas',
      component: ConsultasAgendandasView
    },
    {
      path: '/medicos',
      name: 'Medicos',
      component: MedicosView
    },
    {
      path: '/medicos/:id',
      name: 'DetalhesMedicos',
      props: true, 
      component: DetalhesmedicosView  
    },
    {
      path: '/Agendamento',
      name: 'Agendamento',
      props: true, 
      component: AgendamentoConsultasView
    },
    {
      path: '/perfilMedico',
      name: 'perfilmedico',
      props: true, 
      component: PerfilMedico
    },
    {
      path: '/perfilPaciente',
      name: 'perfil',
      props: true, 
      component: PerfilPaciente
    },
    {
      path: '/agendaMedica',
      name: 'agenda',
      props: true, 
      component: AgendaMedica
    },
  ]
})

export default router
