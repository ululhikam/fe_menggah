<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Calendar, ArrowLeft, Clock, User, Share2 } from 'lucide-vue-next'

const route = useRoute()
const id = route.params.id as string

const news = ref({
  id: id,
  title: 'Pembangunan Saluran Irigasi Baru Mulai Berjalan',
  category: 'pembangunan',
  date: '10 Juli 2026',
  author: 'Sekretariat Desa',
  readTime: '3 Menit Baca',
  image: '/images/nature_spot_ricefields.png',
  content: `Pemerintah Desa Kadaleman resmi memulai pengerjaan pembangunan saluran irigasi baru sepanjang 500 meter di kawasan persawahan Dusun Kidul. Proyek ini didanai oleh alokasi Dana Desa tahun anggaran 2026 dan bertujuan untuk mengoptimalkan pengairan lahan tani guna menunjang produktivitas padi organik setempat.

Kepala Desa Kadaleman menyampaikan bahwa pembangunan saluran irigasi permanen ini merupakan respons atas aspirasi kelompok tani yang sering mengalami kendala pengairan pada musim kemarau. "Dengan irigasi yang lebih teratur dan permanen, kami berharap hasil panen petani dapat meningkat hingga dua kali lipat per tahunnya," jelasnya.

Proyek fisik ini sepenuhnya memberdayakan tenaga kerja lokal dari kalangan warga desa guna memberikan stimulus ekonomi tambahan bagi rumah tangga sasaran. Seluruh pengerjaan ditargetkan selesai dalam jangka waktu 30 hari kalender dengan pengawasan langsung dari Badan Permusyawaratan Desa (BPD) beserta perwakilan warga.`,
})
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
          <RouterLink 
            to="/berita" 
            class="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-warm-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full mb-4 hover:bg-white/15 transition-all duration-300"
          >
            <ArrowLeft :size="12" /> Kembali ke Berita
          </RouterLink>
          <h1 class="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-4 max-w-3xl leading-snug">
            {{ news.title }}
          </h1>
          
          <div class="flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-wider font-bold text-primary-200 opacity-90">
            <span class="inline-flex items-center gap-1"><Calendar :size="11" /> {{ news.date }}</span>
            <span class="hidden sm:inline opacity-40">|</span>
            <span class="inline-flex items-center gap-1"><User :size="11" /> {{ news.author }}</span>
            <span class="hidden sm:inline opacity-40">|</span>
            <span class="inline-flex items-center gap-1"><Clock :size="11" /> {{ news.readTime }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Detail Content -->
    <section class="section bg-surface-50">
      <div class="container-main px-6">
        <div class="max-w-3xl mx-auto space-y-8">
          <!-- Featured Image -->
          <div class="w-full h-96 overflow-hidden rounded-[2.2rem] shadow-sm">
            <img 
              :src="news.image" 
              :alt="news.title" 
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Article Content -->
          <div class="bg-white border border-surface-200/50 rounded-[2rem] p-8 md:p-10 shadow-sm space-y-6">
            <div class="flex justify-between items-center pb-4 border-b border-surface-100">
              <span class="text-[9px] uppercase tracking-wider font-extrabold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                Kategori: {{ news.category }}
              </span>
              <button class="w-8 h-8 rounded-full bg-surface-50 hover:bg-surface-100 text-surface-500 flex items-center justify-center transition-colors">
                <Share2 :size="14" />
              </button>
            </div>
            
            <p 
              v-for="(para, idx) in news.content.split('\n\n')" 
              :key="idx" 
              class="text-xs sm:text-sm text-surface-650 leading-relaxed font-light text-justify"
            >
              {{ para }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
