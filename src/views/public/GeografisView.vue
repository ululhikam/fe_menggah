<script setup lang="ts">
import { Compass, MapPin, Plus, Sparkles, Map, ExternalLink } from 'lucide-vue-next'
</script>

<template>
  <div class="bg-[#FAF9F6] text-slate-800 min-h-screen font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-green-200/15 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/15 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Floating Pluses -->
    <div class="absolute top-36 left-[8%] text-slate-355 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[45%] right-[10%] text-slate-355 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>

    <!-- ===== HEADER SECTION (Full Bleed Hero with Floating Card Overlay) ===== -->
    <section class="relative w-full h-[55vh] md:h-[65vh] bg-slate-950 text-white flex items-center justify-center overflow-hidden mb-8">
      <!-- Background Image -->
      <img 
        src="/images/misty_mountain_hero.png" 
        alt="Bentang Alam Dusun" 
        class="absolute inset-0 w-full h-full object-cover scale-102"
      />
      <div class="absolute inset-0 bg-slate-955/20 z-0"></div>
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF9F6] to-transparent z-0"></div>

      <!-- Overlaid Card -->
      <div class="relative z-10 bg-[#FAF9F6]/95 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-8 sm:p-10 max-w-2xl text-center shadow-2xl mx-4">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1B432C] mb-3">
          Letak Geografis Dusun
        </h1>
        <p class="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed text-justify">
          Secara geografis, Dusun Menggah RT 01 RW 02 menempati kawasan yang sangat strategis di wilayah Desa Katekan, Kecamatan Gantiwarno, Kabupaten Klaten, Provinsi Jawa Tengah. Wilayah ini bertindak sebagai titik perbatasan langsung yang menghubungkan Kabupaten Klaten dengan wilayah Kabupaten Gunungkidul. Topografi dusun ini didominasi oleh bentang lahan agraris yang subur dan area persawahan hijau, memberikan nuansa pedesaan yang asri sekaligus mendukung sektor pertanian sebagai urat nadi kehidupan warganya. Letaknya yang berada di jalur perbatasan menjadikan arus mobilitas masyarakat dan pertukaran ekonomi lokal berjalan dengan cukup dinamis.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: MAP & STATS (Split Layout) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        <!-- Left: Map location card (Spans 7) -->
        <div class="lg:col-span-7">
          <div class="bg-white border border-slate-200/50 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between h-full">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-slate-900 font-extrabold text-base flex items-center gap-2">
                  <Map :size="16" class="text-[#1B432C]" /> Peta Lokasi
                </h3>
                <a 
                  href="https://maps.app.goo.gl/x77tpvXD9zAmAUHZ8" 
                  target="_blank" 
                  class="text-slate-400 hover:text-slate-800 transition-colors"
                  title="Buka Google Maps"
                >
                  <ExternalLink :size="16" />
                </a>
              </div>
              <p class="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider mb-5">
                Pemetaan wilayah administratif dusun
              </p>

              <!-- Map Image Frame -->
              <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                <img 
                  src="/images/village_landscape_map.png" 
                  alt="Peta Administratif Dusun Menggah" 
                  class="w-full h-full object-cover"
                />
                
                <!-- Custom Marker Point overlay -->
                <div class="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full bg-[#8C6D58] border-2 border-white flex items-center justify-center shadow-lg text-white">
                    <MapPin :size="14" class="text-white" />
                  </div>
                  <span class="mt-1 bg-white border border-slate-200 text-[8px] font-black uppercase tracking-wider text-slate-800 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                    Pusat Dusun Menggah
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Stats stack (Spans 5) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          
          <!-- Top Card: Luas Wilayah -->
          <div class="bg-white border border-slate-200/50 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between flex-1">
            <div>
              <!-- Mountain icon -->
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 border border-emerald-100/50">
                <Compass :size="16" />
              </div>
              <span class="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Luas Wilayah Total</span>
              <div class="flex items-baseline mt-1 mb-4">
                <span class="text-4xl font-extrabold text-[#1B432C]">95</span>
                <span class="text-slate-500 font-extrabold text-sm ml-1">Ha</span>
              </div>

              <!-- Progress bar details -->
              <div class="space-y-3 text-xs sm:text-sm font-semibold">
                <!-- Pertanian -->
                <div>
                  <div class="flex justify-between text-slate-500 mb-1">
                    <span>Pertanian</span>
                    <span>65%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-[#1B432C]" style="width: 65%"></div>
                  </div>
                </div>
                <!-- Pemukiman -->
                <div>
                  <div class="flex justify-between text-slate-500 mb-1">
                    <span>Pemukiman</span>
                    <span>20%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-[#8C6D58]" style="width: 20%"></div>
                  </div>
                </div>
                <!-- Lainnya -->
                <div>
                  <div class="flex justify-between text-slate-500 mb-1">
                    <span>Lainnya &amp; Mitigasi</span>
                    <span>15%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-slate-400" style="width: 15%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Card: Ketinggian & Climate -->
          <div class="bg-white border border-slate-200/50 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between flex-1">
            <div>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 border border-emerald-100/50">
                <Sparkles :size="16" />
              </div>
              <span class="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Ketinggian Rata-rata</span>
              <div class="flex items-baseline mt-1 mb-5">
                <span class="text-3xl font-extrabold text-[#1B432C]">55</span>
                <span class="text-slate-500 font-extrabold text-xs ml-1">mdpl (Dataran Rendah)</span>
              </div>

              <!-- Climate grid -->
              <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs sm:text-sm font-semibold">
                <div>
                  <span class="block text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Suhu Rata-rata</span>
                  <span class="block text-slate-800 font-black mt-0.5">24 - 32°C</span>
                </div>
                <div>
                  <span class="block text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Curah Hujan</span>
                  <span class="block text-slate-800 font-black mt-0.5">Sedang - Tinggi</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ===== SECTION 3: BATAS WILAYAH ===== -->
    <section class="max-w-6xl mx-auto px-4 py-12 border-t border-slate-200/40">
      
      <!-- Heading -->
      <div class="text-center mb-12">
        <h2 class="text-2xl sm:text-3xl font-light text-[#1B432C] font-sans tracking-tight">
          Batas Wilayah
        </h2>
      </div>

      <!-- Boundaries Grid Cards (Utara, Timur, Selatan, Barat) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Utara -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
          <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center mb-4 border border-slate-200/50">
            U
          </div>
          <h4 class="text-slate-900 font-extrabold text-sm mb-2">Utara</h4>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
            Berbatasan langsung dengan aliran Sungai Avur Sangiran, membatasi wilayah dengan Desa Katekan Utara.
          </p>
        </div>

        <!-- Timur -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
          <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center mb-4 border border-slate-200/50">
            T
          </div>
          <h4 class="text-slate-900 font-extrabold text-sm mb-2">Timur</h4>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
            Area persawahan subur dan jalan lingkar dusun, membatasi wilayah dengan Dusun Cangkring.
          </p>
        </div>

        <!-- Selatan -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
          <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center mb-4 border border-slate-200/50">
            S
          </div>
          <h4 class="text-slate-900 font-extrabold text-sm mb-2">Selatan</h4>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
            Jalan Kabupaten dan hamparan sawah milik penduduk, berbatasan dengan Dusun Ngrowo.
          </p>
        </div>

        <!-- Barat -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
          <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center mb-4 border border-slate-200/50">
            B
          </div>
          <h4 class="text-slate-900 font-extrabold text-sm mb-2">Barat</h4>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
            Kawasan pemukiman warga dan batas dusun tetangga, berbatasan dengan Desa Sekarjati.
          </p>
        </div>

      </div>
    </section>

  </div>
</template>
