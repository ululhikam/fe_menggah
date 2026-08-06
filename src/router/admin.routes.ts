import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiredRole: ['super_admin'] },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { title: 'Dashboard — Admin Dusun Menggah' },
      },
      {
        path: 'berita',
        name: 'AdminBerita',
        component: () => import('@/views/admin/AdminBeritaView.vue'),
        meta: { title: 'Manajemen Berita — Admin Dusun Menggah' },
      },
      {
        path: 'arsip',
        name: 'AdminArsip',
        component: () => import('@/views/admin/AdminArsipView.vue'),
        meta: { title: 'Arsip Berita — Admin Dusun Menggah' },
      },
      {
        path: 'galeri',
        name: 'AdminGaleri',
        component: () => import('@/views/admin/AdminGaleriView.vue'),
        meta: { title: 'Manajemen Galeri — Admin Dusun Menggah' },
      },
      {
        path: 'agenda',
        name: 'AdminAgenda',
        component: () => import('@/views/admin/AdminAgendaView.vue'),
        meta: { title: 'Manajemen Agenda — Admin Dusun Menggah' },
      },
      {
        path: 'pengumuman',
        name: 'AdminPengumuman',
        component: () => import('@/views/admin/AdminPengumumanView.vue'),
        meta: { title: 'Manajemen Pengumuman — Admin Dusun Menggah' },
      },
      {
        path: 'organisasi',
        name: 'AdminOrganisasi',
        component: () => import('@/views/admin/AdminOrganisasiView.vue'),
        meta: { title: 'Manajemen Organisasi — Admin Dusun Menggah' },
      },
      {
        path: 'kepengurusan',
        name: 'AdminKepengurusan',
        component: () => import('@/views/admin/AdminKepengurusanView.vue'),
        meta: { title: 'Manajemen Kepengurusan — Admin Dusun Menggah' },
      },
      {
        path: 'media',
        name: 'AdminMedia',
        component: () => import('@/views/admin/AdminMediaView.vue'),
        meta: { title: 'Media Manager — Admin Dusun Menggah' },
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettingsView.vue'),
        meta: { title: 'Pengaturan — Admin Dusun Menggah' },
      },
      {
        path: 'pengguna',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: { title: 'Manajemen Pengguna — Admin Dusun Menggah' },
      },
    ],
  },
]
