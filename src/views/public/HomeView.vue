<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  MapPin,
  Megaphone,
  Calendar,
  Newspaper,
  ArrowRight,
  ArrowLeft,
  Clock,
  Plus,
  ChevronRight,
  Mail,
  Send
} from 'lucide-vue-next'
import api from '@/lib/api'

// Loading states
const loadingNews = ref(true)
const loadingAgenda = ref(true)
const loadingGallery = ref(true)

// API Data
const newsList = ref<any[]>([])
const agendaList = ref<any[]>([])
const galleryList = ref<any[]>([])
const activeAnnouncements = ref<any[]>([])

// Removed fallback arrays as we are strictly using API

const stats = [
  { value: '50+', label: 'Hektar Sawah Produktif' },
  { value: '200+', label: 'Kepala Keluarga' },
  { value: '700+', label: 'Total Warga Dusun' },
  { value: '100%', label: 'Semangat Gotong Royong' },
]

// For gallery slider scrolling
const sliderContainer = ref<HTMLElement | null>(null)

function scrollSlider(direction: 'left' | 'right') {
  if (sliderContainer.value) {
    const scrollAmount = 320 // width of a card + gap
    sliderContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}

async function fetchData() {
  // Announcements
  try {
    const res = await api.get('/public/announcements')
    if (res.data?.success && Array.isArray(res.data?.data)) {
      activeAnnouncements.value = res.data.data.slice(0, 3)
    }
  } catch {}

  // News
  try {
    const res = await api.get('/public/news?page=1&per_page=3')
    if (res.data?.success && Array.isArray(res.data?.data?.items)) {
      newsList.value = res.data.data.items
    }
  } catch {
    newsList.value = []
  } finally {
    loadingNews.value = false
  }

  // Agenda
  try {
    const res = await api.get('/public/agenda?upcoming=true')
    if (res.data?.success && Array.isArray(res.data?.data?.items)) {
      agendaList.value = res.data.data.items.slice(0, 3)
    }
  } catch {
    agendaList.value = []
  } finally {
    loadingAgenda.value = false
  }

  // Gallery
  try {
    const res = await api.get('/public/gallery?page=1&per_page=6')
    if (res.data?.success && Array.isArray(res.data?.data?.items)) {
      galleryList.value = res.data.data.items
    }
  } catch {
    galleryList.value = []
  } finally {
    loadingGallery.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getShortMonth(dateStr: string) {
  return new Date(dateStr).toLocaleString('id-ID', { month: 'short' })
}

function getDayNum(dateStr: string) {
  return new Date(dateStr).getDate()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative organic background features -->
    <div class="absolute top-[10%] left-[-100px] w-[350px] h-[350px] bg-green-200/20 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-150px] w-[450px] h-[450px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Floating Sparkles & Plus Accents -->
    <div class="absolute top-28 left-[10%] text-slate-300 animate-pulse pointer-events-none"><Plus :size="24" class="stroke-[1.5]" /></div>
    <div class="absolute top-[45%] left-[8%] text-slate-300 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>
    <div class="absolute top-36 right-[12%] text-slate-300 animate-bounce duration-[4s] pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[65%] right-[6%] text-slate-300 pointer-events-none"><Plus :size="18" class="stroke-[1.5]" /></div>

    <!-- ===== HERO SECTION ===== -->
    <section class="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center space-y-8">
        
        <!-- Announcement Alert Pill -->
        <div v-if="activeAnnouncements.length > 0" class="inline-flex max-w-full">
          <RouterLink 
            to="/pengumuman"
            class="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm text-xs font-bold text-emerald-800 hover:bg-emerald-100/70 transition-all duration-300"
          >
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Megaphone :size="13" class="shrink-0 text-emerald-700" />
            <span class="truncate font-semibold text-slate-700">
              Pengumuman: {{ activeAnnouncements[0].title }}
            </span>
            <ChevronRight :size="14" class="text-slate-400" />
          </RouterLink>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-slate-900 max-w-4xl mx-auto font-sans">
          Membawa Pertumbuhan Baru Bagi <br class="hidden sm:inline" />
          <span class="font-semibold text-emerald-800 italic font-serif">Pertanian Menggah</span>.
        </h1>

        <!-- Subtext -->
        <p class="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Mengembangkan potensi agraris lokal secara berkelanjutan melalui sinergi kearifan budaya dusun dengan inovasi dan teknologi modern demi kesejahteraan warga.
        </p>

        <!-- CTA Action -->
        <div class="flex justify-center pt-2">
          <RouterLink 
            to="/profil" 
            class="group bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-slate-950/15 flex items-center gap-2"
          >
            Pelajari Profil
            <ArrowRight :size="14" class="group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>

        <!-- Large Hero Showcase Image -->
        <div class="pt-6">
          <div class="relative w-full aspect-[21/9] rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 border border-white/50 group bg-slate-100">
            <img 
              src="/images/hero_agri_landscape.png" 
              alt="Lush green agricultural fields of Dusun Menggah" 
              class="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.03] transition-transform duration-[2.5s] ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
            
            <!-- Hero Overlay text -->
            <div class="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 text-left text-white max-w-md space-y-1 z-10">
              <h3 class="font-serif italic text-xl sm:text-2xl font-light">Perjalanan Menuju Kelestarian.</h3>
              <p class="text-[10px] sm:text-xs text-slate-350 leading-relaxed font-semibold tracking-wide uppercase">
                Temukan kearifan lokal dalam praktik pertanian berkelanjutan kami.
              </p>
            </div>
            
            <!-- Floating pin location badge in hero -->
            <div class="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-10 hidden sm:block">
              <div class="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                <MapPin :size="12" class="text-white" />
                <span class="text-[10px] font-bold tracking-widest text-white uppercase">Menggah, Katekan, Ngawi</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== STATS SECTION ===== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200/60">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
        <div 
          v-for="(stat, index) in stats" 
          :key="stat.label" 
          class="space-y-1 relative"
          :class="{'md:border-r border-slate-200/60': index < stats.length - 1}"
        >
          <h2 class="text-3xl sm:text-5xl font-light text-slate-900 tracking-tight font-serif italic">{{ stat.value }}</h2>
          <p class="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-400 font-extrabold leading-tight">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ===== INTRODUCTION SECTION ===== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div class="grid lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left: Category list -->
        <div class="lg:col-span-3 space-y-4 pt-1 border-t-2 border-slate-900/10">
          <span class="text-[11px] uppercase tracking-widest font-black text-emerald-800 block">Selayang Pandang</span>
          <div class="space-y-2 hidden lg:block">
            <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest">2026 • Pertanian Dusun</span>
            <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest">Kearifan Lokal</span>
            <span class="block text-xs font-bold text-slate-400 uppercase tracking-widest">Agroteknologi Organik</span>
          </div>
        </div>

        <!-- Right: Description -->
        <div class="lg:col-span-9 space-y-8">
          <h2 class="text-2xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] font-light text-slate-900 tracking-tight">
            Meskipun ada kemajuan teknologi modern, pertanian Dusun Menggah tetap berakar pada <span class="font-serif italic font-medium text-emerald-850">kearifan lokal</span> dan semangat <span class="font-serif italic font-medium text-emerald-850">gotong royong</span>.
          </h2>
          
          <div class="grid md:grid-cols-12 gap-6 pt-4">
            <div class="md:col-span-8 space-y-4">
              <p class="text-slate-500 text-sm leading-relaxed text-justify font-medium">
                Dusun Menggah merupakan salah satu wilayah administratif Desa Katekan, Ngawi yang subur. Kami mengintegrasikan tradisi bertani turun-temurun dengan inovasi terkini. Mahasiswa KKN bersama warga aktif mendorong implementasi pertanian berbasis lingkungan untuk menjaga kelestarian tanah serta meningkatkan nilai ekonomi komoditas lokal.
              </p>
            </div>
            <div class="md:col-span-4 flex flex-col gap-3 justify-center lg:items-end">
              <RouterLink 
                to="/profil/potensi" 
                class="inline-flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-900 hover:text-emerald-800 bg-white border border-slate-200/80 px-5 py-3 rounded-full hover:bg-slate-50 transition-all text-center"
              >
                Komoditas Unggulan
              </RouterLink>
              <RouterLink 
                to="/profil/visi-misi" 
                class="inline-flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-900 hover:text-emerald-800 bg-white border border-slate-200/80 px-5 py-3 rounded-full hover:bg-slate-50 transition-all text-center"
              >
                Visi & Misi Dusun
              </RouterLink>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== HORIZONTAL CAROUSEL SECTION ===== -->
    <section class="py-16 bg-[#FAF9F6] border-y border-slate-200/40 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Galeri Dokumentasi</span>
            <h2 class="text-3xl font-light tracking-tight text-slate-950 font-sans">
              Dokumentasi Kegiatan & <span class="font-serif italic font-medium">Potensi Menggah</span>
            </h2>
          </div>
          
          <!-- Navigation buttons -->
          <div class="flex items-center gap-3">
            <button 
              @click="scrollSlider('left')"
              class="w-10 h-10 rounded-full border border-slate-250 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-90"
              aria-label="Previous"
            >
              <ArrowLeft :size="16" />
            </button>
            <button 
              @click="scrollSlider('right')"
              class="w-10 h-10 rounded-full border border-slate-250 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-90"
              aria-label="Next"
            >
              <ArrowRight :size="16" />
            </button>
          </div>
        </div>

        <!-- Slider Container -->
        <div 
          ref="sliderContainer" 
          class="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-6"
        >
          
          <!-- Static/Highlighted Card: "Mulai Sekarang" -->
          <div class="snap-start shrink-0 w-[290px] sm:w-[320px] bg-white rounded-3xl p-6 border border-slate-200/50 flex flex-col justify-between hover:shadow-lg transition-all duration-300 shadow-sm">
            <div class="space-y-4">
              <span class="text-[9px] uppercase tracking-widest font-extrabold bg-slate-950 text-white px-2 py-0.5 rounded-full inline-block">Galeri Dusun</span>
              <h3 class="text-xl font-semibold leading-snug text-slate-950">
                Eksplorasi Dokumentasi Dusun Menggah
              </h3>
              <p class="text-slate-450 text-xs leading-relaxed font-semibold">
                Lihat seluruh kumpulan galeri dokumentasi gotong royong, kebudayaan, fasilitas, dan kegiatan warga.
              </p>
            </div>
            
            <div class="pt-6 space-y-4">
              <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <img src="/images/tractor_spraying.png" alt="Farming" class="w-full h-full object-cover" />
              </div>
              <RouterLink 
                to="/galeri" 
                class="group w-full py-3 px-4 bg-slate-950 hover:bg-slate-900 text-white text-xs uppercase tracking-widest font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow"
              >
                Lihat Semua Galeri
                <ArrowRight :size="13" class="group-hover:translate-x-1 transition-transform" />
              </RouterLink>
            </div>
          </div>

          <!-- Dynamic Cards -->
          <div v-if="loadingGallery" class="flex gap-6">
            <div v-for="i in 4" :key="i" class="w-[290px] sm:w-[320px] aspect-[4/5] bg-white rounded-3xl animate-pulse border border-slate-200/50"></div>
          </div>

          <template v-else>
            <div 
              v-for="gal in galleryList" 
              :key="gal.id"
              class="snap-start shrink-0 w-[290px] sm:w-[320px] aspect-[4/5] rounded-3xl overflow-hidden relative group border border-slate-200/40 shadow-sm"
            >
              <img 
                :src="gal.image_url" 
                :alt="gal.title" 
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              
              <div class="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <span class="text-[9px] uppercase tracking-widest font-extrabold bg-white/20 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm inline-block">
                  {{ gal.category || 'Galeri' }}
                </span>
                <h4 class="text-sm font-semibold leading-snug line-clamp-2">{{ gal.title }}</h4>
              </div>
            </div>
          </template>

        </div>

      </div>
    </section>

    <!-- ===== MID-PAGE CALLOUT BANNER ===== -->
    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative w-full min-h-[50vh] sm:min-h-[60vh] rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex flex-col justify-end p-8 sm:p-16 text-left group shadow-xl">
        
        <!-- Image background -->
        <img 
          src="/images/nature_spot_ricefields.png" 
          alt="Green nature fields backdrop" 
          class="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-[3s]" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        <div class="relative z-10 max-w-2xl space-y-6">
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <MapPin :size="12" class="text-white" />
            <span class="text-[9px] font-bold tracking-widest text-white uppercase">Dusun Menggah, Katekan, Ngawi</span>
          </div>
          
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-light leading-tight text-white">
            Kolaborasi & Belajar Bersama <br class="hidden sm:inline" />
            Para <span class="font-serif italic font-medium text-green-300">Ahli & Praktisi</span> Pertanian.
          </h2>

          <div class="flex items-center gap-4 pt-2">
            <RouterLink 
              to="/kontak"
              class="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] tracking-widest uppercase flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-300"
            >
              GABUNG
            </RouterLink>
            <span class="text-xs text-slate-200 font-semibold tracking-wide">
              Hubungi pengurus dusun untuk program kemitraan kelompok tani.
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== POTENSI SEKTOR / SOLUTIONS SECTION ===== -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="space-y-16">
        
        <!-- Section Header -->
        <div class="grid md:grid-cols-12 gap-6 items-end">
          <div class="md:col-span-8 space-y-2">
            <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block">Sektor Unggulan & Inovasi</span>
            <h2 class="text-3xl sm:text-5xl font-light tracking-tight text-slate-900 font-sans">
              Solusi Cerdas Untuk Hasil <span class="font-serif italic font-medium">Tani Optimal</span>
            </h2>
          </div>
          <div class="md:col-span-4 lg:pl-8">
            <p class="text-slate-400 text-xs leading-relaxed font-semibold">
              Mendorong implementasi metode pertanian modern untuk meningkatkan efisiensi kerja, produktivitas, serta keberlanjutan alam Dusun Menggah.
            </p>
          </div>
        </div>

        <!-- Three Columns Grid -->
        <div class="grid md:grid-cols-3 gap-8">
          
          <!-- Card 1: Pertanian Presisi -->
          <div class="bg-white rounded-3xl overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6">
            <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
              <img src="/images/smart_farming_precision.png" alt="Smart precision farming tablet representation" class="w-full h-full object-cover" />
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-slate-950">Pertanian Presisi</h3>
              <p class="text-slate-500 text-xs leading-relaxed font-medium">
                Penerapan analisis data tanah untuk takaran pupuk organik yang presisi, meningkatkan kualitas bulir padi organik Menggah secara optimal.
              </p>
            </div>
          </div>

          <!-- Card 2: Pengawasan Drone -->
          <div class="bg-white rounded-3xl overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6">
            <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
              <img src="/images/drone_crop_surveillance.png" alt="Drone surveillance over crop fields" class="w-full h-full object-cover" />
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-slate-950">Pemantauan Udara</h3>
              <p class="text-slate-500 text-xs leading-relaxed font-medium">
                Penggunaan teknologi drone/UAV untuk pemetaan kesehatan tanaman padi dan deteksi dini penyebaran hama di seluruh hamparan persawahan.
              </p>
            </div>
          </div>

          <!-- Card 3: Irigasi Otomatis -->
          <div class="bg-white rounded-3xl overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6">
            <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
              <img src="/images/automated_watering_robotic.png" alt="Automated greenhouse watering" class="w-full h-full object-cover" />
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-slate-950">Irigasi Otomatis</h3>
              <p class="text-slate-500 text-xs leading-relaxed font-medium">
                Sistem pengairan pintar berbasis kelembaban tanah untuk pembibitan benih, menghemat konsumsi air tanah dan menjaga kualitas persemaian.
              </p>
            </div>
          </div>

        </div>

        <!-- Extra Highlight Row matching "Changing The Game" -->
        <div class="bg-white rounded-[2.5rem] border border-slate-200/50 p-6 sm:p-10 shadow-sm hover:shadow-md transition-all duration-300">
          <div class="grid md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-4 lg:col-span-3">
              <div class="aspect-[4/3] md:aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <img src="/images/greenhouse_nursery_eco.png" alt="Nursery sprouts" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="md:col-span-8 lg:col-span-9 space-y-4">
              <h3 class="text-xl sm:text-2xl lg:text-3xl font-light text-slate-950 leading-snug">
                Mengubah cara kami mengolah tanah melalui penerapan <span class="font-serif italic font-medium text-emerald-800">praktik berkelanjutan</span> dan <span class="font-serif italic font-medium text-emerald-800">teknologi ramah lingkungan</span> demi masa depan ketahanan pangan desa.
              </h3>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Kelompok Tani Dusun Menggah &bull; Program KKN Mahasiswa 2026
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== NEWS & AGENDA DYNAMIC SECTION ===== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/60">
      <div class="grid lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left: News (Kabar Dusun) -->
        <div class="lg:col-span-7 space-y-8">
          <div class="flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Kabar Dusun</span>
              <h2 class="text-2xl font-semibold text-slate-950 flex items-center gap-2">
                <Newspaper :size="20" class="text-emerald-700 shrink-0" />
                Berita & Kegiatan Terbaru
              </h2>
            </div>
            <RouterLink to="/berita" class="text-xs font-bold text-emerald-700 hover:underline shrink-0">Lihat Semua</RouterLink>
          </div>

          <!-- Loading News Skeletons -->
          <div v-if="loadingNews" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-28 bg-white rounded-3xl border border-slate-200/30 animate-pulse"></div>
          </div>

          <div v-else class="space-y-4">
            <RouterLink
              v-for="news in newsList"
              :key="news.id"
              :to="`/berita/${news.slug}`"
              class="flex gap-4 p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <!-- Cover image or placeholder icon -->
              <div class="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
                <img v-if="news.cover_image_url || news.cover_image" :src="news.cover_image_url || news.cover_image" :alt="news.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span v-else class="text-2xl">📰</span>
              </div>
              
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div class="space-y-1">
                  <span class="text-[10px] text-slate-400 font-bold block flex items-center gap-1.5 uppercase tracking-wide">
                    <Clock :size="10" /> {{ formatDate(news.published_at || news.created_at) }}
                  </span>
                  <h3 class="font-bold text-slate-950 text-xs sm:text-sm leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                    {{ news.title }}
                  </h3>
                </div>
                <p class="text-slate-450 text-[11px] leading-relaxed line-clamp-1 font-semibold">
                  {{ news.excerpt }}
                </p>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Right: Upcoming Agendas -->
        <div class="lg:col-span-5 space-y-8">
          <div class="flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Agenda Dusun</span>
              <h2 class="text-2xl font-semibold text-slate-950 flex items-center gap-2">
                <Calendar :size="20" class="text-emerald-700 shrink-0" />
                Agenda Terdekat
              </h2>
            </div>
            <RouterLink to="/agenda" class="text-xs font-bold text-emerald-700 hover:underline shrink-0">Lihat Semua</RouterLink>
          </div>

          <!-- Loading Agendas -->
          <div v-if="loadingAgenda" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-24 bg-white rounded-3xl border border-slate-200/30 animate-pulse"></div>
          </div>

          <div v-else class="space-y-4">
            <RouterLink
              v-for="agenda in agendaList"
              :key="agenda.id"
              to="/agenda"
              class="flex gap-4 p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <!-- Calendar Page style badge -->
              <div class="w-14 sm:w-16 shrink-0 text-center rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm flex flex-col">
                <div class="bg-emerald-800 text-white text-[9px] font-black uppercase py-1 leading-none group-hover:bg-emerald-900 transition-colors tracking-wider">
                  {{ getShortMonth(agenda.start_date) }}
                </div>
                <div class="py-2.5 text-slate-900 font-extrabold text-xl sm:text-2xl leading-none font-serif italic">
                  {{ getDayNum(agenda.start_date) }}
                </div>
              </div>

              <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div class="space-y-1">
                  <span class="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 inline-block uppercase tracking-wider">
                    {{ agenda.category || 'Kegiatan' }}
                  </span>
                  <h3 class="font-bold text-slate-950 text-xs leading-snug line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {{ agenda.title }}
                  </h3>
                </div>
                <span class="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <MapPin :size="10" class="text-slate-400" /> {{ agenda.location || 'Dusun Menggah' }}
                </span>
              </div>
            </RouterLink>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== BOTTOM CALL TO ACTION WITH FORM ===== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="relative w-full rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden bg-slate-950 text-white p-8 sm:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-10 shadow-2xl">
        
        <!-- Subtle image backdrop with overlay -->
        <img 
          src="/images/nature_spot_camp.png" 
          alt="Night scene agriculture fields" 
          class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" 
        />
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

        <!-- Left: Call to action title -->
        <div class="relative z-10 space-y-4 max-w-lg">
          <h2 class="text-3xl sm:text-5xl font-light leading-tight tracking-tight">
            Mari Berkolaborasi Membangun <span class="font-serif italic font-medium text-green-300">Dusun Menggah</span>!
          </h2>
          <p class="text-slate-400 text-xs sm:text-sm font-semibold">
            Masukkan alamat email Anda untuk mendapatkan pemberitahuan agenda kerja gotong royong dan informasi kemitraan pertanian.
          </p>
        </div>

        <!-- Right: Newsletter form -->
        <div class="relative z-10 shrink-0 w-full lg:w-auto">
          <form @submit.prevent class="flex flex-col sm:flex-row gap-3 w-full max-w-md lg:w-[420px]">
            <div class="relative flex-1">
              <input 
                type="email" 
                placeholder="Alamat email Anda" 
                class="w-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-5 py-4 rounded-full placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all font-semibold"
                required
              />
              <Mail :size="16" class="absolute right-5 top-1/2 -translate-y-1/2 text-white/30" />
            </div>
            <button 
              type="submit" 
              class="bg-white hover:bg-slate-100 text-slate-950 text-xs uppercase tracking-widest font-extrabold px-8 py-4 rounded-full transition-all duration-300 active:scale-95 shadow flex items-center justify-center gap-1.5 shrink-0"
            >
              Kirim
              <Send :size="13" />
            </button>
          </form>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
/* Custom local scrollbar hiding for horizontal scroll lists */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
