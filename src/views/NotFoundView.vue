<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Home, AlertTriangle } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen gradient-hero flex items-center justify-center px-4">
    <div class="text-center max-w-lg">
      <div class="mb-8 animate-[float_3s_ease-in-out_infinite]">
        <span class="text-8xl font-extrabold text-gradient">404</span>
      </div>
      <div class="flex items-center justify-center gap-2 mb-4">
        <AlertTriangle :size="20" class="text-warm-400" />
        <h1 class="text-xl font-bold text-white">Halaman Tidak Ditemukan</h1>
      </div>
      <p class="text-surface-400 mb-8">
        Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
      </p>
      <RouterLink to="/" class="btn-primary btn-lg">
        <Home :size="18" />
        Kembali ke Beranda
      </RouterLink>
    </div>
  </div>
</template>
