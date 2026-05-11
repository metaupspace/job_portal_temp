"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useJobsStore, useAuthStore, useApplicationStore } from "@/store"
import type { CreateApplicationPayload } from "@/types"

const STEP_ONE_FIELDS: Array<keyof CreateApplicationPayload> = [
  "fullName",
  "email",
  "contactNumber",
  "currentLocation",
  "linkedinId",
  "qualification",
  "experience",
  "comfortableFlexibleShifts",
  "hearAboutUs",
  "resumeUrl",
  "whyGoodFit",
  "whyJoinUs",
]

export function useApplyForm(jobId: string) {
  const { selectedJob: job, fetchJob, isLoading: isLoadingJob } = useJobsStore()
  const { step: authStep, tokens, profile, fetchProfile } = useAuthStore()
  const { submitApplication, isSubmitting, submitSuccess, submitError, setFormData, resetForm } =
    useApplicationStore()

  const [step, setStep] = useState<1 | 2>(1)

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateApplicationPayload>({
    defaultValues: {
      comfortableFlexibleShifts: false,
      customResponses: {},
    },
  })

  useEffect(() => {
    resetForm()
    fetchJob(jobId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (profile) {
      reset({
        ...getValues(),
        fullName: profile.fullName ?? "",
        email: profile.email,
        contactNumber: profile.contactNumber ?? "",
        whatsappNumber: profile.whatsappNumber ?? "",
        currentLocation: profile.currentLocation ?? "",
        linkedinId: profile.linkedinId ?? "",
        qualification: profile.qualification ?? "",
        ...(profile.experience !== undefined && { experience: profile.experience }),
        resumeUrl: profile.resumeUrl ?? "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  useEffect(() => {
    if (authStep === "authenticated" && tokens.accessToken && !profile) {
      fetchProfile()
    }
  }, [authStep, tokens.accessToken, profile, fetchProfile])

  const nextStep = async () => {
    const valid = await trigger(STEP_ONE_FIELDS)
    if (valid) setStep(2)
  }

  const prevStep = () => setStep(1)

  const onSubmit = handleSubmit((values) => {
    if (!job) return
    const payload = { ...values }
    if (job.type !== "tech") {
      delete payload.githubId
      delete payload.portfolioLink
      delete payload.technologiesKnown
      delete payload.hardestProblem
    }
    for (const k of Object.keys(payload) as Array<keyof typeof payload>) {
      if (payload[k] === "") delete payload[k]
    }
    setFormData(payload)
    submitApplication(job._id)
  })

  return {
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
  }
}
