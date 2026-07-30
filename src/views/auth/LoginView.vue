<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
    const redirect = (router.currentRoute.value.query.redirect as string) || (authStore.isAdmin ? '/admin' : '/')
    router.push(redirect)
  } catch { /* Error handled by store */ }
}
</script>

<template>
  <div class="min-h-screen bg-primary-950 flex items-center justify-center px-4 py-16 relative overflow-hidden font-sans">
    <!-- Decorative background image with opacity -->
    <div class="absolute inset-0 z-0">
      <img 
        src="/images/misty_mountain_hero.png" 
        alt="Misty Mountain Katekan" 
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
        <h1 class="text-2xl font-extrabold uppercase tracking-tight text-white mb-2">Masuk ke Akun Anda</h1>
        <p class="text-xs text-primary-200 opacity-70">Akses pelayanan administrasi desa secara online</p>
      </div>

      <form @submit.prevent="handleLogin" class="bg-primary-900/60 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 shadow-elevated space-y-5">
        <div v-if="authStore.error" class="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-xs text-red-400">
          {{ authStore.error }}
        </div>
        
        <div>
          <label for="login-email" class="block text-[10px] uppercase tracking-wider font-bold text-primary-200 mb-2">Email</label>
          <div class="relative">
            <Mail :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
            <input 
              id="login-email" 
              v-model="email" 
              type="email" 
              placeholder="nama@email.com" 
              required
              class="w-full rounded-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300" 
            />
          </div>
        </div>

        <div>
          <label for="login-password" class="block text-[10px] uppercase tracking-wider font-bold text-primary-200 mb-2">Kata Sandi</label>
          <div class="relative">
            <Lock :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
            <input 
              id="login-password" 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              required
              class="w-full rounded-full bg-white/5 border border-white/10 text-white pl-11 pr-11 py-3 text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300" 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-white transition-colors"
            >
              <component :is="showPassword ? EyeOff : Eye" :size="16" />
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading" 
          class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-full transition-all duration-300 shadow-md shadow-primary-500/10 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <template v-if="authStore.loading">
            <div class="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Memproses...
          </template>
          <template v-else>
            <LogIn :size="14" />
            Masuk
          </template>
        </button>

        <p class="text-center text-xs text-primary-200 opacity-70">
          Belum memiliki akun?
          <RouterLink to="/register" class="text-warm-300 hover:text-warm-400 font-bold ml-1">Daftar Baru</RouterLink>
        </p>
      </form>

      <!-- Mock Accounts Hint -->
      <div class="mt-6 bg-white/5 border border-white/10 rounded-[1.5rem] p-5 text-left text-[11px] text-primary-200 opacity-90 backdrop-blur-md">
        <h4 class="font-extrabold uppercase tracking-wider text-warm-300 mb-2">Simulasi Akun (Bypass Supabase)</h4>
        <p class="mb-3 leading-relaxed">Gunakan akun berikut dengan kata sandi <code class="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">password123</code> untuk menguji panel secara instan:</p>
        <ul class="space-y-2">
          <li class="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span><strong>Super Admin Panel:</strong></span>
            <code class="bg-white/5 px-2 py-0.5 rounded text-white font-mono select-all cursor-pointer">superadmin@katekan.desa.id</code>
          </li>
          <li class="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span><strong>Admin Desa (Kades):</strong></span>
            <code class="bg-white/5 px-2 py-0.5 rounded text-white font-mono select-all cursor-pointer">admin@katekan.desa.id</code>
          </li>
          <li class="flex justify-between items-center">
            <span><strong>Warga (Dashboard):</strong></span>
            <code class="bg-white/5 px-2 py-0.5 rounded text-white font-mono select-all cursor-pointer">warga@katekan.desa.id</code>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
