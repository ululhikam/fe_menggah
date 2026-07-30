<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import {
  LayoutDashboard,
  Users,
  FileText,
  Newspaper,
  UserCog,
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
  { to: '/admin/kependudukan', label: 'Kependudukan', icon: Users },
  { to: '/admin/surat', label: 'Manajemen Surat', icon: FileText },
  { to: '/admin/konten', label: 'Manajemen Konten', icon: Newspaper },
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
    class="fixed top-0 left-0 h-full w-64 bg-surface-900 border-r border-surface-800 z-50
           flex flex-col transition-transform duration-300 lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Header -->
    <div class="p-5 flex items-center justify-between border-b border-surface-800">
      <RouterLink to="/admin" class="flex items-center gap-3">
        <img src="/logo.svg" alt="SIP Desa" class="w-9 h-9 object-contain" />
        <div>
          <span class="font-bold text-white text-sm">SIP Desa</span>
          <span class="block text-xs text-surface-500">Admin Panel</span>
        </div>
      </RouterLink>
      <button
        class="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800"
        @click="emit('close')"
      >
        <X :size="18" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
      <template v-for="item in menuItems" :key="item.to">
        <RouterLink
          v-if="!item.superAdminOnly || authStore.isSuperAdmin"
          :to="item.to"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(item.to, item.exact)
            ? 'gradient-primary text-white shadow-md'
            : 'text-surface-400 hover:text-white hover:bg-surface-800'"
          @click="emit('close')"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-surface-800 space-y-2">
      <RouterLink
        to="/"
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
      >
        <ArrowLeft :size="18" />
        Kembali ke Portal
      </RouterLink>
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-surface-800 transition-all cursor-pointer"
      >
        <LogOut :size="18" />
        Keluar
      </button>
    </div>
  </aside>
</template>
