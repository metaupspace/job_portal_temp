export type AuthStep = 'idle' | 'otp-sent' | 'authenticated'

export interface AuthTokens {
  accessToken?: string
}
