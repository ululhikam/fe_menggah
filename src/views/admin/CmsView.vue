<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Newspaper, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-vue-next'
import api from '@/lib/api'

const activeTab = ref('berita')
const loading = ref(false)

const articles = ref([
  { id: '1', title: 'Pembangunan Jalan Desa Tahap III', category: 'Pembangunan', published: true, date: '2026-07-10' },
  { id: '2', title: 'Pendaftaran BLT Juli 2026', category: 'Sosial', published: true, date: '2026-07-08' },
  { id: '3', title: 'Festival Budaya Desa 2026', category: 'Budaya', published: false, date: '2026-07-05' },
])

async function fetchArticles() {
  try {
    loading.value = true
    const response = await api.get('/cms/news')
    if (response.data?.success && response.data?.data?.items) {
      const items = response.data.data.items
      articles.value = items.map((a: any) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        published: a.is_published,
        date: a.published_at || a.created_at
      }))
    }
  } catch (err) {
    console.warn('Gagal memuat berita dari server, menggunakan data simulasi:', err)
  } finally {
    loading.value = false
  }
}

async function deleteArticle(id: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return
  try {
    const response = await api.delete(`/cms/news/${id}`)
    if (response.data?.success) {
      alert('Berita berhasil dihapus.')
      fetchArticles()
    }
  } catch (err: any) {
    alert(`Gagal menghapus berita: ${err.message}`)
  }
}

async function togglePublish(article: any) {
  try {
    const response = await api.patch(`/cms/news/${article.id}`, {
      is_published: !article.published
    })
    if (response.data?.success) {
      alert(`Berita berhasil diubah statusnya menjadi ${!article.published ? 'Terbit' : 'Draft'}.`)
      fetchArticles()
    }
  } catch (err: any) {
    alert(`Gagal memperbarui status: ${err.message}`)
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<template>
  <div class="space-y-6 animate-[fade-in_0.4s_ease-out]">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 flex items-center gap-2"><Newspaper :size="24" /> Manajemen Konten</h1>
        <p class="text-sm text-surface-500 mt-1">Kelola berita, pengumuman, dan galeri desa.</p>
      </div>
      <button class="btn-primary"><Plus :size="16" /> Tambah Konten</button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit">
      <button v-for="tab in ['berita', 'pengumuman', 'galeri']" :key="tab" @click="activeTab = tab"
        class="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
        :class="activeTab === tab ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'">
        {{ tab }}
      </button>
    </div>

    <!-- Content list -->
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-200 bg-surface-50">
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Judul</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Kategori</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Tanggal</th>
              <th class="text-left py-3 px-4 font-semibold text-surface-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles" :key="article.id" class="border-b border-surface-50 hover:bg-surface-50/80 transition-colors">
              <td class="py-3 px-4 font-medium text-surface-800">{{ article.title }}</td>
              <td class="py-3 px-4"><span class="badge-neutral">{{ article.category }}</span></td>
              <td class="py-3 px-4">
                <span :class="article.published ? 'badge-accent' : 'badge-neutral'">
                  {{ article.published ? 'Terbit' : 'Draft' }}
                </span>
              </td>
              <td class="py-3 px-4 text-surface-500">{{ new Date(article.date).toLocaleDateString('id-ID') }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-1">
                  <button class="p-1.5 rounded-lg text-surface-400 hover:bg-primary-50 hover:text-primary-600"><Edit :size="16" /></button>
                  <button @click="togglePublish(article)" class="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-700">
                    <component :is="article.published ? EyeOff : Eye" :size="16" />
                  </button>
                  <button @click="deleteArticle(article.id)" class="p-1.5 rounded-lg text-surface-400 hover:bg-red-50 hover:text-danger-500"><Trash2 :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
