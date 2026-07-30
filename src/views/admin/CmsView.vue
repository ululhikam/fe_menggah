<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Newspaper, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-vue-next'
import api from '@/lib/api'

const activeTab = ref('berita')
const loading = ref(false)

const articles = ref([
  { id: '1', title: 'Pembangunan Jalan Desa Tahap III', category: 'Pembangunan', published: true, date: '2026-07-10', content: 'Konten pembangunan jalan...' },
  { id: '2', title: 'Pendaftaran BLT Juli 2026', category: 'Sosial', published: true, date: '2026-07-08', content: 'Konten pendaftaran BLT...' },
  { id: '3', title: 'Festival Budaya Desa 2026', category: 'Budaya', published: false, date: '2026-07-05', content: 'Konten festival budaya...' },
])

// Modal Form State
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref('')
const formTitle = ref('')
const formCategory = ref('Pembangunan')
const formContent = ref('')
const formPublished = ref(true)

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
        date: a.published_at || a.created_at,
        content: a.content || ''
      }))
    }
  } catch (err) {
    console.warn('Gagal memuat berita dari server, menggunakan data simulasi:', err)
  } finally {
    loading.value = false
  }
}

function openAdd() {
  isEdit.value = false
  currentId.value = ''
  formTitle.value = ''
  formCategory.value = 'Pembangunan'
  formContent.value = ''
  formPublished.value = true
  showModal.value = true
}

function openEdit(article: any) {
  isEdit.value = true
  currentId.value = article.id
  formTitle.value = article.title
  formCategory.value = article.category
  formContent.value = article.content || ''
  formPublished.value = article.published
  showModal.value = true
}

async function handleSubmit() {
  try {
    const payload = {
      title: formTitle.value,
      category: formCategory.value,
      content: formContent.value,
      is_published: formPublished.value
    }
    
    let response
    if (isEdit.value) {
      response = await api.patch(`/cms/news/${currentId.value}`, payload)
    } else {
      response = await api.post('/cms/news', payload)
    }
    
    if (response.data?.success) {
      alert(`Konten berita berhasil ${isEdit.value ? 'diperbarui' : 'dibuat'}`)
      showModal.value = false
      fetchArticles()
    }
  } catch (err: any) {
    alert(`Gagal menyimpan konten: ${err.message}`)
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
      <button @click="openAdd" class="btn-primary"><Plus :size="16" /> Tambah Konten</button>
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
                  <button @click="openEdit(article)" class="p-1.5 rounded-lg text-surface-400 hover:bg-primary-50 hover:text-primary-600" title="Edit"><Edit :size="16" /></button>
                  <button @click="togglePublish(article)" class="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-700" title="Ubah Status">
                    <component :is="article.published ? EyeOff : Eye" :size="16" />
                  </button>
                  <button @click="deleteArticle(article.id)" class="p-1.5 rounded-lg text-surface-400 hover:bg-red-50 hover:text-danger-500" title="Hapus"><Trash2 :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Dialog -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
      <div class="bg-white border border-surface-200 shadow-elevated rounded-[2rem] w-full max-w-2xl p-8 relative">
        <h3 class="text-lg font-bold text-surface-900 mb-6">{{ isEdit ? 'Edit Artikel Konten' : 'Buat Artikel Konten Baru' }}</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4 text-xs">
          <div>
            <label class="block text-[10px] uppercase tracking-wider font-bold text-surface-450 mb-1.5">Judul Berita/Artikel</label>
            <input v-model="formTitle" type="text" placeholder="Contoh: Pembangunan Fasilitas Posyandu..." required class="input" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] uppercase tracking-wider font-bold text-surface-450 mb-1.5">Kategori Konten</label>
              <select v-model="formCategory" class="input">
                <option value="Pembangunan">Pembangunan</option>
                <option value="Sosial">Sosial</option>
                <option value="Budaya">Budaya</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-wider font-bold text-surface-450 mb-1.5">Status Publikasi</label>
              <select v-model="formPublished" class="input">
                <option :value="true">Terbitkan Langsung</option>
                <option :value="false">Simpan sebagai Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[10px] uppercase tracking-wider font-bold text-surface-450 mb-1.5">Konten / Isi Artikel</label>
            <textarea v-model="formContent" rows="6" placeholder="Tuliskan isi berita di sini secara lengkap..." required class="input resize-none rounded-2xl p-4"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="btn border border-surface-200 text-surface-600 bg-white hover:bg-surface-50 rounded-full py-2.5 px-6">Batal</button>
            <button type="submit" class="btn-primary rounded-full py-2.5 px-6">Simpan Konten</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
