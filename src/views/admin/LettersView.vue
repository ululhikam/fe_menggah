<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { FileText, Search, CheckCircle, XCircle, Eye } from 'lucide-vue-next'
import api from '@/lib/api'

const filterStatus = ref('all')
const searchQuery = ref('')
const loading = ref(false)

const letters = ref<any[]>([])

const statusColors: Record<string, string> = { pending: 'badge-warm', approved: 'badge-accent', rejected: 'badge-danger' }
const statusLabels: Record<string, string> = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }

async function fetchLetters() {
  try {
    loading.value = true
    const response = await api.get('/letters', {
      params: {
        status: filterStatus.value === 'all' ? undefined : filterStatus.value,
        search: searchQuery.value || undefined
      }
    })
    if (response.data?.success && Array.isArray(response.data?.data)) {
      letters.value = response.data.data.map((l: any) => ({
        id: l.id,
        requester: l.profile?.full_name || l.requester_id || 'Warga',
        nik: l.profile?.nik || '-',
        type: l.letter_type,
        date: l.created_at,
        status: l.status,
      }))
    }
  } catch (err) {
    console.warn('Gagal memuat daftar pengajuan surat dari server, menggunakan fallback data simulasi:', err)
  } finally {
    loading.value = false
  }
}

async function updateStatus(id: string, status: 'approved' | 'rejected') {
  try {
    const response = await api.patch(`/letters/${id}/status`, { status })
    if (response.data?.success) {
      alert(`Status pengajuan surat berhasil diubah menjadi ${status === 'approved' ? 'Disetujui' : 'Ditolak'}.`)
      fetchLetters()
    }
  } catch (err: any) {
    alert(`Gagal mengubah status: ${err.message}`)
  }
}

watch([filterStatus, searchQuery], () => {
  fetchLetters()
})

onMounted(() => {
  fetchLetters()
})
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <div>
      <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2"><FileText :size="24" /> Manajemen Surat</h1>
      <p class="text-sm text-surface-500 mt-1">Verifikasi dan kelola pengajuan surat warga.</p>
    </div>

    <div class="card flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-md">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="searchQuery" type="text" placeholder="Cari pemohon..." class="input pl-11" />
      </div>
      <div class="flex gap-2">
        <button v-for="s in ['all', 'pending', 'approved', 'rejected']" :key="s" @click="filterStatus = s"
          class="px-3 py-2 rounded-lg text-xs font-medium transition-all"
          :class="filterStatus === s ? 'gradient-primary text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'">
          {{ s === 'all' ? 'Semua' : statusLabels[s] }}
        </button>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200 bg-surface-50">
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Pemohon</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Jenis</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Tanggal</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="letter in letters" :key="letter.id" class="border-b border-surface-50 hover:bg-surface-50/80 transition-colors">
              <td class="py-3 px-4">
                <p class="font-medium text-surface-800">{{ letter.requester }}</p>
                <p class="text-xs text-surface-400 font-mono">{{ letter.nik }}</p>
              </td>
              <td class="py-3 px-4"><span class="badge-neutral">{{ letter.type }}</span></td>
              <td class="py-3 px-4 text-surface-500">{{ new Date(letter.date).toLocaleDateString('id-ID') }}</td>
              <td class="py-3 px-4"><span :class="statusColors[letter.status]">{{ statusLabels[letter.status] }}</span></td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-1">
                  <button class="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600" title="Lihat Detail"><Eye :size="16" /></button>
                  <button v-if="letter.status === 'pending'" @click="updateStatus(letter.id, 'approved')" class="p-1.5 rounded-lg text-accent-500 hover:bg-accent-50" title="Setujui"><CheckCircle :size="16" /></button>
                  <button v-if="letter.status === 'pending'" @click="updateStatus(letter.id, 'rejected')" class="p-1.5 rounded-lg text-danger-500 hover:bg-red-50" title="Tolak"><XCircle :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
