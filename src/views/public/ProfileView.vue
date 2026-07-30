<script setup lang="ts">
import { Building2, Target, Eye, Award, Sparkles } from 'lucide-vue-next'

const missions = [
  'Meningkatkan kualitas pelayanan administrasi kependudukan yang prima dan terintegrasi digital.',
  'Mengembangkan roda perekonomian lokal melalui optimalisasi Pasar Menggah dan pembinaan UMKM konveksi.',
  'Melestarikan kearifan lokal Jawa, budaya guyub rukun, dan semangat gotong royong antarwarga.',
  'Meningkatkan infrastruktur mitigasi bencana banjir luapan Sungai Avur Sangiran secara terpadu.',
  'Menyelenggarakan tata kelola pemerintahan desa yang transparan, akuntabel, dan berbasis teknologi.'
]

const orgStructure = [
  { title: 'Kepala Desa Katekan', name: 'Sarwono, S.Sos', color: 'primary' },
  { title: 'Sekretaris Desa', name: 'Sugeng Hariyadi, S.AP', color: 'accent' },
  { title: 'Kaur Keuangan', name: 'Tri Handayani, S.E', color: 'warm' },
  { title: 'Kaur Perencanaan', name: 'Joko Susilo, S.T', color: 'primary' },
  { title: 'Kasi Pemerintahan', name: 'Dwi Cahyono, S.H', color: 'accent' },
  { title: 'Kepala Dusun Menggah', name: 'Wawan Setyawan', color: 'warm' },
]
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
            alt="Misty Mountain Katekan" 
            class="w-full h-full object-cover opacity-20 object-center"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-transparent"></div>
        </div>

        <div class="container-main px-6 md:px-12 relative z-10">
          <div class="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-warm-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4">
            <Building2 :size="12" /> Mengenal Wilayah Kami
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Profil Resmi <span class="text-warm-400">Dusun Menggah</span>
          </h1>
          <p class="text-xs sm:text-sm text-primary-100 font-light max-w-xl opacity-90 leading-relaxed">
            Dusun Menggah, Desa Katekan, Kecamatan Gantiwarno, Kabupaten Klaten, Jawa Tengah. Kawasan pemukiman agraris subur dan industri konveksi dengan budaya guyub rukun khas pedesaan Jawa.
          </p>
        </div>
      </div>
    </section>

    <!-- Visi & Misi -->
    <section class="section bg-surface-50 border-b border-surface-200">
      <div class="container-main">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Visi Card -->
          <div class="bg-white border border-surface-200/50 rounded-[1.8rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-card transition-all duration-300">
            <div>
              <div class="w-12 h-12 rounded-[1rem] bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
                <Eye :size="22" />
              </div>
              <h2 class="text-lg font-extrabold uppercase tracking-wider text-surface-800 mb-4">Visi Utama</h2>
              <p class="text-sm text-surface-600 leading-relaxed font-light italic">
                "Mewujudkan Dusun Menggah, Desa Katekan yang mandiri secara ekonomi, sejahtera, berbudaya, serta tangguh bencana."
              </p>
            </div>
            <div class="mt-8 border-t border-surface-100 pt-4 text-[9px] uppercase tracking-widest text-surface-400 font-bold flex items-center gap-2">
              <Sparkles :size="12" class="text-warm-400" /> Arah Pembangunan Desa
            </div>
          </div>

          <!-- Misi Card -->
          <div class="bg-white border border-surface-200/50 rounded-[1.8rem] p-8 shadow-sm hover:shadow-card transition-all duration-300">
            <div class="w-12 h-12 rounded-[1rem] bg-accent-50 text-accent-600 flex items-center justify-center mb-6">
              <Target :size="22" />
            </div>
            <h2 class="text-lg font-extrabold uppercase tracking-wider text-surface-800 mb-5">Misi Pembangunan</h2>
            <ol class="space-y-4">
              <li v-for="(m, i) in missions" :key="i" class="flex gap-4 text-xs sm:text-sm text-surface-600">
                <span class="w-6 h-6 rounded-full bg-accent-50 text-accent-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-accent-100">
                  {{ i + 1 }}
                </span>
                <span class="font-light leading-relaxed">{{ m }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- Struktur Organisasi -->
    <section class="section bg-surface-100">
      <div class="container-main">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="section-subtitle text-primary-600">Pemerintahan Desa &amp; Dusun</span>
          <h2 class="section-title mt-2">Struktur Organisasi &amp; Perangkat</h2>
          <div class="w-12 h-[1px] bg-primary-500 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="person in orgStructure" 
            :key="person.title" 
            class="bg-white border border-surface-200/50 rounded-[1.8rem] p-6 text-center hover:shadow-elevated hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
          >
            <div class="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center border-2 border-dashed"
              :class="{ 
                'bg-primary-50 border-primary-200 text-primary-600': person.color === 'primary', 
                'bg-accent-50 border-accent-200 text-accent-600': person.color === 'accent', 
                'bg-warm-50 border-warm-200 text-warm-600': person.color === 'warm' 
              }"
            >
              <Award :size="26" />
            </div>
            <div>
              <h3 class="text-xs uppercase tracking-wider font-extrabold text-slate-800 leading-snug">{{ person.name }}</h3>
              <p class="text-[9px] uppercase tracking-widest font-bold text-surface-400 mt-2 block">{{ person.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
