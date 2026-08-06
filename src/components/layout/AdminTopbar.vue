<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { Menu, Bell } from 'lucide-vue-next'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const authStore = useAuthStore()
</script>

<template>
  <header class="bg-white border-b border-surface-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
    <!-- Left side -->
    <div class="flex items-center gap-3">
      <button
        class="lg:hidden p-2 rounded-xl text-surface-500 hover:bg-surface-100 transition-colors"
        @click="emit('toggleSidebar')"
      >
        <Menu :size="20" />
      </button>

      <div>
        <h1 class="text-lg font-bold text-surface-900">
          <slot name="title">Dashboard</slot>
        </h1>
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <!-- Notifications -->
      <button class="relative p-2 rounded-xl text-surface-500 hover:bg-surface-100 transition-colors">
        <Bell :size="20" />
        <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white"></span>
      </button>

      <!-- User info -->
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
          <span class="text-white text-xs font-bold">
            {{ authStore.displayName.slice(0, 2).toUpperCase() }}
          </span>
        </div>
        <div class="hidden sm:block">
          <p class="text-sm font-semibold text-surface-800">{{ authStore.displayName }}</p>
          <p class="text-xs text-surface-500 capitalize">{{ authStore.userRole?.replace('_', ' ') ?? 'Super Admin' }}</p>
        </div>
      </div>
    </div>
  </header>
</template>
