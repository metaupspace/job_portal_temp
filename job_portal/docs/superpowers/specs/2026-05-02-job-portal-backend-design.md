# Job Portal Backend — Design Spec
**Date:** 2026-05-02  
**Project:** MetaUpSpace Job Portal  
**Stack:** NestJS · MongoDB (Mongoose) · Cloudinary · Nodemailer · JWT

---

## 1. Overview

NestJS backend for MetaUpSpace's job portal. Manages job listings (tech + non-tech) with custom per-job fields, candidate applications mapped to the form spec, resume uploads via Cloudinary, application status workflow, and email notifications via Nodemailer (Gmail SMTP).

---

## 2. Architecture

**Pattern:** Monolithic modular — single NestJS app with strict module boundaries.

```
job_portal/
├── src/
│   ├── auth/           # JWT login, strategy, guard, decorator
│   ├── jobs/           # Job listing CRUD
│   ├── applications/   # Candidate submissions + status management
│   ├── upload/         # Cloudinary resume upload
│   ├── mail/           # Nodemailer email service
│   ├── common/         # Shared guards, decorators, pipes, filters, enums
│   └── config/         # NestJS ConfigModule setup
├── docs/
│   └── superpowers/specs/
└── package.json
```

Each module owns: `controller`, `service`, `schema` (Mongoose), `dto/` folder.  
Modules communicate only via injected services — no cross-module schema imports.

---

## 3. Data Models

### 3.1 Job Listing (`jobs` collection)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `title` | String | required |
| `slug` | String | unique, auto-generated from title |
| `description` | String | required |
| `domain` | String | e.g. "Backend", "Design" |
| `type` | Enum | `tech` \| `non-tech` |
| `isActive` | Boolean | default true; soft-delete sets false |
| `requirements` | String[] | list of requirements |
| `customFields` | FieldDefinition[] | admin-defined extra fields per job |
| `createdAt` | Date | |
| `updatedAt` | Date | |

**FieldDefinition (sub-document):**
```
fieldId    String   unique key for responses map
label      String   display label
fieldType  Enum     text | textarea | select | boolean | number
required   Boolean
options    String[] select options only
```

### 3.2 Application (`applications` collection)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `jobId` | ObjectId | ref: Job |
| `fullName` | String | required |
| `email` | String | required |
| `contactNumber` | String | required |
| `whatsappNumber` | String | required |
| `currentLocation` | String | required |
| `linkedinId` | String | required |
| `qualification` | String | required |
| `experience` | Enum | `fresher \| 0-1 \| 1-3 \| 3-5` |
| `comfortableFlexibleShifts` | Boolean | required |
| `lastSalary` | String | required |
| `noticePeriod` | String | required |
| `referredBy` | String | optional |
| `hearAboutUs` | Enum | see below |
| `resumeUrl` | String | Cloudinary URL |
| `whyGoodFit` | String | required |
| `whyJoinUs` | String | required |
| `githubId` | String | required when job.type = tech |
| `portfolioLink` | String | required when job.type = tech |
| `technologiesKnown` | String | required when job.type = tech |
| `hardestProblem` | String | required when job.type = tech |
| `customResponses` | Map<string, any> | keyed by fieldId from job.customFields |
| `status` | Enum | `pending \| reviewed \| shortlisted \| rejected \| hired` |
| `createdAt` | Date | |
| `updatedAt` | Date | |

**`hearAboutUs` enum values:** `linkedin_post | linkedin_company | job_portal | whatsapp_telegram | company_website | other`

---

## 4. API Routes

### Auth (public)
```
POST   /auth/login
  body: { email, password }
  returns: { access_token }
```

### Jobs
```
GET    /jobs                         public  — list active jobs
GET    /jobs/:id                     public  — job detail + customFields
POST   /jobs                         admin   — create job
PATCH  /jobs/:id                     admin   — update job
DELETE /jobs/:id                     admin   — soft-delete (isActive=false)
GET    /admin/jobs                   admin   — all jobs incl. inactive
```

### Applications
```
POST   /applications/:jobId          public  — submit application
GET    /admin/applications           admin   — list, filter by jobId/status, paginated
GET    /admin/applications/:id       admin   — single application detail
PATCH  /admin/applications/:id/status  admin — update status
DELETE /admin/applications/:id       admin   — hard delete
```

**Query params on `GET /admin/applications`:**  
`?jobId=&status=&page=1&limit=20`

### Upload
```
POST   /upload/resume                public  — multipart PDF, returns { url }
```

---

## 5. Auth

- Single admin account seeded via env vars at bootstrap
- `POST /auth/login` validates credentials, returns signed JWT (24h expiry)
- `passport-jwt` strategy validates Bearer token on protected routes
- `@AdminOnly()` decorator = `@UseGuards(JwtAuthGuard)` — applied on all admin routes
- No candidate accounts — applications are anonymous submissions

---

## 6. Custom Fields Validation

On `POST /applications/:jobId`:
1. Fetch job document
2. Check job `isActive`
3. If `job.type === 'tech'` → validate tech-specific fields present
4. For each entry in `job.customFields` where `required === true` → verify key exists in `customResponses`
5. Reject with `400` and field-level error messages if any required custom field missing

---

## 7. File Upload Flow

1. Client sends `multipart/form-data` with resume file to `POST /upload/resume`
2. Multer intercepts: validates `mimetype` (PDF / doc / docx), rejects if >10MB
3. `UploadService` streams file buffer to Cloudinary (`resource_type: raw`)
4. Returns `{ url }` — client includes URL in application submission body
5. Cloudinary errors caught, logged, return `500` to client

---

## 8. Email Notifications

**Provider:** Nodemailer via Gmail SMTP (app password from env)

| Trigger | Recipient | Subject |
|---|---|---|
| Application submitted | Candidate | "Application Received — {jobTitle}" |
| Application submitted | Admin | "New Application — {jobTitle} from {name}" |
| Status → reviewed | Candidate | "Your Application is Under Review" |
| Status → shortlisted | Candidate | "You've Been Shortlisted — {jobTitle}" |
| Status → rejected | Candidate | "Application Update — MetaUpSpace" |
| Status → hired | Candidate | "Congratulations — Next Steps" |

- `MailService` has one method per email type with HTML templates
- Called from `ApplicationsService` after DB write — `async/await`, non-blocking
- Errors are caught and logged via NestJS `Logger` — never thrown to caller
- Failed mail never causes application submission or status update to fail

---

## 9. Validation & Error Handling

**Validation:**
- `ValidationPipe` global: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- All DTOs use `class-validator` + `class-transformer`
- Custom validator for dynamic `customResponses` fields (described in section 6)

**Error shape (global `HttpExceptionFilter`):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [...],
  "timestamp": "2026-05-02T...",
  "path": "/applications/..."
}
```

**Service layer** throws NestJS built-in exceptions: `NotFoundException`, `BadRequestException`, `UnauthorizedException`, `ConflictException`.

---

## 10. Security

| Concern | Solution |
|---|---|
| Auth | JWT `passport-jwt`, 24h expiry |
| Headers | `helmet` middleware at bootstrap |
| CORS | Configured origins via env var |
| Rate limiting | `@nestjs/throttler` on `POST /applications` and `POST /auth/login` |
| Input sanitization | `whitelist: true` on global ValidationPipe |
| File type | Multer mimetype + size check before Cloudinary |

---

## 11. Environment Variables

All env vars read via NestJS `ConfigModule` from `process.env`. No defaults hardcoded. Variables managed externally by the developer.

Required variables (names defined in `src/config/`):
- MongoDB connection URI
- JWT secret + expiry
- Cloudinary cloud name, API key, API secret
- Gmail SMTP credentials
- Admin seed email + password
- CORS origin
- Port

---

## 12. Key Dependencies

```
@nestjs/core, @nestjs/common, @nestjs/mongoose
mongoose
@nestjs/jwt, @nestjs/passport, passport-jwt
@nestjs/config
class-validator, class-transformer
cloudinary, multer
nodemailer
@nestjs/throttler
helmet
```
