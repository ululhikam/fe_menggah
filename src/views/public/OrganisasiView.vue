<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Building2, Users, Heart, ArrowLeft, ArrowRight, Plus, Leaf } from 'lucide-vue-next'
import api from '@/lib/api'

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  order_index?: number
  memberCount?: number
}

const loading = ref(true)
const activeIndex = ref(0)
const isMobile = ref(false)

const fallbackOrgs: Organization[] = [
  { id: '1', name: 'Karang Taruna', slug: 'karang-taruna', description: 'Organisasi kepemudaan Dusun Menggah yang aktif dalam kegiatan sosial, seni budaya, dan pemberdayaan pemuda di dusun.', memberCount: 25 },
  { id: '2', name: 'PKK', slug: 'pkk', description: 'Pemberdayaan Kesejahteraan Keluarga yang bergerak di bidang peningkatan kualitas hidup keluarga dan pemberdayaan perempuan.', memberCount: 18 },
  { id: '3', name: 'Posyandu', slug: 'posyandu', description: 'Pos Pelayanan Terpadu yang menyelenggarakan pelayanan kesehatan dasar bagi balita, ibu hamil, dan lansia.', memberCount: 8 },
  { id: '4', name: 'TPQ', slug: 'tpq', description: 'Taman Pendidikan Al-Quran yang memberikan pendidikan agama Islam kepada anak-anak dan remaja di Dusun Menggah.', memberCount: 6 },
  { id: '5', name: 'Kelompok Tani', slug: 'kelompok-tani', description: 'Kelompok yang mengelola kegiatan pertanian warga, termasuk koordinasi pengairan dan penjualan hasil panen.', memberCount: 30 },
  { id: '6', name: 'Kelompok Bapak-bapak', slug: 'kelompok-bapak', description: 'Perkumpulan bapak-bapak warga dusun yang rutin mengadakan kegiatan silaturahmi, yasinan, dan kerja bakti.', memberCount: 40 },
]

const organizations = ref<Organization[]>(fallbackOrgs)

const orgIcons = [
  { icon: '🏆' },
  { icon: '👩‍👧‍👦' },
  { icon: '❤️‍🩺' },
  { icon: '📖' },
  { icon: '🌾' },
  { icon: '👥' },
]

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  try {
    const res = await api.get('/public/organisations')
    if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      organizations.value = res.data.data
    }
  } catch {
    // use fallback
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

function checkMobile() {
  isMobile.value = window.innerWidth < 640
}

function prevSlide() {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

function nextSlide() {
  if (activeIndex.value < organizations.value.length - 1) {
    activeIndex.value++
  }
}

function selectSlide(index: number) {
  activeIndex.value = index
}

const getCardStyle = (index: number) => {
  const offset = index - activeIndex.value
  const absOffset = Math.abs(offset)
  
  if (absOffset > 2) {
    return {
      opacity: 0,
      transform: `translateX(${offset > 0 ? 170 : -170}%) scale(0.65)`,
      zIndex: 0,
      pointerEvents: 'none' as any
    }
  }

  const step = isMobile.value ? 120 : 290
  const translateX = offset * step
  const scale = 1 - absOffset * 0.14
  const zIndex = 30 - absOffset
  const opacity = 1 - absOffset * 0.4

  return {
    transform: `translateX(${translateX}px) scale(${scale})`,
    zIndex,
    opacity,
    pointerEvents: (absOffset <= 1 ? 'auto' : 'none') as any,
    cursor: absOffset === 1 ? 'pointer' : 'default'
  }
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
      <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Organisasi Kemasyarakatan</span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans mb-3">
        Organisasi <span class="font-serif italic font-medium">Dusun Menggah</span>
      </h1>
      <p class="text-slate-550 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold">
        Berbagai organisasi dan kelompok kemasyarakatan yang aktif berkolaborasi memajukan Dusun Menggah.
      </p>
    </section>

    <!-- 3D WIDE COVERFLOW SLIDER SECTION -->
    <section class="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      
      <!-- Skeleton Loading State -->
      <div v-if="loading" class="w-full max-w-[800px] h-[380px] sm:h-[430px] flex items-center justify-center">
        <div class="w-[300px] sm:w-[460px] h-[330px] sm:h-[390px] bg-white border border-slate-200/50 rounded-[2rem] p-8 animate-pulse flex flex-col justify-end">
          <div class="h-6 bg-slate-100 rounded-full w-2/3 mb-4"></div>
          <div class="h-4 bg-slate-50 rounded-full w-5/6 mb-2"></div>
          <div class="h-4 bg-slate-50 rounded-full w-3/4"></div>
        </div>
      </div>

      <!-- Loaded Slider -->
      <div v-else class="relative w-full max-w-[900px] h-[380px] sm:h-[430px] flex items-center justify-center overflow-hidden">
        
        <!-- Sliding Track -->
        <div class="relative w-full h-full flex items-center justify-center">
          <div
            v-for="(org, idx) in organizations"
            :key="org.id"
            :style="getCardStyle(idx)"
            @click="selectSlide(idx)"
            class="absolute w-[300px] sm:w-[460px] h-[330px] sm:h-[390px] bg-[#FDFCFB] border border-slate-200/60 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-900/5 p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 ease-out transform"
          >
            <!-- Card Details -->
            <div class="flex flex-col flex-1 justify-center">
              
              <!-- Framed Media Frame -->
              <div class="w-full h-32 sm:h-40 overflow-hidden rounded-[1.2rem] bg-slate-50 border border-slate-100 mb-4 flex items-center justify-center relative select-none">
                <img 
                  v-if="org.logo_url"
                  :src="org.logo_url" 
                  :alt="org.name" 
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-emerald-500/10 to-emerald-700/15 flex items-center justify-center text-3xl"
                >
                  <span>{{ orgIcons[idx % orgIcons.length]?.icon }}</span>
                </div>
              </div>

              <!-- Name & Members badge header -->
              <div class="flex items-center justify-between gap-3 mb-1.5 px-1">
                <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">{{ org.name }}</h3>
                
                <span v-if="org.memberCount" class="shrink-0 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-slate-450 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Users :size="9" /> {{ org.memberCount }} Anggota
                </span>
              </div>

              <!-- Description -->
              <p class="text-slate-500 text-[10px] sm:text-xs leading-relaxed font-semibold px-1 line-clamp-2 sm:line-clamp-3">
                {{ org.description }}
              </p>
            </div>

            <!-- Footer block inside card -->
            <div class="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-emerald-800">
              <span class="flex items-center gap-1">
                <Building2 :size="11" /> Kelembagaan Dusun
              </span>
              
              <span class="flex items-center gap-1 text-emerald-750">
                Gotong Royong <Heart :size="10" />
              </span>
            </div>
            
          </div>
        </div>

      </div>

      <!-- Arrow Navigation Buttons -->
      <div v-if="!loading" class="flex items-center gap-4 mt-8">
        <button 
          @click="prevSlide"
          :disabled="activeIndex === 0"
          class="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-950 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 disabled:cursor-not-allowed shadow-sm active:scale-95"
          aria-label="Previous organisasi"
        >
          <ArrowLeft :size="16" />
        </button>
        <button 
          @click="nextSlide"
          :disabled="activeIndex === organizations.length - 1"
          class="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-950 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 disabled:cursor-not-allowed shadow-sm active:scale-95"
          aria-label="Next organisasi"
        >
          <ArrowRight :size="16" />
        </button>
      </div>
      
      <!-- Counter indicator -->
      <p v-if="!loading" class="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-4 flex items-center gap-1.5">
        <Leaf :size="12" /> {{ activeIndex + 1 }} / {{ organizations.length }} Organisasi
      </p>
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
