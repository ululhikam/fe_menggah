<script setup lang="ts">
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface-50">
    <PublicNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <PublicFooter />
  </div>
</template>
