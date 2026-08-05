<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  LayoutDashboard,
  Newspaper,
  Archive,
  Image as ImageIcon,
  Calendar,
  Megaphone,
  Building2,
  Users,
  UserCog,
  FileText,
  FolderOpen,
  Settings,
  X,
  LogOut,
  ArrowLeft,
} from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/berita', label: 'Berita', icon: Newspaper },
  { to: '/admin/arsip', label: 'Arsip Berita', icon: Archive },
  { to: '/admin/galeri', label: 'Galeri', icon: ImageIcon },
  { to: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { to: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone },
  { to: '/admin/organisasi', label: 'Organisasi', icon: Building2 },
  { to: '/admin/kepengurusan', label: 'Kepengurusan', icon: Users },
  { to: '/admin/profil', label: 'Profil Dusun', icon: FileText },
  { to: '/admin/media', label: 'Media Manager', icon: FolderOpen },
  { to: '/admin/settings', label: 'Pengaturan', icon: Settings },
  { to: '/admin/pengguna', label: 'Pengguna & Role', icon: UserCog, superAdminOnly: true },
]

function isActive(path: string, exact?: boolean) {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <!-- Mobile overlay -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="emit('close')"
    ></div>
  </transition>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    style="background: linear-gradient(180deg, #0f4c2a 0%, #0a3320 100%); border-right: 1px solid rgba(255,255,255,0.08);"
  >
    <!-- Header -->
    <div class="p-5 flex items-center justify-between" style="border-bottom: 1px solid rgba(255,255,255,0.08);">
      <RouterLink to="/admin" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
          <span class="text-white font-black text-base">M</span>
        </div>
        <div>
          <span class="block font-bold text-white text-sm leading-tight">Dusun Menggah</span>
          <span class="block text-[10px] text-green-300/80 font-medium">Admin Panel</span>
        </div>
      </RouterLink>
      <button
        class="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
        @click="emit('close')"
      >
        <X :size="18" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
      <template v-for="item in menuItems" :key="item.to">
        <RouterLink
          v-if="!item.superAdminOnly || authStore.isSuperAdmin"
          :to="item.to"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(item.to, item.exact)
            ? 'bg-white/15 text-white shadow-sm'
            : 'text-white/60 hover:text-white hover:bg-white/8'"
          @click="emit('close')"
        >
          <component :is="item.icon" :size="17" />
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>

    <!-- Footer -->
    <div class="p-3" style="border-top: 1px solid rgba(255,255,255,0.08);">
      <RouterLink
        to="/"
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all mb-1"
      >
        <ArrowLeft :size="17" />
        Kembali ke Portal
      </RouterLink>
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-white/8 transition-all cursor-pointer"
      >
        <LogOut :size="17" />
        Keluar
      </button>
    </div>
  </aside>
</template>
