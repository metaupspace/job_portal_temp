"use client"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { ArrowLeft } from "lucide-react"
import CustomSelect from "@/components/form/CustomSelect"
import Loader from "@/components/Loader"
import { useAuthStore } from "@/store"
import { api, getErrorMessage, type ApiResponse } from "@/lib/api"
import type { Experience, UpdateApplicantPayload } from "@/types"

const EXPERIENCE_OPTIONS: { label: string; value: Experience }[] = [
  { label: "Fresher", value: "fresher" },
  { label: "0–1 years", value: "0-1" },
  { label: "1–3 years", value: "1-3" },
  { label: "3–5 years", value: "3-5" },
]

const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const RESUME_MAX_BYTES = 10 * 1024 * 1024

const inputClass =
  "w-full sf rounded-lg bg-gray-800/10 outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-sm px-3 py-2.5 text-[0.91875rem] text-white placeholder-white/25 focus:outline-white/40 transition-all"

const labelClass = "sf block text-[0.91875rem] text-white/60 mb-1.5"

const errorClass = "sf mt-1.5 text-[0.7875rem] text-red-400"

const sectionLabelClass =
  "sf text-[0.7875rem] uppercase tracking-widest bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4"

const cardClass =
  "rounded-2xl border border-white/5 bg-[#0F1115] p-6 space-y-5"

type FormValues = {
  fullName: string
  contactNumber: string
  whatsappNumber: string
  currentLocation: string
  linkedinId: string
  qualification: string
  experience: Experience | ""
  resumeUrl: string
}

const emptyForm: FormValues = {
  fullName: "",
  contactNumber: "",
  whatsappNumber: "",
  currentLocation: "",
  linkedinId: "",
  qualification: "",
  experience: "",
  resumeUrl: "",
}

export default function EditProfile() {
  const router = useRouter()
  const { step, profile, fetchProfile, updateProfile, error, clearError } =
    useAuthStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({ defaultValues: emptyForm })

  useEffect(() => {
    if (step !== "authenticated") {
      router.replace("/careers")
      return
    }
    if (!profile) fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName ?? "",
        contactNumber: profile.contactNumber ?? "",
        whatsappNumber: profile.whatsappNumber ?? "",
        currentLocation: profile.currentLocation ?? "",
        linkedinId: profile.linkedinId ?? "",
        qualification: profile.qualification ?? "",
        experience: profile.experience ?? "",
        resumeUrl: profile.resumeUrl ?? "",
      })
    }
  }, [profile, reset])

  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  if (step !== "authenticated" || !profile) return <Loader />

  const onSubmit = handleSubmit(async (values) => {
    clearError()
    const payload: UpdateApplicantPayload = {
      fullName: values.fullName.trim(),
      contactNumber: values.contactNumber.trim() || undefined,
      whatsappNumber: values.whatsappNumber.trim() || undefined,
      currentLocation: values.currentLocation.trim() || undefined,
      linkedinId: values.linkedinId.trim() || undefined,
      qualification: values.qualification.trim() || undefined,
      experience: values.experience || undefined,
      resumeUrl: values.resumeUrl || undefined,
    }
    const ok = await updateProfile(payload)
    if (ok) {
      router.push("/dashboard")
    }
  })

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10">
        <Link
          href="/dashboard"
          className="sf inline-flex items-center gap-2 text-[0.91875rem] text-white/50 hover:text-white mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-[1.575rem] sm:text-[1.96875rem] leading-tight font-medium text-white">
            Edit your{" "}
            <span className="playfair italic font-medium">profile</span>
          </h1>
          <p className="sf text-[0.91875rem] text-white/40 mt-2">
            Keep your details up to date so recruiters can reach you.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="sf text-[0.91875rem] text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Personal Info */}
          <div className={cardClass}>
            <p className={sectionLabelClass}>Personal Information</p>

            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                {...register("fullName", {
                  required: "Full name is required",
                  maxLength: { value: 200, message: "Maximum 200 characters" },
                })}
                type="text"
                placeholder="Jane Doe"
                className={inputClass}
              />
              {errors.fullName && (
                <p className={errorClass}>{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                value={profile.email}
                disabled
                type="email"
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
              <p className="sf mt-1.5 text-[0.7875rem] text-white/30">
                Email cannot be changed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contact Number</label>
                <input
                  {...register("contactNumber", {
                    maxLength: { value: 100, message: "Maximum 100 characters" },
                  })}
                  type="text"
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
                {errors.contactNumber && (
                  <p className={errorClass}>{errors.contactNumber.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  {...register("whatsappNumber", {
                    maxLength: { value: 100, message: "Maximum 100 characters" },
                  })}
                  type="text"
                  placeholder="Same as contact or different"
                  className={inputClass}
                />
                {errors.whatsappNumber && (
                  <p className={errorClass}>{errors.whatsappNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Current Location</label>
                <input
                  {...register("currentLocation", {
                    maxLength: { value: 200, message: "Maximum 200 characters" },
                  })}
                  type="text"
                  placeholder="City, Country"
                  className={inputClass}
                />
                {errors.currentLocation && (
                  <p className={errorClass}>{errors.currentLocation.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>LinkedIn Profile</label>
                <input
                  {...register("linkedinId", {
                    maxLength: { value: 500, message: "Maximum 500 characters" },
                  })}
                  type="text"
                  placeholder="linkedin.com/in/janedoe"
                  className={inputClass}
                />
                {errors.linkedinId && (
                  <p className={errorClass}>{errors.linkedinId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className={cardClass}>
            <p className={sectionLabelClass}>Professional Details</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Qualification</label>
                <input
                  {...register("qualification", {
                    maxLength: { value: 200, message: "Maximum 200 characters" },
                  })}
                  type="text"
                  placeholder="B.Tech Computer Science"
                  className={inputClass}
                />
                {errors.qualification && (
                  <p className={errorClass}>{errors.qualification.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Experience</label>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      name="experience"
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v)}
                      options={EXPERIENCE_OPTIONS}
                      placeholder="Select experience"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Resume</label>
              <Controller
                name="resumeUrl"
                control={control}
                render={({ field }) => (
                  <ResumeUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="sf inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-[0.91875rem] text-white/70 hover:text-white hover:border-white/20 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="sf inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-[0.91875rem] font-medium text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

function ResumeUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [filename, setFilename] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    value ? "done" : "idle",
  )
  const [error, setError] = useState<string>("")

  useEffect(() => {
    setStatus(value ? "done" : "idle")
  }, [value])

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > RESUME_MAX_BYTES) {
      setError("File is larger than 10 MB")
      setStatus("error")
      return
    }

    setFilename(file.name)
    setStatus("uploading")
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      const { data } = await api.post<ApiResponse<{ url: string }>>(
        "/upload/resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      onChange(data.data.url)
      setStatus("done")
    } catch (err) {
      setError(getErrorMessage(err))
      setStatus("error")
    }
  }

  const clear = () => {
    onChange("")
    setFilename("")
    setStatus("idle")
    setError("")
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept={RESUME_ACCEPT}
        onChange={handleSelect}
        className="hidden"
      />

      {status === "idle" && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="sf w-full rounded-lg border border-dashed border-white/20 bg-gray-800/10 px-4 py-6 text-[0.91875rem] text-white/60 hover:border-white/40 hover:text-white/80 transition-all"
        >
          Click to upload PDF or Word (max 10 MB)
        </button>
      )}

      {status === "uploading" && (
        <div className="sf w-full rounded-lg border border-white/10 bg-gray-800/10 px-4 py-3 text-[0.91875rem] text-white/60">
          Uploading {filename}…
        </div>
      )}

      {status === "done" && value && (
        <div className="sf flex items-center justify-between rounded-lg border border-white/10 bg-gray-800/10 px-4 py-3 text-[0.91875rem]">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-white/80 hover:text-white"
          >
            {filename || "View current resume"}
          </a>
          <div className="flex items-center gap-3 ml-3 shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-[0.7875rem] text-blue-400 hover:text-blue-300"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={clear}
              className="text-[0.7875rem] text-white/40 hover:text-red-400"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="sf w-full rounded-lg border border-dashed border-red-400/40 bg-gray-800/10 px-4 py-6 text-[0.91875rem] text-red-400 hover:border-red-400/60 transition-all"
          >
            Upload failed — click to try again
          </button>
          {error && <p className="sf text-[0.7875rem] text-red-400">{error}</p>}
        </div>
      )}
    </div>
  )
}
