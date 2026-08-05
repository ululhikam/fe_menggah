<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Megaphone, Pin, Tag, Calendar, Plus, Leaf, Search, ChevronRight, Sparkles } from 'lucide-vue-next'
import api from '@/lib/api'

interface Announcement {
  id: string
  title: string
  content: string
  category?: string
  is_pinned?: boolean
  is_active?: boolean
  start_date?: string
  end_date?: string
  created_at?: string
}

const loading = ref(true)
const activeCategory = ref('Semua')
const searchQuery = ref('')

const announcements = ref<Announcement[]>([])
const categories = ref(['Semua', 'Kesehatan', 'Kegiatan', 'PKK', 'Infrastruktur', 'Nasional'])

onMounted(async () => {
  try {
    const res = await api.get('/public/announcements')
    if (res.data?.success && Array.isArray(res.data?.data)) {
      announcements.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to load announcements', error)
  } finally {
    loading.value = false
  }
})

const filteredAnnouncements = computed(() => {
  let list = [...announcements.value]
  if (activeCategory.value !== 'Semua') {
    list = list.filter(a => a.category === activeCategory.value)
  }
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.content.toLowerCase().includes(q) || 
      a.category?.toLowerCase().includes(q)
    )
  }
  // Pinned first
  list.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
  return list
})

function getCategoryColor(cat?: string) {
  const map: Record<string, string> = {
    'Kesehatan': 'bg-red-50 text-red-700 border-red-100',
    'Kegiatan': 'bg-green-50 text-green-700 border-green-100',
    'PKK': 'bg-pink-50 text-pink-700 border-pink-100',
    'Infrastruktur': 'bg-orange-50 text-orange-700 border-orange-100',
    'Nasional': 'bg-blue-50 text-blue-700 border-blue-100',
  }
  return map[cat || ''] || 'bg-slate-50 text-slate-500 border-slate-100'
}

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
      <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Pengumuman</span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans mb-3">
        Informasi & <span class="font-serif italic font-medium">Pengumuman Resmi</span>
      </h1>
      <p class="text-slate-550 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold mb-8">
        Informasi dan pengumuman resmi dari perangkat Dusun Menggah untuk seluruh warga.
      </p>

      <!-- Centered Search Box -->
      <div class="relative w-full max-w-md mx-auto mb-10">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari pengumuman..." 
          class="w-full rounded-full border border-slate-200 bg-white text-slate-800 py-3 pl-5 pr-11 text-xs focus:outline-none focus:border-slate-400 font-semibold" 
        />
        <Search :size="13" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <!-- Centered Category Selector -->
      <div class="max-w-4xl mx-auto">
        <span class="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-3">Kategori Pengumuman</span>
        <div class="flex justify-center">
          <div class="flex gap-2 overflow-x-auto py-2 px-1 max-w-full scrollbar-hide">
            <button 
              v-for="cat in categories" 
              :key="cat" 
              @click="activeCategory = cat"
              class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border whitespace-nowrap"
              :class="activeCategory === cat
                ? 'bg-slate-950 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200/60'"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SECTION 1: TOP PICKS (3 Columns Grid) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-8">
      
      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-[#FDFCFB] rounded-[2rem] p-6 animate-pulse border border-slate-200/50">
          <div class="w-10 h-10 bg-slate-100 rounded-xl mb-4"></div>
          <div class="h-5 bg-slate-100 rounded-full w-2/3 mb-3"></div>
          <div class="h-3 bg-slate-50 rounded-full w-5/6 mb-2"></div>
        </div>
      </div>

      <!-- Loaded grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in filteredAnnouncements.slice(0, 3)"
          :key="item.id"
          class="group bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-6 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Banner megaphone box and pinned badge -->
            <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/50">
                <Megaphone :size="16" />
              </div>
              
              <span v-if="item.is_pinned" class="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                <Pin :size="8" /> Disematkan
              </span>
            </div>

            <!-- Tags -->
            <div class="flex items-center gap-2 mb-2">
              <span v-if="item.category" class="text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border flex items-center gap-1" :class="getCategoryColor(item.category)">
                <Tag :size="8" /> {{ item.category }}
              </span>
            </div>

            <h3 class="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">
              {{ item.title }}
            </h3>
            
            <p class="text-slate-500 text-xs leading-relaxed font-semibold mb-4 line-clamp-3">
              {{ item.content }}
            </p>
          </div>

          <!-- Date Footer -->
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3.5 mt-2">
            <Calendar :size="12" class="text-emerald-700" />
            {{ formatDate(item.start_date || item.created_at) }}
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredAnnouncements.length === 0" class="text-center py-16">
        <p class="text-slate-450 font-semibold flex items-center justify-center gap-1.5">
          <Leaf :size="16" /> Belum ada pengumuman yang ditemukan.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: FEATURED ANNOUNCEMENTS SPLIT SECTION ===== -->
    <section v-if="!loading && filteredAnnouncements.length > 0" class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/50 mt-8">
      
      <!-- Section Title -->
      <div class="text-center mb-12">
        <span class="text-[9px] bg-slate-50 border border-slate-100 text-slate-450 font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
          <Megaphone :size="10" /> Kabar Peringatan
        </span>
        <h2 class="text-3xl font-light text-slate-950 mt-3 mb-2 font-sans tracking-tight">Pengumuman Sorotan</h2>
        <p class="text-slate-555 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
          Informasi penting dan instruksi tertulis yang wajib diperhatikan oleh segenap warga dusun.
        </p>
      </div>

      <!-- Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        <!-- Left: Large Featured Pinned Card (First Item) -->
        <div class="bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between mb-5">
            <span v-if="filteredAnnouncements[0].category" class="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border" :class="getCategoryColor(filteredAnnouncements[0].category)">
              Kategori: {{ filteredAnnouncements[0].category }}
            </span>
            <span v-if="filteredAnnouncements[0].is_pinned" class="text-amber-700 bg-amber-50 border border-amber-100 text-[9px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles :size="10" /> Utama
            </span>
          </div>

          <h3 class="font-bold text-slate-955 text-lg sm:text-xl leading-snug mb-3">
            {{ filteredAnnouncements[0].title }}
          </h3>
          
          <p class="text-slate-555 text-xs sm:text-sm leading-relaxed font-semibold mb-6 text-justify">
            {{ filteredAnnouncements[0].content }}
          </p>

          <div class="flex items-center gap-2 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-4">
            <Calendar :size="12" class="text-emerald-700" />
            Terbit: {{ formatDate(filteredAnnouncements[0].start_date || filteredAnnouncements[0].created_at) }}
          </div>
        </div>

        <!-- Right: Vertical list of smaller announcements -->
        <div class="space-y-4">
          <div
            v-for="item in filteredAnnouncements.slice(1, 4)" 
            :key="item.id"
            class="flex gap-4 p-4.5 bg-white border border-slate-200/50 rounded-[1.8rem] hover:shadow-md transition-all duration-300 group items-center"
          >
            <!-- Megaphone icon circle -->
            <div class="w-12 h-12 rounded-[1.2rem] overflow-hidden shrink-0 border border-slate-150 bg-slate-50 flex items-center justify-center text-slate-500">
              <Megaphone :size="16" />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 pr-2">
              <div class="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#7C633F] mb-1">
                <span>{{ item.category }}</span>
                <span class="opacity-50">•</span>
                <span>{{ formatDate(item.start_date || item.created_at) }}</span>
              </div>
              
              <h4 class="text-slate-900 font-extrabold text-xs sm:text-sm leading-snug line-clamp-1">
                {{ item.title }}
              </h4>
            </div>

            <!-- Arrow circle link indicator -->
            <div class="shrink-0 w-8 h-8 rounded-full border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-transparent transition-all">
              <ChevronRight :size="14" />
            </div>
          </div>
          
          <div v-if="filteredAnnouncements.length <= 1" class="py-8 text-center text-slate-450 text-xs font-semibold">
            Belum ada pengumuman tambahan lainnya.
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
