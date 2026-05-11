'use client'
import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  FormCard,
  FormInput,
  FormSubmitButton,
  FormTextarea,
} from '@/components/form'

interface ContactFormProps {
  className?: string
}

interface FormData {
  name: string
  phone: string
  email: string
  message: string
}

const SHEETDB_URL = 'https://sheetdb.io/api/v1/crhwt44b8p4tz'

export default function ContactForm({ className = '' }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: '', phone: '', email: '', message: '' },
  })

  const saveData = async (data: FormData) => {
    try {
      await axios.post(SHEETDB_URL, { data: [data] })
      alert('Form Submitted')
    } catch (error) {
      console.error(error)
      alert('Something Went Wrong')
    } finally {
      setIsLoading(false)
      reset()
    }
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true)
    saveData(data)
  }

  return (
    <FormCard
      title="Personal Information"
      subtitle="Tell us who you are and how we can reach you."
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Name"
          placeholder="Type your Name"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name too short' },
          })}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Phone"
            type="tel"
            placeholder="Type here"
            {...register('phone', {
              required: 'Phone is required',
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: 'Invalid phone number',
              },
            })}
            error={errors.phone?.message}
          />

          <FormInput
            label="Email"
            type="email"
            placeholder="Valid Email only"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            error={errors.email?.message}
          />
        </div>

        <FormTextarea
          label="Message"
          placeholder="Type here"
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 5, message: 'Message too short' },
          })}
          error={errors.message?.message}
        />

        <FormSubmitButton isLoading={isLoading} loadingText="Submitting...">
          <span>Continue to Next Step</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </FormSubmitButton>
      </form>
    </FormCard>
  )
}
