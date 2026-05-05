import { create } from 'zustand'
import { api, getErrorMessage, type ApiResponse } from '@/lib/api'
import type { Application, CreateApplicationPayload } from '@/types'

interface ApplicationState {
  formData: Partial<CreateApplicationPayload>
  currentStep: number
  isSubmitting: boolean
  submitError: string | null
  submitSuccess: boolean
  myApplications: Application[]
  isLoadingApplications: boolean
  applicationsError: string | null
}

interface ApplicationActions {
  setFormData: (data: Partial<CreateApplicationPayload>) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  submitApplication: (jobId: string) => Promise<void>
  fetchMyApplications: () => Promise<void>
  withdrawApplication: (applicationId: string) => Promise<void>
  checkStatus: (email: string) => Promise<Application[]>
  resetForm: () => void
  clearSubmitError: () => void
}

const initialState: ApplicationState = {
  formData: {},
  currentStep: 1,
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
  myApplications: [],
  isLoadingApplications: false,
  applicationsError: null,
}

export const useApplicationStore = create<ApplicationState & ApplicationActions>()(
  (set, get) => ({
    ...initialState,

    setFormData: (data) =>
      set((state) => ({ formData: { ...state.formData, ...data } })),

    setStep: (step) => set({ currentStep: step }),

    nextStep: () =>
      set((state) => ({ currentStep: state.currentStep + 1 })),

    prevStep: () =>
      set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

    submitApplication: async (jobId) => {
      const { formData } = get()
      set({ isSubmitting: true, submitError: null, submitSuccess: false })
      try {
        await api.post<ApiResponse<Application>>(
          `/applications/${jobId}`,
          formData,
        )
        set({ isSubmitting: false, submitSuccess: true })
      } catch (err) {
        set({ submitError: getErrorMessage(err), isSubmitting: false })
      }
    },

    fetchMyApplications: async () => {
      set({ isLoadingApplications: true, applicationsError: null })
      try {
        const { data } = await api.get<ApiResponse<Application[]>>(
          '/applicants/me/applications',
        )
        set({ myApplications: data.data ?? [], isLoadingApplications: false })
      } catch (err) {
        set({
          applicationsError: getErrorMessage(err),
          isLoadingApplications: false,
        })
      }
    },

    withdrawApplication: async (applicationId) => {
      set({ applicationsError: null })
      try {
        await api.post(`/applicants/me/applications/${applicationId}/withdraw`)
        await get().fetchMyApplications()
      } catch (err) {
        set({ applicationsError: getErrorMessage(err) })
      }
    },

    checkStatus: async (email) => {
      set({ applicationsError: null })
      try {
        const { data } = await api.get<ApiResponse<Application[]>>(
          '/applications/status',
          { params: { email } },
        )
        return data.data ?? []
      } catch (err) {
        set({ applicationsError: getErrorMessage(err) })
        return []
      }
    },

    resetForm: () =>
      set({
        formData: {},
        currentStep: 1,
        submitSuccess: false,
        submitError: null,
      }),

    clearSubmitError: () => set({ submitError: null }),
  }),
)
