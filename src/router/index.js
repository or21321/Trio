import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/pages/home.vue'
import board from '@/pages/board.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: home
  },
  {
    path: '/b/:boardId',
    name: 'Board',
    component: board
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
