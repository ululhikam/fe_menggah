import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiredRole: ['admin', 'super_admin'] },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { title: 'Dashboard — Admin SIP Desa' },
      },
      {
        path: 'kependudukan',
        name: 'AdminResidents',
        component: () => import('@/views/admin/ResidentsView.vue'),
        meta: { title: 'Data Kependudukan — Admin SIP Desa' },
      },
      {
        path: 'surat',
        name: 'AdminLetters',
        component: () => import('@/views/admin/LettersView.vue'),
        meta: { title: 'Manajemen Surat — Admin SIP Desa' },
      },
      {
        path: 'konten',
        name: 'AdminCms',
        component: () => import('@/views/admin/CmsView.vue'),
        meta: { title: 'Manajemen Konten — Admin SIP Desa' },
      },
      {
        path: 'pengguna',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: {
          title: 'Manajemen Pengguna — Admin SIP Desa',
          requiredRole: ['super_admin'],
        },
      },
    ],
  },
]
