"use client"
import React, { useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Controller } from "react-hook-form"
import type {
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form"
import {
  CustomSelect,
  FormCard,
  FormCheckbox,
  FormInput,
  FormTextarea,
} from "@/components/form"
import { api, getErrorMessage, type ApiResponse } from "@/lib/api"
import type { CreateApplicationPayload, Job } from "@/types"

const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const RESUME_MAX_BYTES = 10 * 1024 * 1024

const EXPERIENCE_OPTIONS = [
  { label: "Fresher", value: "fresher" },
  { label: "0–1 years", value: "0-1" },
  { label: "1–3 years", value: "1-3" },
  { label: "3–5 years", value: "3-5" },
]

const HEAR_ABOUT_OPTIONS = [
  { label: "LinkedIn Post", value: "linkedin_post" },
  { label: "LinkedIn Company Page", value: "linkedin_company" },
  { label: "Job Portal", value: "job_portal" },
  { label: "WhatsApp / Telegram", value: "whatsapp_telegram" },
  { label: "Company Website", value: "company_website" },
  { label: "Other", value: "other" },
]

const labelClass = "block text-white text-sm font-medium mb-3"
const errorClass = "text-red-500 text-sm mt-1"

interface Props {
  register: UseFormRegister<CreateApplicationPayload>
  control: Control<CreateApplicationPayload>
  errors: FieldErrors<CreateApplicationPayload>
  job: Job
  onNext: () => void
}

export function StepOne({ register, control, errors, job, onNext }: Props) {
  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <FormCard
        title="Personal Information"
        subtitle="Tell us who you are and how we can reach you."
      >
        <FormInput
          label="Full Name"
          required
          placeholder="Jane Doe"
          {...register("fullName", { required: "Full name is required" })}
          error={errors.fullName?.message}
        />

        <FormInput
          label="Email Address"
          required
          type="email"
          placeholder="jane@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email",
            },
          })}
          error={errors.email?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Contact Number"
            required
            placeholder="+91 98765 43210"
            {...register("contactNumber", {
              required: "Contact number is required",
            })}
            error={errors.contactNumber?.message}
          />
          <FormInput
            label="WhatsApp Number"
            placeholder="Same as contact or different"
            {...register("whatsappNumber")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Current Location"
            required
            placeholder="City, Country"
            {...register("currentLocation", {
              required: "Location is required",
            })}
            error={errors.currentLocation?.message}
          />
          <FormInput
            label="LinkedIn Profile"
            required
            placeholder="linkedin.com/in/janedoe"
            {...register("linkedinId", { required: "LinkedIn is required" })}
            error={errors.linkedinId?.message}
          />
        </div>
      </FormCard>

      {/* Professional Details */}
      <FormCard
        title="Professional Details"
        subtitle="Share your background and current situation."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Qualification"
            required
            placeholder="B.Tech Computer Science"
            {...register("qualification", {
              required: "Qualification is required",
            })}
            error={errors.qualification?.message}
          />
          <div>
            <label className={labelClass}>
              Experience<span className="text-blue-400"> *</span>
            </label>
            <Controller
              name="experience"
              control={control}
              rules={{ required: "Experience is required" }}
              render={({ field }) => (
                <CustomSelect
                  name="experience"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  options={EXPERIENCE_OPTIONS}
                  placeholder="Select experience"
                />
              )}
            />
            {errors.experience && (
              <p className={errorClass}>{errors.experience.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Last / Current Salary"
            placeholder="e.g. 8 LPA or $60,000"
            {...register("lastSalary")}
          />
          <FormInput
            label="Notice Period"
            placeholder="e.g. 30 days, Immediate"
            {...register("noticePeriod")}
          />
        </div>

        <FormCheckbox
          label="Comfortable with flexible / rotational shifts"
          id="flexShifts"
          {...register("comfortableFlexibleShifts")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Referred By"
            placeholder="Name of referrer (if any)"
            {...register("referredBy")}
          />
          <div>
            <label className={labelClass}>
              How did you hear about us?
              <span className="text-blue-400"> *</span>
            </label>
            <Controller
              name="hearAboutUs"
              control={control}
              rules={{ required: "Please select an option" }}
              render={({ field }) => (
                <CustomSelect
                  name="hearAboutUs"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  options={HEAR_ABOUT_OPTIONS}
                  placeholder="Select source"
                />
              )}
            />
            {errors.hearAboutUs && (
              <p className={errorClass}>{errors.hearAboutUs.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Resume<span className="text-blue-400"> *</span>
          </label>
          <Controller
            name="resumeUrl"
            control={control}
            rules={{ required: "Please upload your resume" }}
            render={({ field }) => (
              <ResumeUpload value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.resumeUrl && (
            <p className={errorClass}>{errors.resumeUrl.message}</p>
          )}
        </div>
      </FormCard>

      {/* Essay Questions */}
      <FormCard
        title="About You"
        subtitle="Help us understand what motivates you."
      >
        <FormTextarea
          label="Why are you a good fit for this role?"
          required
          placeholder="Describe your relevant experience and skills..."
          {...register("whyGoodFit", {
            required: "This field is required",
            maxLength: { value: 1000, message: "Maximum 1000 characters" },
          })}
          error={errors.whyGoodFit?.message}
        />

        <FormTextarea
          label="Why do you want to join MetaUpSpace?"
          required
          placeholder="Share your motivation..."
          {...register("whyJoinUs", {
            required: "This field is required",
            maxLength: { value: 1000, message: "Maximum 1000 characters" },
          })}
          error={errors.whyJoinUs?.message}
        />
      </FormCard>

      {/* Tech-only fields */}
      {job.type === "tech" && (
        <FormCard
          title="Technical Details"
          subtitle="Share your engineering background."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="GitHub Profile"
              placeholder="github.com/janedoe"
              {...register("githubId")}
            />
            <FormInput
              label="Portfolio / Website"
              placeholder="https://janedoe.dev"
              {...register("portfolioLink")}
            />
          </div>

          <FormTextarea
            label="Technologies Known"
            rows={2}
            placeholder="React, Node.js, Python, AWS..."
            {...register("technologiesKnown")}
          />

          <FormTextarea
            label="Hardest Technical Problem You've Solved"
            placeholder="Describe the problem, your approach, and the outcome..."
            {...register("hardestProblem")}
          />
        </FormCard>
      )}

      <button
        type="button"
        onClick={onNext}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
      >
        <span>Continue to Next Step</span>
        <ArrowRight
          size={20}
          className="group-hover:translate-x-1 transition-transform duration-200"
        />
      </button>
    </div>
  )
}

function ResumeUpload({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [filename, setFilename] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    value ? "done" : "idle",
  )
  const [error, setError] = useState<string>("")

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
      onChange("")
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
          className="w-full bg-gray-800/60 border border-dashed border-gray-600/50 rounded-lg px-4 py-6 text-sm text-gray-400 hover:border-gray-500 hover:text-white/70 transition-all duration-200"
        >
          Click to upload PDF or Word (max 10 MB)
        </button>
      )}

      {status === "uploading" && (
        <div className="w-full bg-gray-800/60 border border-gray-600/50 rounded-lg px-4 py-3 text-sm text-gray-400">
          Uploading {filename}…
        </div>
      )}

      {status === "done" && value && (
        <div className="flex items-center justify-between bg-gray-800/60 border border-gray-600/50 rounded-lg px-4 py-3 text-sm">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-white hover:text-blue-400"
          >
            {filename || "Resume uploaded"}
          </a>
          <button
            type="button"
            onClick={clear}
            className="ml-3 text-xs text-gray-400 hover:text-white"
          >
            Replace
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full bg-gray-800/60 border border-dashed border-red-500/50 rounded-lg px-4 py-6 text-sm text-red-400 hover:border-red-500 transition-all duration-200"
          >
            Upload failed — click to try again
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  )
}
