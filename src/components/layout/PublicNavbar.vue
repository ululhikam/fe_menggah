<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  Menu,
  X,
  Home,
  Newspaper,
  Image as ImageIcon,
  Users,
  Calendar,
  Building2,
  Megaphone,
  Phone,
  ChevronDown,
  Archive,
  User,
  LogIn,
  Search,
  BookOpen,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const route = useRoute()
const mobileMenuOpen = ref(false)
const profileDropdown = ref(false)
const profilDropdownOpen = ref(false)
const kelembagaanDropdownOpen = ref(false)
const kabarDropdownOpen = ref(false)

const profileRef = ref<HTMLElement | null>(null)

const profilSubLinks = [
  { to: '/profil/sejarah', label: 'Sejarah Dusun' },
  { to: '/profil/visi-misi', label: 'Visi & Misi' },
  { to: '/profil/geografis', label: 'Letak Geografis' },
  { to: '/profil/potensi', label: 'Potensi Dusun' },
  { to: '/profil/fasilitas', label: 'Fasilitas Umum' },
]

const kelembagaanSubLinks = [
  { to: '/kepengurusan', label: 'Struktur Kepengurusan', icon: Users },
  { to: '/organisasi', label: 'Organisasi Masyarakat', icon: Building2 },
]

const kabarSubLinks = [
  { to: '/berita', label: 'Berita & Kegiatan', icon: Newspaper },
  { to: '/agenda', label: 'Agenda Kegiatan', icon: Calendar },
  { to: '/pengumuman', label: 'Pengumuman Resmi', icon: Megaphone },
  { to: '/galeri', label: 'Galeri Dokumentasi', icon: ImageIcon },
  { to: '/arsip', label: 'Arsip Digital', icon: Archive },
]

// Close profile dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (profileRef.value && !profileRef.value.contains(event.target as Node)) {
    profileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function isDropdownActive(subLinks: { to: string }[]) {
  return subLinks.some(link => route.path.startsWith(link.to))
}
</script>

<template>
  <!-- Floating Pill Navbar -->
  <header class="fixed top-4 left-4 right-4 z-50 max-w-screen-xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg rounded-2xl py-2 px-4 md:px-6">
    <div class="flex items-center justify-between gap-3">
      
      <!-- Brand Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
        <img 
          src="/logodesa.jpeg" 
          alt="Logo Desa Katekan" 
          class="w-9 h-9 rounded-xl object-cover shadow-sm border border-slate-200/50"
        />
        <div class="hidden sm:block leading-tight">
          <span class="block font-black text-sm text-slate-900 tracking-tight">Dusun Menggah</span>
          <span class="block text-[10px] text-slate-500 font-medium">Desa Katekan, Ngawi</span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation Menu -->
      <nav class="hidden lg:flex items-center gap-1">
        <!-- Beranda -->
        <RouterLink
          to="/"
          class="text-[11px] uppercase tracking-wider font-extrabold px-3 py-2 rounded-xl transition-all duration-200"
          :class="isActive('/') && route.path === '/' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          Beranda
        </RouterLink>

        <!-- Profil Dropdown -->
        <div 
          class="relative py-2" 
          @mouseenter="profilDropdownOpen = true" 
          @mouseleave="profilDropdownOpen = false"
        >
          <RouterLink
            to="/profil"
            class="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold px-3 py-2 rounded-xl transition-all duration-200"
            :class="isActive('/profil') || isDropdownActive(profilSubLinks) ? 'bg-green-50 text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
          >
            Profil <ChevronDown :size="11" class="transition-transform duration-200" :class="{'rotate-180': profilDropdownOpen}" />
          </RouterLink>
          
          <transition name="scale">
            <div v-if="profilDropdownOpen" class="absolute top-full left-0 pt-2 w-48 z-50">
              <div class="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1">
                <RouterLink
                  v-for="sub in profilSubLinks"
                  :key="sub.to"
                  :to="sub.to"
                  class="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all"
                  @click="profilDropdownOpen = false"
                >
                  <BookOpen :size="12" class="text-slate-400" />
                  {{ sub.label }}
                </RouterLink>
              </div>
            </div>
          </transition>
        </div>

        <!-- Kelembagaan Dropdown -->
        <div 
          class="relative py-2" 
          @mouseenter="kelembagaanDropdownOpen = true" 
          @mouseleave="kelembagaanDropdownOpen = false"
        >
          <button
            class="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold px-3 py-2 rounded-xl transition-all duration-200 focus:outline-none"
            :class="isDropdownActive(kelembagaanSubLinks) ? 'bg-green-50 text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
          >
            Kelembagaan <ChevronDown :size="11" class="transition-transform duration-200" :class="{'rotate-180': kelembagaanDropdownOpen}" />
          </button>
          
          <transition name="scale">
            <div v-if="kelembagaanDropdownOpen" class="absolute top-full left-0 pt-2 w-52 z-50">
              <div class="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1">
                <RouterLink
                  v-for="sub in kelembagaanSubLinks"
                  :key="sub.to"
                  :to="sub.to"
                  class="flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all"
                  @click="kelembagaanDropdownOpen = false"
                >
                  <component :is="sub.icon" :size="13" class="text-slate-400" />
                  {{ sub.label }}
                </RouterLink>
              </div>
            </div>
          </transition>
        </div>

        <!-- Kabar Dusun Dropdown -->
        <div 
          class="relative py-2" 
          @mouseenter="kabarDropdownOpen = true" 
          @mouseleave="kabarDropdownOpen = false"
        >
          <button
            class="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold px-3 py-2 rounded-xl transition-all duration-200 focus:outline-none"
            :class="isDropdownActive(kabarSubLinks) ? 'bg-green-50 text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
          >
            Kabar Dusun <ChevronDown :size="11" class="transition-transform duration-200" :class="{'rotate-180': kabarDropdownOpen}" />
          </button>
          
          <transition name="scale">
            <div v-if="kabarDropdownOpen" class="absolute top-full left-0 pt-2 w-52 z-50">
              <div class="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1">
                <RouterLink
                  v-for="sub in kabarSubLinks"
                  :key="sub.to"
                  :to="sub.to"
                  class="flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all"
                  @click="kabarDropdownOpen = false"
                >
                  <component :is="sub.icon" :size="13" class="text-slate-400" />
                  {{ sub.label }}
                </RouterLink>
              </div>
            </div>
          </transition>
        </div>

        <!-- Kontak -->
        <RouterLink
          to="/kontak"
          class="text-[11px] uppercase tracking-wider font-extrabold px-3 py-2 rounded-xl transition-colors duration-200"
          :class="isActive('/kontak') ? 'bg-green-50 text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
        >
          Hubungi Kami
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Search (hidden on small/medium) -->
        <div class="relative hidden xl:block w-48">
          <input 
            type="text" 
            placeholder="Cari..." 
            class="w-full bg-slate-100 border border-transparent rounded-full pl-4 pr-9 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all duration-300"
          />
          <Search :size="12" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <!-- User dropdown if authenticated -->
        <template v-if="authStore.isAuthenticated">
          <div class="relative" ref="profileRef">
            <button
              @click="profileDropdown = !profileDropdown"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shadow-inner">
                <span class="text-green-700 text-[10px] font-black">
                  {{ authStore.displayName.slice(0, 2).toUpperCase() }}
                </span>
              </div>
              <span class="text-[11px] font-bold text-slate-700 hidden sm:block">{{ authStore.displayName }}</span>
              <ChevronDown :size="11" class="text-slate-400" />
            </button>

            <transition name="scale">
              <div
                v-if="profileDropdown"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 overflow-hidden z-50"
              >
                <RouterLink
                  v-if="authStore.isAdmin"
                  to="/admin"
                  class="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-green-50 hover:text-green-700"
                  @click="profileDropdown = false"
                >
                  <User :size="14" /> Admin Panel
                </RouterLink>
                <hr class="my-1 border-slate-100">
                <button
                  @click="authStore.logout(); profileDropdown = false"
                  class="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogIn :size="14" /> Keluar
                </button>
              </div>
            </transition>
          </div>
        </template>


        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <component :is="mobileMenuOpen ? X : Menu" :size="18" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <transition name="slide-down">
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden py-3 max-h-[80vh] overflow-y-auto"
      >
        <nav class="px-3 space-y-0.5">
          <!-- Search -->
          <div class="relative mb-3 px-1">
            <input 
              type="text" 
              placeholder="Cari informasi..." 
              class="w-full bg-slate-100 border border-transparent rounded-xl pl-4 pr-9 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300"
            />
            <Search :size="12" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <RouterLink
            to="/"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors"
            :class="route.path === '/' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'"
            @click="mobileMenuOpen = false"
          >
            <Home :size="15" /> Beranda
          </RouterLink>

          <!-- Profil Section on Mobile -->
          <div class="px-3 py-2 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Profil Dusun</div>
          <RouterLink
            v-for="sub in profilSubLinks"
            :key="sub.to"
            :to="sub.to"
            class="flex items-center gap-3 px-6 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            @click="mobileMenuOpen = false"
          >
            <BookOpen :size="14" class="text-slate-400" />
            {{ sub.label }}
          </RouterLink>

          <!-- Kelembagaan Section on Mobile -->
          <div class="px-3 py-2 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Kelembagaan</div>
          <RouterLink
            v-for="sub in kelembagaanSubLinks"
            :key="sub.to"
            :to="sub.to"
            class="flex items-center gap-3 px-6 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            @click="mobileMenuOpen = false"
          >
            <component :is="sub.icon" :size="14" class="text-slate-400" />
            {{ sub.label }}
          </RouterLink>

          <!-- Kabar Dusun Section on Mobile -->
          <div class="px-3 py-2 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Kabar Dusun</div>
          <RouterLink
            v-for="sub in kabarSubLinks"
            :key="sub.to"
            :to="sub.to"
            class="flex items-center gap-3 px-6 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            @click="mobileMenuOpen = false"
          >
            <component :is="sub.icon" :size="14" class="text-slate-400" />
            {{ sub.label }}
          </RouterLink>

          <hr class="border-slate-100 my-2">

          <RouterLink
            to="/kontak"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            @click="mobileMenuOpen = false"
          >
            <Phone :size="15" /> Hubungi Kami
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              @click="mobileMenuOpen = false"
            >
              <User :size="15" /> Admin Panel
            </RouterLink>
            <button
              @click="authStore.logout(); mobileMenuOpen = false"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 text-left"
            >
              <LogIn :size="15" /> Keluar
            </button>
          </template>

        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
