<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, FileText } from 'lucide-vue-next'
import api from '@/lib/api'

const saving = ref<string | null>(null)
const loading = ref(true)

const sections = ref([
  { key: 'sejarah', label: 'Sejarah Dusun', content: '', placeholder: 'Tulis sejarah Dusun Menggah...' },
  { key: 'visi-misi', label: 'Visi & Misi', content: '', placeholder: 'Tulis visi dan misi Dusun Menggah...' },
  { key: 'geografis', label: 'Letak Geografis', content: '', placeholder: 'Deskripsikan letak geografis dan batas wilayah...' },
  { key: 'potensi', label: 'Potensi Dusun', content: '', placeholder: 'Uraikan potensi ekonomi, budaya, dan sosial dusun...' },
  { key: 'fasilitas', label: 'Fasilitas', content: '', placeholder: 'Daftar fasilitas yang ada di Dusun Menggah...' },
])

onMounted(async () => {
  try {
    const res = await api.get('/cms/profile')
    if (res.data?.success && Array.isArray(res.data.data)) {
      const profileData = res.data.data
      sections.value = sections.value.map(s => {
        const found = profileData.find((p: any) => p.section_key === s.key)
        return { ...s, content: found?.content || found?.metadata?.content || '' }
      })
    }
  } catch {}
  finally { loading.value = false }
})

async function saveSection(section: typeof sections.value[0]) {
  saving.value = section.key
  try {
    await api.put(`/cms/profile/${section.key}`, { content: section.content, section_key: section.key })
    // Success feedback
    setTimeout(() => { if (saving.value === section.key) saving.value = null }, 1200)
  } catch {
    saving.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-surface-900">Profil Dusun</h1>
      <p class="text-sm text-surface-500 mt-1">Edit informasi profil resmi Dusun Menggah.</p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card animate-pulse">
        <div class="h-5 bg-gray-200 rounded-full w-1/4 mb-4"></div>
        <div class="h-32 bg-gray-100 rounded-xl"></div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div v-for="section in sections" :key="section.key" class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <FileText :size="15" class="text-green-600" />
            </div>
            <h2 class="font-black text-surface-900">{{ section.label }}</h2>
          </div>
          <button
            @click="saveSection(section)"
            :disabled="saving === section.key"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="saving === section.key ? 'bg-green-100 text-green-600' : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'"
          >
            <Save :size="14" />
            {{ saving === section.key ? 'Tersimpan ✓' : 'Simpan' }}
          </button>
        </div>
        <textarea
          v-model="section.content"
          :placeholder="section.placeholder"
          rows="8"
          class="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
        ></textarea>
        <p class="text-xs text-surface-400 mt-2">{{ section.content.length }} karakter</p>
      </div>
    </div>
  </div>
</template>
