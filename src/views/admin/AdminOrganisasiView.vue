<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Building2 } from 'lucide-vue-next'
import api from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ImageUpload from '@/components/ui/ImageUpload.vue'

interface Org { id: string; name: string; slug: string; description?: string; logo_url?: string; order_index?: number; created_at: string }

const toast = useToast()
const loading = ref(true)
const items = ref<Org[]>([])
const showModal = ref(false)
const editingItem = ref<Org | null>(null)
const saving = ref(false)
const deleting = ref<string | null>(null)

const form = ref({ name: '', slug: '', description: '', logo_url: '', order_index: 0 })

onMounted(() => load())

async function load() {
  loading.value = true
  try {
    const res = await api.get('/cms/organisations')
    if (res.data?.success) items.value = res.data.data || []
  } catch { items.value = [] }
  finally { loading.value = false }
}

function openCreate() {
  editingItem.value = null
  form.value = { name: '', slug: '', description: '', logo_url: '', order_index: items.value.length }
  showModal.value = true
}

function openEdit(item: Org) {
  editingItem.value = item
  form.value = { name: item.name, slug: item.slug, description: item.description || '', logo_url: item.logo_url || '', order_index: item.order_index || 0 }
  showModal.value = true
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

async function save() {
  saving.value = true
  try {
    if (!form.value.slug) form.value.slug = generateSlug(form.value.name)
    if (editingItem.value) {
      await api.patch(`/cms/organisations/${editingItem.value.id}`, form.value)
    } else {
      await api.post('/cms/organisations', form.value)
    }
    showModal.value = false
    await load()
  } finally { saving.value = false }
}

async function deleteItem(id: string) {
  if (!confirm('Hapus organisasi ini?')) return
  deleting.value = id
  try { await api.delete(`/cms/organisations/${id}`); await load() }
  finally { deleting.value = null }
}
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <Building2 :size="24" class="text-green-600" /> Manajemen Organisasi
        </h1>
        <p class="text-sm text-surface-500 mt-1">Kelola organisasi masyarakat Dusun Menggah.</p>
      </div>
      <button 
        @click="openCreate" 
        class="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm active:scale-95"
      >
        <Plus :size="16" /> Tambah Organisasi
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="loading" v-for="i in 6" :key="i" class="card animate-pulse p-5">
        <div class="h-10 w-10 bg-surface-200 rounded-xl mb-3"></div>
        <div class="h-4 bg-surface-200 rounded-full w-3/4 mb-2"></div>
        <div class="h-3 bg-surface-200 rounded-full w-1/2"></div>
      </div>
      
      <div
        v-else
        v-for="item in items"
        :key="item.id"
        class="card group p-5 hover:border-green-200 hover:shadow-md transition-all duration-300"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center border border-surface-200 shadow-inner">
            <img v-if="item.logo_url" :src="item.logo_url" :alt="item.name" class="w-full h-full object-cover" />
            <Building2 v-else :size="18" class="text-green-600" />
          </div>
          <div class="flex gap-1">
            <button 
              @click="openEdit(item)" 
              class="p-2 sm:p-1.5 rounded-xl text-surface-400 hover:text-green-600 hover:bg-green-50 transition-colors"
              title="Edit Organisasi"
            >
              <Edit2 :size="14" />
            </button>
            <button 
              @click="deleteItem(item.id)" 
              :disabled="deleting === item.id" 
              class="p-2 sm:p-1.5 rounded-xl text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Hapus Organisasi"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
        <h3 class="font-bold text-surface-900 mb-1 text-base leading-tight">{{ item.name }}</h3>
        <p class="text-surface-500 text-sm line-clamp-2 leading-relaxed mb-2">{{ item.description || 'Belum ada deskripsi.' }}</p>
        <p class="text-[10px] text-surface-400 font-mono inline-block bg-surface-50 px-2 py-0.5 rounded-md">/{{ item.slug }}</p>
      </div>

      <div v-if="!loading && items.length === 0" class="col-span-1 sm:col-span-2 lg:col-span-3 py-16 text-center text-surface-400 card">
        <Building2 :size="40" class="mx-auto mb-3 text-surface-300" />
        <p class="font-medium text-sm">Belum ada organisasi terdaftar.</p>
      </div>
    </div>

    <!-- Modal Form -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-[fade-in_0.2s_ease-out]">
          <div class="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 class="text-base font-black text-surface-900">{{ editingItem ? 'Edit Organisasi' : 'Tambah Organisasi' }}</h2>
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
              <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Nama Organisasi *</label>
              <input 
                v-model="form.name" 
                @input="!editingItem ? form.slug = generateSlug(form.name) : null" 
                type="text" 
                required 
                class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Slug (Url Link) *</label>
              <input 
                v-model="form.slug" 
                type="text" 
                required 
                class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Deskripsi</label>
              <textarea 
                v-model="form.description" 
                rows="3" 
                class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
              ></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Logo Organisasi</label>
              <ImageUpload
                v-model="form.logo_url"
                bucket="media"
                folder="organisasi"
                @error="toast.error($event)"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-surface-600 mb-1.5 uppercase tracking-wide">Urutan Tampil</label>
              <input 
                v-model.number="form.order_index" 
                type="number" 
                min="0" 
                class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" 
              />
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
  </div>
</template>
