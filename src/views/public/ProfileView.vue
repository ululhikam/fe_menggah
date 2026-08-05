<script setup lang="ts">
import { ref } from 'vue'
import { Building2, Target, Compass, Sparkles, Wrench, Award, Plus, ArrowRight } from 'lucide-vue-next'

const profileHubs = [
  { 
    to: '/profil/sejarah', 
    label: 'Sejarah Dusun', 
    desc: 'Jelajahi garis keturunan, asal-usul penamaan, dan tradisi gotong royong leluhur.', 
    icon: Building2,
    color: 'emerald'
  },
  { 
    to: '/profil/visi-misi', 
    label: 'Visi & Misi', 
    desc: 'Cita-cita kemandirian ekonomi, rencana pembangunan terpadu, dan mitigasi wilayah.', 
    icon: Target,
    color: 'blue'
  },
  { 
    to: '/profil/geografis', 
    label: 'Letak Geografis', 
    desc: 'Informasi topografi dataran rendah, batas administratif, dan bentang alam sekitar.', 
    icon: Compass,
    color: 'purple'
  },
  { 
    to: '/profil/potensi', 
    label: 'Potensi Dusun', 
    desc: 'Pusat pertanian padi subur, industri kreatif konveksi pakaian jadi, dan kesenian Jawa.', 
    icon: Sparkles,
    color: 'amber'
  },
  { 
    to: '/profil/fasilitas', 
    label: 'Fasilitas Umum', 
    desc: 'Sarana balai dusun, posko posyandu, masjid, dan infrastruktur penunjang warga.', 
    icon: Wrench,
    color: 'rose'
  },
]

const orgStructure = ref([
  { title: 'Kepala Desa Katekan', name: 'Sarwono, S.Sos', color: 'primary' },
  { title: 'Sekretaris Desa', name: 'Sugeng Hariyadi, S.AP', color: 'accent' },
  { title: 'Kaur Keuangan', name: 'Tri Handayani, S.E', color: 'warm' },
  { title: 'Kaur Perencanaan', name: 'Joko Susilo, S.T', color: 'primary' },
  { title: 'Kasi Pemerintahan', name: 'Dwi Cahyono, S.H', color: 'accent' },
  { title: 'Kepala Dusun Menggah', name: 'Wawan Setyawan', color: 'warm' },
])
</script>

<template>
  <div class="bg-[#FAF9F6] text-slate-800 min-h-screen font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[350px] h-[350px] bg-green-200/15 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-[45%] right-[-100px] w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[110px] pointer-events-none"></div>
    <div class="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-amber-100/15 rounded-full blur-[90px] pointer-events-none"></div>

    <!-- Floating Plus Signs -->
    <div class="absolute top-36 left-[8%] text-slate-350 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[35%] right-[10%] text-slate-355 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>
    <div class="absolute bottom-[25%] left-[12%] text-slate-355 pointer-events-none"><Plus :size="22" class="stroke-[1.5]" /></div>

    <!-- ===== HEADER SECTION (Interior Boxed Hero) ===== -->
    <section class="px-4 sm:px-6 lg:px-8 pt-32 pb-4">
      <div class="relative bg-slate-950 text-white py-16 md:py-24 overflow-hidden rounded-[2rem] sm:rounded-[3rem] shadow-xl">
        <!-- Background Image overlay -->
        <div class="absolute inset-0 z-0">
          <img 
            src="/images/misty_mountain_hero.png" 
            alt="Misty Mountain Katekan" 
            class="w-full h-full object-cover opacity-20 object-center scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent"></div>
        </div>

        <div class="container-main px-6 md:px-16 relative z-10">
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md mb-6">
            <Building2 :size="12" class="text-green-300" />
            <span class="text-[9px] font-bold tracking-widest text-white uppercase">Mengenal Wilayah Kami</span>
          </div>
          
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none mb-6">
            Profil Resmi <br class="hidden sm:inline" />
            <span class="font-serif italic font-medium text-green-300">Dusun Menggah</span>
          </h1>
          
          <p class="text-xs sm:text-sm text-slate-350 font-semibold max-w-xl leading-relaxed">
            Dusun Menggah, Desa Katekan, Kecamatan Ngawi, Kabupaten Ngawi, Jawa Timur. Kawasan pemukiman agraris subur dan industri konveksi dengan budaya guyub rukun khas pedesaan Jawa.
          </p>
        </div>
      </div>
    </section>

    <!-- ===== INDEX HUB SECTION (Double-Section Upgrade) ===== -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-4">
        
        <div class="text-center mb-12">
          <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Informasi Kunci</span>
          <h2 class="text-3xl font-light text-slate-955 tracking-tight font-sans">Jelajahi Profil Dusun</h2>
          <p class="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed mt-2">
            Pilih dan telusuri informasi spesifik mengenai kebudayaan, sarana publik, dan geografis Dusun Menggah.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="hub in profileHubs"
            :key="hub.to"
            :to="hub.to"
            class="group bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-6 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div 
                class="w-12 h-12 rounded-2xl flex items-center justify-center border mb-6"
                :class="{
                  'bg-emerald-50 text-emerald-700 border-emerald-100': hub.color === 'emerald',
                  'bg-blue-50 text-blue-700 border-blue-100': hub.color === 'blue',
                  'bg-purple-50 text-purple-700 border-purple-100': hub.color === 'purple',
                  'bg-amber-50 text-amber-800 border-amber-100': hub.color === 'amber',
                  'bg-rose-50 text-rose-700 border-rose-100': hub.color === 'rose',
                }"
              >
                <component :is="hub.icon" :size="22" />
              </div>

              <h3 class="text-slate-900 font-extrabold text-base mb-2 group-hover:text-emerald-850 transition-colors">
                {{ hub.label }}
              </h3>
              
              <p class="text-slate-500 text-xs leading-relaxed font-semibold mb-6">
                {{ hub.desc }}
              </p>
            </div>

            <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-950 transition-colors mt-auto">
              Selengkapnya <ArrowRight :size="12" class="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </RouterLink>
        </div>

      </div>
    </section>

    <!-- ===== STRUKTUR ORGANISASI ===== -->
    <section class="py-20 border-t border-slate-200/55 bg-[#FDFCFB]/50 relative z-10">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Pemerintahan Desa &amp; Dusun</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-slate-955">Perangkat &amp; Struktur Organisasi</h2>
          <p class="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed mt-2">
            Perangkat pelaksana administrasi pemerintahan resmi di tingkat Desa Katekan dan Dusun Menggah.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="person in orgStructure" 
            :key="person.title" 
            class="bg-white border border-slate-200/50 rounded-[2rem] p-6 text-center hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div class="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center border border-slate-100 bg-[#FAF9F6]"
              :class="{ 
                'text-emerald-700': person.color === 'primary', 
                'text-blue-700': person.color === 'accent', 
                'text-amber-700': person.color === 'warm' 
              }"
            >
              <Award :size="24" />
            </div>
            <div>
              <h3 class="text-xs uppercase tracking-wider font-extrabold text-slate-800 leading-snug">{{ person.name }}</h3>
              <p class="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 mt-2 block">{{ person.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
