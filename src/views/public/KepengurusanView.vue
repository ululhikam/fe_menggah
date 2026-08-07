<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Phone, Mail, ArrowLeft, ArrowRight, Plus, Users, Leaf } from 'lucide-vue-next'
import api from '@/lib/api'

interface Member {
  id: string
  name: string
  position: string
  photo_url?: string
  phone?: string
  email?: string
  period_start?: string
  period_end?: string
  group_type?: string
  organizations?: { name: string; slug: string }
}

interface Group {
  groupLabel: string
  slug: string
  members: Member[]
}

const activeTab = ref('')
const activeIndex = ref(0)
const isMobile = ref(false)
const loading = ref(true)

const groups = ref<Group[]>([])

async function fetchMembers() {
  loading.value = true
  try {
    const res = await api.get('/public/members?per_page=100')
    if (res.data?.success && res.data?.data) {
      const allMembers: Member[] = Array.isArray(res.data.data) ? res.data.data : (res.data.data.items || [])
      const grouped = allMembers.reduce((acc, member) => {
        const groupType = member.organizations?.name || member.group_type || 'Lainnya'
        if (!acc[groupType]) {
          acc[groupType] = []
        }
        acc[groupType].push(member)
        return acc
      }, {} as Record<string, Member[]>)
      
      const newGroups: Group[] = []
      for (const [key, members] of Object.entries(grouped)) {
        newGroups.push({
          groupLabel: key,
          slug: key.toLowerCase().replace(/\s+/g, '-'),
          members: members.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
        })
      }
      groups.value = newGroups
      if (newGroups.length > 0) {
        activeTab.value = newGroups[0].slug
      }
    }
  } catch (error) {
    console.error('Failed to fetch members', error)
  } finally {
    loading.value = false
  }
}

const activeMembers = computed(() => {
  const group = groups.value.find(g => g.slug === activeTab.value)
  return group ? group.members : []
})

watch(activeTab, () => {
  activeIndex.value = 0
})

function prevSlide() {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

function nextSlide() {
  if (activeIndex.value < activeMembers.value.length - 1) {
    activeIndex.value++
  }
}

function selectSlide(index: number) {
  activeIndex.value = index
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function checkMobile() {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  fetchMembers()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const getCardStyle = (index: number) => {
  const offset = index - activeIndex.value
  const absOffset = Math.abs(offset)
  
  if (absOffset > 2) {
    return {
      opacity: 0,
      transform: `translateX(${offset > 0 ? 160 : -160}%) scale(0.65)`,
      zIndex: 0,
      pointerEvents: 'none' as any
    }
  }

  const step = isMobile.value ? 100 : 210
  const translateX = offset * step
  const scale = 1 - absOffset * 0.12
  const zIndex = 30 - absOffset
  const opacity = 1 - absOffset * 0.35

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
      <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Struktur Kepengurusan</span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans mb-3">
        Kepengurusan <span class="font-serif italic font-medium">Dusun Menggah</span>
      </h1>
      <p class="text-slate-550 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold">
        Daftar lengkap pengurus dan perangkat yang mengelola berbagai kegiatan dan program kemasyarakatan di Dusun Menggah.
      </p>
    </section>

    <!-- Tab Navigation styled exactly like locations pills -->
    <section class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex justify-center">
        <div class="flex gap-2 overflow-x-auto py-2 px-1 max-w-full scrollbar-hide">
          <button
            v-for="group in groups"
            :key="group.slug"
            @click="activeTab = group.slug"
            class="flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border whitespace-nowrap"
            :class="activeTab === group.slug
              ? 'bg-slate-950 text-white border-transparent shadow-sm'
              : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-slate-200/60'"
          >
            {{ group.groupLabel }}
          </button>
        </div>
      </div>
    </section>

    <!-- 3D COVERFLOW SLIDER SECTION -->
    <section v-if="loading" class="text-center py-32 text-slate-500">
      Memuat data kepengurusan...
    </section>
    <section v-else-if="groups.length === 0" class="text-center py-32 text-slate-500">
      Belum ada data kepengurusan.
    </section>
    <section v-else class="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      <div class="relative w-full max-w-[800px] h-[380px] sm:h-[430px] flex items-center justify-center overflow-hidden">
        
        <!-- Sliding Track -->
        <div class="relative w-full h-full flex items-center justify-center">
          <div
            v-for="(member, idx) in activeMembers"
            :key="member.id"
            :style="getCardStyle(idx)"
            @click="selectSlide(idx)"
            class="absolute w-[240px] sm:w-[280px] h-[320px] sm:h-[370px] bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-900/5 p-5 flex flex-col justify-between transition-all duration-500 ease-out transform"
          >
            <!-- Card Details -->
            <div class="flex flex-col flex-1 justify-center">
              
              <!-- Framed Photo Container (Cohesive Rounded Rectangle) -->
              <div class="w-full h-36 sm:h-44 overflow-hidden rounded-[1.2rem] bg-slate-50 border border-slate-100/80 mb-4 flex items-center justify-center relative select-none">
                <img
                  v-if="member.photo_url"
                  :src="member.photo_url"
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
                
                <!-- Harmonized Sage/Emerald initial pattern if no photo is set -->
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-emerald-500/10 to-emerald-700/15 flex items-center justify-center text-emerald-800"
                >
                  <span class="font-serif italic font-extrabold text-3xl tracking-wide uppercase">{{ getInitials(member.name) }}</span>
                </div>
              </div>

              <!-- Details -->
              <div class="text-center px-1">
                <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1 line-clamp-1">{{ member.name }}</h3>
                <p class="text-[#7C633F] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                  <Leaf :size="10" /> {{ member.position }}
                </p>

                <!-- Period badge -->
                <div v-if="member.period_start" class="inline-block">
                  <span class="text-[8px] sm:text-[9px] bg-slate-50 text-slate-450 border border-slate-100 rounded-full px-3 py-0.5 font-extrabold uppercase tracking-wide">
                    {{ member.period_start }} – {{ member.period_end || 'sekarang' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contacts Action row -->
            <div 
              class="flex justify-center gap-2 mt-3 pt-3.5 border-t border-slate-100 transition-all duration-300"
              :class="{'opacity-100': idx === activeIndex, 'opacity-0 pointer-events-none': idx !== activeIndex}"
            >
              <a v-if="member.phone" :href="`https://wa.me/62${member.phone?.replace(/^0/, '')}`" target="_blank" class="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-850 border border-emerald-100/40 transition-colors">
                <Phone :size="13" />
              </a>
              <a v-if="member.email" :href="`mailto:${member.email}`" class="p-2 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-800 border border-blue-100/40 transition-colors">
                <Mail :size="13" />
              </a>
            </div>
            
          </div>
        </div>

      </div>

      <!-- Arrow Navigation Buttons -->
      <div class="flex items-center gap-4 mt-8">
        <button 
          @click="prevSlide"
          :disabled="activeIndex === 0"
          class="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-950 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 disabled:cursor-not-allowed shadow-sm active:scale-95"
          aria-label="Previous pengurus"
        >
          <ArrowLeft :size="16" />
        </button>
        <button 
          @click="nextSlide"
          :disabled="activeIndex === activeMembers.length - 1"
          class="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-950 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 disabled:cursor-not-allowed shadow-sm active:scale-95"
          aria-label="Next pengurus"
        >
          <ArrowRight :size="16" />
        </button>
      </div>
      
      <!-- Counter indicator -->
      <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-4 flex items-center gap-1.5">
        <Users :size="12" /> {{ activeIndex + 1 }} / {{ activeMembers.length }} Pengurus
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
