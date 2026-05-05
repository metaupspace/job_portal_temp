# Careers UI Wiring — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the `/careers` OpenRoles fragment to live backend job data and build a functional two-step `/careers/[jobId]/apply` form with 2FA pre-fill.

**Architecture:** Hook-per-feature pattern — `useOpenRoles` owns fetch + tab filter logic, `useApplyForm` owns form state + submission. Fragments are pure UI consuming hooks. Auth state machine in `AuthBanner` drives login/pre-fill flow using the existing `useAuthStore`.

**Tech Stack:** Next.js 16 App Router, React 19, Zustand 5, react-hook-form 7, TypeScript 5 strict, Tailwind CSS v4, existing stores (`useJobsStore`, `useAuthStore`, `useApplicationStore`)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/careers/fragments/Openings/useOpenRoles.ts` | Create | Fetch jobs, derive domain tabs, client-side filter |
| `src/app/careers/fragments/Openings/index.tsx` | Modify | Replace mock data with hook; add loading/error/empty states |
| `src/app/careers/[jobId]/apply/page.tsx` | Create | Async server wrapper, reads params, renders ApplyForm |
| `src/app/careers/[jobId]/apply/AuthBanner.tsx` | Create | Full 2FA login UI driven by AuthStep state machine |
| `src/app/careers/[jobId]/apply/useApplyForm.ts` | Create | react-hook-form, job fetch, profile pre-fill, step navigation, submit |
| `src/app/careers/[jobId]/apply/StepOne.tsx` | Create | Base + tech-only form fields |
| `src/app/careers/[jobId]/apply/StepTwo.tsx` | Create | Dynamic custom fields from job.customFields[] |
| `src/app/careers/[jobId]/apply/ApplyForm.tsx` | Create | Orchestrates AuthBanner + step rendering + success state |

---

## Task 1: useOpenRoles Hook

**Files:**
- Create: `src/app/careers/fragments/Openings/useOpenRoles.ts`

- [ ] **Step 1: Create `src/app/careers/fragments/Openings/useOpenRoles.ts`**

```typescript
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
  }, [fetchJobs])

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
```

- [ ] **Step 2: Type-check**

```bash
cd MetaUpSpace-Website-new
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/fragments/Openings/useOpenRoles.ts
git commit -m "feat: add useOpenRoles hook for live job listings"
```

---

## Task 2: Wire Openings/index.tsx to Real Data

**Files:**
- Modify: `src/app/careers/fragments/Openings/index.tsx`

- [ ] **Step 1: Fully replace `src/app/careers/fragments/Openings/index.tsx`**

```tsx
"use client"
import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Headers from "@/components/header"
import { useOpenRoles } from "./useOpenRoles"
import type { Job } from "@/types"

const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/5 bg-[#0F1115] p-6 animate-pulse">
    <div className="h-3 bg-white/10 rounded mb-3 w-1/3" />
    <div className="h-4 bg-white/10 rounded mb-3 w-2/3" />
    <div className="h-3 bg-white/10 rounded mb-2 w-full" />
    <div className="h-3 bg-white/10 rounded mb-6 w-4/5" />
    <div className="h-10 bg-white/10 rounded-full" />
  </div>
)

const RoleCard = ({ job }: { job: Job }) => (
  <article className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0F1115] p-6 transition-colors duration-300 hover:border-white/10 hover:bg-[#12151A]">
    <p className="mb-3 text-[13px] font-normal text-zinc-400">{job.domain}</p>
    <h3 className="mb-3 text-[17px] font-semibold leading-snug tracking-tight text-white">
      {job.title}
    </h3>
    <p className="mb-6 text-[14px] leading-relaxed text-zinc-400 line-clamp-3">
      {job.description}
    </p>
    <Link
      href={`/careers/${job.slug}/apply`}
      className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#2F6BFF] py-3 text-[14px] font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] transition-transform duration-200 hover:bg-[#3A77FF] active:scale-[0.98]"
    >
      Apply Now
      <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
    </Link>
  </article>
)

// Ambient background dots — kept from original design
const STARS = [
  { top: "4%", left: "52%", size: 6, opacity: 0.95, blur: 0 },
  { top: "8%", left: "78%", size: 8, opacity: 0.55, blur: 6 },
  { top: "18%", left: "94%", size: 4, opacity: 0.8, blur: 0 },
  { top: "26%", left: "6%", size: 10, opacity: 0.4, blur: 8 },
  { top: "34%", left: "88%", size: 3, opacity: 0.9, blur: 0 },
  { top: "46%", left: "2%", size: 5, opacity: 0.6, blur: 2 },
  { top: "62%", left: "97%", size: 9, opacity: 0.45, blur: 8 },
  { top: "72%", left: "10%", size: 4, opacity: 0.7, blur: 0 },
  { top: "84%", left: "60%", size: 6, opacity: 0.5, blur: 4 },
  { top: "92%", left: "30%", size: 3, opacity: 0.8, blur: 0 },
]

export function OpenRoles() {
  const { jobs, tabs, activeTab, setActiveTab, isLoading, error, retry } =
    useOpenRoles()

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-black px-6 font-sans antialiased sm:px-10 lg:px-16">
      {/* Ambient stars */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              filter: s.blur ? `blur(${s.blur}px)` : "none",
            }}
          />
        ))}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <Headers
          label="OPENINGS"
          heading="See all Open roles"
          subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
        />

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "rounded-full px-5 py-2.5 text-[14px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-b from-[#3A77FF] to-[#2256E0] text-white shadow-[0_6px_20px_-6px_rgba(47,107,255,0.7)]"
                    : "border border-white/12 bg-transparent text-white/85 hover:border-white/25 hover:bg-white/5",
                ].join(" ")}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={retry}
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/5"
            >
              Retry
            </button>
          </div>
        )}

        {/* Cards */}
        {!error && (
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : jobs.length === 0
              ? (
                <p className="col-span-full text-center text-white/40 py-12">
                  No open roles right now.
                </p>
              )
              : jobs.map((job) => <RoleCard key={job._id} job={job} />)}
          </div>
        )}
      </div>
    </section>
  )
}

export default OpenRoles
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/fragments/Openings/index.tsx
git commit -m "feat: wire OpenRoles fragment to backend job data"
```

---

## Task 3: Apply Route — Server Wrapper

**Files:**
- Create: `src/app/careers/[jobId]/apply/page.tsx`

- [ ] **Step 1: Create directory and `page.tsx`**

```tsx
import { Suspense } from "react"
import Loader from "@/components/Loader"
import ApplyForm from "./ApplyForm"

interface Props {
  params: Promise<{ jobId: string }>
}

export default async function ApplyPage({ params }: Props) {
  const { jobId } = await params
  return (
    <Suspense fallback={<Loader />}>
      <ApplyForm jobId={jobId} />
    </Suspense>
  )
}
```

- [ ] **Step 2: Commit**

Skip tsc here — `./ApplyForm` doesn't exist until Task 8 and would cause a false failure. Task 9 runs the full type-check.

```bash
git add src/app/careers/[jobId]/apply/page.tsx
git commit -m "feat: add apply page server wrapper"
```

---

## Task 4: AuthBanner Component

**Files:**
- Create: `src/app/careers/[jobId]/apply/AuthBanner.tsx`

Drives the full 2FA login flow. Reads `useAuthStore.step` and renders the appropriate UI for each auth state.

- [ ] **Step 1: Create `src/app/careers/[jobId]/apply/AuthBanner.tsx`**

```tsx
"use client"
import React, { useState } from "react"
import { useAuthStore } from "@/store"

export function AuthBanner() {
  const {
    step,
    email,
    totpSetup,
    isLoading,
    error,
    requestOtp,
    verifyOtp,
    setupTotp,
    confirmTotp,
    verifyTotp,
    clearError,
    logout,
  } = useAuthStore()

  const [emailInput, setEmailInput] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [totpInput, setTotpInput] = useState("")

  if (step === "authenticated") {
    return (
      <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-green-400">
          Logged in as <span className="font-medium">{email}</span> — details pre-filled.
        </p>
        <button
          onClick={logout}
          className="text-xs text-white/50 hover:text-white underline ml-4"
        >
          Log out
        </button>
      </div>
    )
  }

  if (step === "idle") {
    return (
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-sm text-white/70 mb-3">
          Applied before? Log in to pre-fill your details.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            clearError()
            requestOtp(emailInput)
          }}
          className="flex gap-2"
        >
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "Sending…" : "Send OTP"}
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (step === "otp-sent") {
    return (
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-sm text-white/70 mb-3">
          OTP sent to <span className="font-medium text-white">{email}</span>. Enter the 6-digit code:
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            clearError()
            verifyOtp(email!, otpInput)
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            placeholder="123456"
            maxLength={6}
            required
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 tracking-widest"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "Verifying…" : "Verify"}
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (step === "totp-enroll") {
    return (
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-sm text-white/70 mb-3">
          Set up an authenticator app to secure your account.
        </p>
        <button
          onClick={() => { clearError(); setupTotp() }}
          disabled={isLoading}
          className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "Generating…" : "Set up 2FA"}
        </button>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (step === "totp-setup") {
    return (
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-4 space-y-3">
        <p className="text-sm text-white/70">
          Scan this QR code with Google Authenticator, Authy, or similar:
        </p>
        {totpSetup?.qrCodeUrl && (
          <img
            src={totpSetup.qrCodeUrl}
            alt="TOTP QR code"
            width={160}
            height={160}
            className="rounded-lg"
          />
        )}
        {totpSetup?.secret && (
          <p className="text-xs text-white/50">
            Manual key:{" "}
            <code className="bg-white/10 px-2 py-0.5 rounded text-white">
              {totpSetup.secret}
            </code>
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            clearError()
            confirmTotp(totpInput)
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={totpInput}
            onChange={(e) => setTotpInput(e.target.value)}
            placeholder="6-digit code from app"
            maxLength={6}
            required
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 tracking-widest"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "Verifying…" : "Complete Setup"}
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (step === "totp-verify") {
    return (
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-sm text-white/70 mb-3">
          Enter your authenticator code (or backup code):
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            clearError()
            verifyTotp(totpInput)
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={totpInput}
            onChange={(e) => setTotpInput(e.target.value)}
            placeholder="123456 or XXXX-XXXX-XXXX-XXXX"
            maxLength={19}
            required
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "Verifying…" : "Verify"}
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return null
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/[jobId]/apply/AuthBanner.tsx
git commit -m "feat: add AuthBanner with full 2FA login flow"
```

---

## Task 5: useApplyForm Hook

**Files:**
- Create: `src/app/careers/[jobId]/apply/useApplyForm.ts`

- [ ] **Step 1: Create `src/app/careers/[jobId]/apply/useApplyForm.ts`**

```typescript
"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useJobsStore, useAuthStore, useApplicationStore } from "@/store"
import type { CreateApplicationPayload } from "@/types"

const STEP_ONE_FIELDS: Array<keyof CreateApplicationPayload> = [
  "fullName",
  "email",
  "contactNumber",
  "currentLocation",
  "linkedinId",
  "qualification",
  "experience",
  "comfortableFlexibleShifts",
  "hearAboutUs",
  "resumeUrl",
  "whyGoodFit",
  "whyJoinUs",
]

export function useApplyForm(jobId: string) {
  const { selectedJob: job, fetchJob, isLoading: isLoadingJob } = useJobsStore()
  const { step: authStep, tokens, profile, fetchProfile } = useAuthStore()
  const { submitApplication, isSubmitting, submitSuccess, submitError, setFormData } =
    useApplicationStore()

  const [step, setStep] = useState<1 | 2>(1)

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateApplicationPayload>({
    defaultValues: {
      comfortableFlexibleShifts: false,
      customResponses: {},
    },
  })

  // Fetch job on mount
  useEffect(() => {
    fetchJob(jobId)
  }, [jobId, fetchJob])

  // Pre-fill when profile is available at mount time
  useEffect(() => {
    if (profile) {
      reset({
        ...getValues(),
        fullName: profile.fullName ?? "",
        email: profile.email,
        contactNumber: profile.contactNumber ?? "",
        whatsappNumber: profile.whatsappNumber ?? "",
        currentLocation: profile.currentLocation ?? "",
        linkedinId: profile.linkedinId ?? "",
        qualification: profile.qualification ?? "",
        experience: profile.experience,
        resumeUrl: profile.resumeUrl ?? "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  // Fetch profile after mid-page login completes
  useEffect(() => {
    if (authStep === "authenticated" && tokens.accessToken && !profile) {
      fetchProfile()
    }
  }, [authStep, tokens.accessToken, profile, fetchProfile])

  const nextStep = async () => {
    const valid = await trigger(STEP_ONE_FIELDS)
    if (valid) setStep(2)
  }

  const prevStep = () => setStep(1)

  const onSubmit = handleSubmit((values) => {
    if (!job) return
    setFormData(values)
    submitApplication(job._id)
  })

  return {
    job,
    isLoadingJob,
    step,
    register,
    control,
    errors,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    submitSuccess,
    submitError,
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/[jobId]/apply/useApplyForm.ts
git commit -m "feat: add useApplyForm hook with pre-fill and submit logic"
```

---

## Task 6: StepOne Component

**Files:**
- Create: `src/app/careers/[jobId]/apply/StepOne.tsx`

- [ ] **Step 1: Create `src/app/careers/[jobId]/apply/StepOne.tsx`**

```tsx
"use client"
import React from "react"
import { Controller } from "react-hook-form"
import type {
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form"
import CustomSelect from "@/components/form/CustomSelect"
import type { CreateApplicationPayload, Job } from "@/types"

const EXPERIENCE_OPTIONS = [
  { label: "Fresher", value: "FRESHER" },
  { label: "0–1 years", value: "0-1" },
  { label: "1–3 years", value: "1-3" },
  { label: "3–5 years", value: "3-5" },
]

const HEAR_ABOUT_OPTIONS = [
  { label: "LinkedIn Post", value: "LINKEDIN_POST" },
  { label: "LinkedIn Company Page", value: "LINKEDIN_COMPANY" },
  { label: "Job Portal", value: "JOB_PORTAL" },
  { label: "WhatsApp / Telegram", value: "WHATSAPP_TELEGRAM" },
  { label: "Company Website", value: "COMPANY_WEBSITE" },
  { label: "Other", value: "OTHER" },
]

const inputClass =
  "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"

const labelClass = "block text-sm text-white/70 mb-1"

const errorClass = "mt-1 text-xs text-red-400"

interface Props {
  register: UseFormRegister<CreateApplicationPayload>
  control: Control<CreateApplicationPayload>
  errors: FieldErrors<CreateApplicationPayload>
  job: Job
  onNext: () => void
}

export function StepOne({ register, control, errors, job, onNext }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Step 1 of 2 — Personal &amp; Professional</p>

      {/* Full Name */}
      <div>
        <label className={labelClass}>Full Name *</label>
        <input
          {...register("fullName", { required: "Full name is required" })}
          type="text"
          placeholder="Jane Doe"
          className={inputClass}
        />
        {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>Email *</label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
          })}
          type="email"
          placeholder="jane@example.com"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Contact Number *</label>
          <input
            {...register("contactNumber", { required: "Contact number is required" })}
            type="text"
            placeholder="+91 98765 43210"
            className={inputClass}
          />
          {errors.contactNumber && <p className={errorClass}>{errors.contactNumber.message}</p>}
        </div>
        <div>
          <label className={labelClass}>WhatsApp Number</label>
          <input
            {...register("whatsappNumber")}
            type="text"
            placeholder="Same as above or different"
            className={inputClass}
          />
        </div>
      </div>

      {/* Location + LinkedIn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Current Location *</label>
          <input
            {...register("currentLocation", { required: "Location is required" })}
            type="text"
            placeholder="City, Country"
            className={inputClass}
          />
          {errors.currentLocation && <p className={errorClass}>{errors.currentLocation.message}</p>}
        </div>
        <div>
          <label className={labelClass}>LinkedIn Profile *</label>
          <input
            {...register("linkedinId", { required: "LinkedIn is required" })}
            type="text"
            placeholder="linkedin.com/in/janedoe"
            className={inputClass}
          />
          {errors.linkedinId && <p className={errorClass}>{errors.linkedinId.message}</p>}
        </div>
      </div>

      {/* Qualification + Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Qualification *</label>
          <input
            {...register("qualification", { required: "Qualification is required" })}
            type="text"
            placeholder="B.Tech Computer Science"
            className={inputClass}
          />
          {errors.qualification && <p className={errorClass}>{errors.qualification.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Experience *</label>
          <Controller
            name="experience"
            control={control}
            rules={{ required: "Experience is required" }}
            render={({ field }) => (
              <CustomSelect
                name="experience"
                value={field.value ?? ""}
                onValueChange={field.onChange}
                options={EXPERIENCE_OPTIONS}
                placeholder="Select experience"
              />
            )}
          />
          {errors.experience && <p className={errorClass}>{errors.experience.message}</p>}
        </div>
      </div>

      {/* Flexible shifts */}
      <div className="flex items-center gap-3">
        <input
          {...register("comfortableFlexibleShifts")}
          type="checkbox"
          id="flexShifts"
          className="w-4 h-4 rounded border-white/20 bg-white/5"
        />
        <label htmlFor="flexShifts" className="text-sm text-white/70">
          Comfortable with flexible / rotational shifts
        </label>
      </div>

      {/* Last Salary + Notice Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Last/Current Salary</label>
          <input
            {...register("lastSalary")}
            type="text"
            placeholder="e.g. 8 LPA or $60,000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Notice Period</label>
          <input
            {...register("noticePeriod")}
            type="text"
            placeholder="e.g. 30 days, Immediate"
            className={inputClass}
          />
        </div>
      </div>

      {/* Referral + Hear about us */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Referred By</label>
          <input
            {...register("referredBy")}
            type="text"
            placeholder="Name of referrer (if any)"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>How did you hear about us? *</label>
          <Controller
            name="hearAboutUs"
            control={control}
            rules={{ required: "Please select an option" }}
            render={({ field }) => (
              <CustomSelect
                name="hearAboutUs"
                value={field.value ?? ""}
                onValueChange={field.onChange}
                options={HEAR_ABOUT_OPTIONS}
                placeholder="Select source"
              />
            )}
          />
          {errors.hearAboutUs && <p className={errorClass}>{errors.hearAboutUs.message}</p>}
        </div>
      </div>

      {/* Resume URL */}
      <div>
        <label className={labelClass}>Resume URL *</label>
        <input
          {...register("resumeUrl", {
            required: "Resume URL is required",
            pattern: { value: /^https?:\/\/.+/, message: "Must be a valid URL" },
          })}
          type="url"
          placeholder="https://drive.google.com/..."
          className={inputClass}
        />
        {errors.resumeUrl && <p className={errorClass}>{errors.resumeUrl.message}</p>}
      </div>

      {/* Essay fields */}
      <div>
        <label className={labelClass}>Why are you a good fit for this role? *</label>
        <textarea
          {...register("whyGoodFit", {
            required: "This field is required",
            maxLength: { value: 1000, message: "Maximum 1000 characters" },
          })}
          rows={4}
          placeholder="Describe your relevant experience and skills..."
          className={inputClass}
        />
        {errors.whyGoodFit && <p className={errorClass}>{errors.whyGoodFit.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Why do you want to join MetaUpSpace? *</label>
        <textarea
          {...register("whyJoinUs", {
            required: "This field is required",
            maxLength: { value: 1000, message: "Maximum 1000 characters" },
          })}
          rows={4}
          placeholder="Share your motivation..."
          className={inputClass}
        />
        {errors.whyJoinUs && <p className={errorClass}>{errors.whyJoinUs.message}</p>}
      </div>

      {/* Tech-only fields */}
      {job.type === "TECH" && (
        <div className="space-y-5 pt-2 border-t border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-widest pt-2">Technical Details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>GitHub Profile</label>
              <input
                {...register("githubId")}
                type="text"
                placeholder="github.com/janedoe"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Portfolio / Website</label>
              <input
                {...register("portfolioLink")}
                type="text"
                placeholder="https://janedoe.dev"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Technologies Known</label>
            <textarea
              {...register("technologiesKnown")}
              rows={2}
              placeholder="React, Node.js, Python, AWS..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Hardest Technical Problem You&apos;ve Solved</label>
            <textarea
              {...register("hardestProblem")}
              rows={4}
              placeholder="Describe the problem, your approach, and the outcome..."
              className={inputClass}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-full bg-[#2F6BFF] py-3 text-sm font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] hover:bg-[#3A77FF] transition-colors"
      >
        Next →
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/[jobId]/apply/StepOne.tsx
git commit -m "feat: add StepOne base fields form component"
```

---

## Task 7: StepTwo Component

**Files:**
- Create: `src/app/careers/[jobId]/apply/StepTwo.tsx`

- [ ] **Step 1: Create `src/app/careers/[jobId]/apply/StepTwo.tsx`**

```tsx
"use client"
import React from "react"
import { Controller } from "react-hook-form"
import type {
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form"
import CustomSelect from "@/components/form/CustomSelect"
import type { CreateApplicationPayload, Job } from "@/types"

const inputClass =
  "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"

const labelClass = "block text-sm text-white/70 mb-1"

const errorClass = "mt-1 text-xs text-red-400"

interface Props {
  job: Job
  register: UseFormRegister<CreateApplicationPayload>
  control: Control<CreateApplicationPayload>
  errors: FieldErrors<CreateApplicationPayload>
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function StepTwo({
  job,
  register,
  control,
  errors,
  onSubmit,
  onBack,
  isSubmitting,
}: Props) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-2">
        Step 2 of 2 — Additional Questions
      </p>

      {job.customFields.length === 0 ? (
        <p className="text-sm text-white/50 py-4">
          No additional questions for this role.
        </p>
      ) : (
        job.customFields.map((field) => {
          const fieldPath = `customResponses.${field.fieldId}` as const

          return (
            <div key={field.fieldId}>
              <label className={labelClass}>
                {field.label}
                {field.required && " *"}
              </label>

              {field.fieldType === "TEXT" && (
                <input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(fieldPath as any, {
                    required: field.required ? `${field.label} is required` : false,
                  })}
                  type="text"
                  className={inputClass}
                />
              )}

              {field.fieldType === "TEXTAREA" && (
                <textarea
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(fieldPath as any, {
                    required: field.required ? `${field.label} is required` : false,
                  })}
                  rows={4}
                  className={inputClass}
                />
              )}

              {field.fieldType === "SELECT" && (
                <Controller
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={fieldPath as any}
                  control={control}
                  rules={{
                    required: field.required ? `${field.label} is required` : false,
                  }}
                  render={({ field: f }) => (
                    <CustomSelect
                      name={field.fieldId}
                      value={String(f.value ?? "")}
                      onValueChange={f.onChange}
                      options={(field.options ?? []).map((o) => ({
                        label: o,
                        value: o,
                      }))}
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  )}
                />
              )}

              {field.fieldType === "BOOLEAN" && (
                <div className="flex items-center gap-3">
                  <input
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...register(fieldPath as any)}
                    type="checkbox"
                    id={field.fieldId}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                  <label htmlFor={field.fieldId} className="text-sm text-white/70">
                    {field.label}
                  </label>
                </div>
              )}

              {field.fieldType === "NUMBER" && (
                <input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(fieldPath as any, {
                    required: field.required ? `${field.label} is required` : false,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className={inputClass}
                />
              )}

              {/* Error for this field */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(errors as any)?.customResponses?.[field.fieldId] && (
                <p className={errorClass}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(errors as any).customResponses[field.fieldId].message}
                </p>
              )}
            </div>
          )
        })
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-white/20 py-3 text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 rounded-full bg-[#2F6BFF] py-3 text-sm font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] hover:bg-[#3A77FF] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/[jobId]/apply/StepTwo.tsx
git commit -m "feat: add StepTwo dynamic custom fields component"
```

---

## Task 8: ApplyForm Orchestrator

**Files:**
- Create: `src/app/careers/[jobId]/apply/ApplyForm.tsx`

- [ ] **Step 1: Create `src/app/careers/[jobId]/apply/ApplyForm.tsx`**

```tsx
"use client"
import React from "react"
import Loader from "@/components/Loader"
import { AuthBanner } from "./AuthBanner"
import { StepOne } from "./StepOne"
import { StepTwo } from "./StepTwo"
import { useApplyForm } from "./useApplyForm"

interface Props {
  jobId: string
}

export default function ApplyForm({ jobId }: Props) {
  const {
    job,
    isLoadingJob,
    step,
    register,
    control,
    errors,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    submitSuccess,
    submitError,
  } = useApplyForm(jobId)

  if (isLoadingJob) return <Loader />

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">Job not found.</p>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-white/60 max-w-sm">
            Thank you for applying to <span className="text-white">{job.title}</span>.
            We&apos;ll review your application and be in touch soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Job header */}
      <div className="mb-8">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{job.domain}</p>
        <h1 className="text-2xl font-bold text-white">{job.title}</h1>
      </div>

      {/* Auth banner — login / pre-fill */}
      <AuthBanner />

      {/* Submit error */}
      {submitError && (
        <p className="mb-4 text-sm text-red-400">{submitError}</p>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <StepOne
          register={register}
          control={control}
          errors={errors}
          job={job}
          onNext={nextStep}
        />
      )}

      {/* Step 2 */}
      {step === 2 && (
        <StepTwo
          job={job}
          register={register}
          control={control}
          errors={errors}
          onSubmit={onSubmit}
          onBack={prevStep}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/[jobId]/apply/ApplyForm.tsx
git commit -m "feat: add ApplyForm orchestrator — two-step application form complete"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Full type-check**

```bash
cd MetaUpSpace-Website-new
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Verify new route resolves**

```bash
npm run dev
```

Navigate to `http://localhost:3000/careers` — job listings should fetch from backend (or show loading skeletons if backend is offline).

Navigate to `http://localhost:3000/careers/test-slug/apply` — should render the apply form with AuthBanner at top.

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "chore: verify careers UI wiring compiles and routes resolve"
```

---

## Usage Reference

```typescript
// /careers page — jobs auto-fetch via useOpenRoles
// Tabs derived from job.domain values, "All" always first
// "Apply Now" → /careers/{job.slug}/apply

// /careers/[jobId]/apply
// AuthBanner: idle → OTP → TOTP enroll/verify → authenticated → pre-fills form
// Step 1: base fields + tech fields (if job.type === 'TECH')
// Step 2: job.customFields[] rendered dynamically by fieldType
// Submit: setFormData(values) → submitApplication(job._id)
```

---

## Out of Scope

- Resume upload UI (`POST /upload/resume`) — `resumeUrl` is a text input
- `/dashboard` page
- Visual styling, animations
- `/join-us` (untouched)
