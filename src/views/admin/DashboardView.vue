<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Newspaper, Image as ImageIcon, Calendar, Megaphone, Users, TrendingUp, ArrowUpRight, ExternalLink } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import api from '@/lib/api'

const stats = ref([
  { label: 'Total Berita', value: '-', trend: 'up', icon: Newspaper, color: 'primary', to: '/admin/berita' },
  { label: 'Foto Galeri', value: '-', trend: 'up', icon: ImageIcon, color: 'accent', to: '/admin/galeri' },
  { label: 'Agenda Mendatang', value: '-', trend: 'up', icon: Calendar, color: 'warm', to: '/admin/agenda' },
  { label: 'Pengumuman Aktif', value: '-', trend: 'up', icon: Megaphone, color: 'primary', to: '/admin/pengumuman' },
  { label: 'Total Anggota', value: '-', trend: 'up', icon: Users, color: 'accent', to: '/admin/kepengurusan' },
])

const quickLinks = [
  { label: 'Tulis Berita Baru', to: '/admin/berita', icon: Newspaper, color: 'bg-blue-50 text-blue-600' },
  { label: 'Tambah Foto Galeri', to: '/admin/galeri', icon: ImageIcon, color: 'bg-green-50 text-green-600' },
  { label: 'Buat Agenda', to: '/admin/agenda', icon: Calendar, color: 'bg-orange-50 text-orange-600' },
  { label: 'Buat Pengumuman', to: '/admin/pengumuman', icon: Megaphone, color: 'bg-amber-50 text-amber-600' },
  { label: 'Tambah Pengurus', to: '/admin/kepengurusan', icon: Users, color: 'bg-purple-50 text-purple-600' },
]

onMounted(async () => {
  try {
    const response = await api.get('/dashboard/stats')
    if (response.data?.success && response.data?.data) {
      const s = response.data.data
      stats.value = [
        { label: 'Total Berita', value: String(s.total_news ?? 0), trend: 'up', icon: Newspaper, color: 'primary', to: '/admin/berita' },
        { label: 'Foto Galeri', value: String(s.total_gallery ?? 0), trend: 'up', icon: ImageIcon, color: 'accent', to: '/admin/galeri' },
        { label: 'Agenda Mendatang', value: String(s.total_upcoming_agenda ?? 0), trend: 'up', icon: Calendar, color: 'warm', to: '/admin/agenda' },
        { label: 'Pengumuman Aktif', value: String(s.total_announcements ?? 0), trend: 'up', icon: Megaphone, color: 'primary', to: '/admin/pengumuman' },
        { label: 'Total Anggota', value: String(s.total_members ?? 0), trend: 'up', icon: Users, color: 'accent', to: '/admin/kepengurusan' },
      ]
    }
  } catch (err) {
    console.warn('Gagal memuat stats:', err)
  }
})
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <div>
      <h1 class="text-2xl font-bold text-surface-900">Dashboard</h1>
      <p class="text-sm text-surface-500 mt-1">Ringkasan konten dan aktivitas Dusun Menggah.</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <RouterLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="card group hover:shadow-card-hover transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center"
            :class="{ 'bg-primary-100': stat.color === 'primary', 'bg-accent-100': stat.color === 'accent', 'bg-warm-100': stat.color === 'warm' }">
            <component :is="stat.icon" :size="20"
              :class="{ 'text-primary-600': stat.color === 'primary', 'text-accent-600': stat.color === 'accent', 'text-warm-600': stat.color === 'warm' }" />
          </div>
          <ArrowUpRight :size="14" class="text-surface-300 group-hover:text-green-500 transition-colors" />
        </div>
        <p class="text-2xl font-bold text-surface-900">{{ stat.value }}</p>
        <p class="text-xs text-surface-500 mt-1">{{ stat.label }}</p>
      </RouterLink>
    </div>

    <!-- Quick Links -->
    <div class="card">
      <div class="flex items-center gap-2.5 mb-5">
        <TrendingUp :size="18" class="text-green-600" />
        <h2 class="text-lg font-bold text-surface-900">Aksi Cepat</h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.label"
          :to="link.to"
          class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-surface-100 hover:shadow-sm transition-all hover:-translate-y-0.5 group"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" :class="link.color">
            <component :is="link.icon" :size="18" />
          </div>
          <span class="text-[11px] font-semibold text-surface-700 text-center leading-tight">{{ link.label }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- Portal Link -->
    <div class="card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-black text-surface-900 mb-1">Lihat Portal Publik</h3>
          <p class="text-sm text-surface-500">Kunjungi website Dusun Menggah seperti yang dilihat oleh warga.</p>
        </div>
        <a href="/" target="_blank" class="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <ExternalLink :size="14" /> Buka Portal
        </a>
      </div>
    </div>
  </div>
</template>
