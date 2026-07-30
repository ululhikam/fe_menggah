<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Users, Search, Plus, Edit, Trash2 } from 'lucide-vue-next'
import api from '@/lib/api'

const searchQuery = ref('')
const loading = ref(false)

const residents = ref([
  { id: '1', nik: '3501234567890001', name: 'Ahmad Fauzi', gender: 'L', age: 45, occupation: 'Petani', address: 'RT 01 / RW 02' },
  { id: '2', nik: '3501234567890002', name: 'Siti Aminah', gender: 'P', age: 38, occupation: 'Pedagang', address: 'RT 01 / RW 02' },
  { id: '3', nik: '3501234567890003', name: 'Budi Hartono', gender: 'L', age: 52, occupation: 'PNS', address: 'RT 03 / RW 01' },
  { id: '4', nik: '3501234567890004', name: 'Dewi Kartika', gender: 'P', age: 29, occupation: 'Guru', address: 'RT 02 / RW 03' },
  { id: '5', nik: '3501234567890005', name: 'Eko Prasetyo', gender: 'L', age: 34, occupation: 'Wiraswasta', address: 'RT 04 / RW 01' },
])

async function fetchResidents() {
  try {
    loading.value = true
    const response = await api.get('/residents', {
      params: {
        search: searchQuery.value || undefined,
        per_page: 50
      }
    })
    if (response.data?.success && response.data?.data?.items) {
      const items = response.data.data.items
      residents.value = items.map((r: any) => ({
        id: r.id,
        nik: r.nik || '-',
        name: r.full_name || 'Tidak ada nama',
        gender: r.gender === 'laki-laki' ? 'L' : 'P',
        age: r.birth_date ? new Date().getFullYear() - new Date(r.birth_date).getFullYear() : 0,
        occupation: r.occupation || '-',
        address: r.address || '-'
      }))
    }
  } catch (err) {
    console.warn('Gagal memuat daftar penduduk dari server, menggunakan fallback data simulasi:', err)
  } finally {
    loading.value = false
  }
}

let timeoutId: any = null
watch(searchQuery, () => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    fetchResidents()
  }, 300)
})

onMounted(() => {
  fetchResidents()
})
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2"><Users :size="24" /> Data Kependudukan</h1>
        <p class="text-sm text-surface-500 mt-1">Kelola data penduduk desa.</p>
      </div>
      <button class="btn-primary"><Plus :size="16" /> Tambah Penduduk</button>
    </div>

    <!-- Search & filter -->
    <div class="card">
      <div class="relative max-w-md">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="searchQuery" type="text" placeholder="Cari berdasarkan nama atau NIK..." class="input pl-11" />
      </div>
    </div>

    <!-- Table -->
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200 bg-surface-50">
              <th class="text-left py-3 px-4 font-semibold text-surface-600">NIK</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Nama</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">JK</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Usia</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Pekerjaan</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Alamat</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in residents" :key="r.id" class="border-b border-surface-50 hover:bg-surface-50/80 transition-colors">
              <td class="py-3 px-4 font-mono text-xs text-surface-600">{{ r.nik }}</td>
              <td class="py-3 px-4 font-medium text-surface-800">{{ r.name }}</td>
              <td class="py-3 px-4"><span :class="r.gender === 'L' ? 'badge-primary' : 'badge-accent'">{{ r.gender }}</span></td>
              <td class="py-3 px-4 text-surface-600">{{ r.age }}</td>
              <td class="py-3 px-4 text-surface-600">{{ r.occupation }}</td>
              <td class="py-3 px-4 text-surface-500">{{ r.address }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-1">
                  <button class="p-1.5 rounded-lg text-surface-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"><Edit :size="16" /></button>
                  <button class="p-1.5 rounded-lg text-surface-400 hover:bg-red-50 hover:text-danger-500 transition-colors"><Trash2 :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
