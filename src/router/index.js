import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import LivrosView from '../views/LivrosView.vue'
import AlugueisView from '../views/AlugueisView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView
    },
    {
      path: '/livros',
      name: 'livros',
      component: LivrosView
    },
    {
      path: '/alugueis',
      name: 'alugueis',
      component: AlugueisView
    }
  ]
})

export default router
