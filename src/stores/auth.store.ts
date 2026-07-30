import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/models.types'
import { UserRole } from '@/types/enums'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const initialized = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => profile.value?.role || UserRole.WARGA)
  const isAdmin = computed(() =>
    [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userRole.value)
  )
  const isSuperAdmin = computed(() => userRole.value === UserRole.SUPER_ADMIN)
  const displayName = computed(() => profile.value?.full_name || user.value?.email || 'Pengguna')

  // Actions
  async function initialize() {
    try {
      loading.value = true

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        user.value = session.user
        await fetchProfile()
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        user.value = session?.user || null
        if (session?.user) {
          await fetchProfile()
        } else {
          profile.value = null
        }
      })
    } catch (err) {
      console.error('[Auth] Initialization error:', err)
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function fetchProfile() {
    if (!user.value) return

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (fetchError) {
      console.error('[Auth] Profile fetch error:', fetchError)
      return
    }

    profile.value = data as Profile
  }

  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        error.value = loginError.message
        throw loginError
      }
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, metadata: Record<string, string>) {
    try {
      loading.value = true
      error.value = null

      const { error: registerError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (registerError) {
        error.value = registerError.message
        throw registerError
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    profile,
    loading,
    initialized,
    error,
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isSuperAdmin,
    displayName,
    // Actions
    initialize,
    fetchProfile,
    login,
    register,
    logout,
    clearError,
  }
})
