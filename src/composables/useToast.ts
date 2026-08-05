import { ref } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
  duration?: number
}

// ─── Global State ─────────────────────────────────────────────────────────────

let _counter = 0
const toasts = ref<Toast[]>([])

// ─── Composable ───────────────────────────────────────────────────────────────

export function useToast() {
  function push(type: ToastType, message: string, duration = 3500) {
    const id = ++_counter
    toasts.value.push({ id, type, message, duration })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  const success = (msg: string, dur?: number) => push('success', msg, dur)
  const error   = (msg: string, dur?: number) => push('error', msg, dur)
  const warning = (msg: string, dur?: number) => push('warning', msg, dur)
  const info    = (msg: string, dur?: number) => push('info', msg, dur)

  return { toasts, push, dismiss, success, error, warning, info }
}
