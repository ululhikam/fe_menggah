<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileText,
  Map,
  MessageSquare,
  Instagram,
  Twitter,
  Facebook,
  Users,
  Megaphone
} from 'lucide-vue-next'
import api from '@/lib/api'

// Statistics bar under Hero
const heroStats = ref([
  { title: '2.8k+', desc: 'Estimasi Populasi Desa' },
  { title: '1.2k+', desc: 'Kepadatan Penduduk (jiwa/km²)' },
  { title: '100%', desc: 'Kearifan Lokal & Gotong Royong' },
])

// Services/Destinations cards (Section 3: Top Destinations)
const destinations = ref([
  {
    title: 'Pasar Menggah',
    tag: 'Pusat Ekonomi',
    rating: '★ 4.9 (240)',
    location: 'Dusun Menggah, Katekan',
    image: '/images/nature_spot_ricefields.png'
  },
  {
    title: 'Ndeshirt Konveksi',
    tag: 'Industri Kreatif',
    rating: '★ 4.8 (115)',
    location: 'UMKM Sablon, Menggah',
    image: '/images/nature_spot_camp.png'
  },
  {
    title: 'Masjid Menggah',
    tag: 'Sosial & Religi',
    rating: '★ 5.0 (420)',
    location: 'Pusat Keagamaan, Menggah',
    image: '/images/misty_mountain_hero.png'
  },
  {
    title: 'Luapan Avur Sangiran',
    tag: 'Mitigasi Bencana',
    rating: '★ 4.7 (80)',
    location: 'Titik Pengawasan Sungai',
    image: '/images/village_landscape_map.png'
  }
])

// Benefits (Section 2 right side)
const benefits = ref([
  {
    title: 'Layanan Mandiri Cepat',
    desc: 'Ajukan surat pengantar kependudukan, domisili, SKCK, dan SKTM secara mandiri dari rumah dalam 5 menit.',
    icon: FileText
  },
  {
    title: 'UMKM & Industri Kreatif',
    desc: 'Mendorong pemasaran industri konveksi, pakaian jadi, jasa sablon, serta hasil komoditas tani warga.',
    icon: Map
  },
  {
    title: 'Aduan Mitigasi Siaga',
    desc: 'Sampaikan laporan kondisi tanggul sungai Avur Sangiran atau usulan pembangunan langsung ke perangkat desa.',
    icon: MessageSquare
  }
])

// Packages Section (Section 4)
const packages = ref([
  {
    title: 'Geografis & Lingkungan',
    desc: 'Dusun Menggah berada di dataran rendah subur Kecamatan Gantiwarno, Klaten, berbatasan langsung dengan Sleman & Gunungkidul DIY.',
    image: '/images/nature_spot_ricefields.png',
    icon: MapPin
  },
  {
    title: 'Sosial & Ekonomi',
    desc: 'Mata pencaharian utama pertanian (padi & palawija), peternakan, serta industri kreatif konveksi terpadu dengan kebersamaan gotong royong.',
    image: '/images/nature_spot_camp.png',
    icon: Users
  }
])

// Form state for consultation/booking panel
const formName = ref('')
const formPhone = ref('')
const formDusun = ref('Menggah')
const formService = ref('SKCK')
const formMessage = ref('')
const formSubmitted = ref(false)

const handleFormSubmit = () => {
  formSubmitted.value = true
  setTimeout(() => {
    formName.value = ''
    formPhone.value = ''
    formMessage.value = ''
    formSubmitted.value = false
    alert('Permohonan layanan/pengaduan Anda telah dikirim ke perangkat desa. Kami akan menghubungi Anda segera melalui WhatsApp.')
  }, 1000)
}

const activeAnnouncements = ref([
  {
    id: 'mock-1',
    title: 'Kerja Bakti Bersih Desa & Sosialisasi KKN Menggah 2026',
    content: 'Dihimbau kepada seluruh warga Dusun Menggah untuk mengikuti kegiatan kerja bakti kebersihan lingkungan dusun bersama mahasiswa KKN pada hari Minggu, 2 Agustus 2026 pukul 07.00 WIB.',
    start_date: '2026-07-30',
    end_date: '2026-08-02',
    priority: 'high'
  }
])

async function fetchAnnouncements() {
  try {
    const response = await api.get('/public/announcements')
    if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
      activeAnnouncements.value = response.data.data
    }
  } catch (err) {
    console.warn('Gagal memuat pengumuman dari server, menggunakan data simulasi:', err)
  }
}

onMounted(() => {
  fetchAnnouncements()
})
</script>

<template>
  <div class="bg-[#f8f9fa] text-slate-800 min-h-screen font-sans antialiased selection:bg-slate-800 selection:text-white">
    
    <!-- ===== HERO SECTION ===== -->
    <section class="px-4 sm:px-6 lg:px-8 pt-24 pb-8 bg-[#f8f9fa]">
      <div class="relative bg-slate-900 text-white min-h-[85vh] flex flex-col justify-between overflow-hidden rounded-[2.5rem] shadow-xl">
        <!-- Background Image with Overlay -->
        <div class="absolute inset-0 z-0">
          <img 
            src="/images/hero.jpg" 
            alt="Scenic Menggah" 
            class="w-full h-full object-cover object-center opacity-65 scale-105 hover:scale-100 transition-transform duration-[1.2s] ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>
        </div>

        <!-- Spacer for Floating Navbar -->
        <div class="h-20"></div>

        <!-- Hero Main Content -->
        <div class="container-main px-6 md:px-16 relative z-10 flex-1 flex flex-col justify-center py-16 md:py-24 text-center">
          <div class="max-w-4xl mx-auto">
            <!-- Huge, heavy bold title matching WANDER style -->
            <h1 class="text-6xl sm:text-8xl lg:text-9xl font-extrabold uppercase tracking-tighter leading-none mb-3">
              Menggah<span class="text-warm-400">.</span>
            </h1>
            
            <p class="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/90 font-bold mb-8">
              Dusun Menggah, Desa Katekan, Gantiwarno, Klaten
            </p>

            <p class="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-xl mx-auto mb-10 opacity-90">
              Pusat perekonomian agraris dan industri kreatif konveksi terpadu dengan kearifan lokal gotong royong yang erat.
            </p>

            <!-- Pill Buttons -->
            <div class="flex flex-wrap items-center justify-center gap-4">
              <RouterLink 
                to="/layanan" 
                class="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md shadow-white/5"
              >
                Ajukan Surat Mandiri
              </RouterLink>
              <RouterLink 
                to="/profil" 
                class="border border-white/40 hover:border-white bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95"
              >
                Profil Dusun
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- bottom spacer -->
        <div class="h-10"></div>
      </div>
    </section>

    <!-- ===== SECTION: PENGUMUMAN PENTING ===== -->
    <section v-if="activeAnnouncements.length > 0" class="px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20 max-w-7xl mx-auto">
      <div class="bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-[1.8rem] p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
            <Megaphone :size="20" />
          </div>
          <div class="flex-1 min-w-0">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-white mb-2">
              Pengumuman Penting
            </span>
            <div class="space-y-3">
              <div v-for="ann in activeAnnouncements" :key="ann.id" class="border-b border-amber-500/10 pb-3 last:border-b-0 last:pb-0">
                <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">{{ ann.title }}</h4>
                <p class="text-[11px] sm:text-xs text-slate-650 leading-relaxed font-light mt-1">{{ ann.content }}</p>
                <div class="flex items-center gap-2 mt-2 text-[9px] text-slate-400 font-bold">
                  <span>Mulai: {{ new Date(ann.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                  <span v-if="ann.end_date">&bull; Selesai: {{ new Date(ann.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SECTION 2: WHY CHOOSE US ===== -->
    <section class="section bg-[#f8f9fa] py-20 border-b border-slate-200/50">
      <div class="container-main px-6 md:px-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <!-- Left Column: Copy, Socials & Stats -->
          <div class="lg:col-span-6 space-y-8">
            <div class="space-y-4">
              <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Mengapa Memilih Portal Digital Dusun Menggah?
              </h2>
              <p class="text-sm text-slate-500 leading-relaxed font-normal">
                Kami mendigitalisasi pelayanan publik kependudukan desa Katekan, mengintegrasikan pemasaran UMKM konveksi &amp; sablon, serta meningkatkan kesiapsiagaan mitigasi tanggul sungai Avur Sangiran secara real-time.
              </p>
            </div>

            <!-- Social Media Icons in Circles -->
            <div class="flex items-center gap-3">
              <a href="#" class="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all">
                <Instagram :size="16" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all">
                <Twitter :size="16" />
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all">
                <Facebook :size="16" />
              </a>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
              <div v-for="(stat, idx) in heroStats" :key="idx" class="space-y-1">
                <h3 class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ stat.title }}</h3>
                <p class="text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-tight">
                  {{ stat.desc }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column: Vertical Cards Stack -->
          <div class="lg:col-span-6 space-y-4">
            <div 
              v-for="(benefit, idx) in benefits" 
              :key="idx" 
              class="bg-slate-700/90 text-white rounded-2xl p-6 flex items-start gap-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div class="w-12 h-12 rounded-[1rem] bg-white/10 text-white flex items-center justify-center shrink-0">
                <component :is="benefit.icon" :size="20" />
              </div>
              <div>
                <h3 class="text-sm uppercase tracking-wider font-extrabold mb-1">
                  {{ benefit.title }}
                </h3>
                <p class="text-xs text-slate-200/80 leading-relaxed font-light">
                  {{ benefit.desc }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ===== SECTION 3: TOP DESTINATIONS ===== -->
    <section class="section bg-[#f8f9fa] py-20 border-b border-slate-200/50">
      <div class="container-main px-6 md:px-16">
        
        <!-- Header: Title left, description right -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div class="max-w-md">
            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">
              Layanan &amp; Potensi Pilihan
            </h2>
          </div>
          <div class="max-w-sm">
            <p class="text-xs text-slate-500 leading-relaxed font-normal">
              Mulai dari fasilitasi transaksi Pasar Menggah, pertumbuhan usaha kreatif konveksi, hingga koordinasi mitigasi pengawasan tanggul air.
            </p>
          </div>
        </div>

        <!-- 4 Vertical Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(dest, idx) in destinations" 
            :key="idx" 
            class="group relative h-[360px] overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-5"
          >
            <!-- Background Image -->
            <img 
              :src="dest.image" 
              :alt="dest.title" 
              class="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700 ease-out z-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>

            <!-- Floating tag on top-right -->
            <span class="absolute top-4 right-4 bg-white/95 text-slate-900 text-[9px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-sm z-20">
              {{ dest.tag }}
            </span>

            <!-- Bottom content -->
            <div class="relative z-20 space-y-2">
              <h3 class="text-lg font-bold tracking-wide">
                {{ dest.title }}
              </h3>
              
              <div class="flex items-center justify-between text-[10px] text-slate-200/90 pt-1">
                <span class="font-bold">{{ dest.rating }}</span>
                <span class="flex items-center gap-1">
                  <MapPin :size="10" /> {{ dest.location }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Row -->
        <div class="flex items-center justify-between mt-10 pt-4">
          <RouterLink 
            to="/layanan" 
            class="bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-full transition-all duration-300"
          >
            Lihat Semua Layanan
          </RouterLink>
          
          <div class="flex items-center gap-2">
            <button class="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer">
              <ChevronLeft :size="18" />
            </button>
            <button class="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer">
              <ChevronRight :size="18" />
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== SECTION 4: POTENCY GRIDS ===== -->
    <section class="section bg-[#f8f9fa] py-20 border-b border-slate-200/50">
      <div class="container-main px-6 md:px-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Card 1: Solid block -->
          <div class="lg:col-span-4 bg-slate-700/80 text-white rounded-3xl p-8 flex flex-col justify-between min-h-[320px]">
            <div class="space-y-4">
              <h3 class="text-2xl font-extrabold tracking-tight">Potensi Kreatif &amp; Agraris</h3>
              <p class="text-xs text-slate-200/80 leading-relaxed font-normal">
                Sinergi antara sektor agraris sawah subur dan pertumbuhan industri pakaian jadi khas pemukiman warga lokal.
              </p>
            </div>
            <RouterLink 
              to="/galeri" 
              class="bg-white hover:bg-slate-100 text-slate-900 text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-full transition-all duration-300 max-w-max"
            >
              Lihat Galeri Potensi
            </RouterLink>
          </div>

          <!-- Card 2 & 3: Scenic package cards -->
          <div 
            v-for="(pkg, idx) in packages" 
            :key="idx" 
            class="lg:col-span-4 group relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 flex flex-col justify-end min-h-[320px] shadow-sm hover:shadow-md transition-all duration-500"
          >
            <!-- Background Image -->
            <img 
              :src="pkg.image" 
              :alt="pkg.title" 
              class="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700 ease-out z-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>

            <!-- Floating circular white icon on top-left -->
            <div class="absolute top-6 left-6 w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm text-white flex items-center justify-center shadow-sm z-20">
              <component :is="pkg.icon" :size="16" />
            </div>

            <!-- Bottom content -->
            <div class="relative z-20 space-y-2">
              <h3 class="text-lg font-bold tracking-wide">
                {{ pkg.title }}
              </h3>
              <p class="text-[11px] text-slate-200/85 leading-relaxed font-light line-clamp-2">
                {{ pkg.desc }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ===== SECTION 5: HOW IT WORKS ===== -->
    <section class="section bg-[#f8f9fa] py-20">
      <div class="container-main px-6 md:px-16">
        
        <div class="text-center max-w-xl mx-auto mb-16">
          <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">
            Alur Pelayanan Semudah 1-2-3
          </h2>
          <div class="w-12 h-[2px] bg-slate-800 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <!-- Connector line for desktop -->
          <div class="hidden md:block absolute top-8 left-16 right-16 h-[1px] bg-slate-200 z-0"></div>

          <div class="text-center relative z-10 space-y-4">
            <div class="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-900 font-extrabold text-lg flex items-center justify-center mx-auto shadow-sm">
              1
            </div>
            <h3 class="text-base font-bold">Pilih Layanan</h3>
            <p class="text-xs text-slate-500 leading-relaxed font-light max-w-[200px] mx-auto">
              Tentukan jenis surat pengantar yang ingin diajukan.
            </p>
          </div>

          <div class="text-center relative z-10 space-y-4">
            <div class="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-900 font-extrabold text-lg flex items-center justify-center mx-auto shadow-sm">
              2
            </div>
            <h3 class="text-base font-bold">Lengkapi Data</h3>
            <p class="text-xs text-slate-500 leading-relaxed font-light max-w-[200px] mx-auto">
              Isi formulir berkas kependudukan secara online.
            </p>
          </div>

          <div class="text-center relative z-10 space-y-4">
            <div class="w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-900 font-extrabold text-lg flex items-center justify-center mx-auto shadow-sm">
              3
            </div>
            <h3 class="text-base font-bold">Unduh Dokumen</h3>
            <p class="text-xs text-slate-500 leading-relaxed font-light max-w-[200px] mx-auto">
              Surat terverifikasi siap diunduh dalam format PDF.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== SECTION 6: FORM PENGAJUAN ===== -->
    <section class="section bg-slate-900 text-white py-20">
      <div class="container-main px-6 md:px-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Column -->
          <div class="lg:col-span-5 space-y-6">
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Butuh Layanan Administrasi Khusus?</h2>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Jika Anda memerlukan layanan administrasi atau ingin melaporkan aduan mitigasi tanggul sungai, silakan kirimkan data melalui formulir ini. Petugas kami akan segera memproses.
            </p>
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-xs text-slate-300">
                <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">✓</span>
                <span>Proses verifikasi data warga terenkripsi</span>
              </li>
              <li class="flex items-center gap-3 text-xs text-slate-300">
                <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">✓</span>
                <span>Bebas dari pungutan biaya tambahan</span>
              </li>
            </ul>
          </div>

          <!-- Right Column (Form Box) -->
          <div class="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-8 shadow-xl">
            <form @submit.prevent="handleFormSubmit" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Nama Warga</label>
                  <input v-model="formName" type="text" required placeholder="Contoh: Budi Santoso" class="w-full rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 py-3 px-5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">No. WhatsApp</label>
                  <input v-model="formPhone" type="tel" required placeholder="Contoh: 0812345678" class="w-full rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 py-3 px-5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Asal Wilayah</label>
                  <select v-model="formDusun" class="w-full rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 py-3 px-5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900">
                    <option value="Menggah">Dusun Menggah</option>
                    <option value="Katekan">Dusun Katekan Lainnya</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Jenis Keperluan</label>
                  <select v-model="formService" class="w-full rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 py-3 px-5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900">
                    <option value="SKCK">Surat SKCK</option>
                    <option value="DOMISILI">Surat Domisili</option>
                    <option value="SKTM">Surat SKTM</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Pesan Detail</label>
                <textarea v-model="formMessage" rows="3" required placeholder="Tuliskan detail pengajuan Anda..." class="w-full rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 py-3 px-5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"></textarea>
              </div>

              <button type="submit" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300">
                Kirim Permohonan
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>
