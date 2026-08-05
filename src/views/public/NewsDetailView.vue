<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Calendar, ArrowLeft, Clock, User, Plus, Leaf } from 'lucide-vue-next'
import api from '@/lib/api'

const route = useRoute()
const slug = route.params.slug as string

const news = ref<any>(null)
const loading = ref(true)

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    const res = await api.get(`/public/news/${slug}`)
    if (res.data?.success && res.data?.data) {
      news.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch news detail', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-green-200/20 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/20 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Floating Pluses -->
    <div class="absolute top-36 left-[8%] text-slate-355 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[45%] right-[10%] text-slate-355 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>

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

        <div class="container-main px-6 md:px-16 relative z-10" v-if="news">
          <RouterLink 
            to="/berita" 
            class="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-green-300 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full mb-6 hover:bg-white/20 transition-all duration-300 backdrop-blur"
          >
            <ArrowLeft :size="12" /> Kembali ke Berita
          </RouterLink>
          
          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-6 max-w-3xl leading-snug">
            {{ news.title }}
          </h1>
          
          <div class="flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-wider font-extrabold text-slate-350">
            <span class="inline-flex items-center gap-1.5"><Calendar :size="11" /> {{ formatDate(news.published_at || news.created_at) }}</span>
            <span class="hidden sm:inline opacity-40">|</span>
            <span class="inline-flex items-center gap-1.5"><User :size="11" /> Oleh: {{ news.author?.name || 'Admin' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Detail Content -->
    <section class="py-12" v-if="news">
      <div class="max-w-4xl mx-auto px-4">
        <div class="space-y-8">
          <!-- Featured Image -->
          <div class="w-full h-64 sm:h-[400px] overflow-hidden rounded-[2rem] shadow-sm bg-slate-100 border border-slate-200/50" v-if="news.cover_image_url || news.cover_image">
            <img 
              :src="news.cover_image_url || news.cover_image" 
              :alt="news.title" 
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Article Content -->
          <div class="bg-white border border-slate-200/55 rounded-[2rem] p-8 md:p-12 shadow-sm space-y-6">
            <div class="flex justify-between items-center pb-4 border-b border-slate-100">
              <span class="text-[9px] uppercase tracking-widest font-extrabold text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <Leaf :size="10" /> Kategori: {{ news.category }}
              </span>
            </div>
            
            <div class="space-y-5 text-slate-500 text-sm leading-relaxed font-medium text-justify" v-html="news.content">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center py-32 text-slate-500">
      Memuat berita...
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-32 text-slate-500">
      Berita tidak ditemukan.
    </div>
  </div>
</template>
