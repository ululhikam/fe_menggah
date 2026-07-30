<script setup lang="ts">
import { ref } from 'vue'
import { FileText, ArrowUpRight, HelpCircle } from 'lucide-vue-next'

const selectedType = ref('all')

const services = ref([
  { id: '1', title: 'Surat Keterangan Catatan Kepolisian (SKCK)', type: 'police', desc: 'Pengantar permohonan SKCK untuk keperluan melamar pekerjaan atau lainnya.', time: '1 Hari Kerja', fee: 'Gratis' },
  { id: '2', title: 'Surat Keterangan Domisili Warga', type: 'residence', desc: 'Surat resmi keterangan domisili tempat tinggal tinggal sementara atau tetap.', time: '5 Menit', fee: 'Gratis' },
  { id: '3', title: 'Surat Keterangan Tidak Mampu (SKTM)', type: 'social', desc: 'Keterangan tidak mampu untuk pengajuan keringanan biaya sekolah/kesehatan.', time: '1 Hari Kerja', fee: 'Gratis' },
  { id: '4', title: 'Surat Keterangan Usaha (SKU)', type: 'business', desc: 'Surat keterangan kepemilikan usaha mikro atau kecil milik warga.', time: '1 Hari Kerja', fee: 'Gratis' },
])

const filteredServices = ref(services.value)

function filterServices(type: string) {
  selectedType.value = type
  filteredServices.value = type === 'all'
    ? services.value
    : services.value.filter(s => s.type === type)
}
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
            <FileText :size="12" /> Layanan Mandiri
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Pelayanan Surat <span class="text-warm-400">Mandiri Online</span>
          </h1>
          <p class="text-xs sm:text-sm text-primary-100 font-light max-w-xl opacity-90 leading-relaxed">
            Dapatkan kemudahan mengurus surat pengantar dan administrasi kependudukan Anda secara mandiri langsung dari rumah.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="section bg-surface-50">
      <div class="container-main">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Sidebar: Filter Pills (Left side) -->
          <div class="lg:col-span-4 space-y-4">
            <div class="bg-white border border-surface-200/50 rounded-[2rem] p-6 shadow-sm">
              <h3 class="text-xs uppercase tracking-wider font-extrabold text-surface-800 mb-4">Kategori Layanan</h3>
              <div class="flex flex-col gap-1.5">
                <button 
                  @click="filterServices('all')"
                  class="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  :class="selectedType === 'all' 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-surface-600 hover:bg-surface-50 hover:text-primary-500'"
                >
                  Semua Layanan
                </button>
                <button 
                  @click="filterServices('residence')"
                  class="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  :class="selectedType === 'residence' 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-surface-600 hover:bg-surface-50 hover:text-primary-500'"
                >
                  Kependudukan
                </button>
                <button 
                  @click="filterServices('police')"
                  class="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  :class="selectedType === 'police' 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-surface-600 hover:bg-surface-50 hover:text-primary-500'"
                >
                  Kepolisian
                </button>
                <button 
                  @click="filterServices('social')"
                  class="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  :class="selectedType === 'social' 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-surface-600 hover:bg-surface-50 hover:text-primary-500'"
                >
                  Sosial & Kesehatan
                </button>
                <button 
                  @click="filterServices('business')"
                  class="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  :class="selectedType === 'business' 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-surface-600 hover:bg-surface-50 hover:text-primary-500'"
                >
                  Usaha & UMKM
                </button>
              </div>
            </div>

            <!-- Help box -->
            <div class="bg-primary-50 border border-primary-100 rounded-[2rem] p-6 text-primary-900">
              <div class="flex items-center gap-2 mb-3">
                <HelpCircle :size="16" class="text-primary-600 shrink-0" />
                <span class="text-[10px] uppercase tracking-widest font-extrabold text-primary-700">Butuh Bantuan?</span>
              </div>
              <p class="text-xs leading-relaxed font-light mb-4">
                Silakan masuk atau daftar menggunakan NIK Anda agar sistem dapat memvalidasi biodata Anda secara otomatis.
              </p>
              <RouterLink 
                to="/login"
                class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold text-primary-700 hover:text-primary-900"
              >
                Masuk Sekarang <ArrowUpRight :size="12" />
              </RouterLink>
            </div>
          </div>

          <!-- Services Grid (Right side) -->
          <div class="lg:col-span-8 space-y-4">
            <div 
              v-for="srv in filteredServices" 
              :key="srv.id" 
              class="bg-white border border-surface-200/50 rounded-[1.8rem] p-6 hover:shadow-elevated hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row justify-between md:items-center gap-6"
            >
              <div class="space-y-2 max-w-lg">
                <span class="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-extrabold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-0.5 rounded-full">
                  {{ srv.type }}
                </span>
                <h3 class="text-xs uppercase tracking-wider font-extrabold text-surface-800">{{ srv.title }}</h3>
                <p class="text-xs text-surface-500 leading-relaxed font-light">{{ srv.desc }}</p>
              </div>
              
              <div class="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 border-surface-100 pt-4 md:pt-0">
                <div class="text-left md:text-right">
                  <span class="block text-[8px] uppercase tracking-widest text-surface-400 font-bold">Waktu Proses</span>
                  <span class="text-xs font-bold text-surface-700">{{ srv.time }}</span>
                </div>
                <RouterLink 
                  to="/login"
                  class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
                >
                  Ajukan <ArrowUpRight :size="12" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
