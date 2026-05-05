# Careers Portal — State & API Integration Design

**Date:** 2026-05-04
**Scope:** Frontend integration with NestJS job portal backend, scoped to `/careers` flow only. `/join-us` (SheetDB) untouched.

---

## Goals

- Fetch live job listings from backend on `/careers`
- "Apply Now" → `/careers/[jobId]/apply` (new page, UI built later)
- Guest application auto-creates applicant account
- Return users: full 2FA login (email OTP → TOTP) → `/dashboard`
- Dashboard: view applications, withdraw — UI built later
- Store + types only in this phase; no new UI components

---

## File Structure

```
MetaUpSpace-Website-new/src/
├── lib/
│   └── api.ts                   # Axios instance + auth interceptors
├── types/
│   ├── enums.ts                 # JobType, Experience, ApplicationStatus, HearAboutUs, FieldType
│   ├── auth.ts                  # AuthStep, AuthTokens, TotpSetupResponse
│   ├── job.ts                   # Job, FieldDefinition
│   ├── application.ts           # Application, CreateApplicationPayload
│   ├── applicant.ts             # ApplicantProfile, UpdateApplicantPayload
│   └── index.ts                 # re-exports all types
└── store/
    ├── index.ts                 # (existing nav store — untouched)
    ├── useAuthStore.ts
    ├── useJobsStore.ts
    └── useApplicationStore.ts
```

---

## API Client (`lib/api.ts`)

- Axios instance, `baseURL = process.env.NEXT_PUBLIC_API_URL`
- Request interceptor: reads `accessToken` from `useAuthStore`, attaches `Authorization: Bearer <token>`
- Response interceptor: 401 → `useAuthStore.logout()`, redirect to `/careers`
- Per-endpoint token override handled in store actions (setupToken / sessionToken passed manually)

### Token routing

| Endpoint | Token |
|---|---|
| `POST /applicants/setup-totp` | `setupToken` |
| `POST /applicants/confirm-totp` | `setupToken` |
| `POST /applicants/verify-totp` | `sessionToken` |
| `GET /applicants/me` + profile routes | `accessToken` (via interceptor) |
| Public routes (jobs, apply) | none |

---

## Types

### `enums.ts`
```typescript
export type JobType = 'TECH' | 'NON_TECH'
export type Experience = 'FRESHER' | '0-1' | '1-3' | '3-5'
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED' | 'WITHDRAWN'
export type HearAboutUs = 'LINKEDIN_POST' | 'LINKEDIN_COMPANY' | 'JOB_PORTAL' | 'WHATSAPP_TELEGRAM' | 'COMPANY_WEBSITE' | 'OTHER'
export type FieldType = 'TEXT' | 'TEXTAREA' | 'SELECT' | 'BOOLEAN' | 'NUMBER'
```

### `auth.ts`
```typescript
export type AuthStep = 'idle' | 'otp-sent' | 'otp-verified' | 'totp-setup' | 'authenticated'
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

### `job.ts`
```typescript
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

### `application.ts`
```typescript
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
  // tech-only
  githubId?: string
  portfolioLink?: string
  technologiesKnown?: string
  hardestProblem?: string
  // dynamic custom fields
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

### `applicant.ts`
```typescript
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

---

## Stores

### `useAuthStore`

**State:**
- `step: AuthStep` — current position in 2FA flow
- `email: string | null` — email being authenticated
- `tokens: AuthTokens` — holds whichever token is active at each step
- `profile: ApplicantProfile | null`
- `totpSetup: TotpSetupResponse | null` — QR + secret during TOTP enrollment
- `isLoading: boolean`
- `error: string | null`

**Actions:**
- `requestOtp(email)` → `POST /applicants/request-otp` → step = `'otp-sent'`
- `verifyOtp(email, otp)` → `POST /applicants/verify-otp` → step = `'otp-verified'`, sets `setupToken` (new user) OR `sessionToken` (returning)
- `setupTotp()` → `POST /applicants/setup-totp` (setupToken) → step = `'totp-setup'`, sets `totpSetup`
- `confirmTotp(code)` → `POST /applicants/confirm-totp` (setupToken) → step = `'authenticated'`, sets `accessToken`
- `verifyTotp(code)` → `POST /applicants/verify-totp` (sessionToken) → step = `'authenticated'`, sets `accessToken`
- `fetchProfile()` → `GET /applicants/me` → sets `profile`
- `logout()` → clears all tokens, profile, step = `'idle'`

**Persistence:** `accessToken` persisted to `localStorage` via `zustand/middleware` `persist`.

---

### `useJobsStore`

**State:**
- `jobs: Job[]`
- `selectedJob: Job | null`
- `activeTab: 'ALL' | JobType`
- `isLoading: boolean`
- `error: string | null`

**Actions:**
- `fetchJobs()` → `GET /jobs` → sets `jobs`
- `fetchJob(identifier)` → `GET /jobs/:identifier` → sets `selectedJob`
- `setActiveTab(tab)` → client-side filter, no API call
- `clearSelectedJob()`

---

### `useApplicationStore`

**State:**
- `formData: Partial<CreateApplicationPayload>`
- `currentStep: number` — 1-based step in multi-step form
- `isSubmitting: boolean`
- `submitError: string | null`
- `submitSuccess: boolean`
- `myApplications: Application[]`
- `isLoadingApplications: boolean`

**Actions:**
- `setFormData(data)` → merges into `formData`
- `setStep(n)` / `nextStep()` / `prevStep()`
- `submitApplication(jobId)` → `POST /applications/:jobId` → `submitSuccess = true` on success
- `fetchMyApplications()` → `GET /applicants/me/applications`
- `withdrawApplication(id)` → `POST /applicants/me/applications/:id/withdraw`
- `checkStatus(email)` → `GET /applications/status`
- `resetForm()` → clears `formData`, `currentStep = 1`, `submitSuccess = false`

---

## Auth Flow Diagram

```
Guest applies:
  fill form → POST /applications/:jobId
  → backend auto-creates applicant
  → account created, application submitted

Return user login:
  enter email → requestOtp()
    → step: otp-sent
  enter OTP → verifyOtp()
    → new user:  step: otp-verified, setupToken set
                 → setupTotp() → step: totp-setup (show QR)
                 → confirmTotp() → step: authenticated, accessToken set
    → returning: step: otp-verified, sessionToken set
                 → verifyTotp() → step: authenticated, accessToken set
  → fetchProfile() → redirect to /dashboard
```

---

## Environment Variables Needed

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Out of Scope (this phase)

- UI components for `/careers/[jobId]/apply`
- `/dashboard` page UI
- Resume upload flow (separate `POST /upload/resume`)
- Admin panel
