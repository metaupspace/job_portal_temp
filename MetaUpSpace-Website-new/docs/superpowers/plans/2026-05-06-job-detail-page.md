# Job Detail Page + Hooks Centralization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a job detail page at `/careers/[jobId]` so users see full job info before applying, and centralize custom hooks into `src/hooks/`.

**Architecture:** Client-side detail page using `useJobsStore.fetchJob()` to load a single job by slug. Card links updated to point at the detail page. Two scattered custom hooks moved to `src/hooks/` with import paths updated in their consumers.

**Tech Stack:** Next.js 15 App Router, React 19, Zustand, Tailwind CSS v4, TypeScript, lucide-react

---

## File Map

| Action | File |
|--------|------|
| Create | `src/hooks/useOpenRoles.ts` |
| Create | `src/hooks/useApplyForm.ts` |
| Delete | `src/app/careers/fragments/Openings/useOpenRoles.ts` |
| Delete | `src/app/careers/[jobId]/apply/useApplyForm.ts` |
| Modify | `src/app/careers/fragments/Openings/index.tsx` (import + link) |
| Modify | `src/app/careers/[jobId]/apply/ApplyForm.tsx` (import) |
| Rewrite | `src/app/careers/[jobId]/page.tsx` |

---

## Task 1: Create `src/hooks/` and move `useOpenRoles`

**Files:**
- Create: `src/hooks/useOpenRoles.ts`
- Modify: `src/app/careers/fragments/Openings/index.tsx:6`

- [ ] **Step 1: Create `src/hooks/useOpenRoles.ts`**

```ts
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
```

- [ ] **Step 2: Update import in `src/app/careers/fragments/Openings/index.tsx`**

Change line 6 from:
```ts
import { useOpenRoles } from "./useOpenRoles";
```
To:
```ts
import { useOpenRoles } from "@/hooks/useOpenRoles";
```

- [ ] **Step 3: Delete old hook file**

Delete: `src/app/careers/fragments/Openings/useOpenRoles.ts`

- [ ] **Step 4: Verify no TypeScript errors**

Run:
```bash
cd MetaUpSpace-Website-new && npx tsc --noEmit
```
Expected: no errors related to `useOpenRoles`

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useOpenRoles.ts src/app/careers/fragments/Openings/index.tsx
git rm src/app/careers/fragments/Openings/useOpenRoles.ts
git commit -m "refactor: move useOpenRoles to src/hooks/"
```

---

## Task 2: Move `useApplyForm` to `src/hooks/`

**Files:**
- Create: `src/hooks/useApplyForm.ts`
- Modify: `src/app/careers/[jobId]/apply/ApplyForm.tsx:7`

- [ ] **Step 1: Create `src/hooks/useApplyForm.ts`**

```ts
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
  const { submitApplication, isSubmitting, submitSuccess, submitError, setFormData, resetForm } =
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

  useEffect(() => {
    resetForm()
    fetchJob(jobId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        ...(profile.experience !== undefined && { experience: profile.experience }),
        resumeUrl: profile.resumeUrl ?? "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

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

- [ ] **Step 2: Update import in `src/app/careers/[jobId]/apply/ApplyForm.tsx`**

Change line 7 from:
```ts
import { useApplyForm } from "./useApplyForm"
```
To:
```ts
import { useApplyForm } from "@/hooks/useApplyForm"
```

- [ ] **Step 3: Delete old hook file**

Delete: `src/app/careers/[jobId]/apply/useApplyForm.ts`

- [ ] **Step 4: Verify no TypeScript errors**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useApplyForm.ts src/app/careers/[jobId]/apply/ApplyForm.tsx
git rm src/app/careers/[jobId]/apply/useApplyForm.ts
git commit -m "refactor: move useApplyForm to src/hooks/"
```

---

## Task 3: Fix card link in `Openings/index.tsx`

**Files:**
- Modify: `src/app/careers/fragments/Openings/index.tsx:29`

- [ ] **Step 1: Change `href` in `RoleCard`**

In `src/app/careers/fragments/Openings/index.tsx`, find the `Link` inside `RoleCard` (line ~29) and change:

```tsx
href={`/careers/${job.slug}/apply`}
```
To:
```tsx
href={`/careers/${job.slug}`}
```

- [ ] **Step 2: Verify dev server compiles**

Run dev server and open `/careers`. Confirm "View Details" cards are present and link URLs now end in `/${slug}` not `/${slug}/apply`.

- [ ] **Step 3: Commit**

```bash
git add src/app/careers/fragments/Openings/index.tsx
git commit -m "fix: job cards link to detail page instead of apply form"
```

---

## Task 4: Build job detail page

**Files:**
- Rewrite: `src/app/careers/[jobId]/page.tsx`

- [ ] **Step 1: Write the full detail page**

Replace the entire contents of `src/app/careers/[jobId]/page.tsx` with:

```tsx
"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useJobsStore } from "@/store"

const SkeletonDetail = () => (
  <div className="animate-pulse max-w-3xl mx-auto px-6 py-16">
    <div className="h-4 bg-white/10 rounded w-24 mb-10" />
    <div className="h-3 bg-white/10 rounded w-20 mb-4" />
    <div className="h-8 bg-white/10 rounded w-2/3 mb-6" />
    <div className="space-y-2 mb-10">
      <div className="h-3 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-5/6" />
      <div className="h-3 bg-white/10 rounded w-4/5" />
    </div>
    <div className="h-5 bg-white/10 rounded w-32 mb-4" />
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-3 bg-white/10 rounded w-3/4" />
      ))}
    </div>
  </div>
)

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const { selectedJob: job, fetchJob, isLoading, error, clearSelectedJob } = useJobsStore()

  useEffect(() => {
    clearSelectedJob()
    fetchJob(jobId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <SkeletonDetail />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-sm">This role is no longer available.</p>
        <Link
          href="/careers"
          className="text-[#2F6BFF] text-sm hover:underline"
        >
          ← Back to Careers
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-zinc-400 text-sm hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Careers
        </Link>

        {/* Domain + type badges */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {job.domain}
          </span>
          <span className="text-xs border border-white/10 rounded-full px-3 py-1 text-zinc-400">
            {job.type === "TECH" ? "Tech" : "Non-Tech"}
          </span>
        </div>

        {/* Title */}
        <h1 className="sf text-3xl font-semibold text-white mb-6 leading-snug">
          {job.title}
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-[15px] leading-relaxed mb-10">
          {job.description}
        </p>

        {/* Requirements */}
        {job.requirements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-white text-lg font-semibold mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-400 text-[14px]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#2F6BFF] flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply CTA */}
        <Link
          href={`/careers/${job.slug}/apply`}
          className="inline-flex items-center gap-2 rounded-full bg-[#2F6BFF] px-8 py-3.5 text-[14px] font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] transition-transform duration-200 hover:bg-[#3A77FF] active:scale-[0.98]"
        >
          Apply Now
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Manual smoke test**

With dev server running:
1. Open `/careers` — cards show "View Details"
2. Click a card — lands on `/careers/[slug]` (not apply form)
3. Detail page shows: back link, domain badge, type badge, title, description, requirements list, "Apply Now" button
4. Click "Apply Now" — lands on `/careers/[slug]/apply` with form
5. Open `/careers/some-invalid-slug` — shows "This role is no longer available" with back link
6. Loading skeleton appears briefly before job data loads

- [ ] **Step 4: Commit**

```bash
git add src/app/careers/[jobId]/page.tsx
git commit -m "feat: add job detail page with apply CTA"
```
