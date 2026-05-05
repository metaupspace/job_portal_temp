import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, getErrorMessage, type ApiResponse } from '@/lib/api'
import type {
  AuthStep,
  AuthTokens,
  TotpSetupResponse,
  ApplicantProfile,
} from '@/types'

interface AuthState {
  step: AuthStep
  email: string | null
  tokens: AuthTokens
  profile: ApplicantProfile | null
  totpSetup: TotpSetupResponse | null
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  requestOtp: (email: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  setupTotp: () => Promise<void>
  confirmTotp: (code: string) => Promise<void>
  verifyTotp: (code: string) => Promise<void>
  fetchProfile: () => Promise<void>
  clearError: () => void
  logout: () => void
}

const initialState: AuthState = {
  step: 'idle',
  email: null,
  tokens: {},
  profile: null,
  totpSetup: null,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      requestOtp: async (email) => {
        set({ isLoading: true, error: null })
        try {
          await api.post<ApiResponse<null>>('/applicants/request-otp', { email })
          set({ step: 'otp-sent', email, isLoading: false })
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post<
            ApiResponse<{ setupToken?: string; sessionToken?: string }>
          >('/applicants/verify-otp', { email, otp })

          if (!data.data.setupToken && !data.data.sessionToken) {
            set({ error: 'Unexpected server response. Please try again.', isLoading: false })
            return
          }

          if (data.data.setupToken) {
            set({
              step: 'totp-enroll',
              tokens: { setupToken: data.data.setupToken },
              isLoading: false,
            })
          } else {
            set({
              step: 'totp-verify',
              tokens: { sessionToken: data.data.sessionToken },
              isLoading: false,
            })
          }
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
        }
      },

      setupTotp: async () => {
        const { tokens } = get()
        if (!tokens.setupToken) {
          set({ error: 'Session expired. Please sign in again.' })
          return
        }
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post<ApiResponse<TotpSetupResponse>>(
            '/applicants/setup-totp',
            {},
            { headers: { Authorization: `Bearer ${tokens.setupToken}` } },
          )
          set({ step: 'totp-setup', totpSetup: data.data, isLoading: false })
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
        }
      },

      confirmTotp: async (code) => {
        const { tokens } = get()
        if (!tokens.setupToken) {
          set({ error: 'Session expired. Please sign in again.' })
          return
        }
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
            '/applicants/confirm-totp',
            { code },
            { headers: { Authorization: `Bearer ${tokens.setupToken}` } },
          )
          set({
            step: 'authenticated',
            tokens: { accessToken: data.data.accessToken },
            totpSetup: null,
            isLoading: false,
          })
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
        }
      },

      verifyTotp: async (code) => {
        const { tokens } = get()
        if (!tokens.sessionToken) {
          set({ error: 'Session expired. Please sign in again.' })
          return
        }
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
            '/applicants/verify-totp',
            { code },
            { headers: { Authorization: `Bearer ${tokens.sessionToken}` } },
          )
          set({
            step: 'authenticated',
            tokens: { accessToken: data.data.accessToken },
            isLoading: false,
          })
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
        }
      },

      fetchProfile: async () => {
        const { tokens } = get()
        if (!tokens.accessToken) return
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.get<ApiResponse<ApplicantProfile>>('/applicants/me')
          set({ profile: data.data, isLoading: false })
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
        }
      },

      clearError: () => set({ error: null }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('portal-auth')
        }
        set({ ...initialState })
      },
    }),
    {
      name: 'portal-auth',
      // Only persist the accessToken — all other state is ephemeral
      partialize: (state) => ({
        tokens: { accessToken: state.tokens.accessToken },
      }),
    },
  ),
)
