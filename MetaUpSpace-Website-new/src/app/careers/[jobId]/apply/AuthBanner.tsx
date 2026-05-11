"use client"
import React, { useState } from "react"
import { useAuthStore } from "@/store"

const inputClass =
  "flex-1 sf rounded-lg bg-gray-800/10 outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-sm px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-white/40 transition-all"

const btnClass =
  "rounded-lg bg-[#2F6BFF] px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_16px_-4px_rgba(47,107,255,0.5)] hover:bg-[#3A77FF] disabled:opacity-50 transition-colors sf"

export function AuthBanner() {
  const {
    step,
    email,
    isLoading,
    error,
    requestOtp,
    verifyOtp,
    clearError,
    logout,
  } = useAuthStore()

  const [emailInput, setEmailInput] = useState("")
  const [otpInput, setOtpInput] = useState("")

  if (step === "authenticated") {
    return (
      <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <p className="sf text-sm text-green-400">
            Logged in as <span className="font-medium text-white">{email}</span> — details pre-filled.
          </p>
        </div>
        <button
          onClick={logout}
          className="sf text-xs text-white/30 hover:text-white/70 transition-colors ml-4"
        >
          Log out
        </button>
      </div>
    )
  }

  if (step === "idle") {
    return (
      <div className="mb-6 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm px-5 py-4">
        <p className="sf text-sm text-white/50 mb-3">
          Applied before?{" "}
          <span className="text-white/80">Log in to pre-fill your details.</span>
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); clearError(); requestOtp(emailInput) }}
          className="flex gap-2"
        >
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Your email address"
            required
            className={inputClass}
          />
          <button type="submit" disabled={isLoading} className={btnClass}>
            {isLoading ? "Sending…" : "Send OTP"}
          </button>
        </form>
        {error && <p className="sf mt-2 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (step === "otp-sent") {
    return (
      <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm px-5 py-4">
        <p className="sf text-sm text-white/60 mb-3">
          OTP sent to <span className="font-medium text-white">{email}</span>. Enter the 6-digit code:
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); clearError(); verifyOtp(email!, otpInput) }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            placeholder="123456"
            maxLength={6}
            required
            className={`${inputClass} tracking-[0.4em] text-center`}
          />
          <button type="submit" disabled={isLoading} className={btnClass}>
            {isLoading ? "Verifying…" : "Verify"}
          </button>
        </form>
        {error && <p className="sf mt-2 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return null
}
