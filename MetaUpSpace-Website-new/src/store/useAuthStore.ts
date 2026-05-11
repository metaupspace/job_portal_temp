import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, getErrorMessage, type ApiResponse } from '@/lib/api'
import type {
  AuthStep,
  AuthTokens,
  ApplicantProfile,
  UpdateApplicantPayload,
} from '@/types'

interface AuthState {
  step: AuthStep
  email: string | null
  tokens: AuthTokens
  profile: ApplicantProfile | null
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  requestOtp: (email: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  fetchProfile: () => Promise<void>
  updateProfile: (payload: UpdateApplicantPayload) => Promise<boolean>
  clearError: () => void
  logout: () => void
}

const initialState: AuthState = {
  step: 'idle',
  email: null,
  tokens: {},
  profile: null,
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
          const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
            '/applicants/verify-otp',
            { email, otp },
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

      updateProfile: async (payload) => {
        const { tokens } = get()
        if (!tokens.accessToken) return false
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.patch<ApiResponse<ApplicantProfile>>(
            '/applicants/me',
            payload,
          )
          set({ profile: data.data, isLoading: false })
          return true
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
          return false
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
      partialize: (state) => ({
        tokens: { accessToken: state.tokens.accessToken },
        step: state.tokens.accessToken ? state.step : 'idle',
        email: state.email,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.tokens?.accessToken) {
          state.step = 'authenticated'
        }
      },
    },
  ),
)
