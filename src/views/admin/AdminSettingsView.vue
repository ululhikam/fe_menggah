<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, Settings, Instagram, Youtube, Facebook, Globe, Phone } from 'lucide-vue-next'
import api from '@/lib/api'

const saving = ref(false)
const loading = ref(true)
const successMsg = ref('')

const generalSettings = ref({
  village_name: 'Dusun Menggah',
  village_tagline: 'Bersatu, Makmur, Berbudaya',
  village_address: 'Dusun Menggah, Desa Katekan, Kecamatan Ngawi, Kabupaten Ngawi, Jawa Timur 63261',
  village_phone: '+62 812-3456-7890',
  village_email: 'dusunmenggah@gmail.com',
  google_maps_url: 'https://maps.app.goo.gl/x77tpvXD9zAmAUHZ8',
})

const socialSettings = ref({
  instagram: 'https://instagram.com/dusunmenggah',
  facebook: 'https://facebook.com/dusunmenggah',
  youtube: 'https://youtube.com/@dusunmenggah',
  tiktok: 'https://tiktok.com/@dusunmenggah',
  whatsapp: '6281234567890',
})

onMounted(async () => {
  try {
    const res = await api.get('/cms/settings')
    if (res.data?.success && res.data.data) {
      const d = res.data.data
      if (d.village_name) generalSettings.value.village_name = d.village_name
      if (d.village_tagline) generalSettings.value.village_tagline = d.village_tagline
      if (d.village_address) generalSettings.value.village_address = d.village_address
      if (d.village_phone) generalSettings.value.village_phone = d.village_phone
      if (d.village_email) generalSettings.value.village_email = d.village_email
      if (d.google_maps_url) generalSettings.value.google_maps_url = d.google_maps_url
      if (d.instagram) socialSettings.value.instagram = d.instagram
      if (d.facebook) socialSettings.value.facebook = d.facebook
      if (d.youtube) socialSettings.value.youtube = d.youtube
      if (d.tiktok) socialSettings.value.tiktok = d.tiktok
      if (d.whatsapp) socialSettings.value.whatsapp = d.whatsapp
    }
  } catch {}
  finally { loading.value = false }
})

async function saveAll() {
  saving.value = true
  try {
    await api.put('/cms/settings', { ...generalSettings.value, ...socialSettings.value })
    successMsg.value = 'Pengaturan berhasil disimpan!'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch {
    successMsg.value = 'Gagal menyimpan pengaturan.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Pengaturan Website</h1>
        <p class="text-sm text-surface-500 mt-1">Konfigurasi informasi dan kontak dusun.</p>
      </div>
      <button @click="saveAll" :disabled="saving" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-50">
        <Save :size="16" /> {{ saving ? 'Menyimpan...' : 'Simpan Semua' }}
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="successMsg" class="flex items-center gap-3 p-4 rounded-xl" :class="successMsg.includes('Gagal') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'">
      {{ successMsg }}
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 2" :key="i" class="card animate-pulse h-48"></div>
    </div>

    <div v-else class="grid lg:grid-cols-2 gap-6">
      <!-- General Settings -->
      <div class="card space-y-4">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center"><Settings :size="16" class="text-green-600" /></div>
          <h2 class="font-black text-surface-900">Informasi Umum</h2>
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide">Nama Dusun</label>
          <input v-model="generalSettings.village_name" type="text" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide">Tagline</label>
          <input v-model="generalSettings.village_tagline" type="text" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide">Alamat Lengkap</label>
          <textarea v-model="generalSettings.village_address" rows="2" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-green-500"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide">No. Telepon</label>
            <input v-model="generalSettings.village_phone" type="text" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide">Email</label>
            <input v-model="generalSettings.village_email" type="email" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide">URL Google Maps</label>
          <input v-model="generalSettings.google_maps_url" type="url" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
        </div>
      </div>

      <!-- Social Media -->
      <div class="card space-y-4">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center"><Globe :size="16" class="text-purple-600" /></div>
          <h2 class="font-black text-surface-900">Media Sosial</h2>
        </div>
        <div v-for="(icon, key) in { instagram: Instagram, facebook: Facebook, youtube: Youtube }" :key="key">
          <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
            <component :is="icon" :size="12" /> {{ key.charAt(0).toUpperCase() + key.slice(1) }}
          </label>
          <input v-model="(socialSettings as any)[key]" type="url" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="https://..." />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide">TikTok</label>
          <input v-model="socialSettings.tiktok" type="url" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="https://tiktok.com/@..." />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
            <Phone :size="12" /> WhatsApp (nomor saja, tanpa +)
          </label>
          <input v-model="socialSettings.whatsapp" type="text" class="w-full border border-surface-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" placeholder="628xxxxxxxxxx" />
        </div>
      </div>
    </div>
  </div>
</template>
