<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Pin, Megaphone } from 'lucide-vue-next'
import api from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

interface Announcement {
  id: string
  title: string
  content: string
  category?: string
  is_pinned: boolean
  is_active: boolean
  start_date?: string
  end_date?: string
  created_at: string
}

const toast       = useToast()
const loading     = ref(true)
const items       = ref<Announcement[]>([])
const showModal   = ref(false)
const editingItem = ref<Announcement | null>(null)
const saving      = ref(false)
const deleteTarget = ref<Announcement | null>(null)
const deleting    = ref(false)

const form = ref({ title: '', content: '', category: 'Umum', is_pinned: false, is_active: true, start_date: '', end_date: '' })
const categories = ['Umum', 'Kesehatan', 'Kegiatan', 'PKK', 'Infrastruktur', 'Nasional']

onMounted(() => load())

async function load() {
  loading.value = true
  try {
    const res = await api.get('/cms/announcements')
    if (res.data?.success) items.value = res.data.data?.items || res.data.data || []
  } catch {
    items.value = []
    toast.error('Gagal memuat pengumuman.')
  } finally { loading.value = false }
}

function openCreate() {
  editingItem.value = null
  form.value = { title: '', content: '', category: 'Umum', is_pinned: false, is_active: true, start_date: '', end_date: '' }
  showModal.value = true
}

function openEdit(item: Announcement) {
  editingItem.value = item
  form.value = { title: item.title, content: item.content, category: item.category || 'Umum', is_pinned: item.is_pinned, is_active: item.is_active, start_date: item.start_date || '', end_date: item.end_date || '' }
  showModal.value = true
}

async function save() {
  saving.value = true
  try {
    if (editingItem.value) {
      await api.patch(`/cms/announcements/${editingItem.value.id}`, form.value)
      toast.success('Pengumuman berhasil diperbarui.')
    } else {
      await api.post('/cms/announcements', form.value)
      toast.success('Pengumuman berhasil dibuat.')
    }
    showModal.value = false
    await load()
  } catch {
    toast.error('Gagal menyimpan pengumuman.')
  } finally { saving.value = false }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/cms/announcements/${deleteTarget.value.id}`)
    toast.success('Pengumuman berhasil dihapus.')
    deleteTarget.value = null
    await load()
  } catch {
    toast.error('Gagal menghapus pengumuman.')
  } finally { deleting.value = false }
}



function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <Megaphone :size="24" class="text-green-600" /> Manajemen Pengumuman
        </h1>
        <p class="text-sm text-surface-500 mt-1">Kelola pengumuman resmi Dusun Menggah.</p>
      </div>
      <button 
        @click="openCreate" 
        class="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
      >
        <Plus :size="16" /> Tambah Pengumuman
      </button>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 text-center"><div class="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200 bg-surface-50">
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Judul</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Kategori</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Tanggal</th>
              <th class="text-right py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="items.length === 0">
              <td colspan="5" class="py-12 text-center text-surface-400">
                <Megaphone :size="32" class="mx-auto mb-3 text-surface-300" />
                <p>Belum ada pengumuman</p>
              </td>
            </tr>
            <tr v-for="item in items" :key="item.id" class="border-b border-surface-50 hover:bg-surface-50/50 transition-colors" :class="item.is_pinned ? 'bg-amber-50/30' : ''">
              <td class="py-3.5 px-4 font-medium text-surface-800 max-w-xs">
                <div class="flex items-center gap-2">
                  <Pin v-if="item.is_pinned" :size="12" class="text-amber-500 shrink-0" />
                  <span class="truncate">{{ item.title }}</span>
                </div>
              </td>
              <td class="py-3.5 px-4">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ item.category }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="item.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'">
                  {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-surface-500 text-xs">{{ formatDate(item.start_date || item.created_at) }}</td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openEdit(item)" 
                    class="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all active:scale-95 flex items-center justify-center"
                    title="Edit"
                  >
                    <Edit2 :size="14" />
                  </button>
                  <button 
                    @click="deleteTarget = item" 
                    class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all active:scale-95 flex items-center justify-center"
                    title="Hapus"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-[fade-in_0.2s_ease-out]">
          <div class="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 class="text-base font-black text-surface-900">{{ editingItem ? 'Edit Pengumuman' : 'Tambah Pengumuman' }}</h2>
            <button 
              @click="showModal = false" 
              class="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="2 2 20 20" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="save" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Judul *</label>
              <input 
                v-model="form.title" 
                type="text" 
                required 
                class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Kategori</label>
                <select 
                  v-model="form.category" 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
                >
                  <option v-for="c in categories" :key="c">{{ c }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Tanggal Mulai</label>
                <input 
                  v-model="form.start_date" 
                  type="date" 
                  class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Isi Pengumuman *</label>
              <textarea 
                v-model="form.content" 
                rows="5" 
                required 
                class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
              ></textarea>
            </div>
            <div class="flex gap-6 py-2">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input v-model="form.is_pinned" type="checkbox" class="w-4 h-4 rounded accent-amber-500 bg-white border-surface-200 focus:ring-2 focus:ring-amber-500/20" />
                <span class="text-sm font-semibold text-surface-700">Sematkan (pinned)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input v-model="form.is_active" type="checkbox" class="w-4 h-4 rounded accent-green-600 bg-white border-surface-200 focus:ring-2 focus:ring-green-600/20" />
                <span class="text-sm font-semibold text-surface-700">Aktif</span>
              </label>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-surface-100">
              <button 
                type="button" 
                @click="showModal = false" 
                class="px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-600 hover:bg-surface-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="saving" 
                class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 transition-colors shadow-sm active:scale-95"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <ConfirmModal
      :open="!!deleteTarget"
      title="Hapus Pengumuman"
      :description="`Pengumuman '${deleteTarget?.title}' akan dihapus secara permanen.`"
      confirm-label="Ya, Hapus"
      variant="danger"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
