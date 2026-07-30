<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Search, CheckCircle, XCircle, Eye } from 'lucide-vue-next'

const filterStatus = ref('all')
const letters = ref([
  { id: '1', requester: 'Ahmad Fauzi', nik: '3501234567890001', type: 'SKCK', date: '2026-07-11', status: 'pending' },
  { id: '2', requester: 'Siti Aminah', nik: '3501234567890002', type: 'DOMISILI', date: '2026-07-11', status: 'pending' },
  { id: '3', requester: 'Budi Hartono', nik: '3501234567890003', type: 'SKTM', date: '2026-07-10', status: 'approved' },
  { id: '4', requester: 'Dewi Sari', nik: '3501234567890004', type: 'UMUM', date: '2026-07-10', status: 'rejected' },
])

const statusColors: Record<string, string> = { pending: 'badge-warm', approved: 'badge-accent', rejected: 'badge-danger' }
const statusLabels: Record<string, string> = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }
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
        <input type="text" placeholder="Cari pemohon..." class="input pl-11" />
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
                  <button v-if="letter.status === 'pending'" class="p-1.5 rounded-lg text-accent-500 hover:bg-accent-50" title="Setujui"><CheckCircle :size="16" /></button>
                  <button v-if="letter.status === 'pending'" class="p-1.5 rounded-lg text-danger-500 hover:bg-red-50" title="Tolak"><XCircle :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
