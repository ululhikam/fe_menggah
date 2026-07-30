<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Users, FileText, Newspaper, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'
import api from '@/lib/api'

const stats = ref([
  { label: 'Total Penduduk', value: '-', change: '0', trend: 'up', icon: Users, color: 'primary' },
  { label: 'Surat Pending', value: '-', change: '0', trend: 'down', icon: FileText, color: 'warm' },
  { label: 'Surat Selesai', value: '-', change: '0', trend: 'up', icon: FileText, color: 'accent' },
  { label: 'Artikel Berita', value: '-', change: '0', trend: 'up', icon: Newspaper, color: 'primary' },
])

const recentLetters = ref<any[]>([])

const statusColors: Record<string, string> = {
  pending: 'badge-warm',
  approved: 'badge-accent',
  rejected: 'badge-danger',
}
const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

onMounted(async () => {
  try {
    const response = await api.get('/dashboard/stats')
    if (response.data?.success && response.data?.data) {
      const serverStats = response.data.data
      stats.value = [
        { label: 'Total Penduduk', value: String(serverStats.total_residents ?? 0), change: '+12', trend: 'up', icon: Users, color: 'primary' },
        { label: 'Surat Pending', value: String(serverStats.total_letters_pending ?? 0), change: '-5', trend: 'down', icon: FileText, color: 'warm' },
        { label: 'Surat Selesai', value: String(serverStats.total_letters_completed ?? 0), change: '+48', trend: 'up', icon: FileText, color: 'accent' },
        { label: 'Artikel Berita', value: String(serverStats.total_news ?? 0), change: '+3', trend: 'up', icon: Newspaper, color: 'primary' },
      ]
    }
  } catch (err) {
    console.warn('Gagal memuat stats dari server, menggunakan fallback data simulasi:', err)
  }

  try {
    const lettersResponse = await api.get('/letters')
    if (lettersResponse.data?.success && Array.isArray(lettersResponse.data?.data)) {
      recentLetters.value = lettersResponse.data.data.slice(0, 5).map((l: any) => ({
        id: l.id,
        requester: l.profile?.full_name || l.requester_id || 'Warga',
        type: l.letter_type,
        date: l.created_at,
        status: l.status,
      }))
    }
  } catch (err) {
    console.warn('Gagal memuat surat terbaru dari server, menggunakan fallback data simulasi:', err)
  }
})
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <div>
      <h1 class="text-2xl font-bold text-surface-900">Dashboard</h1>
      <p class="text-sm text-surface-500 mt-1">Ringkasan data dan aktivitas desa.</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="card group hover:shadow-card-hover transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center"
            :class="{ 'bg-primary-100': stat.color === 'primary', 'bg-accent-100': stat.color === 'accent', 'bg-warm-100': stat.color === 'warm' }">
            <component :is="stat.icon" :size="20"
              :class="{ 'text-primary-600': stat.color === 'primary', 'text-accent-600': stat.color === 'accent', 'text-warm-600': stat.color === 'warm' }" />
          </div>
          <span class="inline-flex items-center gap-0.5 text-xs font-semibold"
            :class="stat.trend === 'up' ? 'text-accent-600' : 'text-warm-600'">
            <component :is="stat.trend === 'up' ? ArrowUpRight : ArrowDownRight" :size="14" />
            {{ stat.change }}
          </span>
        </div>
        <p class="text-2xl font-bold text-surface-900">{{ stat.value }}</p>
        <p class="text-xs text-surface-500 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Recent Letters -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-surface-900">Pengajuan Surat Terbaru</h2>
        <RouterLink to="/admin/surat" class="text-sm text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1">
          Lihat Semua <TrendingUp :size="14" />
        </RouterLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200">
              <th class="text-left py-2.5 px-3 font-semibold text-surface-500">Pemohon</th>
              <th class="text-left py-2.5 px-3 font-semibold text-surface-500">Jenis</th>
              <th class="text-left py-2.5 px-3 font-semibold text-surface-500">Tanggal</th>
              <th class="text-left py-2.5 px-3 font-semibold text-surface-500">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="letter in recentLetters" :key="letter.id" class="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
              <td class="py-3 px-3 font-medium text-surface-800">{{ letter.requester }}</td>
              <td class="py-3 px-3 text-surface-600">{{ letter.type }}</td>
              <td class="py-3 px-3 text-surface-500">{{ new Date(letter.date).toLocaleDateString('id-ID') }}</td>
              <td class="py-3 px-3">
                <span :class="statusColors[letter.status]">{{ statusLabels[letter.status] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
