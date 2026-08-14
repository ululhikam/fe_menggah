<script setup lang="ts">
import {
  Smartphone,
  Download,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Receipt,
  CheckCircle2,
  Info,
  ArrowUpRight,
  Plus,
  ArrowRight,
  CircleAlert,
  Home,
  Settings,
  PlusCircle
} from 'lucide-vue-next'

const appFeatures = [
  {
    icon: Receipt,
    title: 'Pencatatan Praktis',
    desc: 'Catat pemasukan dan pengeluaran kas dusun dalam hitungan detik. Antarmuka sederhana yang mudah dipahami oleh siapa saja.'
  },
  {
    icon: TrendingUp,
    title: 'Analitik & Grafik',
    desc: 'Pantau arus kas masuk dan keluar secara visual melalui grafik ringkasan otomatis yang diperbarui secara real-time.'
  },
  {
    icon: ShieldCheck,
    title: 'Aman & Offline-First',
    desc: 'Data disimpan dengan aman langsung di HP Anda. Aplikasi tetap dapat berfungsi penuh bahkan saat tidak ada koneksi internet.'
  },
  {
    icon: FileSpreadsheet,
    title: 'Ekspor Data Mudah',
    desc: 'Ekspor seluruh riwayat transaksi Anda menjadi dokumen Excel (.xlsx) atau PDF untuk keperluan pelaporan dan pertanggungjawaban.'
  }
]

const installationSteps = [
  {
    step: '01',
    title: 'Unduh File APK',
    desc: 'Klik tombol "Unduh Aplikasi" di halaman ini untuk mulai mengunduh file installer CashIn (.apk) ke HP Android Anda.'
  },
  {
    step: '02',
    title: 'Izinkan Instalasi',
    desc: 'Jika HP Anda memblokir pemasangan, buka Pengaturan Keamanan dan aktifkan opsi "Izinkan Instalasi dari Sumber Tidak Dikenal".'
  },
  {
    step: '03',
    title: 'Buka & Pasang APK',
    desc: 'Buka aplikasi File Manager di HP Anda, cari file `cashin.apk` di folder Download, lalu ketuk untuk menginstalnya.'
  },
  {
    step: '04',
    title: 'Aplikasi Siap!',
    desc: 'Buka ikon CashIn di layar HP Anda. Sekarang Anda siap mengelola dan mencatat keuangan dusun dengan mudah.'
  }
]

const appInfo = [
  { label: 'Nama Aplikasi', value: 'CashIn' },
  { label: 'Versi Terbaru', value: 'v1.0.0 (Stabil)' },
  { label: 'Ukuran File', value: '7.82 MB' },
  { label: 'Format File', value: 'Application Package (.apk)' },
  { label: 'Kebutuhan Sistem', value: 'Android 5.0 (Lollipop) atau lebih baru' },
  { label: 'Developer', value: 'Tim KKN Dusun Menggah & Tim Pengembang Desa Katekan' },
  { label: 'Terakhir Diperbarui', value: 'Agustus 2026' }
]
</script>

<template>
  <main class="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[5%] left-[-150px] w-[300px] h-[300px] bg-green-200/15 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[35%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/15 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-[10%] left-[-100px] w-[280px] h-[280px] bg-emerald-200/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Decorative Floating Pluses -->
    <div class="absolute top-36 left-[8%] text-slate-300 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[55%] right-[12%] text-slate-300 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>

    <!-- ================= HERO SECTION ================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <!-- Hero Text -->
        <div class="lg:col-span-7 text-center lg:text-left space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-150 text-[10px] uppercase tracking-widest font-black text-emerald-800">
            <Smartphone :size="12" /> Aplikasi Resmi Dusun
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none text-slate-950 font-sans">
            Aplikasi Pencatatan Keuangan <br>
            <span class="font-serif italic font-medium text-emerald-800">CashIn</span>
          </h1>
          
          <p class="text-slate-500 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
            Solusi pencatatan arus kas dan pembukuan keuangan praktis untuk pengurus RT, RW, organisasi, dan warga Dusun Menggah. Kelola keuangan secara mandiri, transparan, dan efisien.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <a 
              href="/apk/cashin.apk" 
              download="cashin.apk"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold shadow-lg shadow-emerald-800/10 hover:shadow-emerald-800/20 active:scale-98 transition-all duration-200"
            >
              <Download :size="18" />
              <span>Unduh Aplikasi (APK)</span>
            </a>
            
            <a 
              href="#panduan" 
              class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold shadow-sm transition-all"
            >
              <span>Petunjuk Instalasi</span>
              <ArrowRight :size="15" />
            </a>
          </div>

          <!-- Alert Note -->
          <div class="flex items-start gap-3 bg-amber-50/70 border border-amber-100/80 rounded-2xl p-4 max-w-xl mx-auto lg:mx-0">
            <CircleAlert :size="18" class="text-amber-600 shrink-0 mt-0.5" />
            <div class="text-left text-xs text-amber-800 leading-relaxed font-semibold">
              <span class="font-bold">Informasi Android:</span> Aplikasi ini disebarkan secara mandiri (format file APK) untuk kebutuhan internal warga Dusun Menggah, bukan melalui Google Play Store. File ini 100% aman dan bebas virus.
            </div>
          </div>
        </div>

        <!-- Simulated Smartphone Mockup Showcase -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="relative">
            <!-- Background Glow Effect behind phone -->
            <div class="absolute -inset-4 bg-gradient-to-tr from-emerald-400 to-green-300 rounded-[3rem] opacity-25 blur-2xl -z-10"></div>
            
            <!-- Smartphone frame mockup -->
            <div class="w-[290px] h-[580px] bg-slate-900 rounded-[2.5rem] p-3.5 shadow-2xl border-[4px] border-slate-800 relative flex flex-col justify-between overflow-hidden select-none">
              
              <!-- Camera Notch -->
              <div class="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                <div class="w-2.5 h-2.5 bg-slate-800 rounded-full mr-2"></div>
                <div class="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
              </div>

              <!-- Phone Screen Area -->
              <div class="w-full h-full bg-[#F5F8F7] rounded-[2rem] overflow-hidden flex flex-col text-slate-800 relative">
                
                <!-- Custom status bar -->
                <div class="h-6 text-slate-700 text-[8px] flex items-center justify-between px-5 pt-1.5 z-20 shrink-0 font-bold tracking-tight">
                  <span>15:30</span>
                  <div class="flex items-center gap-1">
                    <span>4G</span>
                    <div class="w-3.5 h-2 border border-slate-700/60 rounded-[2px] p-[1px] flex items-center">
                      <div class="h-full w-4/5 bg-slate-700 rounded-[1px]"></div>
                    </div>
                  </div>
                </div>

                <!-- Custom App Welcome Area -->
                <div class="flex items-center gap-2 px-3.5 py-1.5 text-left shrink-0">
                  <!-- Golden Coin/Gear Avatar -->
                  <div class="w-9 h-9 rounded-full bg-white border border-slate-150 shadow-sm flex items-center justify-center shrink-0 relative">
                    <div class="w-7 h-7 rounded-full border border-dashed border-amber-500 flex items-center justify-center relative animate-[spin_24s_linear_infinite]">
                      <div class="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-white font-extrabold text-[8px] shadow-sm select-none">
                        $
                      </div>
                    </div>
                  </div>
                  <div class="leading-tight">
                    <span class="block font-black text-slate-800 text-[11px]">Selamat datang!</span>
                    <span class="block text-[8px] text-slate-400 font-semibold">Kelola finansial Anda dengan mudah</span>
                  </div>
                </div>

                <!-- Custom App Saldo Card -->
                <div class="mx-3.5 bg-gradient-to-r from-[#00A78E] to-[#00C9A7] text-white rounded-[1.2rem] p-3.5 shadow-md flex flex-col justify-between text-left shrink-0">
                  <div class="space-y-0.5">
                    <span class="text-[8px] font-semibold opacity-85 block">Saldo yang Tersedia</span>
                    <span class="text-[17px] font-black tracking-tight block">Rp97.950.000,00</span>
                  </div>
                  <span class="text-[7px] font-bold opacity-75 mt-3.5 block">Cashin Financial Card</span>
                </div>

                <!-- Double Stats Card -->
                <div class="mx-3.5 bg-white border border-slate-200/50 rounded-[1.2rem] p-3 shadow-sm grid grid-cols-2 divide-x divide-slate-100 text-left shrink-0 mt-2.5">
                  <!-- Pengeluaran -->
                  <div class="pr-2 flex flex-col justify-center">
                    <div class="flex items-center gap-1 text-[7.5px] text-slate-400 font-bold">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#FF4D4F]"></span>
                      <span>Pengeluaran</span>
                    </div>
                    <span class="text-[10px] font-black text-[#FF4D4F] mt-1 block">-Rp2.050.000,00</span>
                  </div>
                  <!-- Pemasukan -->
                  <div class="pl-3 flex flex-col justify-center">
                    <div class="flex items-center gap-1 text-[7.5px] text-slate-400 font-bold">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#00A78E]"></span>
                      <span>Pemasukan</span>
                    </div>
                    <span class="text-[10px] font-black text-[#00A78E] mt-1 block">+Rp100.000.000,00</span>
                  </div>
                </div>

                <!-- Transactions Header -->
                <div class="px-4 flex items-center justify-between shrink-0 mt-3">
                  <span class="text-[10.5px] text-slate-800 font-black">Aktivitas Terakhir</span>
                  <button class="text-[#00A78E] hover:text-[#008A75] text-[8.5px] font-extrabold transition-colors">Lihat Semua</button>
                </div>

                <!-- Screen Contents -->
                <div class="px-3.5 space-y-2 overflow-y-auto scrollbar-hide text-left flex-1 min-h-0 pb-16 pt-1">
                  
                  <!-- Transport -->
                  <div class="bg-white rounded-[1.2rem] p-2.5 border border-slate-100/80 shadow-sm flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-[#EBF3FA] flex items-center justify-center shrink-0">
                        <ArrowUpRight :size="13" class="text-[#2B6CB0] transform rotate-45" />
                      </div>
                      <div class="leading-tight">
                        <span class="font-bold text-slate-800 block text-[9.5px]">Transport</span>
                        <span class="text-[8px] text-slate-400 font-semibold block mt-0.5">05 Agu 2026</span>
                      </div>
                    </div>
                    <span class="font-bold text-slate-850 text-[10px]">-Rp2.000.000,00</span>
                  </div>

                  <!-- Food -->
                  <div class="bg-white rounded-[1.2rem] p-2.5 border border-slate-100/80 shadow-sm flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-[#FDF0EE] flex items-center justify-center shrink-0">
                        <ArrowUpRight :size="13" class="text-[#DD6B20] transform rotate-90" />
                      </div>
                      <div class="leading-tight">
                        <span class="font-bold text-slate-800 block text-[9.5px]">Food</span>
                        <span class="text-[8px] text-slate-400 font-semibold block mt-0.5">05 Agu 2026</span>
                      </div>
                    </div>
                    <span class="font-bold text-slate-850 text-[10px]">-Rp50.000,00</span>
                  </div>

                  <!-- Salary -->
                  <div class="bg-white rounded-[1.2rem] p-2.5 border border-slate-100/80 shadow-sm flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-[#EBF7F2] flex items-center justify-center shrink-0">
                        <ArrowUpRight :size="13" class="text-[#319795]" />
                      </div>
                      <div class="leading-tight">
                        <span class="font-bold text-slate-800 block text-[9.5px]">Salary</span>
                        <span class="text-[8px] text-slate-400 font-semibold block mt-0.5">05 Agu 2026</span>
                      </div>
                    </div>
                    <span class="font-bold text-[#00A78E] text-[10px]">+Rp100.000.000,00</span>
                  </div>

                </div>

                <!-- Floating Plus Button (FAB) -->
                <div class="absolute bottom-16 right-4 z-20">
                  <button class="bg-[#00C9A7] text-white rounded-[0.95rem] w-8 h-8 flex items-center justify-center shadow-lg active:scale-95 transition-all">
                    <Plus :size="15" class="stroke-[2.5]" />
                  </button>
                </div>

                <!-- Navigation Bar at bottom of app screen -->
                <div class="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                  <div class="bg-[#00C9A7] rounded-[1.1rem] h-10 px-3.5 flex items-center justify-between text-white shadow-lg">
                    <div class="flex items-center justify-center bg-white/20 px-3 py-1 rounded-[0.6rem] text-white">
                      <Home :size="13" class="stroke-[2.5]" />
                    </div>
                    <div class="flex items-center justify-center py-1 text-white/70 hover:text-white cursor-pointer transition-colors">
                      <TrendingUp :size="13" class="stroke-[2.5]" />
                    </div>
                    <div class="flex items-center justify-center py-1 text-white/70 hover:text-white cursor-pointer transition-colors">
                      <PlusCircle :size="13" class="stroke-[2.5]" />
                    </div>
                    <div class="flex items-center justify-center py-1 text-white/70 hover:text-white cursor-pointer transition-colors">
                      <Settings :size="13" class="stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ================= FEATURES SECTION ================= -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/50">
      <div class="text-center max-w-xl mx-auto space-y-3 mb-12">
        <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block">Fitur Aplikasi</span>
        <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-slate-950">
          Mudah Digunakan, <span class="font-serif italic font-medium">Banyak Manfaatnya</span>
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
          Dirancang khusus untuk memenuhi kebutuhan pencatatan keuangan skala dusun atau kepengurusan organisasi.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="feat in appFeatures" 
          :key="feat.title"
          class="bg-white/80 border border-slate-200/60 p-6 rounded-2.5xl shadow-sm hover:shadow-md hover:border-emerald-250 transition-all duration-300 flex flex-col space-y-4 group"
        >
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
            <component :is="feat.icon" :size="20" class="stroke-[1.75]" />
          </div>
          <h3 class="font-bold text-slate-900 text-base leading-snug">{{ feat.title }}</h3>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ================= INSTALLATION GUIDE SECTION ================= -->
    <section id="panduan" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/50">
      <div class="text-center max-w-xl mx-auto space-y-3 mb-12">
        <span class="text-[10px] uppercase tracking-widest font-black text-emerald-800 block">Panduan Instalasi</span>
        <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-slate-950">
          Cara Menginstal <span class="font-serif italic font-medium">Aplikasi CashIn</span>
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
          Ikuti 4 langkah mudah berikut untuk memasang aplikasi di HP Android Anda.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(step, idx) in installationSteps" 
          :key="step.step"
          class="relative flex flex-col space-y-3 text-left"
        >
          <!-- Line connecting steps (desktop) -->
          <div 
            v-if="idx < installationSteps.length - 1"
            class="hidden lg:block absolute top-6 left-full w-full h-[1px] bg-slate-200 -z-10"
          ></div>
          
          <div class="flex items-center justify-between">
            <div class="text-2xl font-black text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-1 font-serif">
              {{ step.step }}
            </div>
            <CheckCircle2 v-if="idx === 3" :size="24" class="text-emerald-700" />
          </div>
          
          <h3 class="font-bold text-slate-900 text-base leading-snug pt-1">{{ step.title }}</h3>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ================= TECHNICAL INFO & DOWNLOAD FOOTER ================= -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-200/50">
      <div class="bg-[#FDFCFB] border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Info :size="20" class="text-emerald-800" />
          <h3 class="font-serif text-xl sm:text-2xl italic font-medium text-slate-950">Informasi Teknis File</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="info in appInfo" 
            :key="info.label"
            class="flex justify-between py-2 border-b border-slate-100 text-xs sm:text-sm"
          >
            <span class="text-slate-400 font-semibold">{{ info.label }}</span>
            <span class="text-slate-700 font-bold text-right">{{ info.value }}</span>
          </div>
        </div>

        <!-- Download Banner inside Tech info -->
        <div class="bg-gradient-to-r from-emerald-850 to-emerald-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md shadow-emerald-950/10">
          <div class="text-center sm:text-left">
            <h4 class="font-bold text-base">Siap untuk Memulai Pencatatan?</h4>
            <p class="text-emerald-100 text-xs sm:text-sm font-semibold mt-1">Unduh versi terbaru CashIn sekarang secara gratis.</p>
          </div>
          <a 
            href="/apk/cashin.apk" 
            download="cashin.apk"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-emerald-800 font-black rounded-xl shadow-sm text-xs uppercase tracking-wider transition-all"
          >
            <Download :size="14" />
            <span>Unduh APK</span>
          </a>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
