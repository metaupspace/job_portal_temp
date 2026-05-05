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

const inputClass =
  "w-full sf rounded-lg bg-gray-800/10 outline outline-1 outline-offset-[-1px] outline-white/20 backdrop-blur-sm px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-white/40 transition-all resize-none"

const labelClass = "sf block text-sm text-white/60 mb-1.5"

const errorClass = "sf mt-1.5 text-xs text-red-400"

const cardClass =
  "rounded-2xl border border-white/5 bg-[#0F1115] p-6 space-y-5"

interface Props {
  job: Job
  register: UseFormRegister<CreateApplicationPayload>
  control: Control<CreateApplicationPayload>
  errors: FieldErrors<CreateApplicationPayload>
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function StepTwo({
  job,
  register,
  control,
  errors,
  onSubmit,
  onBack,
  isSubmitting,
}: Props) {
  return (
    <div className="space-y-4">

      {job.customFields.length === 0 ? (
        <div className={cardClass}>
          <p className="sf text-sm text-white/30 text-center py-4">
            No additional questions for this role.
          </p>
        </div>
      ) : (
        <div className={cardClass}>
          <p className="sf text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            Additional Questions
          </p>

          {job.customFields.map((field) => {
            const fieldPath = `customResponses.${field.fieldId}` as const

            return (
              <div key={field.fieldId}>
                <label className={labelClass}>
                  {field.label}
                  {field.required && <span className="text-white/30"> *</span>}
                </label>

                {field.fieldType === "TEXT" && (
                  <input
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...register(fieldPath as any, {
                      required: field.required ? `${field.label} is required` : false,
                    })}
                    type="text"
                    className={inputClass}
                  />
                )}

                {field.fieldType === "TEXTAREA" && (
                  <textarea
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...register(fieldPath as any, {
                      required: field.required ? `${field.label} is required` : false,
                    })}
                    rows={4}
                    className={inputClass}
                  />
                )}

                {field.fieldType === "SELECT" && (
                  <Controller
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={fieldPath as any}
                    control={control}
                    rules={{
                      required: field.required ? `${field.label} is required` : false,
                    }}
                    render={({ field: f }) => (
                      <CustomSelect
                        name={field.fieldId}
                        value={String(f.value ?? "")}
                        onValueChange={f.onChange}
                        options={(field.options ?? []).map((o) => ({
                          label: o,
                          value: o,
                        }))}
                        placeholder={`Select ${field.label.toLowerCase()}`}
                      />
                    )}
                  />
                )}

                {field.fieldType === "BOOLEAN" && (
                  <div className="flex items-center gap-3 py-1">
                    <input
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      {...register(fieldPath as any)}
                      type="checkbox"
                      id={field.fieldId}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#2F6BFF]"
                    />
                    <label htmlFor={field.fieldId} className="sf text-sm text-white/60 cursor-pointer">
                      {field.label}
                    </label>
                  </div>
                )}

                {field.fieldType === "NUMBER" && (
                  <input
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...register(fieldPath as any, {
                      required: field.required ? `${field.label} is required` : false,
                      valueAsNumber: true,
                    })}
                    type="number"
                    className={inputClass}
                  />
                )}

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(errors as any)?.customResponses?.[field.fieldId] && (
                  <p className={errorClass}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(errors as any).customResponses[field.fieldId].message}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="sf flex-1 rounded-full border border-white/10 py-3.5 text-sm font-medium text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 active:scale-[0.98] transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="sf flex-2 flex-[2] rounded-full bg-[#2F6BFF] py-3.5 text-sm font-medium text-white shadow-[0_4px_24px_-8px_rgba(47,107,255,0.6)] hover:bg-[#3A77FF] disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {isSubmitting ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </div>
  )
}
