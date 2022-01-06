import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Prenota from '../views/Prenota'
import Prenotazioni from '../views/Prenotazioni'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/prenota',
    name: 'Prenota',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Prenota
  },
  {
    path: '/prenotazioni',
    name: 'Prenotazioni',
    component: Prenotazioni
  }
]

const router = new VueRouter({
  routes
})

export default router
