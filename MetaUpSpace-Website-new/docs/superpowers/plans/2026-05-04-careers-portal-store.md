# Careers Portal Store Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the `/careers` flow to the NestJS backend by building shared TypeScript types, an Axios API client, and three Zustand stores (auth, jobs, applications).

**Architecture:** Three separate Zustand stores own one domain each (auth, jobs, applications). An Axios instance in `lib/api.ts` handles base URL + auth token injection from localStorage. Types in `src/types/` mirror backend schemas and are re-exported from a single index.

**Tech Stack:** Next.js 16 App Router, TypeScript 5 (strict), Zustand 5 + persist middleware, Axios 1.12

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `.env.local` | Create | Backend API base URL |
| `src/types/enums.ts` | Create | All string literal union types matching backend enums |
| `src/types/auth.ts` | Create | AuthStep, AuthTokens, TotpSetupResponse |
| `src/types/job.ts` | Create | FieldDefinition, Job |
| `src/types/application.ts` | Create | CreateApplicationPayload, Application |
| `src/types/applicant.ts` | Create | ApplicantProfile, UpdateApplicantPayload |
| `src/types/index.ts` | Create | Re-exports all types |
| `src/lib/api.ts` | Create | Axios instance, ApiResponse wrapper type, getErrorMessage helper |
| `src/store/useAuthStore.ts` | Create | 2FA auth state machine + actions |
| `src/store/useJobsStore.ts` | Create | Job listings + tab filter |
| `src/store/useApplicationStore.ts` | Create | Multi-step form state + submission + my applications |

Existing `src/store/index.ts` (nav menu): **untouched**.

---

## Task 1: Environment Setup

**Files:**
- Create: `.env.local` (at `MetaUpSpace-Website-new/.env.local`)

- [ ] **Step 1: Create .env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> Note: Add this to `.gitignore` if not already present. For production, set the deployed backend URL.

- [ ] **Step 2: Verify Next.js picks it up**

Start dev server and confirm no env errors:
```bash
cd MetaUpSpace-Website-new
npm run dev
```
Expected: dev server starts on port 3000 (or next available). No "missing env" errors.

- [ ] **Step 3: Commit**

```bash
git add .env.local
git commit -m "chore: add NEXT_PUBLIC_API_URL for backend integration"
```

---

## Task 2: Types — Enums

**Files:**
- Create: `src/types/enums.ts`

- [ ] **Step 1: Create `src/types/enums.ts`**

```typescript
export type JobType = 'TECH' | 'NON_TECH'

export type Experience = 'FRESHER' | '0-1' | '1-3' | '3-5'

export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'HIRED'
  | 'WITHDRAWN'

export type HearAboutUs =
  | 'LINKEDIN_POST'
  | 'LINKEDIN_COMPANY'
  | 'JOB_PORTAL'
  | 'WHATSAPP_TELEGRAM'
  | 'COMPANY_WEBSITE'
  | 'OTHER'

export type FieldType = 'TEXT' | 'TEXTAREA' | 'SELECT' | 'BOOLEAN' | 'NUMBER'
```

- [ ] **Step 2: Type-check**

```bash
cd MetaUpSpace-Website-new
npx tsc --noEmit
```

Expected: 0 errors.

---

## Task 3: Types — Auth + Job

**Files:**
- Create: `src/types/auth.ts`
- Create: `src/types/job.ts`

- [ ] **Step 1: Create `src/types/auth.ts`**

```typescript
export type AuthStep =
  | 'idle'
  | 'otp-sent'
  | 'otp-verified'
  | 'totp-setup'
  | 'authenticated'

export interface AuthTokens {
  setupToken?: string
  sessionToken?: string
  accessToken?: string
}

export interface TotpSetupResponse {
  qrCodeUrl: string
  secret: string
  backupCodes?: string[]
}
```

- [ ] **Step 2: Create `src/types/job.ts`**

```typescript
import type { FieldType, JobType } from './enums'

export interface FieldDefinition {
  fieldId: string
  label: string
  fieldType: FieldType
  required: boolean
  options?: string[]
}

export interface Job {
  _id: string
  title: string
  slug: string
  description: string
  domain: string
  type: JobType
  isActive: boolean
  requirements: string[]
  customFields: FieldDefinition[]
  createdAt: string
  updatedAt: string
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

---

## Task 4: Types — Application + Applicant + Index

**Files:**
- Create: `src/types/application.ts`
- Create: `src/types/applicant.ts`
- Create: `src/types/index.ts`

- [ ] **Step 1: Create `src/types/application.ts`**

```typescript
import type { ApplicationStatus, Experience, HearAboutUs } from './enums'

export interface CreateApplicationPayload {
  fullName: string
  email: string
  contactNumber: string
  whatsappNumber?: string
  currentLocation: string
  linkedinId: string
  qualification: string
  experience: Experience
  comfortableFlexibleShifts: boolean
  lastSalary?: string
  noticePeriod?: string
  referredBy?: string
  hearAboutUs: HearAboutUs
  resumeUrl: string
  whyGoodFit: string
  whyJoinUs: string
  // tech-only fields (conditional on job.type === 'TECH')
  githubId?: string
  portfolioLink?: string
  technologiesKnown?: string
  hardestProblem?: string
  // dynamic custom field responses keyed by fieldId
  customResponses?: Record<string, string | boolean | number>
}

export interface Application extends CreateApplicationPayload {
  _id: string
  jobId: string
  applicantId?: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}
```

- [ ] **Step 2: Create `src/types/applicant.ts`**

```typescript
import type { Experience } from './enums'

export interface ApplicantProfile {
  _id: string
  email: string
  fullName: string
  contactNumber?: string
  whatsappNumber?: string
  currentLocation?: string
  linkedinId?: string
  qualification?: string
  experience?: Experience
  resumeUrl?: string
  totpEnabled: boolean
  mfaEnrolled: boolean
}

export type UpdateApplicantPayload = Partial<
  Omit<ApplicantProfile, '_id' | 'email' | 'totpEnabled' | 'mfaEnrolled'>
>
```

- [ ] **Step 3: Create `src/types/index.ts`**

```typescript
export * from './enums'
export * from './auth'
export * from './job'
export * from './application'
export * from './applicant'
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript types for job portal integration"
```

---

## Task 5: API Client

**Files:**
- Create: `src/lib/api.ts`

The Axios instance reads `accessToken` from `localStorage` (key: `portal-auth`, set by the auth store's persist middleware). This avoids a circular import between `api.ts` and `useAuthStore.ts`.

- [ ] **Step 1: Create `src/lib/api.ts`**

```typescript
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
    const msg = (err.response?.data as { message?: string })?.message
    return msg ?? err.message
  }
  return 'An unexpected error occurred'
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add Axios API client with auth token interceptor"
```

---

## Task 6: Auth Store

**Files:**
- Create: `src/store/useAuthStore.ts`

Implements the full 2FA state machine. `accessToken` is persisted to localStorage under key `portal-auth`. All other state is ephemeral (lost on refresh — user must log in again).

- [ ] **Step 1: Create `src/store/useAuthStore.ts`**

```typescript
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

          if (data.data.setupToken) {
            set({
              step: 'otp-verified',
              tokens: { setupToken: data.data.setupToken },
              isLoading: false,
            })
          } else {
            set({
              step: 'otp-verified',
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
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.get<ApiResponse<ApplicantProfile>>('/applicants/me')
          set({ profile: data.data, isLoading: false })
        } catch (err) {
          set({ error: getErrorMessage(err), isLoading: false })
        }
      },

      clearError: () => set({ error: null }),

      logout: () => set({ ...initialState }),
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/store/useAuthStore.ts
git commit -m "feat: add useAuthStore with full 2FA state machine"
```

---

## Task 7: Jobs Store

**Files:**
- Create: `src/store/useJobsStore.ts`

- [ ] **Step 1: Create `src/store/useJobsStore.ts`**

```typescript
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
      set({ jobs: data.data, isLoading: false })
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false })
    }
  },

  fetchJob: async (identifier) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get<ApiResponse<Job>>(`/jobs/${identifier}`)
      set({ selectedJob: data.data, isLoading: false })
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false })
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  clearSelectedJob: () => set({ selectedJob: null }),

  clearError: () => set({ error: null }),
}))
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/store/useJobsStore.ts
git commit -m "feat: add useJobsStore for job listings"
```

---

## Task 8: Application Store

**Files:**
- Create: `src/store/useApplicationStore.ts`

- [ ] **Step 1: Create `src/store/useApplicationStore.ts`**

```typescript
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
      set({ isSubmitting: true, submitError: null })
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
        set({ myApplications: data.data, isLoadingApplications: false })
      } catch (err) {
        set({
          applicationsError: getErrorMessage(err),
          isLoadingApplications: false,
        })
      }
    },

    withdrawApplication: async (applicationId) => {
      try {
        await api.post(`/applicants/me/applications/${applicationId}/withdraw`)
        // Refresh list after withdrawal
        await get().fetchMyApplications()
      } catch (err) {
        set({ applicationsError: getErrorMessage(err) })
      }
    },

    checkStatus: async (email) => {
      const { data } = await api.get<ApiResponse<Application[]>>(
        '/applications/status',
        { params: { email } },
      )
      return data.data
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/store/useApplicationStore.ts
git commit -m "feat: add useApplicationStore for application form and submissions"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Full type-check**

```bash
cd MetaUpSpace-Website-new
npx tsc --noEmit
```

Expected: 0 errors across all new files.

- [ ] **Step 2: Verify imports resolve correctly**

Check that these imports work without TypeScript errors in a scratch file (then delete it):

```typescript
// src/app/careers/page.tsx — add these imports temporarily to verify
import { useJobsStore } from '@/store/useJobsStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useApplicationStore } from '@/store/useApplicationStore'
import type { Job, Application, ApplicantProfile } from '@/types'
```

- [ ] **Step 3: Dev server smoke test**

```bash
npm run dev
```

Expected: dev server starts, no module resolution errors in terminal.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete job portal store integration (types, api client, stores)"
```

---

## Usage Reference for UI Work (next phase)

```typescript
// Fetch jobs on /careers page mount
const { fetchJobs, jobs, activeTab, setActiveTab } = useJobsStore()
useEffect(() => { fetchJobs() }, [fetchJobs])
const filtered = activeTab === 'ALL' ? jobs : jobs.filter(j => j.type === activeTab)

// Start application on /careers/[jobId]/apply
const { fetchJob, selectedJob } = useJobsStore()
const { setFormData, submitApplication, submitSuccess } = useApplicationStore()

// Auth flow trigger (login modal)
const { step, requestOtp, verifyOtp, setupTotp, confirmTotp, verifyTotp } = useAuthStore()
```

---

## Out of Scope

- UI components for `/careers/[jobId]/apply`
- `/dashboard` page
- Resume upload (`POST /upload/resume`)
- Admin panel
- `/join-us` (SheetDB, untouched)
