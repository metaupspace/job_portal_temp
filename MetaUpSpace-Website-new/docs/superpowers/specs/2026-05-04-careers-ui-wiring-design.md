# Careers UI Wiring — Design Spec

**Date:** 2026-05-04
**Scope:** Wire `/careers` OpenRoles fragment to backend + build `/careers/[jobId]/apply` two-step form. User will handle all visual styling. This spec covers structure, data flow, and component responsibilities only.

---

## Goals

- Replace hardcoded mock jobs in `Openings/index.tsx` with live data from `useJobsStore`
- Derive tabs dynamically from `job.domain` values (+ always-shown "All" tab)
- "Apply Now" → `/careers/[slug]/apply`
- Apply page: login banner (pre-fill) + two-step form (base fields → custom fields) → `POST /applications/:jobId`
- Basic functional UI only — user adds styling

---

## File Structure

```
src/app/careers/
├── page.tsx                              unchanged
├── fragments/
│   └── Openings/
│       ├── index.tsx                     MODIFY — wire to useOpenRoles
│       └── useOpenRoles.ts               NEW
└── [jobId]/
    └── apply/
        ├── page.tsx                      NEW — server wrapper
        ├── ApplyForm.tsx                 NEW — client, 2-step orchestrator
        ├── useApplyForm.ts               NEW — form logic hook
        ├── StepOne.tsx                   NEW — base fields
        ├── StepTwo.tsx                   NEW — dynamic custom fields
        └── AuthBanner.tsx                NEW — login/pre-fill flow
```

No other careers fragments are touched. `/join-us` untouched.

---

## useOpenRoles Hook

**File:** `src/app/careers/fragments/Openings/useOpenRoles.ts`

```typescript
// Interface
{
  jobs: Job[]          // filtered by activeTab
  allJobs: Job[]       // unfiltered
  tabs: string[]       // ['All', ...unique job.domain values]
  activeTab: string
  setActiveTab: (tab: string) => void
  isLoading: boolean
  error: string | null
}
```

**Logic:**
- Calls `useJobsStore.fetchJobs()` on mount (once, no re-fetch on tab change)
- `tabs` = `['All', ...Array.from(new Set(allJobs.map(j => j.domain)))]`
- `jobs` = `activeTab === 'All' ? allJobs : allJobs.filter(j => j.domain === activeTab)`
- Tab switch is purely client-side — no API call

---

## Openings/index.tsx Changes

**Replace:**
- `ROLES_BY_TAB`, `TABS` constants → `useOpenRoles()` hook
- Hardcoded tab buttons → mapped from `tabs` array
- Hardcoded `RoleCard` data → mapped from `jobs` array
- "Apply Now" button → `<Link href={/careers/${job.slug}/apply}>`

**Add:**
- Loading state: 3 placeholder skeleton cards while `isLoading`
- Error state: error message + retry button (`fetchJobs()`)
- Empty state: "No open roles right now" when `jobs.length === 0` and not loading

**`RoleCard` prop mapping from `Job`:**
```
role.location  → job.domain
role.title     → job.title
role.description → job.description (truncated to ~150 chars)
```

---

## Apply Page

### `page.tsx` — server wrapper
- Reads `params.jobId` via `const { jobId } = await params` (Next.js 16 async params)
- Passes `jobId` as prop to `<ApplyForm jobId={jobId} />`
- Wrapped in `Suspense` with `<Loader />`

### `useApplyForm.ts` hook

```typescript
// Returns:
{
  job: Job | null
  isLoadingJob: boolean
  step: 1 | 2
  register: UseFormRegister<CreateApplicationPayload>
  control: Control<CreateApplicationPayload>
  errors: FieldErrors<CreateApplicationPayload>
  nextStep: () => void      // validates step 1, advances to step 2
  prevStep: () => void      // back to step 1
  onSubmit: () => void      // submits via useApplicationStore
  isSubmitting: boolean
  submitSuccess: boolean
  submitError: string | null
}
```

**On mount:**
1. `useJobsStore.fetchJob(jobId)` → sets `job`
2. If `useAuthStore.tokens.accessToken` → `fetchProfile()` → pre-fills react-hook-form `reset(profileData)`

**Step 1 validation:** `trigger()` on step 1 fields before advancing.

**On submit:** react-hook-form `getValues()` is the single source of truth for all form data. On final submit: calls `useApplicationStore.setFormData({ ...step1Values, customResponses: step2Values })` to stage the payload, then `submitApplication(job._id)` which reads from store. `isSubmitting`/`submitSuccess`/`submitError` read from `useApplicationStore`.

### `StepOne.tsx`

Standard fields rendered via react-hook-form `register`/`Controller`:

| Field | Input Type |
|---|---|
| fullName | text input |
| email | email input |
| contactNumber | text input |
| whatsappNumber | text input (optional) |
| currentLocation | text input |
| linkedinId | text input |
| qualification | text input |
| experience | `<CustomSelect>` (Experience enum options) |
| comfortableFlexibleShifts | checkbox |
| lastSalary | text input (optional) |
| noticePeriod | text input (optional) |
| referredBy | text input (optional) |
| hearAboutUs | `<CustomSelect>` (HearAboutUs enum options) |
| resumeUrl | text input (URL) |
| whyGoodFit | textarea |
| whyJoinUs | textarea |

**If `job.type === 'TECH'`** — additional fields shown:
| githubId | text input (optional) |
| portfolioLink | text input (optional) |
| technologiesKnown | textarea (optional) |
| hardestProblem | textarea (optional) |

### `StepTwo.tsx`

Renders `job.customFields[]` dynamically:

| FieldType | Component |
|---|---|
| TEXT | `<input type="text">` |
| TEXTAREA | `<textarea>` |
| SELECT | `<CustomSelect options={field.options}>` |
| BOOLEAN | `<input type="checkbox">` |
| NUMBER | `<input type="number">` |

- Keys: `customResponses.${field.fieldId}`
- Required fields validated via react-hook-form `validate`
- If `customFields.length === 0`: renders "No additional questions for this role." + submit button immediately

### `AuthBanner.tsx`

Shown at top of apply page. Driven by `useAuthStore.step`.

| AuthStep | UI shown |
|---|---|
| `idle` | "Applied before? Log in to pre-fill." + email input + submit button |
| `otp-sent` | "OTP sent to {email}. Enter code:" + OTP input (6 digits) + submit |
| `totp-enroll` | "Set up authenticator app." + call `setupTotp()` → show QR + secret + TOTP input |
| `totp-setup` | QR code image (`totpSetup.qrCodeUrl`) + secret text + TOTP input + "Verify" button |
| `totp-verify` | "Enter your authenticator code:" + TOTP input (or backup code) + submit |
| `authenticated` | "Logged in as {profile.email} — details pre-filled." + logout link |

**Error display:** `useAuthStore.error` shown inline below active input.

---

## Data Flow

```
/careers page mount
  → useOpenRoles → useJobsStore.fetchJobs() → GET /jobs
  → tabs derived from job.domain values
  → RoleCards rendered with real data
  → "Apply Now" → /careers/[slug]/apply

/careers/[slug]/apply mount
  → useApplyForm → useJobsStore.fetchJob(slug) → GET /jobs/:slug
  → if accessToken: fetchProfile() → pre-fill form
  → AuthBanner: login flow (OTP → TOTP) → authenticated → fetchProfile() → pre-fill

Step 1 submit (Next)
  → react-hook-form trigger() validates base fields
  → step advances to 2

Step 2 submit (Apply)
  → useApplicationStore.setFormData(customResponses)
  → submitApplication(job._id) → POST /applications/:job._id
  → submitSuccess → show success message
```

---

## Out of Scope

- `/dashboard` page UI
- Resume upload (`POST /upload/resume`) — `resumeUrl` is a text input (URL) for now
- Visual styling, animations, transitions
- `/join-us` page (untouched)
- Admin panel
