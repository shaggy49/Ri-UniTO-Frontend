import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Prenota from '../views/Prenota'
import Prenotazioni from '../views/Prenotazioni'
import GestioneInsegnanti from '../views/admin/GestioneInsegnanti'
import GestioneCorsi from '../views/admin/GestioneCorsi'
import GestionePrenotazioni from '../views/admin/GestionePrenotazioni'


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
  },
  {
    path: '/admin/insegnanti',
    name: 'insegnanti',
    component: GestioneInsegnanti
  },
  {
    path: '/admin/corsi',
    name: 'corsi',
    component: GestioneCorsi
  },
  {
    path: '/admin/prenotazioni',
    name: 'prenotazioni',
    component: GestionePrenotazioni
  }
]

const router = new VueRouter({
  routes
})

export default router
