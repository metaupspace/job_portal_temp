"use client"
import React from "react"
import { Controller } from "react-hook-form"
import type {
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form"
import CustomSelect from "@/components/form/CustomSelect"
import type { CreateApplicationPayload, Job } from "@/types"

const EXPERIENCE_OPTIONS = [
  { label: "Fresher", value: "FRESHER" },
  { label: "0–1 years", value: "0-1" },
  { label: "1–3 years", value: "1-3" },
  { label: "3–5 years", value: "3-5" },
]

const HEAR_ABOUT_OPTIONS = [
  { label: "LinkedIn Post", value: "LINKEDIN_POST" },
  { label: "LinkedIn Company Page", value: "LINKEDIN_COMPANY" },
  { label: "Job Portal", value: "JOB_PORTAL" },
  { label: "WhatsApp / Telegram", value: "WHATSAPP_TELEGRAM" },
  { label: "Company Website", value: "COMPANY_WEBSITE" },
  { label: "Other", value: "OTHER" },
]

const inputClass =
  "w-full sf rounded-lg bg-gray-800/10 outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-sm px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-white/40 transition-all resize-none"

const labelClass = "sf block text-sm text-white/60 mb-1.5"

const errorClass = "sf mt-1.5 text-xs text-red-400"

const sectionLabelClass =
  "sf text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4"

const cardClass =
  "rounded-2xl border border-white/5 bg-[#0F1115] p-6 space-y-5"

interface Props {
  register: UseFormRegister<CreateApplicationPayload>
  control: Control<CreateApplicationPayload>
  errors: FieldErrors<CreateApplicationPayload>
  job: Job
  onNext: () => void
}

export function StepOne({ register, control, errors, job, onNext }: Props) {
  return (
    <div className="space-y-4">

      {/* Personal Info */}
      <div className={cardClass}>
        <p className={sectionLabelClass}>Personal Information</p>

        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            {...register("fullName", { required: "Full name is required" })}
            type="text"
            placeholder="Jane Doe"
            className={inputClass}
          />
          {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Email Address *</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            type="email"
            placeholder="jane@example.com"
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contact Number *</label>
            <input
              {...register("contactNumber", { required: "Contact number is required" })}
              type="text"
              placeholder="+91 98765 43210"
              className={inputClass}
            />
            {errors.contactNumber && <p className={errorClass}>{errors.contactNumber.message}</p>}
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number</label>
            <input
              {...register("whatsappNumber")}
              type="text"
              placeholder="Same as contact or different"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current Location *</label>
            <input
              {...register("currentLocation", { required: "Location is required" })}
              type="text"
              placeholder="City, Country"
              className={inputClass}
            />
            {errors.currentLocation && <p className={errorClass}>{errors.currentLocation.message}</p>}
          </div>
          <div>
            <label className={labelClass}>LinkedIn Profile *</label>
            <input
              {...register("linkedinId", { required: "LinkedIn is required" })}
              type="text"
              placeholder="linkedin.com/in/janedoe"
              className={inputClass}
            />
            {errors.linkedinId && <p className={errorClass}>{errors.linkedinId.message}</p>}
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className={cardClass}>
        <p className={sectionLabelClass}>Professional Details</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Qualification *</label>
            <input
              {...register("qualification", { required: "Qualification is required" })}
              type="text"
              placeholder="B.Tech Computer Science"
              className={inputClass}
            />
            {errors.qualification && <p className={errorClass}>{errors.qualification.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Experience *</label>
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
            {errors.experience && <p className={errorClass}>{errors.experience.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Last / Current Salary</label>
            <input
              {...register("lastSalary")}
              type="text"
              placeholder="e.g. 8 LPA or $60,000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Notice Period</label>
            <input
              {...register("noticePeriod")}
              type="text"
              placeholder="e.g. 30 days, Immediate"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 py-1">
          <input
            {...register("comfortableFlexibleShifts")}
            type="checkbox"
            id="flexShifts"
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#2F6BFF]"
          />
          <label htmlFor="flexShifts" className="sf text-sm text-white/60 cursor-pointer">
            Comfortable with flexible / rotational shifts
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Referred By</label>
            <input
              {...register("referredBy")}
              type="text"
              placeholder="Name of referrer (if any)"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>How did you hear about us? *</label>
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
            {errors.hearAboutUs && <p className={errorClass}>{errors.hearAboutUs.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Resume URL *</label>
          <input
            {...register("resumeUrl", {
              required: "Resume URL is required",
              pattern: { value: /^https?:\/\/.+/, message: "Must be a valid URL" },
            })}
            type="url"
            placeholder="https://drive.google.com/your-resume"
            className={inputClass}
          />
          {errors.resumeUrl && <p className={errorClass}>{errors.resumeUrl.message}</p>}
        </div>
      </div>

      {/* Essay Questions */}
      <div className={cardClass}>
        <p className={sectionLabelClass}>About You</p>

        <div>
          <label className={labelClass}>Why are you a good fit for this role? *</label>
          <textarea
            {...register("whyGoodFit", {
              required: "This field is required",
              maxLength: { value: 1000, message: "Maximum 1000 characters" },
            })}
            rows={4}
            placeholder="Describe your relevant experience and skills..."
            className={inputClass}
          />
          {errors.whyGoodFit && <p className={errorClass}>{errors.whyGoodFit.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Why do you want to join MetaUpSpace? *</label>
          <textarea
            {...register("whyJoinUs", {
              required: "This field is required",
              maxLength: { value: 1000, message: "Maximum 1000 characters" },
            })}
            rows={4}
            placeholder="Share your motivation..."
            className={inputClass}
          />
          {errors.whyJoinUs && <p className={errorClass}>{errors.whyJoinUs.message}</p>}
        </div>
      </div>

      {/* Tech-only fields */}
      {job.type === "TECH" && (
        <div className={cardClass}>
          <p className={sectionLabelClass}>Technical Details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>GitHub Profile</label>
              <input
                {...register("githubId")}
                type="text"
                placeholder="github.com/janedoe"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Portfolio / Website</label>
              <input
                {...register("portfolioLink")}
                type="text"
                placeholder="https://janedoe.dev"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Technologies Known</label>
            <textarea
              {...register("technologiesKnown")}
              rows={2}
              placeholder="React, Node.js, Python, AWS..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Hardest Technical Problem You&apos;ve Solved</label>
            <textarea
              {...register("hardestProblem")}
              rows={4}
              placeholder="Describe the problem, your approach, and the outcome..."
              className={inputClass}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="sf w-full rounded-full bg-[#2F6BFF] py-3.5 text-sm font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] hover:bg-[#3A77FF] active:scale-[0.98] transition-all"
      >
        Continue to Step 2 →
      </button>
    </div>
  )
}
