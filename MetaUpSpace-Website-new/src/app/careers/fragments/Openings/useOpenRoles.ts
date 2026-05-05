'use client'
import { useEffect, useMemo, useState } from 'react'
import { useJobsStore } from '@/store'
import type { Job } from '@/types'

export interface OpenRolesState {
  jobs: Job[]
  allJobs: Job[]
  tabs: string[]
  activeTab: string
  setActiveTab: (tab: string) => void
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useOpenRoles(): OpenRolesState {
  const { jobs: allJobs, fetchJobs, isLoading, error } = useJobsStore()
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tabs = useMemo(
    () => ['All', ...Array.from(new Set(allJobs.map((j) => j.domain)))],
    [allJobs],
  )

  const jobs = useMemo(
    () =>
      activeTab === 'All'
        ? allJobs
        : allJobs.filter((j) => j.domain === activeTab),
    [allJobs, activeTab],
  )

  return {
    jobs,
    allJobs,
    tabs,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    retry: fetchJobs,
  }
}
