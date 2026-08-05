<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineMilestone {
  era: string
  title: string
  description: string
  textColor: string
  badgeBg: string
  badgeBorder: string
  /** 'left' = card on left half; 'right' = card on right half (flex-row-reverse) */
  side: 'left' | 'right'
}

interface GalleryItem {
  src: string
  alt: string
  title: string
  label?: string
  size: 'large' | 'small'
}

// ─── Data ────────────────────────────────────────────────────────────────────

const timelineMilestones: TimelineMilestone[] = [
  {
    era: '1800-an',
    title: 'Babad Alas',
    description:
      'Pembukaan lahan pertama kali oleh sesepuh adat setempat. Pembangunan sistem irigasi sederhana yang menjadi cikal bakal kesuburan pertanian dusun.',
    textColor: 'text-[#2D503C]',
    badgeBg: 'bg-[#E3EDE8]',
    badgeBorder: 'border-emerald-100',
    side: 'left',
  },
  {
    era: '1950',
    title: 'Pembangunan Balai Desa',
    description:
      'Gotong royong masyarakat membangun pusat kegiatan warga yang terbuat dari kayu jati asli, yang strukturnya masih dipertahankan hingga kini.',
    textColor: 'text-[#805030]',
    badgeBg: 'bg-[#FAF0E6]',
    badgeBorder: 'border-amber-100',
    side: 'right',
  },
  {
    era: '2000-an',
    title: 'Transformasi Konveksi & Modernisasi',
    description:
      'Perkembangan industri kreatif konveksi pakaian jadi dan sablon yang dimotori oleh generasi muda karang taruna dusun.',
    textColor: 'text-slate-700',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-200',
    side: 'left',
  },
]

const galleryItems: GalleryItem[] = [
  {
    src: '/images/historical_panen_raya.png',
    alt: 'Tradisi Panen Raya',
    title: 'Tradisi Panen Raya',
    label: 'Sekitar 1960',
    size: 'large',
  },
  {
    src: '/images/historical_jembatan.png',
    alt: 'Pembangunan Jembatan Bambu',
    title: 'Pembangunan Jembatan Bambu',
    size: 'small',
  },
  {
    src: '/images/historical_anyaman.png',
    alt: 'Kerajinan Anyaman Tempo Dulu',
    title: 'Kerajinan Anyaman Tempo Dulu',
    size: 'small',
  },
]
</script>

<template>
  <div
    class="bg-[#FAF9F6] text-slate-800 min-h-screen font-sans overflow-x-hidden relative selection:bg-green-100 selection:text-green-800"
  >
    <!-- Decorative background glows -->
    <div
      class="absolute top-[8%] left-[-150px] w-[300px] h-[300px] bg-green-200/10 rounded-full blur-[90px] pointer-events-none"
      aria-hidden="true"
    />
    <div
      class="absolute top-[40%] right-[-120px] w-[350px] h-[350px] bg-emerald-100/10 rounded-full blur-[100px] pointer-events-none"
      aria-hidden="true"
    />

    <!-- Floating Pluses (decorative) -->
    <div class="absolute top-36 left-[8%] text-slate-300 pointer-events-none" aria-hidden="true">
      <Plus :size="20" class="stroke-[1.5]" />
    </div>
    <div class="absolute top-[45%] right-[10%] text-slate-300 pointer-events-none" aria-hidden="true">
      <Plus :size="16" class="stroke-[1.5]" />
    </div>

    <!-- ===== HERO SECTION ===== -->
    <section
      class="relative w-full h-[55vh] md:h-[65vh] bg-slate-950 text-white flex items-center justify-center text-center overflow-hidden mb-8"
      aria-labelledby="hero-heading"
    >
      <!-- Background Image overlay -->
      <div class="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/misty_mountain_hero.png"
          alt=""
          width="1920"
          height="1080"
          loading="eager"
          fetchpriority="high"
          class="w-full h-full object-cover opacity-35 object-center scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
      </div>

      <div class="max-w-3xl mx-auto px-6 relative z-10 pt-12">
        <h1
          id="hero-heading"
          class="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none mb-4 font-sans text-white"
        >
          Sejarah <span class="font-serif italic font-medium text-emerald-300">Dusun Menggah</span>
        </h1>

        <p class="text-xs sm:text-sm text-slate-300 font-semibold max-w-xl mx-auto leading-relaxed">
          Menelusuri akar tradisi dan kisah perjalanan panjang yang membentuk harmoni kehidupan masyarakat kami hari ini.
        </p>
      </div>
    </section>

    <!-- ===== SECTION 1: ASAL USUL DUSUN ===== -->
    <section class="max-w-6xl mx-auto px-4 py-16" aria-labelledby="asal-usul-heading">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">

        <!-- Left: Photo frame -->
        <div class="md:col-span-5 flex justify-center">
          <div class="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/50 aspect-[4/5] bg-slate-100">
            <img
              src="/images/historical_carver_hands.png"
              alt="Tangan pengrajin, gambaran asal usul Dusun Menggah"
              width="400"
              height="500"
              loading="lazy"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Right: Text Content -->
        <div class="md:col-span-7 space-y-4">
          <h2
            id="asal-usul-heading"
            class="text-2xl sm:text-3xl font-light text-[#2C2015] font-sans tracking-tight"
          >
            Asal Usul Dusun
          </h2>
          <!-- Horizontal Accent Line -->
          <div class="w-12 h-0.5 bg-[#8C6D58] my-3" aria-hidden="true" />

          <div class="space-y-4 text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold text-justify">
            <p>
              Menurut cerita yang diwariskan turun-temurun dari para sesepuh, Dusun Menggah pertama kali dibuka pada awal abad ke-19 oleh sekelompok pengembara yang mencari lahan sawah subur. Dipimpin oleh sesepuh adat setempat, mereka menemukan sebuah lembah hijau yang dialiri oleh sungai jernih dan memutuskan untuk menetap.
            </p>
            <p>
              Nama "Menggah" sendiri diambil dari kata Jawa kuno yang menggambarkan kontur aliran air yang tenang dan menyejukkan. Harmoni hubungan gotong royong antar manusia dan alam ini menjadi filosofi dasar yang terus kami pegang teguh hingga kini.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== SECTION 2: TIMELINE ===== -->
    <section
      class="bg-[#FAF9F6] py-16 border-t border-slate-200/40"
      aria-labelledby="timeline-heading"
    >
      <div class="max-w-6xl mx-auto px-4 relative">

        <!-- Heading -->
        <div class="text-center mb-16">
          <h2
            id="timeline-heading"
            class="text-2xl sm:text-3xl font-light text-[#2C2015] font-sans tracking-tight"
          >
            Garis Waktu Perkembangan
          </h2>
          <p class="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed mt-2">
            Peristiwa-peristiwa penting yang menjadi tonggak sejarah pembangunan dan pelestarian budaya di dusun kami.
          </p>
        </div>

        <!-- Vertical timeline line -->
        <div
          class="absolute left-4 md:left-1/2 top-32 bottom-8 w-px bg-slate-300 -translate-x-1/2 z-0"
          aria-hidden="true"
        />

        <!-- Timeline items (data-driven) -->
        <div class="space-y-12 relative z-10">
          <div
            v-for="(milestone, index) in timelineMilestones"
            :key="index"
            class="flex flex-col items-start"
            :class="milestone.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'"
          >
            <!-- Card column -->
            <div
              class="w-full md:w-1/2 pl-10 md:pl-0"
              :class="milestone.side === 'left' ? 'pr-0 md:pr-12' : 'md:pl-12'"
            >
              <article class="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all duration-300 relative">
                <!-- Timeline dot -->
                <div
                  class="absolute top-8 w-3 h-3 rounded-full bg-[#8C6D58] border-4 border-[#FAF9F6] box-content"
                  :class="
                    milestone.side === 'left'
                      ? 'left-[-30px] md:left-auto md:right-[-52px]'
                      : 'left-[-30px] md:left-[-52px]'
                  "
                  aria-hidden="true"
                />

                <span
                  class="inline-block text-[10px] uppercase font-black px-3.5 py-1 rounded-full mb-3 tracking-widest border"
                  :class="[milestone.textColor, milestone.badgeBg, milestone.badgeBorder]"
                >
                  {{ milestone.era }}
                </span>

                <h3 class="text-slate-900 font-extrabold text-sm sm:text-base leading-snug mb-2">
                  {{ milestone.title }}
                </h3>

                <p class="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed text-justify">
                  {{ milestone.description }}
                </p>
              </article>
            </div>

            <!-- Spacer column (desktop) -->
            <div class="hidden md:block w-1/2" aria-hidden="true" />
          </div>
        </div>

      </div>
    </section>

    <!-- ===== SECTION 3: GALERI KENANGAN ===== -->
    <section
      class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200/40"
      aria-labelledby="galeri-heading"
    >
      <!-- Heading -->
      <div class="mb-10">
        <h2
          id="galeri-heading"
          class="text-2xl sm:text-3xl font-light text-[#2C2015] font-sans tracking-tight"
        >
          Galeri Kenangan
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed mt-1">
          Kumpulan arsip visual merekam potret kehidupan dusun di masa lampau.
        </p>
      </div>

      <!-- Photo Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        <!-- Large vertical card (first item) -->
        <figure
          class="relative w-full rounded-[2rem] overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[4/5] bg-slate-100 group border border-slate-200/20"
        >
          <img
            :src="galleryItems[0].src"
            :alt="galleryItems[0].alt"
            width="800"
            height="1000"
            loading="lazy"
            class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" aria-hidden="true" />
          <figcaption class="absolute bottom-6 left-6 right-6 text-white">
            <span v-if="galleryItems[0].label" class="block text-[10px] font-black uppercase tracking-wider text-emerald-300 mb-1">
              {{ galleryItems[0].label }}
            </span>
            <h3 class="text-lg font-bold">{{ galleryItems[0].title }}</h3>
          </figcaption>
        </figure>

        <!-- Stack of two small cards (items 1 & 2) -->
        <div class="space-y-6">
          <figure
            v-for="item in galleryItems.slice(1)"
            :key="item.src"
            class="relative w-full rounded-[2rem] overflow-hidden shadow-xl aspect-[16/10] bg-slate-100 group border border-slate-200/20"
          >
            <img
              :src="item.src"
              :alt="item.alt"
              width="800"
              height="500"
              loading="lazy"
              class="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" aria-hidden="true" />
            <figcaption class="absolute bottom-5 left-5 right-5 text-white">
              <h3 class="text-base font-bold">{{ item.title }}</h3>
            </figcaption>
          </figure>
        </div>

      </div>
    </section>

  </div>
</template>
