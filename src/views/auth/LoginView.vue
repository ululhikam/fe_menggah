<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
    const redirect = (router.currentRoute.value.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch { /* Error handled by store */ }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a1e12] via-[#0f2e1e] to-[#08170e] flex items-center justify-center px-4 py-16 relative overflow-hidden font-sans select-none">
    
    <!-- Premium Ambient Background Light Glows -->
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-[pulse_8s_infinite_alternate]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-green-600/10 rounded-full blur-[120px] pointer-events-none animate-[pulse_10s_infinite_alternate]"></div>
    
    <!-- Floating geometric nodes for micro-interactivity -->
    <div class="absolute top-[20%] right-[15%] text-emerald-500/20 pointer-events-none animate-bounce"><span class="text-4xl font-serif">+</span></div>
    <div class="absolute bottom-[25%] left-[12%] text-emerald-500/10 pointer-events-none animate-pulse"><span class="text-6xl font-sans">×</span></div>

    <!-- Login Container -->
    <div class="w-full max-w-[440px] relative z-10 animate-[fade-in_0.6s_ease-out]">
      
      <!-- Brand Logo / Badge -->
      <div class="text-center mb-10 flex flex-col items-center">
        <RouterLink to="/" class="group inline-flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <span class="text-white font-serif font-black text-2xl tracking-wider">M</span>
          </div>
          <div class="mt-3 text-center">
            <span class="block text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 group-hover:text-emerald-300 transition-colors">Portal Layanan</span>
            <span class="block text-2xl font-extrabold text-white mt-1 font-serif tracking-tight">Dusun Menggah</span>
          </div>
        </RouterLink>
      </div>

      <!-- Glassmorphic Card -->
      <div class="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-black/40 relative overflow-hidden group/card hover:border-white/[0.12] transition-colors duration-300">
        
        <!-- Subtle Card Header Border Light -->
        <div class="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

        <div class="mb-8">
          <h2 class="text-xl font-bold text-white tracking-tight">Selamat Datang Kembali</h2>
          <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Silakan masuk dengan akun terdaftar Anda untuk mengakses panel manajemen sistem informasi.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error Notification -->
          <div 
            v-if="authStore.error" 
            class="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-4 py-3 text-xs leading-relaxed animate-[shake_0.4s_ease-in-out]"
          >
            {{ authStore.error }}
          </div>
          
          <!-- Email Input -->
          <div class="space-y-2">
            <label for="login-email" class="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Alamat Email</label>
            <div class="relative group/input">
              <Mail :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors duration-300" />
              <input 
                id="login-email" 
                v-model="email" 
                type="email" 
                placeholder="nama@email.com" 
                required
                class="w-full rounded-2xl bg-white/[0.03] border border-white/10 text-white pl-11 pr-4 py-3.5 text-xs placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all duration-300" 
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label for="login-password" class="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Kata Sandi</label>
            </div>
            <div class="relative group/input">
              <Lock :size="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors duration-300" />
              <input 
                id="login-password" 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Masukkan kata sandi" 
                required
                class="w-full rounded-2xl bg-white/[0.03] border border-white/10 text-white pl-11 pr-12 py-3.5 text-xs placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all duration-300" 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors duration-200"
              >
                <component :is="showPassword ? EyeOff : Eye" :size="16" />
              </button>
            </div>
          </div>

          <!-- Sign In Button -->
          <button 
            type="submit" 
            :disabled="authStore.loading" 
            class="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
          >
            <template v-if="authStore.loading">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Memproses...
            </template>
            <template v-else>
              <LogIn :size="14" />
              Masuk ke Dashboard
            </template>
          </button>
        </form>

        <!-- Back to Home Link -->
        <div class="text-center pt-4 border-t border-white/[0.06] mt-6">
          <RouterLink 
            to="/" 
            class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-all active:scale-95"
          >
            <ArrowLeft :size="14" /> Kembali ke Beranda
          </RouterLink>
        </div>

      </div>
    </div>
  </div>

</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
</style>
