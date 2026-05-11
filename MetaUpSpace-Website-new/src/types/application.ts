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
  // tech-only fields (conditional on job.type === 'tech')
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

// Shape returned by GET /applicants/me/applications — a summary, not the full doc.
export interface ApplicationSummary {
  applicationId: string
  jobTitle: string
  jobSlug: string
  status: ApplicationStatus
  appliedAt: string
}
