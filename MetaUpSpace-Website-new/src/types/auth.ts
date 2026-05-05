export type AuthStep =
  | 'idle'
  | 'otp-sent'
  | 'totp-enroll'       // new user: has setupToken, needs TOTP enrollment
  | 'totp-setup'        // TOTP QR shown, user configuring authenticator app
  | 'totp-verify'       // returning user: has sessionToken, needs TOTP code entry
  | 'authenticated'

export interface AuthTokens {
  setupToken?: string
  sessionToken?: string
  accessToken?: string
}

export interface TotpSetupResponse {
  qrCodeUrl: string
  secret: string
  backupCodes?: string[]
}
