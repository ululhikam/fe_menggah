<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  Menu,
  X,
  Home,
  Newspaper,
  Image as ImageIcon,
  FileText,
  PieChart,
  User,
  LogIn,
  Search,
  ChevronDown,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const route = useRoute()
const mobileMenuOpen = ref(false)
const profileDropdown = ref(false)

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/profil', label: 'Profile', icon: User },
  { to: '/berita', label: 'News', icon: Newspaper },
  { to: '/galeri', label: 'Gallery', icon: ImageIcon },
  { to: '/layanan', label: 'Services', icon: FileText },
  { to: '/transparansi', label: 'Transparency', icon: PieChart },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <!-- Floating Pill Navbar (Always floating, matching Wander.ph design) -->
  <header class="fixed top-6 left-4 right-4 z-50 max-w-7xl mx-auto bg-white border border-slate-200/80 shadow-md rounded-full py-2.5 px-6 md:px-8">
    <div class="flex items-center justify-between gap-4">
      
      <!-- Brand Logo -->
      <RouterLink to="/" class="flex items-center gap-3 shrink-0">
        <div class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
          <span class="text-white font-serif font-black text-base">S</span>
        </div>
        <div class="hidden sm:block">
          <span class="font-sans font-black text-sm uppercase tracking-wider text-slate-900">
            SIP Desa
          </span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation Menu -->
      <nav class="hidden lg:flex items-center gap-6">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-[10px] uppercase tracking-widest font-extrabold transition-colors duration-200"
          :class="isActive(link.to) ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Search Input (Exactly like Wander.ph search box) -->
      <div class="relative hidden xl:block w-72">
        <input 
          type="text" 
          placeholder="Search for services or information..." 
          class="w-full bg-[#f1f3f5] border border-transparent rounded-full pl-5 pr-10 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all duration-300"
        />
        <Search :size="13" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <!-- Action Button / User Dropdown -->
      <div class="flex items-center gap-3 shrink-0">
        <template v-if="authStore.isAuthenticated">
          <div class="relative">
            <button
              @click="profileDropdown = !profileDropdown"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <div class="w-7 h-7 rounded-full bg-slate-850 flex items-center justify-center border border-slate-200">
                <span class="text-slate-700 text-[10px] font-bold">
                  {{ authStore.displayName.slice(0, 2).toUpperCase() }}
                </span>
              </div>
              <span class="text-[10px] uppercase tracking-wider font-extrabold text-slate-700">
                {{ authStore.displayName }}
              </span>
              <ChevronDown :size="12" class="text-slate-400" />
            </button>

            <!-- Dropdown -->
            <transition name="scale">
              <div
                v-if="profileDropdown"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-slate-200/80 py-2 overflow-hidden"
              >
                <RouterLink
                  v-if="authStore.isAdmin"
                  to="/admin"
                  class="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  @click="profileDropdown = false"
                >
                  Admin Panel
                </RouterLink>
                <RouterLink
                  to="/layanan"
                  class="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  @click="profileDropdown = false"
                >
                  Pengajuan Surat
                </RouterLink>
                <hr class="my-1 border-slate-150">
                <button
                  @click="authStore.logout(); profileDropdown = false"
                  class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-red-600 hover:bg-red-50"
                >
                  Keluar
                </button>
              </div>
            </transition>
          </div>
        </template>
        <template v-else>
          <!-- Solid pill button exactly like Wander "Book now" -->
          <RouterLink
            to="/login"
            class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <LogIn :size="12" />
            Masuk
          </RouterLink>
        </template>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
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
        class="lg:hidden absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 shadow-lg rounded-3xl overflow-hidden py-3"
      >
        <nav class="px-4 space-y-1">
          <!-- Search box for mobile -->
          <div class="relative mb-3 px-2">
            <input 
              type="text" 
              placeholder="Search..." 
              class="w-full bg-[#f1f3f5] border border-transparent rounded-full pl-4 pr-10 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300"
            />
            <Search :size="13" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-extrabold transition-colors"
            :class="isActive(link.to)
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-600 hover:bg-slate-50'"
            @click="mobileMenuOpen = false"
          >
            <component :is="link.icon" :size="14" />
            {{ link.label }}
          </RouterLink>

          <hr class="border-slate-150 my-2">

          <template v-if="authStore.isAuthenticated">
            <RouterLink
              v-if="authStore.isAdmin"
              to="/admin"
              class="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-extrabold text-slate-700 hover:bg-slate-55"
              @click="mobileMenuOpen = false"
            >
              Admin Panel
            </RouterLink>
            <button
              @click="authStore.logout(); mobileMenuOpen = false"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-extrabold text-red-650 hover:bg-slate-55 text-left"
            >
              Keluar
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-extrabold text-slate-700 hover:bg-slate-55"
              @click="mobileMenuOpen = false"
            >
              <LogIn :size="14" />
              Masuk
            </RouterLink>
          </template>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
