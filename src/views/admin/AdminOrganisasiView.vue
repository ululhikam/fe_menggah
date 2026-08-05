<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Building2 } from 'lucide-vue-next'
import api from '@/lib/api'

interface Org { id: string; name: string; slug: string; description?: string; order_index?: number; created_at: string }

const loading = ref(true)
const items = ref<Org[]>([])
const showModal = ref(false)
const editingItem = ref<Org | null>(null)
const saving = ref(false)
const deleting = ref<string | null>(null)

const form = ref({ name: '', slug: '', description: '', order_index: 0 })

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
  form.value = { name: '', slug: '', description: '', order_index: items.value.length }
  showModal.value = true
}

function openEdit(item: Org) {
  editingItem.value = item
  form.value = { name: item.name, slug: item.slug, description: item.description || '', order_index: item.order_index || 0 }
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
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Manajemen Organisasi</h1>
        <p class="text-sm text-surface-500 mt-1">Kelola organisasi masyarakat Dusun Menggah.</p>
      </div>
      <button @click="openCreate" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
        <Plus :size="16" /> Tambah Organisasi
      </button>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="loading" v-for="i in 6" :key="i" class="card animate-pulse">
        <div class="h-5 bg-gray-200 rounded-full w-1/2 mb-2"></div>
        <div class="h-3 bg-gray-100 rounded-full"></div>
      </div>
      <div
        v-else
        v-for="item in items"
        :key="item.id"
        class="card group"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Building2 :size="18" class="text-green-600" />
          </div>
          <div class="flex gap-1.5">
            <button @click="openEdit(item)" class="p-1.5 rounded-lg text-surface-400 hover:text-green-600 hover:bg-green-50 transition-colors"><Edit2 :size="14" /></button>
            <button @click="deleteItem(item.id)" :disabled="deleting === item.id" class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 :size="14" /></button>
          </div>
        </div>
        <h3 class="font-black text-surface-900 mb-1">{{ item.name }}</h3>
        <p class="text-surface-400 text-sm line-clamp-2">{{ item.description || 'Belum ada deskripsi.' }}</p>
        <p class="text-xs text-surface-300 mt-2 font-mono">/{{ item.slug }}</p>
      </div>
      <div v-if="!loading && items.length === 0" class="col-span-3 py-12 text-center text-surface-400">
        <Building2 :size="32" class="mx-auto mb-3 text-surface-300" />
        <p>Belum ada organisasi</p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-md">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-black text-gray-900">{{ editingItem ? 'Edit Organisasi' : 'Tambah Organisasi' }}</h2>
          </div>
          <form @submit.prevent="save" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Nama Organisasi</label>
              <input v-model="form.name" @input="!editingItem ? form.slug = generateSlug(form.name) : null" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Slug</label>
              <input v-model="form.slug" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Deskripsi</label>
              <textarea v-model="form.description" rows="4" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-green-500"></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Urutan Tampil</label>
              <input v-model.number="form.order_index" type="number" min="0" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
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
  </div>
</template>
