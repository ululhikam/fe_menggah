<script setup lang="ts">
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import AdminTopbar from '@/components/layout/AdminTopbar.vue'
import { ref } from 'vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex bg-surface-100">
    <!-- Sidebar -->
    <AdminSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
      <AdminTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-4 md:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
