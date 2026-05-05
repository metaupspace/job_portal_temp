import axios, { type AxiosError } from 'axios'

// Shape of every backend response (from TransformInterceptor)
export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

// Matches the persist key used in useAuthStore
const AUTH_STORAGE_KEY = 'portal-auth'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach accessToken from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) {
      const { state } = JSON.parse(raw) as { state: { tokens?: { accessToken?: string } } }
      if (state?.tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${state.tokens.accessToken}`
      }
    }
  } catch {
    // localStorage parse failure — proceed without token
  }
  return config
})

// On 401: clear stored token and redirect to /careers
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      window.location.href = '/careers'
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const raw = (err.response?.data as { message?: string | string[] })?.message
    const msg = Array.isArray(raw) ? raw[0] : raw
    return msg ?? err.message
  }
  return 'An unexpected error occurred'
}
