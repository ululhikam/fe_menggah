<script setup lang="ts">
import { ref, computed } from 'vue'
import { Image as ImageIcon, X, ArrowUpRight, Plus, Leaf, Search, Sparkles } from 'lucide-vue-next'
import api from '@/lib/api'

const categories = [
  { key: 'semua', label: 'Semua Potensi' },
  { key: 'umkm', label: 'Produk UMKM' },
  { key: 'wisata', label: 'Destinasi Wisata' },
  { key: 'budaya', label: 'Warisan Budaya' },
  { key: 'kegiatan', label: 'Kegiatan Warga' },
]
const activeCategory = ref('semua')
const searchQuery = ref('')
const loading = ref(true)

const galleryItems = ref<any[]>([])

const selectedItem = ref<any | null>(null)

const filteredGallery = computed(() => {
  let list = [...galleryItems.value]
  if (activeCategory.value !== 'semua') {
    list = list.filter(i => i.category === activeCategory.value)
  }
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.desc.toLowerCase().includes(q) || 
      i.category.toLowerCase().includes(q)
    )
  }
  return list
})

function filterGallery(cat: string) {
  activeCategory.value = cat
}

import { onMounted } from 'vue'

onMounted(async () => {
  try {
    loading.value = true
    const res = await api.get('/public/gallery?per_page=100')
    if (res.data?.success) {
      galleryItems.value = res.data.data.items || res.data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch gallery', error)
  } finally {
    loading.value = false
  }
})
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
      <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Galeri Dokumentasi</span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans mb-3">
        Dokumentasi & <span class="font-serif italic font-medium">Potensi Dusun</span>
      </h1>
      <p class="text-slate-550 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold mb-8">
        Jelajahi keindahan tersembunyi, peninggalan adat, hasil tani kopi rakyat, hingga produk kreatif UMKM unggulan kami.
      </p>

      <!-- Centered Search Box -->
      <div class="relative w-full max-w-md mx-auto mb-10">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari dokumentasi potensi..." 
          class="w-full rounded-full border border-slate-200 bg-white text-slate-800 py-3 pl-5 pr-11 text-xs focus:outline-none focus:border-slate-400 font-semibold" 
        />
        <Search :size="13" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <!-- Centered Category Selector Pills -->
      <div class="max-w-4xl mx-auto">
        <span class="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-3">Kategori Potensi</span>
        <div class="flex justify-center">
          <div class="flex gap-2 overflow-x-auto py-2 px-1 max-w-full scrollbar-hide">
            <button 
              v-for="cat in categories" 
              :key="cat.key" 
              @click="filterGallery(cat.key)"
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
          v-for="item in filteredGallery.slice(0, 3)" 
          :key="item.id" 
          @click="selectedItem = item"
          class="group bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-5 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <!-- Cover image frame with hover overlay zoom button -->
            <div class="relative w-full h-52 overflow-hidden rounded-[1.5rem] mb-4 bg-slate-50 border border-slate-100 flex items-center justify-center">
              <img 
                :src="item.image_url || item.image" 
                :alt="item.title"
                class="w-full h-full object-cover scale-100 group-hover:scale-103 transition-transform duration-500"
              />
              
              <!-- Hover Overlay Button -->
              <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="bg-white text-slate-900 text-[10px] font-extrabold px-4.5 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-1 scale-95 group-hover:scale-100 transition-all duration-300">
                  Lihat Foto <ArrowUpRight :size="12" />
                </span>
              </div>

              <span class="absolute top-3 right-3 bg-white border border-slate-100 text-[8px] uppercase tracking-wider font-extrabold text-emerald-800 px-3 py-1 rounded-full shadow-sm">
                {{ item.category }}
              </span>
            </div>
            
            <h3 class="font-bold text-slate-900 text-sm leading-snug mb-1.5">
              {{ item.title }}
            </h3>
            
            <p class="text-slate-555 text-xs leading-relaxed font-semibold mb-4">
              {{ item.description || item.desc || 'Tidak ada deskripsi' }}
            </p>
          </div>
          
          <!-- Zoom indicator footer -->
          <span class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold text-emerald-700 mt-auto pt-3 border-t border-slate-100 group-hover:text-emerald-950">
            Detail Potensi <ArrowUpRight :size="12" />
          </span>
        </div>
      </div>
      
      <div v-if="filteredGallery.length === 0" class="text-center py-16">
        <p class="text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <Leaf :size="16" /> Belum ada dokumentasi galeri yang ditemukan.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: SHOWCASES SPLIT SECTION ===== -->
    <section v-if="filteredGallery.length > 0" class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/50 mt-8">
      
      <!-- Section Title -->
      <div class="text-center mb-12">
        <span class="text-[9px] bg-slate-50 border border-slate-100 text-slate-450 font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
          <ImageIcon :size="10" /> Sorotan Galeri
        </span>
        <h2 class="text-3xl font-light text-slate-950 mt-3 mb-2 font-sans tracking-tight">Katalog Destinasi Utama</h2>
        <p class="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
          Dokumentasi visual terbaik yang merangkum keunikan budaya dan keindahan panorama alam Dusun Menggah.
        </p>
      </div>

      <!-- Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        <!-- Left: Large Featured Showcase Card (First Item) -->
        <div 
          @click="selectedItem = filteredGallery[0]"
          class="bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 text-emerald-800 bg-emerald-50">
              Kategori: {{ filteredGallery[0].category }}
            </span>
            <span class="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles :size="10" /> Unggulan
            </span>
          </div>

          <h3 class="font-bold text-slate-955 text-xl sm:text-2xl leading-snug mb-3">
            {{ filteredGallery[0].title }}
          </h3>
          
          <p class="text-slate-555 text-xs sm:text-sm leading-relaxed font-semibold mb-6">
            {{ filteredGallery[0].description || filteredGallery[0].desc }}
          </p>

          <!-- Large image frame -->
          <div class="relative w-full h-64 sm:h-80 overflow-hidden rounded-[1.8rem] mb-4 bg-slate-50 border border-slate-100">
            <img 
              :src="filteredGallery[0].image_url || filteredGallery[0].image" 
              :alt="filteredGallery[0].title"
              class="w-full h-full object-cover scale-100 group-hover:scale-102 transition-transform duration-[1.5s]"
            />
          </div>

          <span class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold text-emerald-700 mt-2">
            Klik Untuk Perbesar <ArrowUpRight :size="12" />
          </span>
        </div>

        <!-- Right: Stack of smaller horizontal items -->
        <div class="space-y-4">
          <div
            v-for="item in filteredGallery.slice(1, 4)" 
            :key="item.id"
            @click="selectedItem = item"
            class="flex gap-4 p-4.5 bg-white border border-slate-200/50 rounded-[1.8rem] hover:shadow-md transition-all duration-300 group items-center cursor-pointer"
          >
            <!-- Small rounded cover -->
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.2rem] overflow-hidden shrink-0 border border-slate-100 bg-slate-50 relative">
              <img 
                :src="item.image_url || item.image" 
                :alt="item.title" 
                class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 pr-2">
              <span class="text-[9px] font-extrabold uppercase tracking-widest text-[#7C633F] mb-1 block">
                {{ item.category }}
              </span>
              
              <h4 class="text-slate-900 font-extrabold text-xs sm:text-sm leading-snug line-clamp-1 mb-1">
                {{ item.title }}
              </h4>
              <p class="text-[10px] text-slate-400 font-bold line-clamp-2 leading-relaxed">
                {{ item.description || item.desc }}
              </p>
            </div>

            <!-- Arrow link indicator -->
            <div class="shrink-0 w-8 h-8 rounded-full border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-transparent transition-all">
              <ArrowUpRight :size="14" />
            </div>
          </div>
          
          <div v-if="filteredGallery.length <= 1" class="py-8 text-center text-slate-450 text-xs font-semibold">
            Belum ada dokumentasi sorotan tambahan.
          </div>
        </div>

      </div>
    </section>

    <!-- Lightbox Modal -->
    <teleport to="body">
      <transition name="fade">
        <div 
          v-if="selectedItem" 
          class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" 
          @click="selectedItem = null"
        >
          <div 
            class="bg-white rounded-[2.5rem] max-w-2xl w-full p-6 md:p-10 relative border border-slate-200/60 shadow-xl animate-[scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)]" 
            @click.stop
          >
            <button 
              @click="selectedItem = null" 
              class="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors animate-none"
            >
              <X :size="16" />
            </button>
            
            <div class="w-full h-72 overflow-hidden rounded-[1.8rem] mb-6 border border-slate-100">
              <img 
                :src="selectedItem.image_url || selectedItem.image" 
                :alt="selectedItem.title"
                class="w-full h-full object-cover"
              />
            </div>
            
            <span class="inline-block text-[9px] uppercase tracking-widest font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {{ selectedItem.category }}
            </span>
            
            <h2 class="text-xl font-bold text-slate-950 mt-4 mb-2.5 font-sans leading-snug">{{ selectedItem.title }}</h2>
            <p class="text-slate-500 text-xs leading-relaxed font-semibold mb-6">{{ selectedItem.description || selectedItem.desc }}</p>
            
            <button 
              @click="selectedItem = null" 
              class="w-full sm:w-auto inline-flex items-center justify-center bg-slate-950 hover:bg-slate-900 text-white font-extrabold px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-colors duration-300"
            >
              Tutup Galeri
            </button>
          </div>
        </div>
      </transition>
    </teleport>

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
