# Applicant Identity & Dashboard — Design Spec
_Date: 2026-05-03_

## Overview

Add persistent applicant identity to the job portal. Currently applications are anonymous documents. This spec introduces an `Applicants` collection, Email OTP + TOTP MFA authentication, and a protected dashboard where applicants can view their applications, update their profile, and withdraw pending applications.

---

## 1. Data Model

### 1.1 New: `Applicant` Collection

```typescript
{
  email:           string        // unique, indexed — immutable identity key
  fullName:        string
  contactNumber:   string
  whatsappNumber:  string
  currentLocation: string
  linkedinId:      string
  qualification:   string
  experience:      Experience    // existing enum
  resumeUrl:       string        // updated to latest on each application

  // Email OTP (factor 1)
  otpHash:         string | null // bcrypt hash of current 6-digit OTP
  otpExpiresAt:    Date | null   // 10-minute window

  // TOTP MFA (factor 2)
  totpSecret:      string | null // AES-256 encrypted before storage
  totpEnabled:     boolean       // false until confirm-totp succeeds
  backupCodes:     string[]      // 8 bcrypt-hashed single-use codes
  mfaEnrolled:     boolean       // true after first full TOTP enrollment

  timestamps: true
}
```

### 1.2 Modified: `Application` Collection

Add one field (non-breaking, optional):

```typescript
applicantId: Types.ObjectId   // ref: Applicant, optional (null for pre-existing docs)
```

### 1.3 Modified: `ApplicationStatus` Enum

Add terminal state:

```
WITHDRAWN  — set by applicant on pending/reviewed applications. Admin can still override.
```

---

## 2. Auth Flow

### 2.1 First-Time Login (TOTP not yet enrolled)

```
POST /applicants/request-otp
  Body: { email }
  → Generates 6-digit OTP, bcrypt-hashes it, stores hash + expiry (10 min) on Applicant doc
  → Sends OTP to email
  → 200 OK (same response regardless of whether email exists — prevents enumeration)

POST /applicants/verify-otp
  Body: { email, otp }
  → Verifies bcrypt hash, checks expiry
  → mfaEnrolled === false → 200 { requiresTotpSetup: true, setupToken: <JWT 15min> }

POST /applicants/setup-totp
  Header: Bearer <setupToken>
  → Generates TOTP secret (speakeasy), returns { qrCodeUri, secret }
  → Does NOT persist secret yet (user must confirm first)
  → Secret stored temporarily in setupToken payload

POST /applicants/confirm-totp
  Header: Bearer <setupToken>
  Body: { code }
  → Verifies TOTP code against secret from token
  → Saves AES-256 encrypted secret to Applicant doc
  → Sets totpEnabled=true, mfaEnrolled=true
  → Generates 8 backup codes: 16-char uppercase alphanumeric, displayed as XXXX-XXXX-XXXX-XXXX,
    bcrypt-hashed (hyphens stripped) before storage.
  → Returns { accessToken: <JWT 24h>, backupCodes: string[8] }
  ⚠ Backup codes shown exactly once. Not retrievable again.
```

### 2.2 Subsequent Logins (TOTP enrolled)

```
POST /applicants/request-otp    → same as above
POST /applicants/verify-otp
  → mfaEnrolled === true → 200 { requiresTotp: true, sessionToken: <JWT 5min> }

POST /applicants/verify-totp
  Header: Bearer <sessionToken>
  Body: { code }
  → Accepts 6-digit TOTP code OR one backup code (service detects format)
  → TOTP: verifies against decrypted secret (speakeasy, 30s window ±1 step)
  → Backup code: 16 uppercase alphanumeric chars, formatted XXXX-XXXX-XXXX-XXXX on display,
                 stored stripped of hyphens. Service strips hyphens before bcrypt compare.
                 Finds matching hash, deletes it from array (single-use).
  → Returns { accessToken: <JWT 24h> }
```

### 2.3 JWT Strategy

- New `ApplicantJwtStrategy` — completely separate from existing `AdminJwtStrategy`
- Payload: `{ sub: applicantId, email, role: 'applicant' }`
- New `ApplicantGuard` checks `user.role === 'applicant'`
- New `@ApplicantOnly()` decorator chains `ApplicantGuard`
- Admin JWT and Applicant JWT cannot be used interchangeably

---

## 3. Application Auto-Link on Submit

Changes to `ApplicationsService.create()` — additive, no breaking changes:

```
1. Validate job (existing)
2. Duplicate check (existing)
3. Upsert Applicant:
     findOneAndUpdate(
       { email: dto.email },
       { $setOnInsert: { fullName, contactNumber, whatsappNumber, currentLocation,
                         linkedinId, qualification, experience, mfaEnrolled: false,
                         totpEnabled: false, backupCodes: [], otpHash: null, otpExpiresAt: null },
         $set: { resumeUrl: dto.resumeUrl }   ← always update to latest resume
       },
       { upsert: true, new: true }
     )
4. Create Application with applicantId: applicant._id
5. Send existing confirmation emails (unchanged)
6. Send new email nudge: "Set up your dashboard to track this application" (non-blocking, failure logged)
```

Email field on `Applicant` is the identity key and is never updated after creation.

---

## 4. Dashboard Endpoints

All routes require `@ApplicantOnly()`. JWT `sub` is used to scope all queries — applicants can only see their own data.

### 4.1 Profile

```
GET  /applicants/me
  → Returns full Applicant profile (excludes: otpHash, totpSecret, backupCodes)

PATCH /applicants/me
  Body (all optional): { fullName, contactNumber, whatsappNumber,
                         currentLocation, linkedinId, qualification,
                         experience, resumeUrl }
  → email NOT patchable (identity key)
  → Validated via UpdateApplicantDto (class-validator)
```

### 4.2 Applications

```
GET /applicants/me/applications
  → Query: { $or: [{ applicantId: JWT sub }, { email: applicant.email, applicantId: null }] }
    (second clause handles pre-existing applications before this feature was added)
  → Populates jobId (title, slug)
  → Sorted createdAt DESC
  → Returns: [{ applicationId, jobTitle, jobSlug, status, appliedAt }]

POST /applicants/me/applications/:id/withdraw
  → Verifies application.applicantId === JWT sub (ownership check)
  → Throws ForbiddenException if applicantId mismatch
  → Throws ConflictException if status not in [PENDING, REVIEWED]
     (cannot withdraw SHORTLISTED, HIRED, REJECTED, already WITHDRAWN)
  → Sets status = WITHDRAWN
  → No email sent (admin sees status change in their list)
```

### 4.3 Existing Public Endpoint (unchanged)

```
GET /applications/status?email=   → still works unauthenticated. No regression.
GET /applications/:id/status?email= → same.
```

---

## 5. Security Considerations

| Concern | Mitigation |
|---|---|
| OTP brute-force | Throttle `verify-otp`: 5 attempts / 15 min per IP |
| OTP enumeration | Same 200 response whether email exists or not on `request-otp` |
| TOTP secret exposure | AES-256 encrypt before storage using `TOTP_ENCRYPTION_KEY` env var |
| Backup code theft | Stored as bcrypt hashes, single-use, shown once |
| setupToken / sessionToken misuse | Short expiry (15min / 5min), scoped role in payload |
| Applicant accessing other applicant data | All queries scoped to JWT `sub` (applicantId) |
| TOTP replay | speakeasy rejects codes outside ±1 step window |

---

## 6. New Module Structure

```
src/
  applicants/
    schemas/
      applicant.schema.ts
    dto/
      request-otp.dto.ts
      verify-otp.dto.ts
      verify-totp.dto.ts
      update-applicant.dto.ts
    applicants.module.ts
    applicants.service.ts
    applicants.controller.ts
  auth/
    strategies/
      applicant-jwt.strategy.ts   ← new, alongside existing jwt.strategy.ts
    guards/
      applicant.guard.ts          ← new
  common/
    decorators/
      applicant-only.decorator.ts ← new
    enums/
      application-status.enum.ts  ← add WITHDRAWN
```

---

## 7. New Environment Variables

```
TOTP_ENCRYPTION_KEY=   # 32-byte hex string for AES-256 TOTP secret encryption
```

---

## 8. Dependencies

```
speakeasy       # TOTP generation + verification
qrcode          # QR code URI generation for TOTP setup
```

Both are lightweight, no native bindings. Add to package.json.

---

## 9. Out of Scope

- Frontend / UI (API only)
- Applicant ability to delete their profile
- Admin ability to see applicant TOTP enrollment status
- Password-based auth
- Social OAuth
