<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Trash2, Image as ImageIcon, Search, X } from 'lucide-vue-next'
import api from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import ImageUpload from '@/components/ui/ImageUpload.vue'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: string
  title: string
  image_url: string
  category?: string
  sort_order?: number
  created_at: string
}

// ─── State ────────────────────────────────────────────────────────────────────

const toast          = useToast()
const loading        = ref(true)
const items          = ref<GalleryItem[]>([])
const searchQuery    = ref('')
const showModal      = ref(false)
const saving         = ref(false)
const deleteTarget   = ref<GalleryItem | null>(null)
const deleting       = ref(false)
const activeCategory = ref('semua')

const categories = [
  { key: 'semua', label: 'Semua' },
  { key: 'umkm', label: 'UMKM' },
  { key: 'wisata', label: 'Wisata' },
  { key: 'budaya', label: 'Budaya' },
  { key: 'kegiatan', label: 'Kegiatan' }
]
const form = ref({ title: '', image_url: '', category: 'kegiatan', description: '' })

// ─── Computed ─────────────────────────────────────────────────────────────────

const filtered = computed(() =>
  items.value.filter(
    (i) =>
      (activeCategory.value === 'semua' || i.category === activeCategory.value) &&
      (!searchQuery.value || i.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
)

// ─── Methods ──────────────────────────────────────────────────────────────────

async function loadGallery() {
  loading.value = true
  try {
    const res = await api.get('/cms/gallery?per_page=100')
    if (res.data?.success) items.value = res.data.data?.items || res.data.data || []
  } catch {
    items.value = []
    toast.error('Gagal memuat data galeri.')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.value = { title: '', image_url: '', category: 'kegiatan', description: '' }
  showModal.value = true
}

async function saveItem() {
  if (!form.value.image_url) {
    toast.warning('Pilih atau masukkan URL gambar terlebih dahulu.')
    return
  }
  saving.value = true
  try {
    await api.post('/cms/gallery', form.value)
    showModal.value = false
    toast.success('Foto berhasil ditambahkan ke galeri.')
    await loadGallery()
  } catch {
    toast.error('Gagal menambah foto. Coba lagi.')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/cms/gallery/${deleteTarget.value.id}`)
    toast.success('Foto berhasil dihapus.')
    deleteTarget.value = null
    await loadGallery()
  } catch {
    toast.error('Gagal menghapus foto.')
  } finally {
    deleting.value = false
  }
}

loadGallery()
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <ImageIcon :size="24" class="text-green-600" /> Manajemen Galeri
        </h1>
        <p class="text-sm text-surface-500 mt-1">Kelola foto dan dokumentasi Dusun Menggah.</p>
      </div>
      <button
        @click="openCreate"
        class="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
      >
        <Plus :size="16" /> Tambah Foto
      </button>
    </div>

    <!-- Category filter + Search -->
    <div class="flex flex-wrap gap-3 items-center">
      <div class="flex gap-1.5 overflow-x-auto flex-1 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="activeCategory = cat.key"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border"
          :class="activeCategory === cat.key
            ? 'bg-green-600 border-green-600 text-white shadow-sm'
            : 'bg-white border-surface-200 text-surface-500 hover:text-surface-900 hover:bg-surface-50'"
        >
          {{ cat.label }}
        </button>
      </div>
      <div class="relative w-full sm:w-auto">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari..."
          class="w-full sm:w-auto pl-9 pr-4 py-1.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-green-500 bg-white"
        />
      </div>
    </div>

    <!-- Count -->
    <p class="text-xs text-surface-400 font-medium">
      {{ filtered.length }} foto ditampilkan
    </p>

    <!-- Skeleton loading -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="aspect-square rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <!-- Empty state -->
    <div v-else-if="filtered.length === 0" class="py-20 text-center">
      <ImageIcon :size="44" class="mx-auto mb-3 text-slate-200" />
      <p class="text-slate-400 font-semibold">
        {{ searchQuery || activeCategory !== 'semua' ? 'Tidak ada foto yang sesuai filter.' : 'Belum ada foto di galeri.' }}
      </p>
    </div>

    <!-- Photo Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/50"
      >
        <img
          :src="item.image_url"
          :alt="item.title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <!-- Delete Button (always visible on mobile, hover on desktop) -->
        <div class="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            @click="deleteTarget = item"
            class="p-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow transition-all active:scale-95 flex items-center justify-center"
            title="Hapus foto"
          >
            <Trash2 :size="12" />
          </button>
        </div>

        <!-- Title overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p class="text-white text-xs font-bold line-clamp-2">{{ item.title }}</p>
        </div>
        <span class="absolute top-2 left-2 text-[10px] font-bold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
          {{ item.category }}
        </span>
      </div>
    </div>

    <!-- ─── Modal Tambah Foto ─── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[9997] p-4"
        >
          <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-[fade-in_0.2s_ease-out]">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-base font-black text-slate-900">Tambah Foto Galeri</h2>
              <button @click="showModal = false" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <X :size="16" />
              </button>
            </div>
            <form @submit.prevent="saveItem" class="p-6 space-y-4">

              <!-- Judul -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Judul Foto *</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  placeholder="Nama / deskripsi singkat foto..."
                />
              </div>

              <!-- Upload Gambar -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Gambar *</label>
                <ImageUpload
                  v-model="form.image_url"
                  bucket="media"
                  folder="galeri"
                  placeholder="Upload foto galeri"
                  @error="toast.error($event)"
                />
              </div>

              <!-- Kategori -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Kategori</label>
                <select
                  v-model="form.category"
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
                >
                  <option v-for="cat in categories.slice(1)" :key="cat.key" :value="cat.key">{{ cat.label }}</option>
                </select>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button type="button" @click="showModal = false" class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
                >
                  {{ saving ? 'Menyimpan...' : 'Tambah Foto' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Confirm Delete ─── -->
    <ConfirmModal
      :open="!!deleteTarget"
      title="Hapus Foto"
      :description="`Foto '${deleteTarget?.title}' akan dihapus secara permanen.`"
      confirm-label="Ya, Hapus"
      variant="danger"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />

  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
