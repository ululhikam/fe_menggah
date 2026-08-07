<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Image as ImageIcon, 
  X, 
  ArrowUpRight, 
  Plus, 
  Leaf, 
  Search, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Tag
} from 'lucide-vue-next'
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
const selectedIndex = ref<number | null>(null)

const filteredGallery = computed(() => {
  let list = [...galleryItems.value]
  if (activeCategory.value !== 'semua') {
    list = list.filter(i => i.category === activeCategory.value)
  }
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(i => 
      i.title?.toLowerCase().includes(q) || 
      i.desc?.toLowerCase().includes(q) || 
      i.description?.toLowerCase().includes(q) || 
      i.category?.toLowerCase().includes(q)
    )
  }
  return list
})

const selectedItem = computed(() => {
  if (selectedIndex.value === null || selectedIndex.value < 0) return null
  return filteredGallery.value[selectedIndex.value] || null
})

function openLightbox(item: any) {
  const index = filteredGallery.value.findIndex(i => i.id === item.id)
  selectedIndex.value = index !== -1 ? index : 0
}

function closeLightbox() {
  selectedIndex.value = null
}

function prevPhoto() {
  if (selectedIndex.value === null) return
  if (selectedIndex.value > 0) {
    selectedIndex.value -= 1
  } else {
    selectedIndex.value = filteredGallery.value.length - 1
  }
}

function nextPhoto() {
  if (selectedIndex.value === null) return
  if (selectedIndex.value < filteredGallery.value.length - 1) {
    selectedIndex.value += 1
  } else {
    selectedIndex.value = 0
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (selectedIndex.value === null) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
}

function filterGallery(cat: string) {
  activeCategory.value = cat
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
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

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans overflow-x-hidden relative selection:bg-emerald-100 selection:text-emerald-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-emerald-200/15 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-teal-100/15 rounded-full blur-[100px] pointer-events-none"></div>

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
        Jelajahi keindahan tersembunyi, peninggalan adat, hasil tani kopi rakyat, hingga produk kreatif UMKM unggulan kami. Klik foto untuk memperbesar tampilan full-screen.
      </p>

      <!-- Centered Search Box -->
      <div class="relative w-full max-w-md mx-auto mb-10">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari dokumentasi potensi..." 
          class="w-full rounded-full border border-slate-200 bg-white text-slate-800 py-3 pl-5 pr-11 text-xs focus:outline-none focus:border-slate-400 font-semibold shadow-xs" 
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
      
      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-white border border-slate-200/50 rounded-[2rem] p-5 animate-pulse">
          <div class="w-full h-52 bg-slate-100 rounded-[1.5rem] mb-4"></div>
          <div class="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="item in filteredGallery.slice(0, 3)" 
          :key="item.id" 
          @click="openLightbox(item)"
          class="group bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-5 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <!-- Cover image frame with hover overlay zoom button -->
            <div class="relative w-full h-56 overflow-hidden rounded-[1.5rem] mb-4 bg-slate-100 border border-slate-200/60 flex items-center justify-center">
              <img 
                :src="item.image_url || item.image" 
                :alt="item.title"
                class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
              />
              
              <!-- Hover Overlay Button -->
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                <span class="bg-white text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-full shadow-2xl border border-white/40 flex items-center gap-1.5 scale-90 group-hover:scale-100 transition-all duration-300">
                  <Maximize2 :size="14" /> Perbesar Full Foto
                </span>
              </div>

              <span class="absolute top-3 right-3 bg-white/90 backdrop-blur border border-white/60 text-[8px] uppercase tracking-wider font-extrabold text-emerald-800 px-3 py-1 rounded-full shadow-sm">
                {{ item.category }}
              </span>
            </div>
            
            <h3 class="font-bold text-slate-900 text-sm leading-snug mb-1.5 group-hover:text-emerald-800 transition-colors">
              {{ item.title }}
            </h3>
            
            <p class="text-slate-550 text-xs leading-relaxed font-semibold mb-4 line-clamp-2">
              {{ item.description || item.desc || 'Tidak ada deskripsi' }}
            </p>
          </div>
          
          <!-- Zoom indicator footer -->
          <span class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold text-emerald-700 mt-auto pt-3 border-t border-slate-100 group-hover:text-emerald-950">
            Perbesar Visual <ArrowUpRight :size="12" />
          </span>
        </div>
      </div>
      
      <div v-if="!loading && filteredGallery.length === 0" class="text-center py-16">
        <p class="text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <Leaf :size="16" /> Belum ada dokumentasi galeri yang ditemukan.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: SHOWCASES SPLIT SECTION ===== -->
    <section v-if="!loading && filteredGallery.length > 0" class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/50 mt-8">
      
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
          @click="openLightbox(filteredGallery[0])"
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

          <h3 class="font-bold text-slate-955 text-xl sm:text-2xl leading-snug mb-3 group-hover:text-emerald-800 transition-colors">
            {{ filteredGallery[0].title }}
          </h3>
          
          <p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold mb-6">
            {{ filteredGallery[0].description || filteredGallery[0].desc }}
          </p>

          <!-- Large image frame -->
          <div class="relative w-full h-64 sm:h-80 overflow-hidden rounded-[1.8rem] mb-4 bg-slate-100 border border-slate-200/60">
            <img 
              :src="filteredGallery[0].image_url || filteredGallery[0].image" 
              :alt="filteredGallery[0].title"
              class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="bg-white text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-1.5">
                <Maximize2 :size="14" /> Perbesar Full Foto
              </span>
            </div>
          </div>

          <span class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold text-emerald-700 mt-2">
            Klik Untuk Tampilan Penuh <ArrowUpRight :size="12" />
          </span>
        </div>

        <!-- Right: Stack of smaller horizontal items -->
        <div class="space-y-4">
          <div
            v-for="item in filteredGallery.slice(1, 4)" 
            :key="item.id"
            @click="openLightbox(item)"
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
              
              <h4 class="text-slate-900 font-extrabold text-xs sm:text-sm leading-snug line-clamp-1 mb-1 group-hover:text-emerald-800 transition-colors">
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

    <!-- FULL SCREEN PHOTO LIGHTBOX MODAL -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="selectedItem" 
          class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden" 
          @click="closeLightbox"
        >
          <!-- Top Control Header Bar -->
          <div class="p-4 sm:p-6 flex items-center justify-between z-20 text-white bg-gradient-to-b from-black/80 to-transparent" @click.stop>
            <div class="flex items-center gap-3">
              <span class="text-xs uppercase tracking-widest font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5">
                <Tag :size="12" /> {{ selectedItem.category }}
              </span>
              <span class="text-xs text-slate-400 font-medium hidden sm:inline">
                Foto {{ (selectedIndex ?? 0) + 1 }} dari {{ filteredGallery.length }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <button 
                @click="closeLightbox" 
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20 shadow-lg"
                title="Tutup (Esc)"
              >
                <X :size="20" />
              </button>
            </div>
          </div>

          <!-- Center Photo Viewport with Prev / Next Floating Arrows -->
          <div class="flex-1 relative flex items-center justify-center px-4 sm:px-12 py-2" @click.stop>
            
            <!-- Previous Button -->
            <button 
              @click.stop="prevPhoto"
              class="absolute left-3 sm:left-8 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md"
              title="Foto Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft :size="24" />
            </button>

            <!-- Full Screen Image Container -->
            <div class="max-w-6xl max-h-[75vh] sm:max-h-[82vh] flex items-center justify-center transition-all duration-300">
              <img 
                :src="selectedItem.image_url || selectedItem.image" 
                :alt="selectedItem.title"
                class="max-h-[75vh] sm:max-h-[82vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 select-none animate-[scale-in_0.25s_ease-out]"
              />
            </div>

            <!-- Next Button -->
            <button 
              @click.stop="nextPhoto"
              class="absolute right-3 sm:right-8 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-md"
              title="Foto Selanjutnya (Panah Kanan)"
            >
              <ChevronRight :size="24" />
            </button>
          </div>

          <!-- Bottom Full Caption & Description Bar -->
          <div class="p-6 sm:p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-20 text-white border-t border-white/10" @click.stop>
            <div class="max-w-4xl mx-auto space-y-2">
              <h2 class="text-lg sm:text-2xl font-bold font-sans tracking-tight text-white leading-snug">
                {{ selectedItem.title }}
              </h2>
              <p class="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal max-w-3xl">
                {{ selectedItem.description || selectedItem.desc || 'Dokumentasi potensi dan keindahan Dusun Menggah, Desa Katekan.' }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
