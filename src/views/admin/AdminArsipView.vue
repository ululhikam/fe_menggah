<script setup lang="ts">
import { ref, computed } from 'vue'
import { Archive, Eye, EyeOff, Search, ExternalLink, Trash2 } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import api from '@/lib/api'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  is_published: boolean
  published_at?: string
  created_at: string
  category?: { name: string }
}

// ─── State ────────────────────────────────────────────────────────────────────

const toast        = useToast()
const loading      = ref(true)
const allNews      = ref<NewsItem[]>([])
const searchQuery  = ref('')
const activeFilter = ref<'all' | 'published' | 'draft'>('all')

const deleteTarget   = ref<NewsItem | null>(null)
const deleting       = ref(false)
const togglingId     = ref<string | null>(null)

// ─── Computed ─────────────────────────────────────────────────────────────────

const filtered = computed(() => {
  let list = allNews.value

  if (activeFilter.value === 'published') list = list.filter((n) => n.is_published)
  if (activeFilter.value === 'draft')     list = list.filter((n) => !n.is_published)
  if (searchQuery.value)
    list = list.filter((n) =>
      n.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

  return list
})

const counts = computed(() => ({
  all:       allNews.value.length,
  published: allNews.value.filter((n) => n.is_published).length,
  draft:     allNews.value.filter((n) => !n.is_published).length,
}))

// ─── Methods ──────────────────────────────────────────────────────────────────

async function loadNews() {
  loading.value = true
  try {
    const res = await api.get('/cms/news?per_page=200')
    if (res.data?.success) allNews.value = res.data.data?.items || res.data.data || []
  } catch {
    allNews.value = []
    toast.error('Gagal memuat arsip berita.')
  } finally {
    loading.value = false
  }
}

/** Toggle status published/draft */
async function togglePublish(item: NewsItem) {
  togglingId.value = item.id
  try {
    await api.patch(`/cms/news/${item.id}`, { is_published: !item.is_published })
    item.is_published = !item.is_published
    toast.success(
      item.is_published ? `"${item.title}" kini dipublikasikan.` : `"${item.title}" disimpan sebagai draft.`
    )
  } catch {
    toast.error('Gagal mengubah status publikasi.')
  } finally {
    togglingId.value = null
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/cms/news/${deleteTarget.value.id}`)
    toast.success('Berita berhasil dihapus dari arsip.')
    deleteTarget.value = null
    await loadNews()
  } catch {
    toast.error('Gagal menghapus berita.')
  } finally {
    deleting.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

loadNews()
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <Archive :size="22" /> Arsip Berita
        </h1>
        <p class="text-sm text-surface-500 mt-1">
          Kelola semua berita — publikasikan, arsipkan, atau hapus permanen.
        </p>
      </div>
      <RouterLink
        to="/admin/berita"
        class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
      >
        + Tulis Berita Baru
      </RouterLink>
    </div>

    <!-- Filter tabs + Search -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex gap-1.5">
        <button
          v-for="f in [
            { key: 'all', label: 'Semua', count: counts.all },
            { key: 'published', label: 'Publikasi', count: counts.published },
            { key: 'draft', label: 'Draft', count: counts.draft },
          ]"
          :key="f.key"
          @click="activeFilter = f.key as any"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="activeFilter === f.key
            ? 'bg-green-600 text-white shadow-sm'
            : 'bg-white border border-surface-200 text-surface-500 hover:text-surface-900'"
        >
          {{ f.label }}
          <span
            class="rounded-full px-1.5 py-0.5 text-[10px] leading-none font-black"
            :class="activeFilter === f.key ? 'bg-white/20' : 'bg-slate-100'"
          >
            {{ f.count }}
          </span>
        </button>
      </div>

      <div class="relative flex-1 max-w-xs">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul..."
          class="w-full pl-9 pr-4 py-1.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card p-10 flex justify-center">
      <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="card py-16 text-center">
      <Archive :size="40" class="mx-auto mb-3 text-slate-200" />
      <p class="text-slate-400 font-semibold">Tidak ada berita yang sesuai filter.</p>
    </div>

    <!-- Article list -->
    <div v-else class="space-y-2">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all duration-200"
      >
        <!-- Thumbnail -->
        <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img
            v-if="item.cover_image"
            :src="item.cover_image"
            :alt="item.title"
            loading="lazy"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Archive :size="20" class="text-slate-300" />
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span
              class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold"
              :class="item.is_published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'"
            >
              <component :is="item.is_published ? Eye : EyeOff" :size="9" />
              {{ item.is_published ? 'Publikasi' : 'Draft' }}
            </span>
            <span v-if="item.category" class="text-[10px] text-surface-400 font-medium">{{ item.category.name }}</span>
          </div>
          <h3 class="font-semibold text-surface-800 text-sm truncate">{{ item.title }}</h3>
          <p class="text-xs text-surface-400 mt-0.5">
            {{ formatDate(item.published_at || item.created_at) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 shrink-0">
          <!-- Toggle publish -->
          <button
            @click="togglePublish(item)"
            :disabled="togglingId === item.id"
            class="p-2 rounded-xl text-surface-400 transition-colors"
            :class="item.is_published
              ? 'hover:bg-slate-100 hover:text-slate-600'
              : 'hover:bg-green-50 hover:text-green-600'"
            :title="item.is_published ? 'Jadikan Draft' : 'Publikasikan'"
          >
            <component
              :is="item.is_published ? EyeOff : Eye"
              :size="15"
              :class="togglingId === item.id ? 'animate-pulse' : ''"
            />
          </button>

          <!-- Lihat di publik -->
          <a
            :href="`/berita/${item.slug}`"
            target="_blank"
            class="p-2 rounded-xl text-surface-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Lihat di Portal"
          >
            <ExternalLink :size="15" />
          </a>

          <!-- Hapus -->
          <button
            @click="deleteTarget = item"
            class="p-2 rounded-xl text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Permanen"
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Confirm Delete ─── -->
    <ConfirmModal
      :open="!!deleteTarget"
      title="Hapus Berita Permanen"
      :description="`Berita '${deleteTarget?.title}' akan dihapus dari arsip secara permanen dan tidak dapat dipulihkan.`"
      confirm-label="Hapus Permanen"
      variant="danger"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />

  </div>
</template>
