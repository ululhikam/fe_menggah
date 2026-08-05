<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Newspaper, Calendar, ChevronRight, Leaf, Plus, Search, Sparkles } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import api from '@/lib/api'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  published_at?: string
  category?: { name: string }
  cover_image?: string
}

const loading = ref(true)
const newsItems = ref<NewsItem[]>([])
const totalPages = ref(1)
const currentPage = ref(1)
const perPage = 10
const searchQuery = ref('')



onMounted(() => loadNews())

async function loadNews(page = 1) {
  loading.value = true
  try {
    const res = await api.get(`/public/news?page=${page}&per_page=${perPage}`)
    if (res.data?.success) {
      newsItems.value = res.data.data?.items || []
      totalPages.value = res.data.data?.total_pages || 1
      currentPage.value = page
    }
  } catch (error) {
    console.error('Failed to load news', error)
    newsItems.value = []
  } finally {
    loading.value = false
  }
}

const filteredNewsItems = computed(() => {
  let list = [...newsItems.value]
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.excerpt?.toLowerCase().includes(q)
    )
  }
  return list
})

function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-green-200/15 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/15 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Floating Pluses -->
    <div class="absolute top-36 left-[8%] text-slate-355 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[45%] right-[10%] text-slate-355 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>

    <!-- ===== HEADER SECTION ===== -->
    <section class="px-4 sm:px-6 lg:px-8 pt-32 pb-4 text-center">
      <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Arsip Digital</span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans mb-3">
        Dokumentasi & <span class="font-serif italic font-medium">Arsip Kegiatan</span>
      </h1>
      <p class="text-slate-550 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold mb-8">
        Dokumentasi dan arsip digital seluruh berita, kegiatan, dan program yang telah berlangsung di Dusun Menggah.
      </p>

      <!-- Centered Search Box -->
      <div class="relative w-full max-w-md mx-auto mb-10">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari arsip dokumentasi..." 
          class="w-full rounded-full border border-slate-200 bg-white text-slate-800 py-3 pl-5 pr-11 text-xs focus:outline-none focus:border-slate-400 font-semibold" 
        />
        <Search :size="13" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </section>

    <!-- ===== SECTION 1: TOP PICKS (3 Columns Grid) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-8">
      
      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-[#FDFCFB] rounded-[2rem] p-6 animate-pulse border border-slate-200/50">
          <div class="w-full h-44 bg-slate-100 rounded-xl mb-4"></div>
          <div class="h-5 bg-slate-100 rounded-full w-2/3 mb-3"></div>
          <div class="h-3 bg-slate-50 rounded-full w-5/6 mb-2"></div>
        </div>
      </div>

      <!-- Loaded grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="item in filteredNewsItems.slice(0, 3)" 
          :key="item.id" 
          class="group bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-5 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Cover image frame -->
            <div class="relative w-full h-44 overflow-hidden rounded-[1.5rem] mb-4 bg-slate-50 border border-slate-100 flex items-center justify-center">
              <img 
                v-if="item.cover_image"
                :src="item.cover_image" 
                :alt="item.title"
                class="w-full h-full object-cover scale-100 group-hover:scale-103 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-emerald-700/15 text-3xl">
                <Newspaper :size="24" class="text-emerald-750" />
              </div>
              
              <!-- Hover Overlay Button -->
              <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <RouterLink 
                  :to="`/berita/${item.slug}`"
                  class="bg-white text-slate-900 text-[10px] font-extrabold px-4.5 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-1 scale-95 group-hover:scale-100 transition-all duration-300"
                >
                  Buka Arsip <ChevronRight :size="12" />
                </RouterLink>
              </div>

              <span class="absolute top-3 right-3 bg-white border border-slate-100 text-[8px] uppercase tracking-wider font-extrabold text-emerald-800 px-3 py-1 rounded-full shadow-sm">
                {{ item.category?.name || 'Berita' }}
              </span>
            </div>
            
            <h3 class="font-bold text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2">
              {{ item.title }}
            </h3>
            
            <p v-if="item.excerpt" class="text-slate-555 text-xs leading-relaxed font-semibold mb-4 line-clamp-2">
              {{ item.excerpt }}
            </p>
          </div>
          
          <!-- Date Published Footer -->
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3.5 mt-2">
            <Calendar :size="12" class="text-emerald-700" />
            Terbit: {{ formatDate(item.published_at) }}
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredNewsItems.length === 0" class="text-center py-16">
        <p class="text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <Leaf :size="16" /> Belum ada arsip yang ditemukan.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: ARCHIVES SPLIT SECTION ===== -->
    <section v-if="!loading && filteredNewsItems.length > 0" class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/50 mt-8">
      
      <!-- Section Title -->
      <div class="text-center mb-12">
        <span class="text-[9px] bg-slate-50 border border-slate-100 text-slate-450 font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
          <Newspaper :size="10" /> Catatan Historis
        </span>
        <h2 class="text-3xl font-light text-slate-950 mt-3 mb-2 font-sans tracking-tight">Arsip Sorotan Utama</h2>
        <p class="text-slate-555 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
          Kilas balik kesuksesan program gotong royong dan pembangunan infrastruktur desa.
        </p>
      </div>

      <!-- Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        <!-- Left: Large Featured Archive Card (First Item) -->
        <div class="bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 group">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 text-emerald-800 bg-emerald-50">
              Kategori: {{ filteredNewsItems[0].category?.name || 'Kegiatan' }}
            </span>
            <span class="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles :size="10" /> Historis
            </span>
          </div>

          <h3 class="font-bold text-slate-955 text-xl sm:text-2xl leading-snug mb-3 hover:text-emerald-800 transition-colors duration-300">
            <RouterLink :to="`/berita/${filteredNewsItems[0].slug}`">
              {{ filteredNewsItems[0].title }}
            </RouterLink>
          </h3>
          
          <p v-if="filteredNewsItems[0].excerpt" class="text-slate-555 text-xs sm:text-sm leading-relaxed font-semibold mb-6">
            {{ filteredNewsItems[0].excerpt }}
          </p>

          <!-- Large image cover layout -->
          <div class="relative w-full h-64 sm:h-80 overflow-hidden rounded-[1.8rem] mb-4 bg-slate-50 border border-slate-100">
            <img 
              v-if="filteredNewsItems[0].cover_image"
              :src="filteredNewsItems[0].cover_image" 
              :alt="filteredNewsItems[0].title"
              class="w-full h-full object-cover scale-100 group-hover:scale-102 transition-transform duration-[1.5s]"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-emerald-700/15 text-5xl">
              <Newspaper :size="36" class="text-emerald-750" />
            </div>
          </div>

          <div class="flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-2 pt-2 border-t border-slate-100/80">
            <Calendar :size="12" class="text-emerald-700" />
            Terbit: {{ formatDate(filteredNewsItems[0].published_at) }}
          </div>
        </div>

        <!-- Right: Stack of smaller horizontal row items -->
        <div class="space-y-4">
          <RouterLink
            v-for="item in filteredNewsItems.slice(1, 4)" 
            :key="item.id"
            :to="`/berita/${item.slug}`"
            class="flex gap-4 p-4.5 bg-white border border-slate-200/50 rounded-[1.8rem] hover:shadow-md transition-all duration-300 group items-center"
          >
            <!-- Small rounded cover -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.2rem] overflow-hidden shrink-0 border border-slate-100 bg-slate-50 relative flex items-center justify-center">
              <img 
                v-if="item.cover_image"
                :src="item.cover_image" 
                :alt="item.title" 
                class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
              />
              <Newspaper v-else :size="20" class="text-emerald-750/70" />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 pr-2">
              <div class="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#7C633F] mb-1">
                <span>{{ item.category?.name || 'Berita' }}</span>
                <span class="opacity-50">•</span>
                <span>{{ formatDate(item.published_at) }}</span>
              </div>
              
              <h4 class="text-slate-900 font-extrabold text-xs sm:text-sm leading-snug line-clamp-1 mb-1">
                {{ item.title }}
              </h4>
              <p v-if="item.excerpt" class="text-[10px] text-slate-400 font-bold line-clamp-2 leading-relaxed">
                {{ item.excerpt }}
              </p>
            </div>

            <!-- Arrow link indicator -->
            <div class="shrink-0 w-8 h-8 rounded-full border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-transparent transition-all">
              <ChevronRight :size="14" />
            </div>
          </RouterLink>
          
          <div v-if="filteredNewsItems.length <= 1" class="py-8 text-center text-slate-455 text-xs font-semibold">
            Belum ada arsip sorotan tambahan.
          </div>
        </div>

      </div>

      <!-- Pagination at the bottom -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-12 border-t border-slate-200/50 pt-8">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="loadNews(p)"
          class="w-9 h-9 rounded-full text-xs font-extrabold transition-all"
          :class="currentPage === p 
            ? 'bg-slate-950 text-white shadow-sm' 
            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/50'"
        >{{ p }}</button>
      </div>
    </section>

  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
