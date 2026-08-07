<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook, Globe } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import api from '@/lib/api'

const authStore = useAuthStore()
const currentYear = new Date().getFullYear()

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil Dusun' },
  { to: '/kepengurusan', label: 'Kepengurusan' },
  { to: '/berita', label: 'Berita' },
  { to: '/agenda', label: 'Agenda' },
]

const moreLinks = [
  { to: '/galeri', label: 'Galeri' },
  { to: '/organisasi', label: 'Organisasi' },
  { to: '/pengumuman', label: 'Pengumuman' },
  { to: '/arsip', label: 'Arsip' },
  { to: '/kontak', label: 'Kontak' },
]

const address = ref('Dusun Menggah, Desa Katekan, Kec. Ngawi, Kab. Ngawi, Jawa Timur 63261')
const phone = ref('+62 812-3456-7890')
const email = ref('dusunmenggah@gmail.com')

const socialLinks = ref<{ icon: any, href: string, label: string }[]>([
  { icon: Instagram, href: 'https://instagram.com/dusunmenggah', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/dusunmenggah', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/@dusunmenggah', label: 'YouTube' },
])

onMounted(async () => {
  try {
    const res = await api.get('/public/settings')
    if (res.data?.success && res.data?.data) {
      const s = res.data.data
      if (s.village_address) address.value = s.village_address
      if (s.village_phone) phone.value = s.village_phone
      if (s.village_email) email.value = s.village_email
      
      const iconMap: any = {
        'instagram': Instagram,
        'facebook': Facebook,
        'youtube': Youtube,
        'tiktok': Globe,
      }
      const platforms = ['instagram', 'facebook', 'youtube', 'tiktok']
      const newLinks = platforms.filter(p => s[p]).map(p => ({
        icon: iconMap[p] || Globe,
        href: s[p],
        label: p.charAt(0).toUpperCase() + p.slice(1)
      }))
      if (newLinks.length > 0) socialLinks.value = newLinks
    }
  } catch (error) {
    console.error('Failed to load settings in footer', error)
  }
})
</script>

<template>
  <footer class="bg-slate-950 border-t border-slate-900 text-slate-100 relative overflow-hidden">
    
    <!-- Fine-grain background texture backdrop image overlay -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.06]">
      <img 
        src="/images/misty_mountain_hero.png" 
        alt="Misty Mountain" 
        class="w-full h-full object-cover scale-105"
      />
    </div>

    <!-- Top section -->
    <div class="max-w-6xl mx-auto px-6 py-16 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        <!-- Brand / Logo -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-5">
            <img 
              src="/logodesa.jpeg" 
              alt="Logo Desa Katekan" 
              class="w-10 h-10 rounded-xl object-cover border border-slate-700/60 shadow-sm"
            />
            <div>
              <span class="block font-black text-base text-white leading-tight">Dusun Menggah</span>
              <span class="block text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">Desa Katekan, Gantiwarno, Klaten,
            Jawa Tengah</span>
            </div>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed font-semibold mb-6">
            Portal informasi resmi Dusun Menggah. Pusat informasi, dokumentasi kegiatan, dan publikasi potensi dusun untuk seluruh warga.
          </p>
        </div>

        <!-- Nav Links -->
        <div>
          <h4 class="text-[9px] uppercase tracking-widest font-extrabold text-slate-450 mb-5">Navigasi</h4>
          <ul class="space-y-3 font-semibold text-xs text-slate-350">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink :to="link.to" class="hover:text-emerald-350 transition-colors">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- More Links -->
        <div>
          <h4 class="text-[9px] uppercase tracking-widest font-extrabold text-slate-450 mb-5">Lainnya</h4>
          <ul class="space-y-3 font-semibold text-xs text-slate-350">
            <li v-for="link in moreLinks" :key="link.to">
              <RouterLink :to="link.to" class="hover:text-emerald-350 transition-colors">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact & Social -->
        <div>
          <h4 class="text-[9px] uppercase tracking-widest font-extrabold text-slate-450 mb-5">Kontak &amp; Alamat</h4>
          <ul class="space-y-3.5 font-semibold text-xs text-slate-350">
            <li class="flex items-start gap-2.5">
              <MapPin :size="14" class="text-emerald-400 mt-0.5 shrink-0" />
              <span class="leading-relaxed">{{ address }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone :size="14" class="text-emerald-400 shrink-0" />
              <a :href="`https://wa.me/${phone.replace(/[^0-9]/g, '')}`" target="_blank" class="hover:text-emerald-350 transition-colors">{{ phone }}</a>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail :size="14" class="text-emerald-400 shrink-0" />
              <a :href="`mailto:${email}`" class="hover:text-emerald-350 transition-colors">{{ email }}</a>
            </li>
          </ul>

          <!-- Social Media Group -->
          <div class="mt-6 flex items-center gap-2">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              target="_blank"
              :title="social.label"
              class="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center transition-all hover:scale-105 hover:bg-emerald-800 hover:border-transparent hover:text-white"
            >
              <component :is="social.icon" :size="14" class="text-slate-350" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5 relative z-10 bg-slate-950/50">
      <div class="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
        <p>
          &copy; {{ currentYear }} Dusun Menggah, Desa Katekan. Seluruh Hak Cipta Dilindungi.
        </p>
        <div class="flex items-center gap-3">
          <span class="text-slate-800">|</span>
          <RouterLink :to="authStore.isAuthenticated ? '/admin' : '/login'" class="text-slate-600 hover:text-emerald-400 transition-colors normal-case font-medium">
            admin
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
