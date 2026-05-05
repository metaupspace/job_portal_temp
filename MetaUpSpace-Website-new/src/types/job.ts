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
