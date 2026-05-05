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
