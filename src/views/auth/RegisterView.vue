<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Mail, Lock, User, CreditCard, LogIn, ShieldAlert } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const form = ref({ email: '', password: '', full_name: '', nik: '', role: 'warga' })

async function handleRegister() {
  try {
    await authStore.register(form.value.email, form.value.password, {
      full_name: form.value.full_name,
      nik: form.value.nik,
      role: form.value.role,
    })
    router.push('/')
  } catch { /* Error handled by store */ }
}
</script>

<template>
  <div class="min-h-screen bg-primary-950 flex items-center justify-center px-4 py-16 relative overflow-hidden font-sans">
    <!-- Decorative background image with opacity -->
    <div class="absolute inset-0 z-0">
      <img 
        src="/images/misty_mountain_hero.png" 
        alt="Misty Mountain Kadaleman" 
        class="w-full h-full object-cover opacity-20 object-center"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/90 to-transparent"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-md">
            <span class="text-white font-black text-base">S</span>
          </div>
          <span class="text-sm font-sans font-black uppercase tracking-wider text-white">SIP Desa</span>
        </RouterLink>
        <h1 class="text-2xl font-extrabold uppercase tracking-tight text-white mb-2">Buat Akun Baru</h1>
        <p class="text-xs text-primary-200 opacity-70">Lengkapi data diri untuk memulai pengajuan surat atau administrasi</p>
      </div>

      <form @submit.prevent="handleRegister" class="bg-primary-900/60 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 shadow-elevated space-y-4">
        <div v-if="authStore.error" class="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-xs text-red-400">
          {{ authStore.error }}
        </div>

        <div>
          <label for="reg-name" class="block text-[10px] uppercase tracking-wider font-bold text-primary-200 mb-2">Nama Lengkap</label>
          <div class="relative">
            <User :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
            <input 
              id="reg-name" 
              v-model="form.full_name" 
              type="text" 
              placeholder="Nama sesuai KTP" 
              required
              class="w-full rounded-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300" 
            />
          </div>
        </div>

        <div>
          <label for="reg-nik" class="block text-[10px] uppercase tracking-wider font-bold text-primary-200 mb-2">NIK (Nomor Induk Kependudukan)</label>
          <div class="relative">
            <CreditCard :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
            <input 
              id="reg-nik" 
              v-model="form.nik" 
              type="text" 
              placeholder="16 digit NIK" 
              required 
              maxlength="16"
              class="w-full rounded-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300" 
            />
          </div>
        </div>

        <div>
          <label for="reg-role" class="block text-[10px] uppercase tracking-wider font-bold text-primary-200 mb-2">Role Akses (Peran)</label>
          <div class="relative">
            <ShieldAlert :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
            <select 
              id="reg-role" 
              v-model="form.role"
              class="w-full rounded-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300 appearance-none"
            >
              <option value="warga" class="bg-[#0f172a] text-white">Warga (Masyarakat)</option>
              <option value="admin" class="bg-[#0f172a] text-white">Admin (Perangkat Desa)</option>
              <option value="super_admin" class="bg-[#0f172a] text-white">Super Admin (Kades)</option>
            </select>
          </div>
        </div>

        <div>
          <label for="reg-email" class="block text-[10px] uppercase tracking-wider font-bold text-primary-200 mb-2">Email</label>
          <div class="relative">
            <Mail :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
            <input 
              id="reg-email" 
              v-model="form.email" 
              type="email" 
              placeholder="nama@email.com" 
              required
              class="w-full rounded-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300" 
            />
          </div>
        </div>

        <div>
          <label for="reg-password" class="block text-[10px] uppercase tracking-wider font-bold text-primary-200 mb-2">Kata Sandi</label>
          <div class="relative">
            <Lock :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
            <input 
              id="reg-password" 
              v-model="form.password" 
              type="password" 
              placeholder="Min. 8 karakter" 
              required 
              minlength="8"
              class="w-full rounded-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading" 
          class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-full transition-all duration-300 shadow-md shadow-primary-500/10 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
        >
          <template v-if="authStore.loading">
            <div class="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Memproses...
          </template>
          <template v-else>
            <LogIn :size="14" />
            Daftar
          </template>
        </button>

        <p class="text-center text-xs text-primary-200 opacity-70">
          Sudah memiliki akun?
          <RouterLink to="/login" class="text-warm-300 hover:text-warm-400 font-bold ml-1">Masuk di sini</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
