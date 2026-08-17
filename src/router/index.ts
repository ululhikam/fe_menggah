import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from './public.routes'
import { adminRoutes } from './admin.routes'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  },
  routes: [
    // Public portal routes
    ...publicRoutes,

    // Admin panel routes (protected)
    ...adminRoutes,

    // Auth routes
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Masuk — Admin Dusun Menggah', guest: true },
    },
    {
      path: '/register',
      redirect: '/login'
    },

    // 404 catch-all
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Halaman Tidak Ditemukan — Dusun Menggah' },
    },
  ],
})

// Navigation guard
router.beforeEach(async (to) => {
  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const authStore = useAuthStore()

  // Initialize auth state if needed
  if (!authStore.initialized) {
    await authStore.initialize()
  }

  // Redirect logged-in users away from guest-only pages
  if (to.meta.guest && authStore.isAuthenticated) {
    return authStore.isAdmin ? '/admin' : '/'
  }

  // Protect admin routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // Check role requirements
  if (to.meta.requiredRole) {
    const roles = to.meta.requiredRole as string[]
    if (!roles.includes(authStore.userRole ?? '')) {
      return '/'
    }
  }
})

export default router
