<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Globe, Send, MessageCircle, Map as MapIcon } from 'lucide-vue-next'
import api from '@/lib/api'

const form = ref({
  name: '',
  contact: '',
  subject: '',
  message: ''
})

const contactInfo = ref([
  { id: 'address', icon: MapPin, title: 'Alamat Kantor Desa', value: '-', valueHtml: '', href: '#' },
  { id: 'phone', icon: Phone, title: 'Telepon / WhatsApp', value: '-', valueHtml: '', href: '#' },
  { id: 'email', icon: Mail, title: 'Email Resmi', value: '-', valueHtml: '', href: '#' },
  { id: 'hours', icon: Clock, title: 'Jam Operasional', value: '', valueHtml: 'Senin - Jumat: 08:00 - 15:00<br>Sabtu - Minggu: Tutup', href: '' },
])

const socialLinks = ref<any[]>([])
const loading = ref(true)

async function fetchKontakData() {
  loading.value = true
  try {
    const settingsRes = await api.get('/public/settings')

    if (settingsRes.data?.success && settingsRes.data?.data) {
      const s = settingsRes.data.data
      
      const addrLines = (s.village_address || '-').split(', ')
      const addrHtml = addrLines.join('<br>')

      contactInfo.value = [
        { id: 'address', icon: MapPin, title: 'Alamat Kantor Desa', value: s.village_address || '-', valueHtml: addrHtml, href: s.google_maps_url || 'https://maps.app.goo.gl/x77tpvXD9zAmAUHZ8' },
        { id: 'phone', icon: Phone, title: 'Telepon / WhatsApp', value: s.village_phone || '-', valueHtml: s.village_phone || '-', href: `https://wa.me/${(s.village_phone||'').replace(/\D/g,'')}` },
        { id: 'email', icon: Mail, title: 'Email Resmi', value: s.village_email || '-', valueHtml: s.village_email || '-', href: `mailto:${s.village_email||''}` },
        { id: 'hours', icon: Clock, title: 'Jam Operasional', value: '', valueHtml: 'Senin - Jumat: 08:00 - 15:00<br>Sabtu - Minggu: Tutup', href: '' },
      ]

      const iconMap: any = {
        'instagram': Instagram,
        'facebook': Facebook,
        'youtube': Youtube,
        'tiktok': Globe, // Or a custom TikTok icon
        'website': Globe,
      }
      
      const platforms = ['instagram', 'facebook', 'youtube', 'tiktok']
      socialLinks.value = platforms
        .filter(p => s[p]) // Only include if setting has a value
        .map(p => ({
          icon: iconMap[p] || MessageCircle,
          label: p.charAt(0).toUpperCase() + p.slice(1),
          href: s[p]
        }))
    }
  } catch (error) {
    console.error('Failed to fetch kontak data', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchKontakData()
})
</script>

<template>
  <div class="min-h-screen bg-[#F6F8F3] text-slate-800 font-sans selection:bg-green-100 selection:text-green-800">
    
    <!-- Hero Section -->
    <!-- Using a base64 inline SVG for the faint plus pattern -->
    <section class="pt-32 pb-20 bg-white border-b border-slate-100" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDB2NDBNMCAyMGg0MCIgc3Ryb2tlPSIjZTNlOGUxIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==');">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold text-[#143d23] mb-4 tracking-tight">Hubungi Kami</h1>
        <p class="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Kami terbuka untuk komunikasi dan kolaborasi. Silakan hubungi perangkat desa Dusun Menggah untuk informasi lebih lanjut, saran, atau keperluan administratif lainnya.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="max-w-6xl mx-auto px-4 py-12 -mt-4">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-10">
        
        <!-- Left Column: Form -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
          <h2 class="text-2xl font-bold text-[#143d23] mb-8">Kirim Pesan</h2>
          
          <form class="space-y-6" @submit.prevent>
            <div class="grid sm:grid-cols-2 gap-6">
              <!-- Nama -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700">Nama Lengkap</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  placeholder="Masukkan nama Anda"
                  class="w-full bg-[#f4f7f1] border-b-2 border-slate-200/60 px-4 py-3 text-sm focus:outline-none focus:border-[#143d23] transition-colors rounded-t-lg"
                />
              </div>
              
              <!-- Kontak -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700">Email / No. Telepon</label>
                <input 
                  v-model="form.contact"
                  type="text" 
                  placeholder="Email atau WhatsApp"
                  class="w-full bg-[#f4f7f1] border-b-2 border-slate-200/60 px-4 py-3 text-sm focus:outline-none focus:border-[#143d23] transition-colors rounded-t-lg"
                />
              </div>
            </div>

            <!-- Subjek -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Subjek</label>
              <input 
                v-model="form.subject"
                type="text" 
                placeholder="Keperluan Anda"
                class="w-full bg-[#f4f7f1] border-b-2 border-slate-200/60 px-4 py-3 text-sm focus:outline-none focus:border-[#143d23] transition-colors rounded-t-lg"
              />
            </div>

            <!-- Pesan -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Pesan</label>
              <textarea 
                v-model="form.message"
                rows="4"
                placeholder="Tuliskan pesan Anda di sini..."
                class="w-full bg-[#f4f7f1] border-b-2 border-slate-200/60 px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#143d23] transition-colors rounded-t-lg"
              ></textarea>
            </div>

            <div class="pt-2">
              <button 
                type="button"
                class="bg-[#143d23] hover:bg-[#1a4f2e] text-white font-semibold text-sm px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                Kirim Pesan <Send :size="16" />
              </button>
            </div>
          </form>
        </div>

        <!-- Right Column: Info & Map -->
        <div class="lg:col-span-5 space-y-6">
          
          <!-- Contact Info Card -->
          <div class="bg-[#eef2e6] rounded-3xl p-8 border border-[#e0e8d5]">
            <h2 class="text-2xl font-bold text-[#143d23] mb-8">Informasi Kontak</h2>
            
            <div class="space-y-6">
              <a 
                v-for="item in contactInfo" 
                :key="item.id"
                :href="item.href || undefined"
                :target="item.href ? '_blank' : undefined"
                class="flex items-start gap-4 group"
                :class="item.href ? 'cursor-pointer' : 'cursor-default'"
              >
                <!-- Icon Circle -->
                <div class="w-10 h-10 rounded-full bg-[#dce5d2] flex items-center justify-center shrink-0 text-[#143d23] transition-transform group-hover:scale-105">
                  <component :is="item.icon" :size="18" />
                </div>
                <!-- Text -->
                <div class="pt-0.5">
                  <p class="text-xs font-extrabold text-[#2a563b] mb-1">{{ item.title }}</p>
                  <div class="text-sm text-slate-700 leading-relaxed font-medium" v-html="item.valueHtml"></div>
                </div>
              </a>

              <!-- Social Media -->
              <div class="pt-4 border-t border-[#dce5d2]/60">
                <p class="text-xs font-extrabold text-[#2a563b] mb-3">Media Sosial</p>
                <div class="flex flex-wrap gap-3">
                  <a 
                    v-for="social in socialLinks" 
                    :key="social.label"
                    :href="social.href"
                    target="_blank"
                    class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#143d23] shadow-sm hover:shadow-md hover:scale-105 transition-all border border-slate-100"
                    :title="social.label"
                  >
                    <component :is="social.icon" :size="18" />
                  </a>
                  <!-- If no social links, show placeholders -->
                  <template v-if="!socialLinks.length">
                    <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                      <Instagram :size="18" />
                    </div>
                    <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                      <Facebook :size="18" />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Image / Map Link -->
          <div class="relative rounded-3xl overflow-hidden h-48 sm:h-56 group border border-slate-200/50 shadow-sm">
            <img 
              src="/images/misty_mountain_hero.png" 
              alt="Peta Desa" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            
            <!-- Map Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center">
              <a 
                :href="contactInfo[0].href || '#'" 
                target="_blank"
                class="bg-white/95 backdrop-blur-sm hover:bg-white text-[#143d23] font-bold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <MapIcon :size="16" /> Lihat Peta
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  </div>
</template>
