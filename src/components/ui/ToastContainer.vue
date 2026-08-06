<script setup lang="ts">
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styleMap = {
  success: {
    bar:  'bg-white border border-green-100 shadow-lg shadow-green-900/5',
    icon: 'text-green-500',
    text: 'text-slate-800',
  },
  error: {
    bar:  'bg-white border border-red-100 shadow-lg shadow-red-900/5',
    icon: 'text-red-500',
    text: 'text-slate-800',
  },
  warning: {
    bar:  'bg-white border border-amber-100 shadow-lg shadow-amber-900/5',
    icon: 'text-amber-500',
    text: 'text-slate-800',
  },
  info: {
    bar:  'bg-white border border-blue-100 shadow-lg shadow-blue-900/5',
    icon: 'text-blue-500',
    text: 'text-slate-800',
  },
}
</script>

<template>
  <!-- Toast Container — bottom-right fixed -->
  <Teleport to="body">
    <div
      class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2.5"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl min-w-[280px] max-w-sm"
          :class="styleMap[toast.type].bar"
          role="alert"
        >
          <!-- Icon -->
          <component
            :is="iconMap[toast.type]"
            :size="18"
            class="shrink-0 mt-0.5"
            :class="styleMap[toast.type].icon"
          />

          <!-- Message -->
          <span
            class="flex-1 text-sm font-semibold leading-snug"
            :class="styleMap[toast.type].text"
          >
            {{ toast.message }}
          </span>

          <!-- Dismiss -->
          <button
            @click="dismiss(toast.id)"
            class="shrink-0 text-slate-300 hover:text-slate-500 transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X :size="15" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
