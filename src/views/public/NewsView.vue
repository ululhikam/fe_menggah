<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/lib/api'
import { Search, ArrowRight, Leaf, Plus, Sparkles, ChevronRight } from 'lucide-vue-next'

const categories = [
  { key: 'semua', label: 'Semua Berita' },
  { key: 'pengumuman', label: 'Pengumuman Resmi' },
  { key: 'kegiatan', label: 'Kegiatan Warga' },
  { key: 'pembangunan', label: 'Pembangunan Dusun' },
]

const activeCategory = ref('semua')
const searchQuery = ref('')

const newsList = ref<any[]>([])
const loading = ref(true)

async function fetchNews() {
  loading.value = true
  try {
    const res = await api.get('/public/news?page=1&per_page=50')
    if (res.data?.success && res.data?.data?.items) {
      newsList.value = res.data.data.items
    }
  } catch (error) {
    console.error('Failed to fetch news', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNews()
})

const filteredNews = computed(() => {
  let temp = newsList.value
  if (activeCategory.value !== 'semua') {
    temp = temp.filter(n => n.category.toLowerCase() === activeCategory.value.toLowerCase())
  }
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    temp = temp.filter(n => n.title?.toLowerCase().includes(q) || n.excerpt?.toLowerCase().includes(q))
  }
  return temp
})

function filterCategory(cat: string) {
  activeCategory.value = cat
}

function getInitials(name: string) {
  if (!name) return 'A'
  return name.split(' ').slice(0, 2).map(n => n?.[0] || '').join('').toUpperCase() || 'A'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
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

    <!-- ===== HEADER SECTION (Exact match with centered elements) ===== -->
    <section class="px-4 sm:px-6 lg:px-8 pt-32 pb-4 text-center">
      <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Kabar Dusun</span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans mb-3">
        Inspirasi & <span class="font-serif italic font-medium">Kabar Terkini</span>
      </h1>
      <p class="text-slate-550 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold mb-8">
        Ikuti perkembangan pembangunan, pengumuman resmi pemerintahan, dan dokumentasi ragam kegiatan warga di Dusun Menggah.
      </p>

      <!-- Centered Search Box -->
      <div class="relative w-full max-w-md mx-auto mb-10">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari berita..." 
          class="w-full rounded-full border border-slate-200 bg-white text-slate-800 py-3 pl-5 pr-11 text-xs focus:outline-none focus:border-slate-400 font-semibold" 
        />
        <Search :size="13" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <!-- Centered Category Filter Pills -->
      <div class="max-w-4xl mx-auto">
        <span class="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-3">Kategori Pilihan</span>
        <div class="flex justify-center">
          <div class="flex gap-2 overflow-x-auto py-2 px-1 max-w-full scrollbar-hide">
            <button 
              v-for="cat in categories" 
              :key="cat.key" 
              @click="filterCategory(cat.key)"
              class="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border"
              :class="activeCategory === cat.key 
                ? 'bg-slate-950 text-white border-transparent shadow-sm' 
                : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200/60'"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SECTION 1: TOP PICKS (3 Columns Grid) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="news in filteredNews.slice(0, 3)" 
          :key="news.id" 
          class="group bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-5 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Cover image frame with hover overlay button -->
            <div class="relative w-full h-48 overflow-hidden rounded-[1.5rem] mb-4 bg-slate-50 border border-slate-100 flex items-center justify-center">
              <img 
                v-if="news.cover_image_url || news.cover_image"
                :src="news.cover_image_url || news.cover_image" 
                :alt="news.title"
                class="w-full h-full object-cover scale-100 group-hover:scale-103 transition-transform duration-500"
              />
              <span v-else class="text-4xl opacity-50">📰</span>
              
              <!-- Hover Overlay Button -->
              <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <RouterLink 
                  :to="`/berita/${news.slug}`"
                  class="bg-white text-slate-900 text-[10px] font-extrabold px-4.5 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-1 scale-95 group-hover:scale-100 transition-all duration-300"
                >
                  Baca Berita <ArrowRight :size="12" />
                </RouterLink>
              </div>

              <span class="absolute top-3 right-3 bg-white border border-slate-100 text-[8px] uppercase tracking-wider font-extrabold text-emerald-800 px-3 py-1 rounded-full shadow-sm">
                {{ news.category }}
              </span>
            </div>
            
            <h3 class="font-bold text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2">
              {{ news.title }}
            </h3>
            
            <p class="text-slate-500 text-xs leading-relaxed font-semibold mb-4 line-clamp-2">
              {{ news.excerpt || news.desc }}
            </p>
          </div>
          
          <!-- Author Block Footer -->
          <div class="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-2">
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-extrabold flex items-center justify-center border border-emerald-100 select-none">
                {{ getInitials(news.author?.name || 'Admin') }}
              </div>
              <span class="text-slate-700 font-bold text-[11px] ml-2">{{ news.author?.name || 'Admin' }}</span>
            </div>
            
            <span class="text-slate-400 text-[9px] font-extrabold uppercase tracking-wide bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
              {{ formatDate(news.published_at || news.created_at) }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="filteredNews.length === 0" class="text-center py-16">
        <p class="text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <Leaf :size="16" /> Belum ada berita yang ditemukan.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: TOP BLOGS (Split Layout: Big Card Left, Small Rows Right) ===== -->
    <section v-if="filteredNews.length > 0" class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/50 mt-8">
      
      <!-- Section Title -->
      <div class="text-center mb-12">
        <span class="text-[9px] bg-slate-50 border border-slate-100 text-slate-450 font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
          <Sparkles :size="10" /> Featured Blogs
        </span>
        <h2 class="text-3xl font-light text-slate-950 mt-3 mb-2 font-sans tracking-tight">Sorotan Kabar Utama</h2>
        <p class="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
          Jelajahi analisis mendalam dan berita pilihan yang berdampak besar bagi kemajuan masyarakat.
        </p>
      </div>

      <!-- Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        <!-- Left: One Large Card (First Item of the list) -->
        <div class="bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 group">
          
          <h3 class="font-bold text-slate-950 text-xl sm:text-2xl leading-snug mb-3 hover:text-emerald-800 transition-colors duration-300">
            <RouterLink :to="`/berita/${filteredNews[0].slug}`">
              {{ filteredNews[0].title }}
            </RouterLink>
          </h3>
          
          <p class="text-slate-555 text-xs sm:text-sm leading-relaxed font-semibold mb-5 line-clamp-3">
            {{ filteredNews[0].excerpt || filteredNews[0].desc }}
          </p>

          <!-- Large image frame -->
          <div class="relative w-full h-64 sm:h-80 overflow-hidden rounded-[1.8rem] mb-5 bg-slate-50 border border-slate-100 flex items-center justify-center">
            <img 
              v-if="filteredNews[0].cover_image_url || filteredNews[0].cover_image"
              :src="filteredNews[0].cover_image_url || filteredNews[0].cover_image" 
              :alt="filteredNews[0].title"
              class="w-full h-full object-cover scale-100 group-hover:scale-102 transition-transform duration-[1.5s]"
            />
            <span v-else class="text-6xl opacity-30">📰</span>
            
            <span class="absolute top-4 left-4 bg-white/95 border border-slate-100 text-[8px] uppercase tracking-wider font-extrabold text-emerald-800 px-3 py-1 rounded-full shadow-sm">
              Featured Post
            </span>
          </div>

          <!-- Footer details -->
          <div class="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <div class="flex items-center">
              <div class="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold flex items-center justify-center border border-emerald-100 select-none">
                {{ getInitials(filteredNews[0].author?.name || 'Admin') }}
              </div>
              <span class="text-slate-700 font-bold text-xs ml-2.5">{{ filteredNews[0].author?.name || 'Admin' }}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-slate-400 text-[9px] font-extrabold uppercase tracking-wide bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
                {{ filteredNews[0].category }}
              </span>
              <span class="text-slate-400 text-[9px] font-extrabold uppercase tracking-wide bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
                {{ formatDate(filteredNews[0].published_at || filteredNews[0].created_at) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Stack of smaller horizontal cards (Index 1 to 3) -->
        <div class="space-y-4">
          <RouterLink
            v-for="news in filteredNews.slice(1, 4)" 
            :key="news.id"
            :to="`/berita/${news.slug}`"
            class="flex gap-4 p-4.5 bg-white border border-slate-200/50 rounded-[1.8rem] hover:shadow-md transition-all duration-300 group items-center"
          >
            <!-- Small rounded thumbnail -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.2rem] overflow-hidden shrink-0 border border-slate-100/80 bg-slate-50 relative flex items-center justify-center">
              <img 
                v-if="news.cover_image_url || news.cover_image"
                :src="news.cover_image_url || news.cover_image" 
                :alt="news.title" 
                class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
              />
              <span v-else class="text-3xl opacity-50">📰</span>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 pr-2">
              <div class="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#7C633F] mb-1.5">
                <span>{{ news.category }}</span>
                <span class="opacity-50">•</span>
                <span>{{ formatDate(news.published_at || news.created_at) }}</span>
              </div>
              
              <h4 class="text-slate-900 font-extrabold text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-emerald-850 transition-colors">
                {{ news.title }}
              </h4>
            </div>

            <!-- Circular arrow link indicator -->
            <div class="shrink-0 w-8 h-8 rounded-full border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-transparent transition-all">
              <ChevronRight :size="14" />
            </div>
          </RouterLink>
          
          <div v-if="filteredNews.length <= 1" class="py-8 text-center text-slate-400 text-xs font-semibold">
            Belum ada berita sorotan tambahan.
          </div>
        </div>

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
