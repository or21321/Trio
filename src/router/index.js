import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/pages/home.vue'
import board from '@/pages/board.vue'
import boards from '@/pages/boards.vue'
import cardDetails from '@/pages/card-details.vue'
import login from '@/pages/login.vue'
import signup from '@/pages/signup.vue'

Vue.use(VueRouter)

const routes = [
   {
      path: '/',
      name: 'Home',
      component: home
   },
   {
      path: '/b',
      name: 'Boards',
      component: boards
   },
   {
      path: '/b/:boardId',
      name: 'Board',
      component: board,
      children: [
         {
            path: 'g/:groupId/c/:cardId',
            name: 'CardDetails',
            component: cardDetails,
         }]
   },
   {
      path: '/login',
      name: 'Login',
      component: login
   },
   {
      path: '/signup',
      name: 'Signup',
      component: signup
   },
]

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
})

export default router
