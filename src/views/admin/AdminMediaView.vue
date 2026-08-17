<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FolderOpen, Image as ImageIcon, Trash2, Copy, ExternalLink } from 'lucide-vue-next'
import api from '@/lib/api'

interface MediaItem {
  id: string
  title: string
  image_url: string
  category?: string
  created_at: string
}

const loading = ref(true)
const items = ref<MediaItem[]>([])
const selectedItem = ref<MediaItem | null>(null)
const copied = ref(false)

onMounted(() => load())

async function load() {
  loading.value = true
  try {
    const res = await api.get('/cms/gallery?per_page=200')
    if (res.data?.success) items.value = res.data.data?.items || res.data.data || []
  } catch { items.value = [] }
  finally { loading.value = false }
}

async function deleteItem(id: string) {
  if (!confirm('Hapus foto ini dari galeri?')) return
  try {
    await api.delete(`/cms/gallery/${id}`)
    await load()
    if (selectedItem.value?.id === id) selectedItem.value = null
  } catch {}
}

async function copyUrl(url: string) {
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <FolderOpen :size="24" class="text-green-600" /> Media Manager
        </h1>
        <p class="text-sm text-surface-500 mt-1">Kelola semua media dan gambar yang digunakan.</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-surface-400 font-semibold bg-surface-50 px-3 py-1.5 rounded-xl border border-surface-150">
        <FolderOpen :size="14" /> {{ items.length }} file
      </div>
    </div>

    <!-- Responsive Layout (stack columns on mobile, row on large screens) -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Grid (Flex-1) -->
      <div class="flex-1">
        <div v-if="loading" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
          <div v-for="i in 18" :key="i" class="aspect-square rounded-xl bg-surface-100 animate-pulse"></div>
        </div>
        <div v-else-if="items.length === 0" class="py-20 text-center card">
          <ImageIcon :size="40" class="mx-auto mb-3 text-surface-300" />
          <p class="text-surface-400 font-medium text-sm">Belum ada media. Tambah foto di halaman Galeri.</p>
        </div>
        <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
          <div
            v-for="item in items"
            :key="item.id"
            @click="selectedItem = item"
            class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm"
            :class="selectedItem?.id === item.id ? 'border-green-500 ring-4 ring-green-500/15' : 'border-surface-200 hover:border-surface-400'"
          >
            <img :src="item.image_url" :alt="item.title" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Sidebar detail (Responsive width: full width on mobile, w-64 on desktop) -->
      <div v-if="selectedItem" class="w-full lg:w-64 shrink-0">
        <div class="card sticky top-6 p-4 border border-surface-200">
          <img :src="selectedItem.image_url" :alt="selectedItem.title" class="w-full aspect-square object-cover rounded-xl mb-4 border border-surface-100" />
          <h3 class="font-bold text-surface-900 text-sm mb-1 line-clamp-2" :title="selectedItem.title">{{ selectedItem.title }}</h3>
          <p class="text-[10px] text-surface-400 mb-3 font-semibold uppercase tracking-wider">{{ selectedItem.category }}</p>
          <div class="text-[10px] font-mono bg-surface-50 border border-surface-150 rounded-lg p-2 text-surface-500 break-all mb-4 select-all" title="Klik 3x untuk memblokir URL">{{ selectedItem.image_url }}</div>
          <div class="flex flex-col gap-2">
            <button 
              @click="copyUrl(selectedItem.image_url)" 
              class="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:text-green-800 transition-all active:scale-95"
            >
              <Copy :size="12" /> {{ copied ? 'Disalin!' : 'Salin URL' }}
            </button>
            <a 
              :href="selectedItem.image_url" 
              target="_blank" 
              class="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-all active:scale-95"
            >
              <ExternalLink :size="12" /> Buka
            </a>
            <button 
              @click="deleteItem(selectedItem.id)" 
              class="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 transition-all active:scale-95"
            >
              <Trash2 :size="12" /> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
