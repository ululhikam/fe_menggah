import type { RouteRecordRaw } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/public/HomeView.vue'),
        meta: { title: 'SIP Desa — Portal Layanan Desa' },
      },
      {
        path: 'profil',
        name: 'Profile',
        component: () => import('@/views/public/ProfileView.vue'),
        meta: { title: 'Profil Desa — SIP Desa' },
      },
      {
        path: 'berita',
        name: 'News',
        component: () => import('@/views/public/NewsView.vue'),
        meta: { title: 'Berita & Informasi — SIP Desa' },
      },
      {
        path: 'berita/:slug',
        name: 'NewsDetail',
        component: () => import('@/views/public/NewsDetailView.vue'),
        meta: { title: 'Berita — SIP Desa' },
      },
      {
        path: 'galeri',
        name: 'Gallery',
        component: () => import('@/views/public/GalleryView.vue'),
        meta: { title: 'Galeri Potensi & Budaya — SIP Desa' },
      },
      {
        path: 'layanan',
        name: 'Services',
        component: () => import('@/views/public/ServicesView.vue'),
        meta: { title: 'Layanan Mandiri — SIP Desa' },
      },
      {
        path: 'transparansi',
        name: 'Transparency',
        component: () => import('@/views/public/TransparencyView.vue'),
        meta: { title: 'Transparansi Dana Desa — SIP Desa' },
      },
    ],
  },
]
