export type ApplicationFormState = {
  fullName: string
  libraryId: string
  mobile: string
  email: string
  domain: string
  github: string
}

export const initialApplicationState: ApplicationFormState = {
  fullName: '',
  libraryId: '',
  mobile: '',
  email: '',
  // empty by default so the form shows the placeholder and forces user selection
  domain: '',
  github: '',
}

export function validateApplication(state: ApplicationFormState): Partial<Record<keyof ApplicationFormState, string>> {
  const errors: Partial<Record<keyof ApplicationFormState, string>> = {}

  if (!state.fullName || state.fullName.trim().length < 2) errors.fullName = 'Enter a valid name.'
  if (!state.libraryId || state.libraryId.trim().length < 1) errors.libraryId = 'Library ID is required.'
  if (!state.mobile || !/^\+?[0-9]{7,15}$/.test(state.mobile)) errors.mobile = 'Enter a valid phone (digits, optional leading +).'
  if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errors.email = 'Enter a valid email address.'
  const allowed = ['AI Development', 'Web Fullstack development', 'App Development']
  if (!state.domain || !allowed.includes(state.domain)) errors.domain = 'Please select a valid domain.'

  try {
    // allow empty github (handled as optional by caller)
    if (state.github && state.github.trim().length) new URL(state.github)
  } catch {
    errors.github = 'Enter a valid URL for Github/Portfolio.'
  }

  return errors
}
