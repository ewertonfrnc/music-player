import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '../stores/user'

import Home from '../views/Home.vue'
import Manage from '../views/Manage.vue'
import Song from '../views/Song.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'manage',
      path: '/manage-music',
      component: Manage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/manage',
      redirect: { name: 'manage' }
    },
    {
      name: 'song',
      path: '/song/:id',
      component: Song
    },
    {
      path: '/:catchAll(.*)*',
      redirect: { name: 'home' }
    }
  ],
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const { user } = useUserStore()
  if (user) next()
  else next({ name: 'home' })
})

export default router
