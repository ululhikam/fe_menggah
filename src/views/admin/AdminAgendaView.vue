<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Calendar, X } from 'lucide-vue-next'
import api from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

interface AgendaItem {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  location?: string
  status?: string
  category?: string
}

const toast       = useToast()
const loading     = ref(true)
const items       = ref<AgendaItem[]>([])
const showModal   = ref(false)
const editingItem = ref<AgendaItem | null>(null)
const saving      = ref(false)
const deleteTarget = ref<AgendaItem | null>(null)
const deleting    = ref(false)

const form = ref({
  title: '', description: '', start_date: '', end_date: '', location: '', category: 'Kegiatan', status: 'upcoming'
})

onMounted(() => load())

async function load() {
  loading.value = true
  try {
    const res = await api.get('/cms/agenda?per_page=50')
    if (res.data?.success) items.value = res.data.data?.items || res.data.data || []
  } catch {
    items.value = []
    toast.error('Gagal memuat data agenda.')
  } finally { loading.value = false }
}

function openCreate() {
  editingItem.value = null
  form.value = { title: '', description: '', start_date: '', end_date: '', location: '', category: 'Kegiatan', status: 'upcoming' }
  showModal.value = true
}

function openEdit(item: AgendaItem) {
  editingItem.value = item
  form.value = {
    title: item.title, description: item.description || '', start_date: item.start_date.slice(0, 16),
    end_date: item.end_date ? item.end_date.slice(0, 16) : '', location: item.location || '',
    category: item.category || 'Kegiatan', status: item.status || 'upcoming'
  }
  showModal.value = true
}

async function save() {
  saving.value = true
  try {
    if (editingItem.value) {
      await api.patch(`/cms/agenda/${editingItem.value.id}`, form.value)
      toast.success('Agenda berhasil diperbarui.')
    } else {
      await api.post('/cms/agenda', form.value)
      toast.success('Agenda berhasil dibuat.')
    }
    showModal.value = false
    await load()
  } catch {
    toast.error('Gagal menyimpan agenda.')
  } finally { saving.value = false }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/cms/agenda/${deleteTarget.value.id}`)
    toast.success('Agenda berhasil dihapus.')
    deleteTarget.value = null
    await load()
  } catch {
    toast.error('Gagal menghapus agenda.')
  } finally { deleting.value = false }
}



function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-50 text-blue-600',
  ongoing: 'bg-green-50 text-green-600',
  done: 'bg-gray-100 text-gray-500',
}
const statusLabels: Record<string, string> = { upcoming: 'Akan Datang', ongoing: 'Berlangsung', done: 'Selesai' }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Manajemen Agenda</h1>
        <p class="text-sm text-surface-500 mt-1">Kelola jadwal kegiatan Dusun Menggah.</p>
      </div>
      <button @click="openCreate" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
        <Plus :size="16" /> Tambah Agenda
      </button>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 text-center"><div class="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200">
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Kegiatan</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Tanggal</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Lokasi</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Status</th>
              <th class="text-right py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="items.length === 0">
              <td colspan="5" class="py-12 text-center text-surface-400">
                <Calendar :size="32" class="mx-auto mb-3 text-surface-300" />
                <p>Belum ada agenda</p>
              </td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
              <td class="py-3.5 px-4 font-medium text-surface-800 max-w-xs truncate">{{ item.title }}</td>
              <td class="py-3.5 px-4 text-surface-500 text-xs">{{ formatDate(item.start_date) }}</td>
              <td class="py-3.5 px-4 text-surface-500 text-xs max-w-[150px] truncate">{{ item.location || '—' }}</td>
              <td class="py-3.5 px-4">
                <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full" :class="statusColors[item.status || 'upcoming']">
                  {{ statusLabels[item.status || 'upcoming'] }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(item)" class="p-1.5 rounded-lg text-surface-400 hover:text-green-600 hover:bg-green-50 transition-colors"><Edit2 :size="15" /></button>
                  <button @click="deleteTarget = item" class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 :size="15" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-black text-gray-900">{{ editingItem ? 'Edit Agenda' : 'Tambah Agenda' }}</h2>
          </div>
          <form @submit.prevent="save" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Judul Kegiatan</label>
              <input v-model="form.title" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Tanggal Mulai</label>
                <input v-model="form.start_date" type="datetime-local" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Tanggal Selesai</label>
                <input v-model="form.end_date" type="datetime-local" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Lokasi</label>
              <input v-model="form.location" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="Nama lokasi kegiatan..." />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Kategori</label>
                <select v-model="form.category" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500">
                  <option v-for="c in ['Rapat', 'Kegiatan', 'Kesehatan', 'Pelatihan', 'Nasional', 'Lainnya']" :key="c">{{ c }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                <select v-model="form.status" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500">
                  <option value="upcoming">Akan Datang</option>
                  <option value="ongoing">Berlangsung</option>
                  <option value="done">Selesai</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Deskripsi</label>
              <textarea v-model="form.description" rows="4" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-green-500"></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showModal = false" class="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Batal</button>
              <button type="submit" :disabled="saving" class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <ConfirmModal
      :open="!!deleteTarget"
      title="Hapus Agenda"
      :description="`Agenda '${deleteTarget?.title}' akan dihapus secara permanen.`"
      confirm-label="Ya, Hapus"
      variant="danger"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
