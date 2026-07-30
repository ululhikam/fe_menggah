<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { BarChart3, TrendingUp, Wallet, ArrowUpRight } from 'lucide-vue-next'
import { formatCurrency } from '@/lib/utils'
import api from '@/lib/api'

const selectedYear = ref(2026)
const years = [2024, 2025, 2026]
const loading = ref(false)

const budgetData = ref([
  { category: 'Pembangunan Infrastruktur', allocated: 1200000000, realized: 1050000000 },
  { category: 'Pemberdayaan Masyarakat', allocated: 450000000, realized: 420000000 },
  { category: 'Pendidikan & Kesehatan', allocated: 380000000, realized: 350000000 },
  { category: 'Pemerintahan Desa', allocated: 320000000, realized: 310000000 },
  { category: 'Sosial & Budaya', allocated: 150000000, realized: 130000000 },
])

const totalAllocated = computed(() => budgetData.value.reduce((s, b) => s + b.allocated, 0))
const totalRealized = computed(() => budgetData.value.reduce((s, b) => s + b.realized, 0))
const realization = computed(() => totalAllocated.value ? Math.round((totalRealized.value / totalAllocated.value) * 100) : 0)

async function fetchBudget() {
  try {
    loading.value = true
    const response = await api.get(`/public/budget/${selectedYear.value}`)
    if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
      budgetData.value = response.data.data.map((b: any) => ({
        category: b.category,
        allocated: b.allocated_amount,
        realized: b.realized_amount
      }))
    }
  } catch (err) {
    console.warn('Gagal memuat transparansi dana dari server, menggunakan data simulasi:', err)
  } finally {
    loading.value = false
  }
}

watch(selectedYear, () => {
  fetchBudget()
})

onMounted(() => {
  fetchBudget()
})
</script>

<template>
  <div class="bg-surface-50 text-surface-800 min-h-screen font-sans">
    
    <!-- ===== HEADER SECTION (Interior Boxed Hero) ===== -->
    <section class="px-4 sm:px-6 lg:px-8 pt-24 pb-4 bg-surface-50">
      <div class="relative bg-primary-950 text-white py-16 md:py-20 overflow-hidden rounded-[2rem] shadow-elevated">
        <!-- Background Image overlay -->
        <div class="absolute inset-0 z-0">
          <img 
            src="/images/misty_mountain_hero.png" 
            alt="Misty Mountain Kadaleman" 
            class="w-full h-full object-cover opacity-20 object-center"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-transparent"></div>
        </div>

        <div class="container-main px-6 md:px-12 relative z-10">
          <div class="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-warm-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4">
            <BarChart3 :size="12" /> Laporan Transparansi
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Transparansi <span class="text-warm-400">Dana Desa</span>
          </h1>
          <p class="text-xs sm:text-sm text-primary-100 font-light max-w-xl opacity-90 leading-relaxed">
            Akses informasi alokasi dan realisasi APBD Desa secara terbuka, akuntabel, dan real-time demi menjaga kepercayaan warga.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="section bg-surface-50">
      <div class="container-main">
        <!-- Year selector (Pills) -->
        <div class="flex items-center gap-2 mb-10 bg-surface-200/50 p-1.5 rounded-full max-w-max border border-surface-200/30">
          <button 
            v-for="year in years" 
            :key="year" 
            @click="selectedYear = year"
            class="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
            :class="selectedYear === year 
              ? 'bg-primary-500 text-white shadow-sm' 
              : 'text-surface-600 hover:text-primary-500 hover:bg-white/50'"
          >
            Tahun {{ year }}
          </button>
        </div>

        <!-- Summary cards (Wander-like rounded boxes) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Card 1: Total Anggaran -->
          <div class="bg-white border border-surface-200/50 rounded-[1.8rem] p-6 shadow-sm hover:shadow-card transition-all duration-300">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-[0.8rem] bg-primary-50 text-primary-600 flex items-center justify-center">
                <Wallet :size="18" />
              </div>
              <span class="text-[10px] uppercase tracking-widest font-extrabold text-surface-400">Total Anggaran</span>
            </div>
            <p class="text-xl font-extrabold tracking-tight text-surface-800">{{ formatCurrency(totalAllocated) }}</p>
          </div>

          <!-- Card 2: Total Realisasi -->
          <div class="bg-white border border-surface-200/50 rounded-[1.8rem] p-6 shadow-sm hover:shadow-card transition-all duration-300">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-[0.8rem] bg-accent-50 text-accent-600 flex items-center justify-center">
                <TrendingUp :size="18" />
              </div>
              <span class="text-[10px] uppercase tracking-widest font-extrabold text-surface-400">Total Realisasi</span>
            </div>
            <p class="text-xl font-extrabold tracking-tight text-surface-800">{{ formatCurrency(totalRealized) }}</p>
          </div>

          <!-- Card 3: % Realisasi -->
          <div class="bg-white border border-surface-200/50 rounded-[1.8rem] p-6 shadow-sm hover:shadow-card transition-all duration-300">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-[0.8rem] bg-warm-50 text-warm-600 flex items-center justify-center">
                <BarChart3 :size="18" />
              </div>
              <span class="text-[10px] uppercase tracking-widest font-extrabold text-surface-400">% Realisasi</span>
            </div>
            <div class="flex items-baseline justify-between mb-2">
              <p class="text-xl font-extrabold tracking-tight text-surface-800">{{ realization }}%</p>
            </div>
            <div class="h-2 bg-surface-100 rounded-full overflow-hidden">
              <div class="h-full bg-accent-500 rounded-full transition-all duration-1000" :style="{ width: realization + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Budget Table Card -->
        <div class="bg-white border border-surface-200/50 rounded-[2rem] overflow-hidden shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xs uppercase tracking-wider font-extrabold text-surface-800">Kategori Rincian Pembiayaan</h3>
            <span class="text-[10px] uppercase tracking-widest font-bold text-surface-400 flex items-center gap-1">
              Data Terkini <ArrowUpRight :size="12" />
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-surface-100">
                  <th class="text-left py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-surface-400">Kategori</th>
                  <th class="text-right py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-surface-400">Alokasi</th>
                  <th class="text-right py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-surface-400">Realisasi</th>
                  <th class="text-right py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-surface-400">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100">
                <tr v-for="item in budgetData" :key="item.category" class="hover:bg-surface-50/50 transition-colors">
                  <td class="py-4 px-4 font-medium text-surface-700 text-xs md:text-sm">{{ item.category }}</td>
                  <td class="py-4 px-4 text-right text-surface-500 text-xs md:text-sm">{{ formatCurrency(item.allocated) }}</td>
                  <td class="py-4 px-4 text-right text-surface-500 text-xs md:text-sm">{{ formatCurrency(item.realized) }}</td>
                  <td class="py-4 px-4 text-right">
                    <span class="inline-block text-[9px] uppercase tracking-wider font-extrabold text-accent-700 bg-accent-50 border border-accent-100 px-2.5 py-0.5 rounded-full">
                      {{ Math.round((item.realized / item.allocated) * 100) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
