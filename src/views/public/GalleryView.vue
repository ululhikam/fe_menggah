<script setup lang="ts">
import { ref } from 'vue'
import { Image as ImageIcon, X, ArrowUpRight } from 'lucide-vue-next'

const categories = [
  { key: 'semua', label: 'Semua Potensi' },
  { key: 'umkm', label: 'Produk UMKM' },
  { key: 'wisata', label: 'Destinasi Wisata' },
  { key: 'budaya', label: 'Warisan Budaya' },
  { key: 'kegiatan', label: 'Kegiatan Warga' },
]
const activeCategory = ref('semua')

const galleryItems = ref([
  { id: '1', title: 'Batik Khas Desa', category: 'umkm', desc: 'Kerajinan batik tulis khas desa dengan pewarna alami.', image: '/images/nature_spot_ricefields.png' },
  { id: '2', title: 'Air Terjun Curug Indah', category: 'wisata', desc: 'Destinasi wisata air terjun purba yang masih asri di kaki bukit.', image: '/images/nature_spot_waterfall.png' },
  { id: '3', title: 'Tarian Tradisional', category: 'budaya', desc: 'Pagelaran tari adat menyambut masa panen raya.', image: '/images/misty_mountain_hero.png' },
  { id: '4', title: 'Kerja Bakti Desa', category: 'kegiatan', desc: 'Gotong royong rutin warga menjaga kebersihan saluran irigasi.', image: '/images/village_landscape_map.png' },
  { id: '5', title: 'Kopi Lokal Premium', category: 'umkm', desc: 'Biji kopi robusta pilihan hasil panen perkebunan rakyat.', image: '/images/nature_spot_camp.png' },
  { id: '6', title: 'Situs Bersejarah', category: 'budaya', desc: 'Cagar budaya peninggalan leluhur yang terawat baik.', image: '/images/nature_spot_ricefields.png' },
])

const selectedItem = ref<typeof galleryItems.value[0] | null>(null)
const filteredItems = ref(galleryItems.value)

function filterGallery(cat: string) {
  activeCategory.value = cat
  filteredItems.value = cat === 'semua'
    ? galleryItems.value
    : galleryItems.value.filter(i => i.category === cat)
}
</script>

<template>
  <div class="bg-surface-50 text-surface-800 min-h-screen font-sans">
    
    <!-- ===== HEADER SECTION (Interior Boxed Hero) ===== -->
    <section class="px-4 sm:px-6 lg:px-8 pt-24 pb-4 bg-surface-50">
      <div class="relative bg-primary-950 text-white py-16 md:py-20 overflow-hidden rounded-[2rem] shadow-elevated">
        <!-- Background Image overlay -->
        <div class="absolute inset-0 z-0">
          <img 
            src="/images/misty_mountain_hero.png" 
            alt="Misty Mountain Kadaleman" 
            class="w-full h-full object-cover opacity-20 object-center"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-transparent"></div>
        </div>

        <div class="container-main px-6 md:px-12 relative z-10">
          <div class="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-warm-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4">
            <ImageIcon :size="12" /> Galeri Potensi
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Potensi Wisata <span class="text-warm-400">&amp; Budaya</span>
          </h1>
          <p class="text-xs sm:text-sm text-primary-100 font-light max-w-xl opacity-90 leading-relaxed">
            Jelajahi keindahan tersembunyi, peninggalan adat, hasil tani kopi rakyat, hingga produk kreatif UMKM unggulan kami.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="section bg-surface-50">
      <div class="container-main">
        <!-- Category Filter Pills -->
        <div class="flex items-center gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide flex-wrap md:flex-nowrap">
          <div class="flex gap-2 max-w-full">
            <button 
              v-for="cat in categories" 
              :key="cat.key" 
              @click="filterGallery(cat.key)"
              class="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
              :class="activeCategory === cat.key 
                ? 'bg-primary-500 text-white shadow-sm' 
                : 'bg-white border border-surface-200/60 text-surface-600 hover:text-primary-500 hover:bg-surface-100'"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            @click="selectedItem = item"
            class="group bg-white border border-surface-200/50 rounded-[1.8rem] p-5 cursor-pointer hover:shadow-elevated transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div class="relative w-full h-52 overflow-hidden rounded-[1.2rem] mb-4">
                <img 
                  :src="item.image" 
                  :alt="item.title"
                  class="w-full h-full object-cover scale-100 group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <span class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[8px] uppercase tracking-wider font-extrabold text-primary-600 px-3 py-1 rounded-full shadow-sm">
                  {{ item.category }}
                </span>
              </div>
              <h3 class="text-sm uppercase tracking-wider font-extrabold text-surface-800 group-hover:text-primary-600 transition-colors duration-300 mb-2">
                {{ item.title }}
              </h3>
              <p class="text-xs text-surface-500 leading-relaxed font-light mb-4">
                {{ item.desc }}
              </p>
            </div>
            <span class="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-extrabold text-primary-600 group-hover:text-primary-800 mt-auto pt-2">
              Lihat Detail <ArrowUpRight :size="12" />
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <teleport to="body">
      <transition name="fade">
        <div 
          v-if="selectedItem" 
          class="fixed inset-0 z-50 bg-primary-950/80 backdrop-blur-md flex items-center justify-center p-4" 
          @click="selectedItem = null"
        >
          <div 
            class="bg-white rounded-[2.2rem] max-w-2xl w-full p-6 md:p-8 animate-[scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)] relative border border-surface-200/60 shadow-elevated" 
            @click.stop
          >
            <button 
              @click="selectedItem = null" 
              class="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 text-surface-600 flex items-center justify-center transition-colors"
            >
              <X :size="16" />
            </button>
            <div class="w-full h-72 overflow-hidden rounded-[1.5rem] mb-6">
              <img 
                :src="selectedItem.image" 
                :alt="selectedItem.title"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="inline-block text-[9px] uppercase tracking-wider font-extrabold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
              {{ selectedItem.category }}
            </span>
            <h2 class="text-xl font-extrabold uppercase tracking-wider text-surface-800 mt-3 mb-2">{{ selectedItem.title }}</h2>
            <p class="text-xs text-surface-500 leading-relaxed font-light mb-6">{{ selectedItem.desc }}</p>
            <button 
              @click="selectedItem = null" 
              class="w-full sm:w-auto inline-flex items-center justify-center border border-surface-200/60 hover:bg-surface-50 text-surface-600 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-colors duration-300"
            >
              Tutup Galeri
            </button>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
