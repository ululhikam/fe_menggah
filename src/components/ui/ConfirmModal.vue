<script setup lang="ts">
import { Trash2, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  /** Tampilkan modal */
  open: boolean
  /** Judul konfirmasi */
  title?: string
  /** Deskripsi detail */
  description?: string
  /** Label tombol konfirmasi */
  confirmLabel?: string
  /** Variant warna tombol konfirmasi */
  variant?: 'danger' | 'warning' | 'primary'
  /** Loading state saat proses hapus berjalan */
  loading?: boolean
}>(), {
  title: 'Hapus Data',
  description: 'Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.',
  confirmLabel: 'Hapus',
  variant: 'danger',
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const variantStyles = {
  danger:  'bg-red-600 hover:bg-red-700 focus:ring-red-500/30',
  warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/30',
  primary: 'bg-green-600 hover:bg-green-700 focus:ring-green-500/30',
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        aria-modal="true"
        role="alertdialog"
        :aria-label="title"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          @click="emit('cancel')"
        />

        <!-- Panel -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[scale-in_0.2s_ease-out]">
          <!-- Close button -->
          <button
            @click="emit('cancel')"
            class="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Batal"
          >
            <X :size="16" />
          </button>

          <!-- Icon -->
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            :class="variant === 'danger' ? 'bg-red-50' : variant === 'warning' ? 'bg-amber-50' : 'bg-green-50'"
          >
            <Trash2
              :size="22"
              :class="variant === 'danger' ? 'text-red-500' : variant === 'warning' ? 'text-amber-500' : 'text-green-600'"
            />
          </div>

          <!-- Title & description -->
          <h2 class="text-base font-black text-slate-900 mb-1">{{ title }}</h2>
          <p class="text-sm text-slate-500 leading-relaxed mb-6">{{ description }}</p>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="emit('cancel')"
              :disabled="loading"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              @click="emit('confirm')"
              :disabled="loading"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all focus:outline-none focus:ring-4 disabled:opacity-60"
              :class="variantStyles[variant]"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Menghapus...
              </span>
              <span v-else>{{ confirmLabel }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
