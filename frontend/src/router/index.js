import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'

// MODE LOCAL : Authentification désactivée
const LOCAL_MODE = true

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/history' // Rediriger vers l'historique (dashboard)
    },
    // Routes auth (désactivées en mode local)
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: () => import('@/views/LoginView.vue'),
    //   meta: { requiresGuest: true }
    // },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: () => import('@/views/RegisterView.vue'),
    //   meta: { requiresGuest: true }
    // },
    {
      path: '/scanner',
      name: 'Scanner',
      component: () => import('@/views/ScannerView.vue'),
      meta: { requiresAuth: false } // Désactivé en mode local
    },
    {
      path: '/photo',
      name: 'Photo',
      component: () => import('@/views/PhotoView.vue'),
      meta: { requiresAuth: false } // Désactivé en mode local
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchView.vue'),
      meta: { requiresAuth: false } // Désactivé en mode local
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('@/views/HistoryView.vue'),
      meta: { requiresAuth: false } // Désactivé en mode local
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: false } // Désactivé en mode local
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // MODE LOCAL : Laisser passer toutes les requêtes sans authentification
  if (LOCAL_MODE) {
    next()
    return
  }

  // MODE CONNECTÉ (futur) : Vérifier l'authentification
  // const authStore = useAuthStore()
  // const isAuthenticated = authStore.isAuthenticated

  // if (to.meta.requiresAuth && !isAuthenticated) {
  //   next({ name: 'Login' })
  // } else if (to.meta.requiresGuest && isAuthenticated) {
  //   next({ name: 'Scanner' })
  // } else {
  //   next()
  // }

  next()
})

export default router
