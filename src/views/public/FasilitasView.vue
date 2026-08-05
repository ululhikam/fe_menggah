<script setup lang="ts">
import { Building2, Heart, GraduationCap, Compass, Plus } from 'lucide-vue-next'
</script>

<template>
  <div class="bg-[#FAF9F6] text-slate-800 min-h-screen font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-green-200/15 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/15 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Floating Pluses -->
    <div class="absolute top-36 left-[8%] text-slate-355 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[45%] right-[10%] text-slate-355 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>

    <!-- ===== HERO SECTION (Split Row Layout) ===== -->
    <section class="max-w-6xl mx-auto px-4 pt-36 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Left Side: Title & Description -->
        <div class="lg:col-span-5 space-y-4">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-[#1B432C] font-sans">
            Fasilitas Penunjang <br />
            <span class="text-[#805030] font-serif italic font-semibold">Kesejahteraan Warga</span>
          </h1>
          <p class="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
            Infrastruktur modern yang dibangun berdampingan dengan alam. Kami menyediakan berbagai fasilitas memadai untuk mendukung kegiatan sosial, ibadah, olahraga, pendidikan, dan kesehatan bagi seluruh warga Dusun Menggah.
          </p>
        </div>

        <!-- Right Side: Hero Image Frame -->
        <div class="lg:col-span-7">
          <div class="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[1.5/1] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-100">
            <img 
              src="/images/historical_jembatan.png" 
              alt="Fasilitas Penunjang Dusun Menggah"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>

    <!-- ===== MAIN CONTENT SECTION (Split Row Grid & 3 Column Cards) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-8 mb-16">
      
      <!-- Row 1: Balai Dusun (Spans 8) & Klinik (Spans 4) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        
        <!-- Left: Balai Dusun Card (Spans 8) -->
        <div class="lg:col-span-8">
          <div class="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-md flex flex-col md:flex-row items-stretch h-full">
            <!-- Image Left -->
            <div class="relative w-full md:w-1/2 min-h-[220px] md:min-h-full overflow-hidden bg-slate-100">
              <img 
                src="/images/nature_spot_ricefields.png" 
                alt="Balai Dusun Interaktif" 
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <!-- Details Right -->
            <div class="p-8 flex flex-col justify-between md:w-1/2">
              <div class="space-y-3">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200/50 text-slate-500">
                  <Building2 :size="16" />
                </div>
                <h3 class="text-slate-900 font-extrabold text-base">Balai Dusun Interaktif</h3>
                <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                  Pusat kegiatan administratif dan musyawarah warga. Dilengkapi dengan ruang pertemuan, perpustakaan desa mini, dan akses Wi-Fi publik berkecepatan tinggi.
                </p>
              </div>
              
              <div class="pt-6">
                <span class="text-emerald-850 hover:text-emerald-700 transition-colors text-xs font-black cursor-pointer">
                  Lihat Jadwal Penggunaan
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Klinik & Posyandu Card (Spans 4) -->
        <div class="lg:col-span-4">
          <div class="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-md flex flex-col h-full justify-between">
            <!-- Image Top -->
            <div class="relative w-full aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-100">
              <img 
                src="/images/historical_carver_hands.png" 
                alt="Klinik Desa & Posyandu" 
                class="w-full h-full object-cover"
              />
            </div>
            <!-- Details Bottom -->
            <div class="p-6 space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100/50">
                  <Heart :size="12" class="fill-rose-50" />
                </div>
                <h4 class="text-slate-900 font-extrabold text-sm sm:text-base leading-none">Klinik Desa &amp; Posyandu</h4>
              </div>
              <p class="text-slate-500 text-xs leading-relaxed font-semibold">
                Pelayanan kesehatan dasar, pemeriksaan kehamilan, dan imunisasi balita yang buka setiap hari kerja dengan tenaga medis profesional.
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Row 2: PAUD, Masjid, & Gelanggang (3 Columns Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Card 1: PAUD -->
        <div class="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-md flex flex-col hover:shadow-xl transition-shadow duration-300">
          <div class="relative w-full aspect-[16/10] overflow-hidden border-b border-slate-100 bg-slate-50">
            <img 
              src="/images/historical_anyaman.png" 
              alt="Pusat Pendidikan PAUD" 
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-6 space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50">
                <GraduationCap :size="12" />
              </div>
              <h4 class="text-slate-900 font-extrabold text-sm sm:text-base leading-none">Pusat Pendidikan PAUD</h4>
            </div>
            <p class="text-slate-500 text-xs leading-relaxed font-semibold">
              Fasilitas pendidikan anak usia dini yang asri, dilengkapi dengan area bermain edukatif yang aman dan berstandar.
            </p>
          </div>
        </div>

        <!-- Card 2: Masjid -->
        <div class="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-md flex flex-col hover:shadow-xl transition-shadow duration-300">
          <div class="relative w-full aspect-[16/10] overflow-hidden border-b border-slate-100 bg-slate-50">
            <img 
              src="/images/misty_mountain_hero.png" 
              alt="Masjid Al-Menggah" 
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-6 space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200/50">
                <Compass :size="12" />
              </div>
              <h4 class="text-slate-900 font-extrabold text-sm sm:text-base leading-none">Masjid Al-Menggah</h4>
            </div>
            <p class="text-slate-500 text-xs leading-relaxed font-semibold">
              Pusat peribadatan utama warga yang luas, bersih, dan sejuk. Menjadi pusat kegiatan keagamaan dan pembinaan spiritual.
            </p>
          </div>
        </div>

        <!-- Card 3: Gelanggang Olahraga -->
        <div class="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-md flex flex-col hover:shadow-xl transition-shadow duration-300">
          <div class="relative w-full aspect-[16/10] overflow-hidden border-b border-slate-100 bg-slate-50">
            <img 
              src="/images/potensi_sungai.png" 
              alt="Gelanggang Olahraga" 
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-6 space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-800 border border-emerald-100/50">
                <Plus :size="12" class="stroke-[2.5]" />
              </div>
              <h4 class="text-slate-900 font-extrabold text-sm sm:text-base leading-none">Gelanggang Olahraga</h4>
            </div>
            <p class="text-slate-500 text-xs leading-relaxed font-semibold">
              Lapangan serbaguna untuk sepak bola, voli, dan bulu tangkis. Tersedia jogging track yang melingkari area hijau desa.
            </p>
          </div>
        </div>

      </div>

    </section>

  </div>
</template>
