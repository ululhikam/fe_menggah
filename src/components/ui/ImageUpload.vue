<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

// ─── Props ────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  /** Nilai URL gambar saat ini (v-model) */
  modelValue?: string
  /** Bucket Supabase Storage yang digunakan */
  bucket?: string
  /** Subfolder path di dalam bucket */
  folder?: string
  /** Teks placeholder area drop */
  placeholder?: string
  /** Batas ukuran file (bytes). Default 5 MB */
  maxSize?: number
  /** Format yang diterima */
  accept?: string
}>(), {
  bucket: 'media',
  folder: 'uploads',
  placeholder: 'Klik atau seret gambar ke sini',
  maxSize: 5 * 1024 * 1024,
  accept: 'image/jpeg,image/png,image/webp,image/gif',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  uploaded: [url: string]
  error: [message: string]
}>()

// ─── State ────────────────────────────────────────────────────────────────────

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading  = ref(false)
const progress   = ref(0)
const errorMsg   = ref('')
const justDone   = ref(false)

const preview = computed(() => props.modelValue || '')

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── Upload Logic ─────────────────────────────────────────────────────────────

async function handleFiles(files: FileList | null) {
  errorMsg.value = ''
  if (!files || files.length === 0) return

  const file = files[0]

  // Validasi tipe
  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'File harus berupa gambar.'
    return
  }

  // Validasi ukuran
  if (file.size > props.maxSize) {
    errorMsg.value = `Ukuran file maksimal ${formatBytes(props.maxSize)}.`
    return
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${props.folder}/${Date.now()}-${sanitizeFilename(file.name.replace(`.${ext}`, ''))}.${ext}`

  uploading.value = true
  progress.value = 0

  // Simulate progress (Supabase tidak support streaming progress, jadi fake progress)
  const progressInterval = setInterval(() => {
    if (progress.value < 85) progress.value += Math.random() * 15
  }, 200)

  try {
    const { data, error } = await supabase.storage
      .from(props.bucket)
      .upload(filename, file, { upsert: true, contentType: file.type })

    clearInterval(progressInterval)

    if (error) throw error

    progress.value = 100
    justDone.value = true
    setTimeout(() => { justDone.value = false; progress.value = 0 }, 2000)

    // Ambil public URL
    const { data: urlData } = supabase.storage.from(props.bucket).getPublicUrl(data.path)
    const publicUrl = urlData.publicUrl

    emit('update:modelValue', publicUrl)
    emit('uploaded', publicUrl)
  } catch (err: any) {
    clearInterval(progressInterval)
    progress.value = 0
    const msg = err?.message || 'Gagal mengunggah gambar.'
    errorMsg.value = msg
    emit('error', msg)
  } finally {
    uploading.value = false
    // Reset file input agar bisa memilih file yang sama lagi
    if (fileInput.value) fileInput.value.value = ''
  }
}

function onFileChange(e: Event) {
  handleFiles((e.target as HTMLInputElement).files)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  handleFiles(e.dataTransfer?.files ?? null)
}

function clearImage() {
  emit('update:modelValue', '')
  errorMsg.value = ''
}
</script>

<template>
  <div class="space-y-2">

    <!-- Preview (jika ada gambar) -->
    <div v-if="preview" class="relative group w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
      <img
        :src="preview"
        alt="Preview gambar"
        class="w-full h-48 object-cover"
        loading="lazy"
      />
      <!-- Overlay hapus -->
      <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          type="button"
          @click="clearImage"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold shadow-lg"
        >
          <X :size="13" /> Ganti Gambar
        </button>
      </div>
      <!-- URL bawah -->
      <div class="px-3 py-2 bg-white border-t border-slate-100">
        <p class="text-[10px] font-mono text-slate-400 truncate">{{ preview }}</p>
      </div>
    </div>

    <!-- Drop Area (jika belum ada gambar) -->
    <div
      v-else
      class="relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer"
      :class="[
        isDragging
          ? 'border-green-400 bg-green-50/60 scale-[1.01]'
          : 'border-slate-200 bg-slate-50 hover:border-green-300 hover:bg-green-50/30',
        uploading ? 'pointer-events-none' : '',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="!uploading && fileInput?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="hidden"
        @change="onFileChange"
      />

      <div class="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center select-none">
        <!-- Icon state -->
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
          :class="uploading ? 'bg-green-100' : isDragging ? 'bg-green-100' : 'bg-slate-100'"
        >
          <Loader2 v-if="uploading" :size="22" class="text-green-500 animate-spin" />
          <CheckCircle2 v-else-if="justDone" :size="22" class="text-green-500" />
          <Upload v-else-if="isDragging" :size="22" class="text-green-600" />
          <ImageIcon v-else :size="22" class="text-slate-400" />
        </div>

        <!-- Text -->
        <div>
          <p class="text-sm font-semibold text-slate-700">
            <span v-if="uploading">Mengunggah... {{ Math.round(progress) }}%</span>
            <span v-else-if="justDone" class="text-green-600">Berhasil diunggah!</span>
            <span v-else>{{ placeholder }}</span>
          </p>
          <p v-if="!uploading && !justDone" class="text-xs text-slate-400 mt-0.5">
            JPG, PNG, WebP — maks. {{ formatBytes(maxSize) }}
          </p>
        </div>

        <!-- Progress bar -->
        <div v-if="uploading" class="w-full max-w-[180px] h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 rounded-full transition-all duration-200"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Atau paste URL manual -->
    <div class="flex items-center gap-2">
      <div class="flex-1 h-px bg-slate-100" />
      <span class="text-[10px] text-slate-400 font-medium">atau masukkan URL langsung</span>
      <div class="flex-1 h-px bg-slate-100" />
    </div>
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="url"
      placeholder="https://..."
      class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-colors"
    />

    <!-- Error -->
    <p v-if="errorMsg" class="text-xs text-red-500 font-semibold flex items-center gap-1">
      <span>⚠</span> {{ errorMsg }}
    </p>
  </div>
</template>
