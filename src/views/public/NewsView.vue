<script setup lang="ts">
import { ref } from 'vue'
import { Newspaper, Search, ArrowRight, Calendar } from 'lucide-vue-next'

const categories = [
  { key: 'semua', label: 'Semua Berita' },
  { key: 'pengumuman', label: 'Pengumuman Resmi' },
  { key: 'kegiatan', label: 'Kegiatan Desa' },
  { key: 'pembangunan', label: 'Pembangunan' },
]
const activeCategory = ref('semua')
const searchQuery = ref('')

const newsList = ref([
  { id: '1', title: 'Pembangunan Saluran Irigasi Baru Mulai Berjalan', category: 'pembangunan', date: '10 Juli 2026', desc: 'Pemdes Kadaleman memulai proyek irigasi sepanjang 500 meter untuk mendukung sektor pertanian lokal.', image: '/images/nature_spot_ricefields.png' },
  { id: '2', title: 'Sosialisasi Penyaluran BLT Dana Desa Tahap II', category: 'pengumuman', date: '08 Juli 2026', desc: 'Pertemuan warga di balai desa membahas kriteria dan jadwal pembagian bantuan langsung tunai.', image: '/images/village_landscape_map.png' },
  { id: '3', title: 'Kerja Bakti Akbar Menyambut Hari Kemerdekaan', category: 'kegiatan', date: '05 Juli 2026', desc: 'Warga serentak berpartisipasi membersihkan lingkungan desa dan memasang bendera hias.', image: '/images/nature_spot_camp.png' },
])

const filteredNews = ref(newsList.value)

function filterCategory(cat: string) {
  activeCategory.value = cat
  updateFilters()
}

function updateFilters() {
  let temp = newsList.value
  if (activeCategory.value !== 'semua') {
    temp = temp.filter(n => n.category === activeCategory.value)
  }
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    temp = temp.filter(n => n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q))
  }
  filteredNews.value = temp
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
            <Newspaper :size="12" /> Berita Terkini
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Kabar Berita <span class="text-warm-400">&amp; Pengumuman</span>
          </h1>
          <p class="text-xs sm:text-sm text-primary-100 font-light max-w-xl opacity-90 leading-relaxed">
            Ikuti perkembangan pembangunan infrastruktur, pengumuman resmi pemerintahan, dan dokumentasi ragam kegiatan warga.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="section bg-surface-50">
      <div class="container-main">
        <!-- Filter & Search Bar Row -->
        <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-10">
          <!-- Category Pills -->
          <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              v-for="cat in categories" 
              :key="cat.key" 
              @click="filterCategory(cat.key)"
              class="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
              :class="activeCategory === cat.key 
                ? 'bg-primary-500 text-white shadow-sm' 
                : 'bg-white border border-surface-200/60 text-surface-600 hover:text-primary-500 hover:bg-surface-100'"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- Search Box -->
          <div class="relative w-full md:w-80">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari kata kunci berita..." 
              @input="updateFilters"
              class="w-full rounded-full border border-surface-250 bg-white text-surface-800 py-3 pl-5 pr-11 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900" 
            />
            <Search :size="14" class="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400" />
          </div>
        </div>

        <!-- News Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="news in filteredNews" 
            :key="news.id" 
            class="group bg-white border border-surface-200/50 rounded-[1.8rem] p-5 shadow-sm hover:shadow-card transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div class="relative w-full h-48 overflow-hidden rounded-[1.2rem] mb-4">
                <img 
                  :src="news.image" 
                  :alt="news.title"
                  class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span class="absolute top-3 right-3 bg-white/95 text-[8px] uppercase tracking-wider font-extrabold text-primary-600 px-3 py-1 rounded-full shadow-sm">
                  {{ news.category }}
                </span>
              </div>
              <div class="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-surface-400 mb-2">
                <Calendar :size="10" /> {{ news.date }}
              </div>
              <h3 class="text-xs uppercase tracking-wider font-extrabold text-surface-800 group-hover:text-primary-600 transition-colors duration-300 mb-2 line-clamp-2">
                {{ news.title }}
              </h3>
              <p class="text-xs text-surface-500 leading-relaxed font-light mb-4 line-clamp-3">
                {{ news.desc }}
              </p>
            </div>
            <RouterLink 
              :to="`/berita/${news.id}`"
              class="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-extrabold text-primary-600 group-hover:text-primary-800 mt-auto pt-2 border-t border-surface-50"
            >
              Baca Selengkapnya <ArrowRight :size="12" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
