"use client"
import React from "react"
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
  FormSubmitButton,
  FormTextarea,
} from "@/components/form"
import type { CreateApplicationPayload, Job } from "@/types"

const labelClass = "block text-white text-sm font-medium mb-3"
const errorClass = "text-red-500 text-sm mt-1"

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
    <div className="space-y-6">
      {job.customFields.length === 0 ? (
        <FormCard
          title="Additional Questions"
          subtitle="No additional questions for this role."
        >
          <p className="text-gray-400 text-sm text-center py-4">
            You&apos;re all set — review and submit your application.
          </p>
        </FormCard>
      ) : (
        <FormCard
          title="Additional Questions"
          subtitle="A few role-specific details we'd like to know."
        >
          {job.customFields.map((field) => {
            const fieldPath = `customResponses.${field.fieldId}` as const
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fieldError = (errors as any)?.customResponses?.[field.fieldId]
              ?.message as string | undefined

            if (field.fieldType === "text") {
              return (
                <FormInput
                  key={field.fieldId}
                  label={field.label}
                  required={field.required}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(fieldPath as any, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  error={fieldError}
                />
              )
            }

            if (field.fieldType === "textarea") {
              return (
                <FormTextarea
                  key={field.fieldId}
                  label={field.label}
                  required={field.required}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(fieldPath as any, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                  })}
                  error={fieldError}
                />
              )
            }

            if (field.fieldType === "number") {
              return (
                <FormInput
                  key={field.fieldId}
                  label={field.label}
                  required={field.required}
                  type="number"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(fieldPath as any, {
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                    valueAsNumber: true,
                  })}
                  error={fieldError}
                />
              )
            }

            if (field.fieldType === "boolean") {
              return (
                <FormCheckbox
                  key={field.fieldId}
                  label={field.label}
                  id={field.fieldId}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...register(fieldPath as any)}
                />
              )
            }

            if (field.fieldType === "select") {
              return (
                <div key={field.fieldId}>
                  <label className={labelClass}>
                    {field.label}
                    {field.required && (
                      <span className="text-blue-400"> *</span>
                    )}
                  </label>
                  <Controller
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name={fieldPath as any}
                    control={control}
                    rules={{
                      required: field.required
                        ? `${field.label} is required`
                        : false,
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
                  {fieldError && <p className={errorClass}>{fieldError}</p>}
                </div>
              )
            }

            return null
          })}
        </FormCard>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-800/60 border border-gray-600/50 hover:bg-gray-800/80 hover:border-gray-500 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200"
        >
          ← Back
        </button>
        <div className="flex-[2]">
          <FormSubmitButton
            type="button"
            onClick={onSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            <span>Submit Application</span>
          </FormSubmitButton>
        </div>
      </div>
    </div>
  )
}
