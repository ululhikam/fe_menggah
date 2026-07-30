<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const quickLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil Desa' },
  { to: '/berita', label: 'Berita' },
  { to: '/galeri', label: 'Galeri' },
]

const serviceLinks = [
  { to: '/layanan', label: 'Layanan Mandiri' },
  { to: '/transparansi', label: 'Transparansi Dana' },
  { to: '/login', label: 'Login Warga' },
]
</script>

<template>
  <footer class="bg-primary-950 text-primary-200 relative overflow-hidden font-sans border-t border-slate-900">
    <!-- Decorative background gradient -->
    <div class="absolute inset-0 z-0">
      <img 
        src="/images/misty_mountain_hero.png" 
        alt="Footer Background" 
        class="w-full h-full object-cover opacity-10 object-center"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/90 to-transparent"></div>
    </div>

    <div class="container-main relative z-10 py-16 px-6 md:px-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
              <span class="text-white font-black text-base">S</span>
            </div>
            <div>
              <span class="font-sans font-black text-sm uppercase tracking-wider text-white">SIP Desa</span>
              <p class="text-[9px] uppercase tracking-widest font-extrabold text-primary-400">Desa Katekan (Menggah)</p>
            </div>
          </div>
          <p class="text-xs text-primary-200/75 leading-relaxed font-light mb-6">
            Mendigitalisasi administrasi kependudukan dan meningkatkan transparansi tata kelola desa demi pelayanan publik yang lebih prima.
          </p>
          <span class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold text-warm-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <Sparkles :size="10" /> Gotong Royong Digital
          </span>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-xs uppercase tracking-widest font-extrabold text-white mb-5">Navigasi Portal</h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-xs text-primary-200/70 hover:text-warm-300 transition-colors duration-300 font-light"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h4 class="text-xs uppercase tracking-widest font-extrabold text-white mb-5">Layanan Mandiri</h4>
          <ul class="space-y-3">
            <li v-for="link in serviceLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-xs text-primary-200/70 hover:text-warm-300 transition-colors duration-300 font-light"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-xs uppercase tracking-widest font-extrabold text-white mb-5">Hubungi Kami</h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-xs text-primary-200/70 font-light leading-relaxed">
              <MapPin :size="14" class="mt-0.5 shrink-0 text-warm-300" />
              <span>Jl. Raya Katekan No. 12, Kec. Gantiwarno, Kabupaten Klaten, Jawa Tengah</span>
            </li>
            <li class="flex items-center gap-3 text-xs text-primary-200/70 font-light">
              <Phone :size="14" class="shrink-0 text-warm-300" />
              <span>+62 812-3456-7890</span>
            </li>
            <li class="flex items-center gap-3 text-xs text-primary-200/70 font-light">
              <Mail :size="14" class="shrink-0 text-warm-300" />
              <span>pemdes@katekan.desa.id</span>
            </li>
            <li class="flex items-center gap-3 text-xs text-primary-200/70 font-light">
              <Globe :size="14" class="shrink-0 text-warm-300" />
              <span>www.katekan.desa.id</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5 relative z-10 bg-primary-950/60 backdrop-blur-sm">
      <div class="container-main py-6 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-[10px] text-primary-400 font-light tracking-wide">
          &copy; {{ currentYear }} Pemerintah Desa Katekan. Seluruh Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  </footer>
</template>
