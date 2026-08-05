<script setup lang="ts">
import { Compass, Building2, Leaf, Users, GraduationCap, ArrowRight, Plus } from 'lucide-vue-next'
</script>

<template>
  <div class="bg-[#FAF9F6] text-slate-800 min-h-screen font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800">
    
    <!-- Decorative background glows -->
    <div class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-green-200/15 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/15 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Floating Pluses -->
    <div class="absolute top-36 left-[8%] text-slate-355 pointer-events-none"><Plus :size="20" class="stroke-[1.5]" /></div>
    <div class="absolute top-[45%] right-[10%] text-slate-355 pointer-events-none"><Plus :size="16" class="stroke-[1.5]" /></div>

    <!-- ===== HEADER SECTION (Exact match with large landscape banner & card overlay) ===== -->
    <section class="relative w-full h-[55vh] md:h-[65vh] bg-slate-950 text-white flex items-center justify-center text-center overflow-hidden mb-8">
      <!-- Background Image overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/images/misty_mountain_hero.png" 
          alt="Bentang Alam Dusun" 
          class="w-full h-full object-cover opacity-35 object-center scale-102"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF9F6] to-transparent"></div>
      </div>

      <div class="max-w-3xl mx-auto px-6 relative z-10 pt-12">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-white font-sans mb-4">
          Merajut Harmoni, <span class="text-emerald-300">Membangun Kemandirian</span>
        </h1>
        <p class="text-slate-300 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
          Visi dan misi Dusun Menggah bukan sekadar janji tertulis, melainkan komitmen bersama untuk menjaga kearifan lokal sambil beradaptasi dengan kemajuan zaman demi kesejahteraan setiap warga.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 2: VISI UTAMA (Split Column) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Left: Visi Card (Spans 7) -->
        <div class="lg:col-span-7">
          <div class="bg-white border border-slate-200/50 rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-900/5 flex flex-col justify-center h-full group">
            
            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 border border-emerald-100/50">
              <Compass :size="16" />
            </div>
            
            <span class="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Visi Dusun Menggah</span>
            <h3 class="text-slate-950 font-bold text-xl sm:text-2xl tracking-tight leading-snug mb-4">
              "Terwujudnya Dusun Menggah yang Mandiri, Berbudaya, dan Sejahtera melalui Tata Kelola yang Transparan dan Partisipatif."
            </h3>
          </div>
        </div>

        <!-- Right: Weaver Image Frame (Spans 5) -->
        <div class="lg:col-span-5">
          <div class="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl border border-slate-200/50 bg-slate-100">
            <img 
              src="/images/historical_anyaman.png" 
              alt="Menjaga Tradisi Dusun Menggah"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            <span class="absolute bottom-4 left-5 text-white text-[10px] font-black uppercase tracking-wider bg-black/25 backdrop-blur-sm px-3 py-1 rounded-full">
              © Menjaga Tradisi
            </span>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== SECTION 3: MISI (Langkah Menuju Tujuan) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/40">
      
      <!-- Heading -->
      <div class="text-center mb-12">
        <h2 class="text-2xl sm:text-3xl font-light text-[#1B432C] font-sans tracking-tight">
          Langkah Menuju Tujuan
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed mt-2">
          Empat pilar utama misi kami untuk mewujudkan Dusun Menggah yang lebih baik untuk generasi mendatang.
        </p>
      </div>

      <!-- 4-Card Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Card 1 -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <Building2 :size="18" />
          </div>
          <div>
            <h4 class="text-slate-950 font-extrabold text-sm sm:text-base leading-snug mb-2">Tata Kelola Transparan</h4>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
              Mewujudkan sistem pemerintahan dusun yang bersih, akuntabel, dan mengutamakan pelayanan publik yang prima berbasis musyawarah.
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <Leaf :size="18" />
          </div>
          <div>
            <h4 class="text-slate-955 font-extrabold text-sm sm:text-base leading-snug mb-2">Ekonomi &amp; Lingkungan Berkelanjutan</h4>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
              Meningkatkan perekonomian warga melalui optimalisasi potensi pertanian lokal dan UMKM sambil menjaga kelestarian alam sekitar.
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <Users :size="18" />
          </div>
          <div>
            <h4 class="text-slate-950 font-extrabold text-sm sm:text-base leading-snug mb-2">Penguatan Sosial Budaya</h4>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
              Melestarikan nilai-nilai gotong royong, kesenian tradisional, dan kerukunan antar warga sebagai identitas utama dusun.
            </p>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="bg-white border border-slate-200/50 rounded-[1.8rem] p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200/50">
            <GraduationCap :size="18" />
          </div>
          <div>
            <h4 class="text-slate-950 font-extrabold text-sm sm:text-base leading-snug mb-2">Peningkatan Kualitas SDM</h4>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
              Mendorong akses pendidikan dan kesehatan yang merata serta memfasilitasi pelatihan keterampilan untuk pemuda dan wanita tani.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== SECTION 4: PAMONG DUSUN (Struktur Organisasi bottom split) ===== -->
    <section class="max-w-6xl mx-auto px-4 py-8 mb-16">
      <div class="bg-[#FDFCFB] border border-slate-200/60 rounded-[2.5rem] p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row gap-10 items-center">
        
        <!-- Left: Pamong details -->
        <div class="w-full lg:w-1/2 space-y-4">
          <span class="block text-[9px] text-[#805030] uppercase font-black tracking-widest">
            Struktur Organisasi
          </span>
          
          <h3 class="text-slate-950 font-bold text-2xl font-sans tracking-tight">
            Pamong Dusun
          </h3>
          
          <p class="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed text-justify">
            Dusun Menggah dipimpin oleh individu-individu berdedikasi yang dipilih langsung oleh masyarakat. Kami bekerja secara kolektif untuk memastikan setiap kebijakan berpihak pada kesejahteraan bersama.
          </p>

          <!-- Staff rows list -->
          <div class="space-y-3 pt-2">
            <!-- Row 1 -->
            <div class="flex items-center gap-3 bg-white border border-slate-200/40 p-3 rounded-2xl">
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 border border-emerald-100">
                WS
              </div>
              <div>
                <h5 class="text-xs sm:text-sm font-extrabold text-slate-900 leading-none">Bpk. Wawan Setyawan</h5>
                <span class="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1 block">Kepala Dusun (Kasun)</span>
              </div>
            </div>
            <!-- Row 2 -->
            <div class="flex items-center gap-3 bg-white border border-slate-200/40 p-3 rounded-2xl">
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 border border-emerald-100">
                SR
              </div>
              <div>
                <h5 class="text-xs sm:text-sm font-extrabold text-slate-900 leading-none">Ibu Siti Rahayu</h5>
                <span class="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1 block">Ketua PKK &amp; Pemberdayaan</span>
              </div>
            </div>
          </div>

          <RouterLink
            to="/kepengurusan"
            class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-emerald-850 hover:text-emerald-700 transition-colors pt-4"
          >
            Lihat Struktur Lengkap <ArrowRight :size="12" />
          </RouterLink>
        </div>

        <!-- Right: Village meeting photo placeholder -->
        <div class="w-full lg:w-1/2">
          <div class="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl border border-slate-200/50 bg-slate-100">
            <img 
              src="/images/nature_spot_ricefields.png" 
              alt="Pamong Dusun Menggah"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>

  </div>
</template>
