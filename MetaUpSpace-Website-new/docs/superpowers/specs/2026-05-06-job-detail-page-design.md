# Job Detail Page + Hooks Centralization

**Date:** 2026-05-06  
**Status:** Approved

## Problem

Clicking a job card on `/careers` skips directly to the application form (`/careers/[slug]/apply`), bypassing any detail view. The `/careers/[jobId]/page.tsx` exists but is empty. Custom hooks are scattered in feature subdirectories rather than a central location.

## Goals

1. Job cards link to a detail page first
2. Detail page shows full job info + "Apply Now" CTA
3. Custom hooks consolidated in `src/hooks/`

## Out of Scope

- Zustand stores in `src/store/` stay where they are
- No changes to the apply form flow
- No SEO/SSR changes

---

## Part 1 — Fix Card Link

**File:** `src/app/careers/fragments/Openings/index.tsx`

Change `RoleCard` href:
```
FROM: /careers/${job.slug}/apply
TO:   /careers/${job.slug}
```

Button label stays "View Details".

---

## Part 2 — Job Detail Page

**File:** `src/app/careers/[jobId]/page.tsx`

### Data Fetching

Client component. Uses `useJobsStore`:
- If `jobs` array empty → call `fetchJobs()`
- Find job where `job.slug === params.jobId`
- If not found after fetch → show "Job not found" with back link

### Layout (dark theme, matches existing careers page)

```
[← Back to Careers]

[domain badge]  [TECH / NON-TECH badge]

[Job Title — large]

[Full description]

## Requirements
• requirement 1
• requirement 2
• ...

[Apply Now →]   (links to /careers/[slug]/apply)
```

### States

| State | UI |
|---|---|
| Loading | Skeleton (title + description placeholder) |
| Not found | "This role is no longer available" + back link |
| Loaded | Full detail layout above |

### Styling

Matches existing dark palette:
- Background: `#0F1115`
- Text: `text-white` / `text-zinc-400`
- CTA button: `bg-[#2F6BFF]` with same shadow as card button
- Back link: `text-zinc-400` with left arrow icon

---

## Part 3 — Hooks Migration

| From | To |
|---|---|
| `src/app/careers/fragments/Openings/useOpenRoles.ts` | `src/hooks/useOpenRoles.ts` |
| `src/app/careers/[jobId]/apply/useApplyForm.ts` | `src/hooks/useApplyForm.ts` |

Update import in:
- `src/app/careers/fragments/Openings/index.tsx` → `@/hooks/useOpenRoles`
- `src/app/careers/[jobId]/apply/ApplyForm.tsx` → `@/hooks/useApplyForm`

Delete original hook files after moving.

---

## Implementation Order

1. Create `src/hooks/` and move hooks (update imports)
2. Fix card link in `Openings/index.tsx`
3. Build `/careers/[jobId]/page.tsx`
