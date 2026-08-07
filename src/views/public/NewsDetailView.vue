<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { 
  Calendar, 
  ArrowLeft, 
  Plus, 
  Leaf, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  Heart, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  MessageCircle, 
  AArrowUp, 
  AArrowDown,
  Building2
} from 'lucide-vue-next'
import api from '@/lib/api'

const route = useRoute()

// State
const news = ref<any>(null)
const relatedNews = ref<any[]>([])
const loading = ref(true)
const loadingRelated = ref(true)

// Interactive States
const scrollProgress = ref(0)
const copiedToast = ref(false)
const liked = ref(false)
const likesCount = ref(0)
const fontScale = ref(100) // % size: 90, 100, 110, 120

// Format date helper
function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

// Calculate reading time
const readingTime = computed(() => {
  if (!news.value?.content) return 1
  const textWithoutTags = news.value.content.replace(/<[^>]*>/g, '')
  const words = textWithoutTags.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return minutes > 0 ? minutes : 1
})

// Get author initials
function getInitials(name?: string) {
  if (!name) return 'ADM'
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0] || '')
    .join('')
    .toUpperCase()
}

// Category badge style generator
function getCategoryBadgeClass(category?: string) {
  const cat = (category || '').toLowerCase()
  if (cat.includes('pengumuman')) return 'bg-amber-50 text-amber-700 border-amber-200/80'
  if (cat.includes('pembangunan')) return 'bg-blue-50 text-blue-700 border-blue-200/80'
  if (cat.includes('kegiatan')) return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
  return 'bg-emerald-50 text-emerald-800 border-emerald-100'
}

// Scroll progress handler
function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  if (docHeight > 0) {
    scrollProgress.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  } else {
    scrollProgress.value = 0
  }
}

// Share functions
function copyArticleLink() {
  navigator.clipboard.writeText(window.location.href)
  copiedToast.value = true
  setTimeout(() => {
    copiedToast.value = false
  }, 3000)
}

function shareWhatsApp() {
  const text = encodeURIComponent(`Baca berita "${news.value?.title || 'Dusun Menggah'}": ${window.location.href}`)
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
}

function shareFacebook() {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

function shareTwitter() {
  const text = encodeURIComponent(`"${news.value?.title || 'Berita Dusun'}" via Web Desa Katekan`)
  const url = encodeURIComponent(window.location.href)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

// Font size controls
function zoomInFont() {
  if (fontScale.value < 125) fontScale.value += 10
}
function zoomOutFont() {
  if (fontScale.value > 85) fontScale.value -= 10
}

// Like handler
function toggleLike() {
  if (!news.value?.id) return
  const storageKey = `news_like_${news.value.id}`
  liked.value = !liked.value
  if (liked.value) {
    likesCount.value += 1
    localStorage.setItem(storageKey, 'true')
  } else {
    likesCount.value = Math.max(0, likesCount.value - 1)
    localStorage.removeItem(storageKey)
  }
}

// Fetch Article Data
async function fetchNewsDetail(slugParam: string) {
  loading.value = true
  news.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })

  try {
    const res = await api.get(`/public/news/${slugParam}`)
    if (res.data?.success && res.data?.data) {
      news.value = res.data.data

      // Initialize persistent likes
      const storageKey = `news_like_${news.value.id}`
      liked.value = localStorage.getItem(storageKey) === 'true'
      likesCount.value = (news.value.id ? (news.value.id.charCodeAt(0) % 20) + 12 : 15) + (liked.value ? 1 : 0)

      // Fetch related articles
      fetchRelatedArticles(news.value.category, news.value.id)
    }
  } catch (error) {
    console.error('Failed to fetch news detail', error)
  } finally {
    loading.value = false
  }
}

// Fetch Related Articles
async function fetchRelatedArticles(category?: string, currentId?: string) {
  loadingRelated.value = true
  try {
    const url = category ? `/public/news?page=1&per_page=6&category=${encodeURIComponent(category)}` : '/public/news?page=1&per_page=6'
    const res = await api.get(url)
    if (res.data?.success && res.data?.data?.items) {
      const allItems: any[] = res.data.data.items
      relatedNews.value = allItems
        .filter(item => item.id !== currentId)
        .slice(0, 4)
    }
  } catch (err) {
    console.error('Failed to fetch related news', err)
  } finally {
    loadingRelated.value = false
  }
}

// Watch route params for seamless in-page navigation between articles
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      fetchNewsDetail(newSlug as string)
    }
  }
)

onMounted(() => {
  const currentSlug = route.params.slug as string
  if (currentSlug) {
    fetchNewsDetail(currentSlug)
  }
  window.addEventListener('scroll', updateScrollProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans overflow-x-hidden relative selection:bg-emerald-100 selection:text-emerald-800">
    
    <!-- Top Reading Scroll Progress Bar -->
    <div 
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 z-[100] transition-all duration-150 ease-out shadow-sm"
      :style="{ width: `${scrollProgress}%` }"
    ></div>

    <!-- Copied Toast Notification -->
    <Transition name="slide-down">
      <div 
        v-if="copiedToast" 
        class="fixed top-6 right-6 z-[110] bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700/60 backdrop-blur"
      >
        <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Check :size="14" />
        </div>
        <span>Tautan artikel berhasil disalin!</span>
      </div>
    </Transition>

    <!-- Decorative background glows -->
    <div class="absolute top-[5%] left-[-150px] w-[350px] h-[350px] bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-[35%] right-[-120px] w-[400px] h-[400px] bg-teal-100/25 rounded-full blur-[110px] pointer-events-none"></div>

    <!-- Floating Background Decorative Elements -->
    <div class="absolute top-40 left-[6%] text-slate-300 pointer-events-none hidden lg:block"><Plus :size="22" class="stroke-[1.5]" /></div>
    <div class="absolute top-[50%] right-[5%] text-slate-300 pointer-events-none hidden lg:block"><Plus :size="18" class="stroke-[1.5]" /></div>

    <!-- Main Content Container -->
    <div class="pt-28 pb-20">
      
      <!-- BREADCRUMBS BAR & HEADER -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <!-- Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 flex-wrap">
          <RouterLink to="/" class="hover:text-emerald-700 transition-colors flex items-center gap-1">
            Beranda
          </RouterLink>
          <ChevronRight :size="12" class="text-slate-400" />
          <RouterLink to="/berita" class="hover:text-emerald-700 transition-colors">
            Kabar Dusun
          </RouterLink>
          <template v-if="news">
            <ChevronRight :size="12" class="text-slate-400" />
            <span class="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-[350px]">
              {{ news.title }}
            </span>
          </template>
        </nav>

        <!-- Dynamic Article Hero Container -->
        <div v-if="news" class="relative bg-slate-950 text-white p-8 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800/80">
          <!-- Background Image Overlay with Vignette -->
          <div class="absolute inset-0 z-0">
            <img 
              src="/images/misty_mountain_hero.png" 
              alt="Misty Mountain Katekan" 
              class="w-full h-full object-cover opacity-25 scale-105 filter blur-[1px]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40"></div>
          </div>

          <div class="relative z-10 max-w-4xl">
            <!-- Back & Category Pill -->
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <RouterLink 
                to="/berita" 
                class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-full transition-all duration-300 backdrop-blur"
              >
                <ArrowLeft :size="14" /> Kembali ke Berita
              </RouterLink>

              <span 
                v-if="news.category" 
                class="text-[10px] uppercase tracking-widest font-black px-3.5 py-1.5 rounded-full border shadow-sm backdrop-blur"
                :class="getCategoryBadgeClass(news.category)"
              >
                <Leaf :size="11" class="inline mr-1" /> {{ news.category }}
              </span>
            </div>

            <!-- Article Title -->
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.2] text-white font-sans mb-6">
              {{ news.title }}
            </h1>

            <!-- Article Meta Info -->
            <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-4 border-t border-white/10">
              <!-- Author -->
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md border border-emerald-400/40">
                  {{ getInitials(news.author?.name) }}
                </div>
                <div>
                  <div class="text-white font-semibold leading-none">{{ news.author?.name || 'Admin Redaksi' }}</div>
                  <div class="text-[10px] text-slate-400 leading-tight">Kontributor Resmi</div>
                </div>
              </div>

              <span class="opacity-30">|</span>

              <!-- Date -->
              <span class="inline-flex items-center gap-1.5 text-slate-300">
                <Calendar :size="14" class="text-emerald-400" />
                {{ formatDate(news.published_at || news.created_at) }}
              </span>

              <span class="opacity-30">|</span>

              <!-- Reading Time -->
              <span class="inline-flex items-center gap-1.5 text-slate-300">
                <Clock :size="14" class="text-emerald-400" />
                {{ readingTime }} menit baca
              </span>
            </div>
          </div>
        </div>

        <!-- Skeleton Header Loading -->
        <div v-else-if="loading" class="bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] shadow-xl animate-pulse">
          <div class="h-6 w-32 bg-slate-800 rounded-full mb-6"></div>
          <div class="h-10 w-3/4 bg-slate-800 rounded-xl mb-4"></div>
          <div class="h-10 w-1/2 bg-slate-800 rounded-xl mb-6"></div>
          <div class="flex gap-4">
            <div class="h-8 w-24 bg-slate-800 rounded-full"></div>
            <div class="h-8 w-32 bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </section>

      <!-- ARTICLE CONTENT & SIDEBAR GRID -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" v-if="news">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <!-- LEFT COLUMN: ARTICLE BODY (8 Columns) -->
          <article class="lg:col-span-8 space-y-8">
            
            <!-- Quick Reading Utility & Share Actions Bar -->
            <div class="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <!-- Share Quick Buttons -->
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                  <Share2 :size="13" /> Bagikan:
                </span>
                
                <button 
                  @click="shareWhatsApp" 
                  title="Bagikan ke WhatsApp"
                  class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  <MessageCircle :size="14" /> WhatsApp
                </button>

                <button 
                  @click="shareFacebook" 
                  title="Bagikan ke Facebook"
                  class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold"
                >
                  Facebook
                </button>

                <button 
                  @click="shareTwitter" 
                  title="Bagikan ke X / Twitter"
                  class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-500 hover:text-white transition-all text-xs font-semibold"
                >
                  X / Twitter
                </button>

                <button 
                  @click="copyArticleLink" 
                  title="Salin Tautan"
                  class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy :size="13" /> Salin Link
                </button>
              </div>

              <!-- Typography Zoom Control -->
              <div class="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1 text-xs">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ukuran Teks:</span>
                <button 
                  @click="zoomOutFont" 
                  class="w-7 h-7 rounded-lg hover:bg-white hover:shadow-xs text-slate-600 font-bold flex items-center justify-center transition-all disabled:opacity-40"
                  :disabled="fontScale <= 85"
                  title="Kecilkan Teks"
                >
                  <AArrowDown :size="15" />
                </button>
                <span class="font-extrabold text-slate-700 min-w-[36px] text-center">{{ fontScale }}%</span>
                <button 
                  @click="zoomInFont" 
                  class="w-7 h-7 rounded-lg hover:bg-white hover:shadow-xs text-slate-600 font-bold flex items-center justify-center transition-all disabled:opacity-40"
                  :disabled="fontScale >= 125"
                  title="Besarkan Teks"
                >
                  <AArrowUp :size="15" />
                </button>
              </div>
            </div>

            <!-- Featured Cover Image -->
            <div 
              v-if="news.cover_image_url || news.cover_image" 
              class="relative group rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <img 
                :src="news.cover_image_url || news.cover_image" 
                :alt="news.title" 
                class="w-full max-h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              <div class="absolute bottom-4 left-6 right-6 text-white text-xs font-medium drop-shadow-sm flex items-center justify-between">
                <span>Dokumentasi Resmi Dusun Menggah</span>
                <span class="text-[10px] bg-black/40 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">Foto Utama</span>
              </div>
            </div>

            <!-- Excerpt Callout (If Available) -->
            <div 
              v-if="news.excerpt" 
              class="bg-emerald-50/60 border-l-4 border-emerald-600 rounded-r-2xl p-6 text-slate-700 font-serif italic text-lg leading-relaxed shadow-xs"
            >
              "{{ news.excerpt }}"
            </div>

            <!-- Main Article Body Container -->
            <div class="bg-white border border-slate-200/60 rounded-[2.2rem] p-6 sm:p-10 lg:p-12 shadow-sm relative">
              <div 
                class="article-content text-slate-700 leading-relaxed font-normal text-justify space-y-6"
                :style="{ fontSize: `${(15 * fontScale) / 100}px` }"
                v-html="news.content"
              ></div>

              <!-- Engagement & Article Appreciation Box -->
              <div class="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h4 class="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Sparkles :size="16" class="text-emerald-600" /> Bagaimana pendapat Anda tentang artikel ini?
                  </h4>
                  <p class="text-xs text-slate-500">Berikan apresiasi untuk warta informasi desa ini.</p>
                </div>

                <button 
                  @click="toggleLike"
                  class="px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition-all duration-300 border shadow-xs"
                  :class="liked 
                    ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'"
                >
                  <Heart 
                    :size="18" 
                    :class="liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'" 
                    class="transition-transform duration-300"
                  />
                  <span>{{ liked ? 'Menyukai' : 'Sukai Artikel' }}</span>
                  <span class="bg-white/80 px-2 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs">
                    {{ likesCount }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Author Signature Profile Box -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
              <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white text-xl font-black flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
                  {{ getInitials(news.author?.name) }}
                </div>

                <div class="space-y-1.5 flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-bold text-white">{{ news.author?.name || 'Redaksi Dusun Menggah' }}</h3>
                    <span class="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Official</span>
                  </div>
                  <p class="text-xs text-slate-350 leading-relaxed">
                    Dipublikasikan oleh Tim Pusat Informasi Desa Katekan. Berita disajikan secara terbuka untuk mendukung transparansi dan publikasi publik di Dusun Menggah.
                  </p>
                </div>
              </div>
            </div>

          </article>

          <!-- RIGHT COLUMN: SIDEBAR WIDGETS (4 Columns) -->
          <aside class="lg:col-span-4 space-y-8">
            
            <!-- Quick Action Box -->
            <div class="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div class="relative z-10 space-y-4">
                <span class="text-[9px] uppercase tracking-widest font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/50 inline-block">
                  Pusat Warta
                </span>
                <h3 class="text-lg font-light text-white leading-snug">
                  Temukan Informasi & <span class="font-serif italic font-medium text-emerald-300">Pengumuman Terbaru</span>
                </h3>
                <p class="text-xs text-slate-350 leading-relaxed">
                  Jelajahi berita pembangunan, administrasi warga, dan liputan kegiatan dusun lainnya.
                </p>
                <RouterLink 
                  to="/berita" 
                  class="inline-flex items-center justify-center gap-2 w-full text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-3 rounded-xl transition-all duration-300 shadow-md"
                >
                  <BookOpen :size="14" /> Lihat Semua Berita
                </RouterLink>
              </div>
            </div>

            <!-- Related / Latest Articles Widget -->
            <div class="bg-white border border-slate-200/70 rounded-[2rem] p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Sparkles :size="15" class="text-emerald-600" /> Berita Terkait
                </h3>
                <span class="text-[10px] text-slate-400 font-bold">Terbaru</span>
              </div>

              <!-- Loading state for related news -->
              <div v-if="loadingRelated" class="space-y-4">
                <div v-for="n in 3" :key="n" class="animate-pulse flex gap-3">
                  <div class="w-16 h-16 bg-slate-100 rounded-xl shrink-0"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>

              <!-- List of related articles -->
              <div v-else-if="relatedNews.length > 0" class="space-y-5">
                <RouterLink 
                  v-for="item in relatedNews" 
                  :key="item.id" 
                  :to="`/berita/${item.slug}`"
                  class="group flex gap-4 items-start pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 transition-all duration-200"
                >
                  <!-- Thumbnail -->
                  <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 relative group-hover:shadow-md transition-shadow">
                    <img 
                      v-if="item.cover_image_url || item.cover_image" 
                      :src="item.cover_image_url || item.cover_image" 
                      :alt="item.title" 
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div v-else class="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs">
                      Warta
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="space-y-1.5 flex-1 min-w-0">
                    <span 
                      class="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block border"
                      :class="getCategoryBadgeClass(item.category)"
                    >
                      {{ item.category }}
                    </span>
                    <h4 class="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {{ item.title }}
                    </h4>
                    <p class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar :size="10" /> {{ formatDate(item.published_at || item.created_at) }}
                    </p>
                  </div>
                </RouterLink>
              </div>

              <div v-else class="text-xs text-slate-400 text-center py-6">
                Belum ada berita terkait lainnya.
              </div>
            </div>

            <!-- Dusun Menggah Info Card -->
            <div class="bg-emerald-950 text-white rounded-[2rem] p-6 shadow-md border border-emerald-800/40 relative overflow-hidden">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-800/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
                  <Building2 :size="20" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Dusun Menggah</h4>
                  <p class="text-[10px] text-emerald-300">Desa Katekan</p>
                </div>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed mb-4">
                Dusun Menggah berkomitmen memberikan informasi terbuka serta mengedepankan kemajuan warga secara berkelanjutan.
              </p>
              <RouterLink 
                to="/profile" 
                class="text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                Jelajahi Profil Dusun <ChevronRight :size="13" />
              </RouterLink>
            </div>

          </aside>

        </div>
      </main>

      <!-- SKELETON LOADING STATE FOR MAIN GRID -->
      <div v-else-if="loading" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div class="lg:col-span-8 space-y-6">
            <div class="h-64 bg-slate-200/70 rounded-3xl animate-pulse"></div>
            <div class="bg-white p-8 rounded-3xl space-y-4 shadow-xs">
              <div class="h-5 bg-slate-200/70 rounded w-full animate-pulse"></div>
              <div class="h-5 bg-slate-200/70 rounded w-11/12 animate-pulse"></div>
              <div class="h-5 bg-slate-200/70 rounded w-4/5 animate-pulse"></div>
              <div class="h-5 bg-slate-200/70 rounded w-9/12 animate-pulse"></div>
            </div>
          </div>
          <div class="lg:col-span-4 space-y-6">
            <div class="h-48 bg-slate-200/70 rounded-3xl animate-pulse"></div>
            <div class="h-80 bg-slate-200/70 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- NOT FOUND STATE -->
      <div v-else class="max-w-xl mx-auto px-4 py-20 text-center">
        <div class="bg-white border border-slate-200/80 rounded-[2.5rem] p-10 shadow-lg space-y-5">
          <div class="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <BookOpen :size="28" />
          </div>
          <h2 class="text-2xl font-light text-slate-900">Artikel Tidak Ditemukan</h2>
          <p class="text-xs text-slate-500 leading-relaxed">
            Maaf, berita yang Anda cari tidak tersedia atau mungkin telah dihapus oleh tim redaksi.
          </p>
          <RouterLink 
            to="/berita" 
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
          >
            <ArrowLeft :size="14" /> Kembali ke Daftar Berita
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Article Content Custom Typography Styles */
:deep(.article-content) {
  line-height: 1.85;
}

:deep(.article-content p) {
  margin-bottom: 1.4rem;
  color: #334155;
}

:deep(.article-content h1),
:deep(.article-content h2),
:deep(.article-content h3),
:deep(.article-content h4) {
  color: #0f172a;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

:deep(.article-content h1) { font-size: 1.75rem; }
:deep(.article-content h2) { font-size: 1.45rem; }
:deep(.article-content h3) { font-size: 1.25rem; }

:deep(.article-content ul),
:deep(.article-content ol) {
  margin-bottom: 1.4rem;
  padding-left: 1.5rem;
}

:deep(.article-content ul) { list-style-type: disc; }
:deep(.article-content ol) { list-style-type: decimal; }

:deep(.article-content li) {
  margin-bottom: 0.5rem;
}

:deep(.article-content blockquote) {
  border-left: 4px solid #059669;
  background-color: #f0fdf4;
  padding: 1rem 1.25rem;
  border-radius: 0 0.75rem 0.75rem 0;
  font-style: italic;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  color: #047857;
}

:deep(.article-content img) {
  border-radius: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  max-width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

:deep(.article-content a) {
  color: #059669;
  text-decoration: underline;
  font-weight: 600;
}
:deep(.article-content a:hover) {
  color: #047857;
}
</style>
