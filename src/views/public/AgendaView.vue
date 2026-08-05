<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Calendar, MapPin, Clock, History, Sparkles, Leaf, Plus, Search, ChevronRight } from 'lucide-vue-next'
import api from '@/lib/api'

type AgendaStatus = 'upcoming' | 'ongoing' | 'done'

interface AgendaItem {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  location?: string
  status: AgendaStatus
  category?: string
}

const activeTab = ref<'upcoming' | 'history'>('upcoming')
const searchQuery = ref('')
const loading = ref(true)

const upcomingItems = ref<AgendaItem[]>([])
const historyItems = ref<AgendaItem[]>([])

async function fetchAgenda() {
  loading.value = true
  try {
    const [upcomingRes, historyRes] = await Promise.all([
      api.get('/public/agenda?upcoming=true&per_page=50'),
      api.get('/public/agenda?status=done&per_page=50')
    ])
    
    if (upcomingRes.data?.success && upcomingRes.data?.data?.items) {
      upcomingItems.value = upcomingRes.data.data.items
    }
    if (historyRes.data?.success && historyRes.data?.data?.items) {
      historyItems.value = historyRes.data.data.items
    }
  } catch (error) {
    console.error('Failed to fetch agenda', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAgenda()
})

const categoryColors: Record<string, string> = {
  'Rapat': 'bg-blue-50 text-blue-700 border-blue-100',
  'Kegiatan': 'bg-green-50 text-green-700 border-green-100',
  'Kesehatan': 'bg-red-50 text-red-700 border-red-100',
  'Pelatihan': 'bg-purple-50 text-purple-700 border-purple-100',
  'Nasional': 'bg-yellow-50 text-yellow-750 border-yellow-100',
  'Sosialisasi': 'bg-orange-50 text-orange-700 border-orange-100',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function getDaysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return 'Besok'
  if (diff < 0) return 'Selesai'
  return `${diff} hari lagi`
}

const filteredAgendas = computed(() => {
  let list = activeTab.value === 'upcoming' ? upcomingItems.value : historyItems.value
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.description?.toLowerCase().includes(q) || 
      a.category?.toLowerCase().includes(q)
    )
  }
  return list
})
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
      <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block mb-1">Jadwal Acara</span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans mb-3">
        Agenda & <span class="font-serif italic font-medium">Kegiatan Dusun</span>
      </h1>
      <p class="text-slate-550 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold mb-8">
        Jadwal kegiatan, acara, dan program yang akan dan telah berlangsung di Dusun Menggah.
      </p>

      <!-- Centered Search Box -->
      <div class="relative w-full max-w-md mx-auto mb-10">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari agenda kegiatan..." 
          class="w-full rounded-full border border-slate-200 bg-white text-slate-800 py-3 pl-5 pr-11 text-xs focus:outline-none focus:border-slate-400 font-semibold" 
        />
        <Search :size="13" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <!-- Centered Category Selector Tabs -->
      <div class="max-w-4xl mx-auto">
        <span class="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-3">Filter Jadwal</span>
        <div class="flex justify-center gap-2">
          <button
            @click="activeTab = 'upcoming'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border"
            :class="activeTab === 'upcoming' 
              ? 'bg-slate-950 text-white border-transparent shadow-sm' 
              : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200/60'"
          >
            <Sparkles :size="13" /> Mendatang
          </button>
          <button
            @click="activeTab = 'history'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border"
            :class="activeTab === 'history' 
              ? 'bg-slate-950 text-white border-transparent shadow-sm' 
              : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200/60'"
          >
            <History :size="13" /> Riwayat
          </button>
        </div>
      </div>
    </section>

    <!-- ===== SECTION 1: TOP PICKS (3 Columns Grid) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in filteredAgendas.slice(0, 3)"
          :key="item.id"
          class="group bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-5 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Banner / Header Details -->
            <div class="flex items-start justify-between mb-4 pb-4 border-b border-slate-100">
              <!-- Calendar Block Frame -->
              <div class="w-12 text-center rounded-xl overflow-hidden border border-slate-100 bg-[#FAF9F6] shadow-sm flex flex-col">
                <div class="py-0.5 text-[8px] font-black uppercase text-white" :class="activeTab === 'upcoming' ? 'bg-emerald-800' : 'bg-slate-600'">
                  {{ new Date(item.start_date).toLocaleString('id-ID', { month: 'short' }) }}
                </div>
                <div class="py-1 bg-white">
                  <span class="block text-lg font-black text-slate-900 leading-none font-serif italic">{{ new Date(item.start_date).getDate() }}</span>
                </div>
              </div>

              <!-- Metadata Category tag -->
              <span v-if="item.category" class="text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border" :class="categoryColors[item.category] || 'bg-slate-50 text-slate-500 border-slate-200'">
                {{ item.category }}
              </span>
            </div>

            <h3 class="font-bold text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2">
              {{ item.title }}
            </h3>
            
            <p v-if="item.description" class="text-slate-500 text-xs leading-relaxed font-semibold mb-4 line-clamp-2">
              {{ item.description }}
            </p>
          </div>

          <!-- Time & Location Footer -->
          <div class="flex flex-col gap-2 pt-3.5 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
            <span v-if="item.location" class="flex items-center gap-1.5 truncate">
              <MapPin :size="12" class="text-emerald-700 shrink-0" /> {{ item.location }}
            </span>
            <span class="flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <Clock :size="12" class="text-emerald-700" /> {{ formatTime(item.start_date) }} WIB
              </span>
              <span v-if="activeTab === 'upcoming'" class="text-[8px] text-emerald-850 bg-emerald-50 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                {{ getDaysUntil(item.start_date) }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-16">
        <p class="text-slate-450 font-semibold">Memuat agenda...</p>
      </div>

      <div v-else-if="filteredAgendas.length === 0" class="text-center py-16">
        <p class="text-slate-450 font-semibold flex items-center justify-center gap-1.5">
          <Leaf :size="16" /> Belum ada agenda yang ditemukan.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: FEATURED SPLIT SECTION ===== -->
    <section v-if="filteredAgendas.length > 0" class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/50 mt-8">
      
      <!-- Section Title -->
      <div class="text-center mb-12">
        <span class="text-[9px] bg-slate-50 border border-slate-100 text-slate-450 font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
          <Calendar :size="10" /> Sorotan Agenda
        </span>
        <h2 class="text-3xl font-light text-slate-950 mt-3 mb-2 font-sans tracking-tight">Kabar Jadwal Utama</h2>
        <p class="text-slate-555 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
          Rencana kegiatan besar yang menuntut keterlibatan gotong royong seluruh warga dusun.
        </p>
      </div>

      <!-- Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        <!-- Left: Large Featured Agenda card -->
        <div class="bg-[#FDFCFB] border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 group">
          
          <div class="flex items-center justify-between mb-4">
            <span v-if="filteredAgendas[0].category" class="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border" :class="categoryColors[filteredAgendas[0].category] || 'bg-slate-50 text-slate-500 border-slate-200'">
              {{ filteredAgendas[0].category }}
            </span>
            <span class="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles :size="10" /> {{ getDaysUntil(filteredAgendas[0].start_date) }}
            </span>
          </div>

          <h3 class="font-bold text-slate-950 text-xl sm:text-2xl leading-snug mb-3">
            {{ filteredAgendas[0].title }}
          </h3>
          
          <p class="text-slate-555 text-xs sm:text-sm leading-relaxed font-semibold mb-6">
            {{ filteredAgendas[0].description }}
          </p>

          <!-- Large calendar/location summary frame -->
          <div class="relative w-full p-6 bg-slate-50 border border-slate-150/60 rounded-[1.8rem] mb-6 flex flex-col sm:flex-row items-center gap-6">
            <div class="w-20 text-center rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col shrink-0">
              <div class="py-1 text-[9px] font-black uppercase text-white" :class="activeTab === 'upcoming' ? 'bg-emerald-800' : 'bg-slate-600'">
                {{ new Date(filteredAgendas[0].start_date).toLocaleString('id-ID', { month: 'short' }) }}
              </div>
              <div class="py-2.5 bg-white">
                <span class="block text-3xl font-black text-slate-900 leading-none font-serif italic">{{ new Date(filteredAgendas[0].start_date).getDate() }}</span>
                <span class="block text-[8px] text-slate-400 font-extrabold uppercase mt-1">{{ new Date(filteredAgendas[0].start_date).getFullYear() }}</span>
              </div>
            </div>

            <div class="space-y-2 text-xs text-slate-500 font-semibold leading-relaxed">
              <p class="flex items-center gap-2">
                <Calendar :size="14" class="text-emerald-700" /> {{ formatDate(filteredAgendas[0].start_date) }}
              </p>
              <p class="flex items-center gap-2">
                <Clock :size="14" class="text-emerald-700" /> {{ formatTime(filteredAgendas[0].start_date) }} WIB s.d Selesai
              </p>
              <p v-if="filteredAgendas[0].location" class="flex items-center gap-2">
                <MapPin :size="14" class="text-emerald-700" /> {{ filteredAgendas[0].location }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right: List of smaller items -->
        <div class="space-y-4">
          <div
            v-for="item in filteredAgendas.slice(1, 4)" 
            :key="item.id"
            class="flex gap-4 p-4.5 bg-white border border-slate-200/50 rounded-[1.8rem] hover:shadow-md transition-all duration-300 group items-center"
          >
            <!-- Small rounded calendar thumb -->
            <div class="w-16 h-16 rounded-[1.2rem] overflow-hidden shrink-0 border border-slate-200/80 bg-slate-50 flex flex-col text-center">
              <div class="py-0.5 text-[8px] font-black uppercase text-white bg-slate-700">
                {{ new Date(item.start_date).toLocaleString('id-ID', { month: 'short' }) }}
              </div>
              <div class="flex-1 flex items-center justify-center bg-white">
                <span class="block text-xl font-bold text-slate-950 font-serif italic leading-none">{{ new Date(item.start_date).getDate() }}</span>
              </div>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 pr-2">
              <div class="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#7C633F] mb-1">
                <span>{{ item.category }}</span>
                <span class="opacity-50">•</span>
                <span>{{ formatTime(item.start_date) }} WIB</span>
              </div>
              
              <h4 class="text-slate-900 font-extrabold text-xs sm:text-sm leading-snug line-clamp-1 mb-1">
                {{ item.title }}
              </h4>
              <p v-if="item.location" class="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <MapPin :size="10" /> {{ item.location }}
              </p>
            </div>

            <!-- Arrow link indicator -->
            <div class="shrink-0 w-8 h-8 rounded-full border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-transparent transition-all">
              <ChevronRight :size="14" />
            </div>
          </div>
          
          <div v-if="filteredAgendas.length <= 1" class="py-8 text-center text-slate-450 text-xs font-semibold">
            Belum ada agenda tambahan yang terdaftar.
          </div>
        </div>

      </div>
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
