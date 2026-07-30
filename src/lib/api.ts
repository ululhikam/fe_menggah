import axios from 'axios'
import { supabase } from './supabase'

/**
 * Pre-configured Axios instance for API calls.
 * Automatically attaches Supabase JWT token to requests.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach auth token
api.interceptors.request.use(async (config) => {
  // Check for mock session first
  const mockSessionStr = localStorage.getItem('sip_desa_mock_session')
  if (mockSessionStr) {
    const mockSession = JSON.parse(mockSessionStr)
    if (mockSession?.user?.id) {
      config.headers.Authorization = `Bearer ${mockSession.user.id}`
      return config
    }
  }

  // Fallback to Supabase session
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Response interceptor: standardize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.error?.message ||
        error.response.data?.message ||
        'Terjadi kesalahan pada server'

      return Promise.reject(new Error(message))
    }
    return Promise.reject(new Error('Tidak dapat terhubung ke server'))
  }
)

export default api
