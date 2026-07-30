import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/models.types'
import { UserRole } from '@/types/enums'
import type { User } from '@supabase/supabase-js'

const mockUsers: Record<string, { user: any, profile: Profile }> = {
  'superadmin@katekan.desa.id': {
    user: { id: 'mock-super-admin-id', email: 'superadmin@katekan.desa.id' },
    profile: {
      id: 'mock-super-admin-id',
      nik: '3310000000000001',
      full_name: 'Supardi (Super Admin KKN)',
      birth_place: 'Klaten',
      birth_date: '1990-01-01',
      gender: 'laki-laki' as any,
      religion: 'islam' as any,
      marital_status: 'kawin' as any,
      education: 'S1',
      occupation: 'PNS',
      address: 'Dusun Menggah RT 01 / RW 01, Katekan, Gantiwarno',
      family_card_id: 'mock-kk-1',
      role: UserRole.SUPER_ADMIN,
      phone: '081234567890',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  },
  'admin@katekan.desa.id': {
    user: { id: 'mock-admin-id', email: 'admin@katekan.desa.id' },
    profile: {
      id: 'mock-admin-id',
      nik: '3310000000000002',
      full_name: 'Sarwono, S.Sos (Kepala Desa)',
      birth_place: 'Klaten',
      birth_date: '1985-05-12',
      gender: 'laki-laki' as any,
      religion: 'islam' as any,
      marital_status: 'kawin' as any,
      education: 'S1',
      occupation: 'Kepala Desa',
      address: 'Dusun Menggah RT 02 / RW 01, Katekan, Gantiwarno',
      family_card_id: 'mock-kk-1',
      role: UserRole.ADMIN,
      phone: '081234567891',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  },
  'warga@katekan.desa.id': {
    user: { id: 'mock-warga-id', email: 'warga@katekan.desa.id' },
    profile: {
      id: 'mock-warga-id',
      nik: '3310000000000003',
      full_name: 'Budi Santoso',
      birth_place: 'Klaten',
      birth_date: '1995-08-21',
      gender: 'laki-laki' as any,
      religion: 'islam' as any,
      marital_status: 'belum_kawin' as any,
      education: 'SMA',
      occupation: 'Buruh',
      address: 'Dusun Menggah RT 03 / RW 01, Katekan, Gantiwarno',
      family_card_id: 'mock-kk-2',
      role: UserRole.WARGA,
      phone: '081234567892',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
}

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

      // Check for mock session first
      const savedMockSession = localStorage.getItem('sip_desa_mock_session')
      if (savedMockSession) {
        const mockSession = JSON.parse(savedMockSession)
        user.value = mockSession.user
        profile.value = mockSession.profile
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        user.value = session.user
        await fetchProfile()
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        // Skip trigger if we have a simulated mock session active
        if (localStorage.getItem('sip_desa_mock_session')) return

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

      // Check for mock credentials first
      const lowercaseEmail = email.toLowerCase().trim()
      if (mockUsers[lowercaseEmail]) {
        if (password === 'password123') {
          const mockSession = mockUsers[lowercaseEmail]
          user.value = mockSession.user
          profile.value = mockSession.profile
          localStorage.setItem('sip_desa_mock_session', JSON.stringify(mockSession))
          return
        } else {
          error.value = 'Kata sandi simulasi salah'
          throw new Error('Kata sandi simulasi salah')
        }
      }

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
    localStorage.removeItem('sip_desa_mock_session')
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
