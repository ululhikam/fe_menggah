<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
</script>

<template>
  <div class="bg-[#FAF9F6] text-slate-800 min-h-screen font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-green-200/15 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/15 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Floating Pluses -->
    <div class="absolute top-36 left-[8%] text-slate-355 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[45%] right-[10%] text-slate-355 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>

    <!-- ===== HEADER SECTION (Exact match with centered typography) ===== -->
    <section class="px-4 sm:px-6 lg:px-8 pt-32 pb-4 text-center">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-[#1B432C] font-sans max-w-4xl mx-auto mb-4">
        Kekayaan Alam &amp; Karya Tangan Dusun Kami
      </h1>
      <div class="max-w-4xl mx-auto text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed text-justify space-y-4">
        <p>
          Potensi utama yang dimiliki oleh Dusun Menggah bertumpu pada perpaduan antara sektor pertanian dan usaha mikro kecil menengah. Hasil bumi dari persawahan warga menjadi komoditas penyokong ketahanan pangan lokal. Di samping itu, potensi ekonomi dusun ini semakin bersinar dengan keberadaan pelaku usaha kuliner dan pedagang yang aktif menggerakkan ekonomi mikro. Keterlibatan warga dalam mengelola dan mengisi berbagai kegiatan niaga lokal membuktikan bahwa dusun ini memiliki sumber daya manusia yang ulet, adaptif, serta mampu melihat peluang pasar untuk meningkatkan taraf hidup keluarga.
        </p>
      </div>
    </section>

    <!-- ===== CONTENT GRID SECTION (Exact layout match "plek ketiplek") ===== -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        <!-- LEFT COLUMN: Large Vertical Potential Card (Spans 6) -->
        <div class="lg:col-span-6">
          <div class="relative w-full h-[580px] rounded-[2rem] overflow-hidden shadow-xl border border-slate-200/50 flex flex-col justify-end p-8 sm:p-10 group">
            
            <!-- Cover image background -->
            <img 
              src="/images/potensi_padi.png" 
              alt="Padi Organik Nusantara" 
              class="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-103 transition-transform duration-[1.5s] z-0"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>

            <!-- Content -->
            <div class="relative z-20 text-white">
              <span class="inline-block bg-[#1B432C] text-emerald-300 text-[9px] uppercase font-black tracking-widest px-3.5 py-1.5 rounded-full mb-3.5">
                Pertanian Unggulan
              </span>
              
              <h3 class="text-2xl font-bold font-sans tracking-tight mb-2">
                Padi Organik Nusantara
              </h3>
              
              <p class="text-slate-250 text-xs sm:text-sm leading-relaxed font-semibold">
                Lumbung padi desa kami menghasilkan varietas organik premium yang dibudidayakan secara turun-temurun dengan irigasi alami.
              </p>
            </div>

          </div>
        </div>

        <!-- RIGHT COLUMN: Landscape Top Card & Side-by-Side Bottom Cards (Spans 6) -->
        <div class="lg:col-span-6 flex flex-col justify-between">
          
          <!-- Top Row: Landscape Card -->
          <div class="relative w-full h-[270px] rounded-[2rem] overflow-hidden shadow-xl border border-slate-200/50 flex flex-col justify-end p-8 group mb-6">
            
            <img 
              src="/images/potensi_sungai.png" 
              alt="Sungai Bening Ekowisata" 
              class="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-103 transition-transform duration-[1.5s] z-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent z-10"></div>

            <div class="relative z-20 text-white">
              <span class="inline-block bg-[#805030] text-amber-200 text-[9px] uppercase font-black tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                Pariwisata Alam
              </span>
              
              <h3 class="text-xl font-bold font-sans tracking-tight">
                Sungai Bening Ekowisata
              </h3>
            </div>

          </div>

          <!-- Bottom Row: Side-by-Side Cards (2 Columns Grid) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <!-- Left Square Card -->
            <div class="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
              <div class="relative w-full aspect-[4/3] overflow-hidden border-b border-slate-100 bg-slate-50">
                <img 
                  src="/images/potensi_anyaman.png" 
                  alt="Anyaman Bambu" 
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-6">
                <span class="inline-block bg-slate-100 text-slate-500 text-[9px] uppercase font-black px-3 py-1 rounded-full mb-2 tracking-wider">
                  Kriya
                </span>
                <h4 class="text-slate-900 font-extrabold text-sm sm:text-base leading-snug">
                  Anyaman Bambu
                </h4>
              </div>
            </div>

            <!-- Right Square Card -->
            <div class="bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
              <div class="relative w-full aspect-[4/3] overflow-hidden border-b border-slate-100 bg-slate-50">
                <img 
                  src="/images/nature_spot_camp.png" 
                  alt="Kopi Robusta Asli" 
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-6">
                <span class="inline-block bg-slate-100 text-slate-500 text-[9px] uppercase font-black px-3 py-1 rounded-full mb-2 tracking-wider">
                  Kuliner
                </span>
                <h4 class="text-slate-900 font-extrabold text-sm sm:text-base leading-snug">
                  Kopi Robusta Asli
                </h4>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

  </div>
</template>
