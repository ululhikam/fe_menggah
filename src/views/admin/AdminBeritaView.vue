<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Newspaper, X } from 'lucide-vue-next'
import api from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import ImageUpload from '@/components/ui/ImageUpload.vue'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  cover_image?: string
  is_published: boolean
  published_at?: string
  created_at: string
  category?: { name: string }
}

// ─── State ────────────────────────────────────────────────────────────────────

const toast      = useToast()
const loading    = ref(true)
const newsItems  = ref<NewsItem[]>([])
const searchQuery = ref('')
const showModal  = ref(false)
const editingItem = ref<NewsItem | null>(null)
const saving     = ref(false)

// Confirm delete
const deleteTarget = ref<NewsItem | null>(null)
const deleting     = ref(false)

const form = ref({
  title: '',
  content: '',
  excerpt: '',
  slug: '',
  cover_image: '',
  is_published: false,
})

// ─── Computed ─────────────────────────────────────────────────────────────────

const filtered = computed(() =>
  !searchQuery.value
    ? newsItems.value
    : newsItems.value.filter((n) =>
        n.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
)

// ─── Methods ──────────────────────────────────────────────────────────────────

async function loadNews() {
  loading.value = true
  try {
    const res = await api.get('/cms/news?per_page=50')
    if (res.data?.success) newsItems.value = res.data.data?.items || res.data.data || []
  } catch {
    newsItems.value = []
    toast.error('Gagal memuat data berita.')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingItem.value = null
  form.value = { title: '', content: '', excerpt: '', slug: '', cover_image: '', is_published: false }
  showModal.value = true
}

function openEdit(item: NewsItem) {
  editingItem.value = item
  form.value = {
    title: item.title,
    content: item.content || '',
    excerpt: item.excerpt || '',
    slug: item.slug,
    cover_image: item.cover_image || '',
    is_published: item.is_published,
  }
  showModal.value = true
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

async function saveNews() {
  saving.value = true
  try {
    if (!form.value.slug) form.value.slug = generateSlug(form.value.title)
    if (editingItem.value) {
      await api.patch(`/cms/news/${editingItem.value.id}`, form.value)
      toast.success('Berita berhasil diperbarui.')
    } else {
      await api.post('/cms/news', form.value)
      toast.success('Berita berhasil dibuat.')
    }
    showModal.value = false
    await loadNews()
  } catch {
    toast.error('Gagal menyimpan berita. Coba lagi.')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/cms/news/${deleteTarget.value.id}`)
    toast.success('Berita berhasil dihapus.')
    deleteTarget.value = null
    await loadNews()
  } catch {
    toast.error('Gagal menghapus berita.')
  } finally {
    deleting.value = false
  }
}

loadNews()
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Manajemen Berita</h1>
        <p class="text-sm text-surface-500 mt-1">Kelola artikel berita Dusun Menggah.</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
      >
        <Plus :size="16" /> Tulis Berita
      </button>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari judul berita..."
        class="w-full pl-11 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
      />
    </div>

    <!-- Table -->
    <div class="card p-0 overflow-hidden">
      <div v-if="loading" class="p-10 text-center">
        <div class="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200 bg-surface-50">
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Judul</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Tanggal</th>
              <th class="text-right py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="4" class="py-14 text-center text-surface-400">
                <Newspaper :size="36" class="mx-auto mb-3 text-surface-200" />
                <p class="font-medium">{{ searchQuery ? 'Tidak ditemukan.' : 'Belum ada berita.' }}</p>
              </td>
            </tr>
            <tr
              v-for="item in filtered"
              :key="item.id"
              class="border-b border-surface-50 hover:bg-surface-50/60 transition-colors"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <!-- Cover thumbnail -->
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      v-if="item.cover_image"
                      :src="item.cover_image"
                      :alt="item.title"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <Newspaper :size="16" class="text-slate-300" />
                    </div>
                  </div>
                  <span class="font-medium text-surface-800 max-w-xs truncate">{{ item.title }}</span>
                </div>
              </td>
              <td class="py-3.5 px-4">
                <span
                  class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                  :class="item.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'"
                >
                  <component :is="item.is_published ? Eye : EyeOff" :size="11" />
                  {{ item.is_published ? 'Dipublikasi' : 'Draft' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-surface-500 text-xs">
                {{ new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="openEdit(item)"
                    class="p-1.5 rounded-lg text-surface-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 :size="15" />
                  </button>
                  <button
                    @click="deleteTarget = item"
                    class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─── Modal Form ─── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[9997] p-4"
        >
          <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 class="text-base font-black text-slate-900">
                {{ editingItem ? 'Edit Berita' : 'Tulis Berita Baru' }}
              </h2>
              <button
                @click="showModal = false"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X :size="16" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="saveNews" class="p-6 space-y-4">

              <!-- Judul -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Judul *</label>
                <input
                  v-model="form.title"
                  @input="!editingItem ? (form.slug = generateSlug(form.title)) : null"
                  type="text"
                  required
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  placeholder="Judul berita..."
                />
              </div>

              <!-- Slug -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Slug URL *</label>
                <input
                  v-model="form.slug"
                  type="text"
                  required
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>

              <!-- Cover Image -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Foto Cover</label>
                <ImageUpload
                  v-model="form.cover_image"
                  bucket="media"
                  folder="berita"
                  @error="toast.error($event)"
                />
              </div>

              <!-- Ringkasan -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ringkasan</label>
                <textarea
                  v-model="form.excerpt"
                  rows="2"
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  placeholder="Ringkasan singkat berita..."
                />
              </div>

              <!-- Konten -->
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Konten *</label>
                <textarea
                  v-model="form.content"
                  rows="10"
                  required
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono leading-relaxed"
                  placeholder="Tulis konten berita di sini..."
                />
                <p class="text-[10px] text-slate-400 mt-1">{{ form.content.length }} karakter</p>
              </div>

              <!-- Publikasi -->
              <label class="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 transition-colors">
                <input v-model="form.is_published" type="checkbox" class="w-4 h-4 rounded accent-green-600" />
                <div>
                  <span class="text-sm font-semibold text-slate-700">Publikasikan sekarang</span>
                  <p class="text-xs text-slate-400">Berita langsung dapat dilihat oleh publik.</p>
                </div>
              </label>

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  @click="showModal = false"
                  class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <svg v-if="saving" class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {{ saving ? 'Menyimpan...' : 'Simpan Berita' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Confirm Delete Modal ─── -->
    <ConfirmModal
      :open="!!deleteTarget"
      title="Hapus Berita"
      :description="`Berita '${deleteTarget?.title}' akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`"
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
