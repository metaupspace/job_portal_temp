"use client"
import React from "react"
import Loader from "@/components/Loader"
import { AuthBanner } from "./AuthBanner"
import { StepOne } from "./StepOne"
import { StepTwo } from "./StepTwo"
import { useApplyForm } from "@/hooks/useApplyForm"

interface Props {
  jobId: string
}

export default function ApplyForm({ jobId }: Props) {
  const {
    job,
    isLoadingJob,
    step,
    register,
    control,
    errors,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    submitSuccess,
    submitError,
  } = useApplyForm(jobId)

  if (isLoadingJob) return <Loader />

  if (!job) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="sf text-white/40">Job not found.</p>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="sf text-2xl font-semibold text-white mb-3">Application Submitted!</h2>
          <p className="sf text-white/50 text-sm leading-relaxed">
            Thank you for applying to{" "}
            <span className="text-white font-medium">{job.title}</span>.
            We&apos;ll review your application and be in touch soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-2xl mx-auto px-4 py-16">

        {/* Job header */}
        <div className="mb-10">
          <p className="sf text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            {job.domain}
          </p>
          <h1 className="sf text-3xl font-semibold text-white mb-1">{job.title}</h1>
          <p className="sf text-white/40 text-sm">Fill out the form below to apply.</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  step >= s
                    ? "bg-[#2F6BFF] text-white"
                    : "bg-white/5 border border-white/10 text-white/30"
                ].join(" ")}>
                  {s}
                </div>
                <span className={[
                  "sf text-sm hidden sm:block",
                  step >= s ? "text-white/70" : "text-white/25"
                ].join(" ")}>
                  {s === 1 ? "Personal & Professional" : "Additional Questions"}
                </span>
              </div>
              {s < 2 && (
                <div className={[
                  "flex-1 h-px transition-colors",
                  step >= 2 ? "bg-[#2F6BFF]/50" : "bg-white/10"
                ].join(" ")} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Auth banner */}
        <AuthBanner />

        {/* Submit error */}
        {submitError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="sf text-sm text-red-400">{submitError}</p>
          </div>
        )}

        {/* Steps */}
        {step === 1 && (
          <StepOne
            register={register}
            control={control}
            errors={errors}
            job={job}
            onNext={nextStep}
          />
        )}

        {step === 2 && (
          <StepTwo
            job={job}
            register={register}
            control={control}
            errors={errors}
            onSubmit={onSubmit}
            onBack={prevStep}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  )
}
