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
        meta: { title: 'Dusun Menggah — Portal Informasi Dusun' },
      },
      {
        path: 'profil',
        name: 'Profile',
        component: () => import('@/views/public/ProfileView.vue'),
        meta: { title: 'Profil Dusun — Dusun Menggah' },
      },
      {
        path: 'profil/sejarah',
        name: 'Sejarah',
        component: () => import('@/views/public/SejarahView.vue'),
        meta: { title: 'Sejarah Dusun — Dusun Menggah' },
      },
      {
        path: 'profil/visi-misi',
        name: 'VisiMisi',
        component: () => import('@/views/public/VisiMisiView.vue'),
        meta: { title: 'Visi & Misi — Dusun Menggah' },
      },
      {
        path: 'profil/geografis',
        name: 'Geografis',
        component: () => import('@/views/public/GeografisView.vue'),
        meta: { title: 'Letak Geografis — Dusun Menggah' },
      },
      {
        path: 'profil/potensi',
        name: 'Potensi',
        component: () => import('@/views/public/PotensiView.vue'),
        meta: { title: 'Potensi Dusun — Dusun Menggah' },
      },
      {
        path: 'profil/fasilitas',
        name: 'Fasilitas',
        component: () => import('@/views/public/FasilitasView.vue'),
        meta: { title: 'Fasilitas Umum — Dusun Menggah' },
      },
      {
        path: 'kepengurusan',
        name: 'Kepengurusan',
        component: () => import('@/views/public/KepengurusanView.vue'),
        meta: { title: 'Kepengurusan — Dusun Menggah' },
      },
      {
        path: 'berita',
        name: 'News',
        component: () => import('@/views/public/NewsView.vue'),
        meta: { title: 'Berita & Informasi — Dusun Menggah' },
      },
      {
        path: 'berita/:slug',
        name: 'NewsDetail',
        component: () => import('@/views/public/NewsDetailView.vue'),
        meta: { title: 'Berita — Dusun Menggah' },
      },
      {
        path: 'agenda',
        name: 'Agenda',
        component: () => import('@/views/public/AgendaView.vue'),
        meta: { title: 'Agenda Kegiatan — Dusun Menggah' },
      },
      {
        path: 'galeri',
        name: 'Gallery',
        component: () => import('@/views/public/GalleryView.vue'),
        meta: { title: 'Galeri Dokumentasi — Dusun Menggah' },
      },
      {
        path: 'organisasi',
        name: 'Organisasi',
        component: () => import('@/views/public/OrganisasiView.vue'),
        meta: { title: 'Organisasi Masyarakat — Dusun Menggah' },
      },
      {
        path: 'pengumuman',
        name: 'Pengumuman',
        component: () => import('@/views/public/PengumumanView.vue'),
        meta: { title: 'Pengumuman — Dusun Menggah' },
      },
      {
        path: 'arsip',
        name: 'Arsip',
        component: () => import('@/views/public/ArsipView.vue'),
        meta: { title: 'Arsip — Dusun Menggah' },
      },
      {
        path: 'kontak',
        name: 'Kontak',
        component: () => import('@/views/public/KontakView.vue'),
        meta: { title: 'Kontak — Dusun Menggah' },
      },
    ],
  },
]
