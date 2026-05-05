import { create } from 'zustand'
import { api, getErrorMessage, type ApiResponse } from '@/lib/api'
import type { Job, JobType } from '@/types'

type TabFilter = 'ALL' | JobType

interface JobsState {
  jobs: Job[]
  selectedJob: Job | null
  activeTab: TabFilter
  isLoading: boolean
  error: string | null
}

interface JobsActions {
  fetchJobs: () => Promise<void>
  fetchJob: (identifier: string) => Promise<void>
  setActiveTab: (tab: TabFilter) => void
  clearSelectedJob: () => void
  clearError: () => void
}

export const useJobsStore = create<JobsState & JobsActions>()((set) => ({
  jobs: [],
  selectedJob: null,
  activeTab: 'ALL',
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get<ApiResponse<Job[]>>('/jobs')
      set({ jobs: data.data ?? [], isLoading: false })
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false })
    }
  },

  fetchJob: async (identifier) => {
    set({ isLoading: true, error: null, selectedJob: null })
    try {
      const { data } = await api.get<ApiResponse<Job>>(`/jobs/${identifier}`)
      set({ selectedJob: data.data ?? null, isLoading: false })
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false })
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  clearSelectedJob: () => set({ selectedJob: null }),

  clearError: () => set({ error: null }),
}))
