'use client'
import React, { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import axios from 'axios'

interface FormData {
  name: string
  phone: string
  email: string
  address: string
  companyname: string
  companytype: string
  consultationintrest: string[]
  message: string
  wheredidyouhearaboutus: string
}

const CONSULTATION_OPTIONS = [
  'Web Development',
  'Mobile App Development', 
  'UI/UX Design',
  'Digital Marketing',
  'E-commerce Solutions',
  'Custom Software',
  'AI/ML Solutions',
  'Other'
]

const COMPANY_TYPES = [
  'Startup',
  'Small Business',
  'Medium Enterprise',
  'Large Corporation',
  'Non-profit',
  'Government',
  'Other'
]

const REFERRAL_SOURCES = [
  'Google Search',
  'Social Media',
  'Referral from Friend',
  'LinkedIn',
  'Previous Client',
  'Conference/Event',
  'Advertisement',
  'Other'
]

const SHEETDB_URL = "https://sheetdb.io/api/v1/c4yhk473os09w"

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0) // Start from 0

  const { control, handleSubmit, reset, formState: { errors }, trigger } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      companyname: '',
      companytype: '',
      consultationintrest: [],
      message: '',
      wheredidyouhearaboutus: '',
    }
  })

  // Handle next step with validation
  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = []
    
    if (step === 0) {
      fieldsToValidate = ['name', 'email', 'phone']
    }
    
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid) {
      setStep(1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    setStep(0)
  }

  // Save data to SheetDB
  const saveData = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        consultationintrest: Array.isArray(data.consultationintrest) 
          ? data.consultationintrest.join(', ')
          : data.consultationintrest,
        submittedAt: new Date().toISOString()
      }
      
      await axios.post(SHEETDB_URL, { data: [formattedData] })
      alert("Form Submitted Successfully!")
      reset()
      setStep(0)
    } catch (error) {
      console.error(error)
      alert("Something Went Wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle final form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true)
    saveData(data)
  }

  return (
    <div className='bg-gray-900/20 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-gray-500/50'>
      
      {/* Step 0 - Personal Information */}
      {step === 0 && (
        <>
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              Personal Information
            </h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Tell us who you are and how we can reach you.
            </p>
          </div>

          <div className='space-y-6'>
            {/* Name Field */}
            <div>
              <label htmlFor='name' className='block text-white text-sm font-medium mb-3'>
                Name
              </label>
              <Controller 
                name='name'
                control={control}
                rules={{ required: "Name is required", minLength: { value: 2, message: "Name is too short" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    id='name'
                    placeholder='Type your Name'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.name ? 'border-red-500' : 'border-gray-600/50'
                    }`}
                  />
                )}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Phone and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Field */}
              <div>
                <label htmlFor='phone' className='block text-white text-sm font-medium mb-3'>
                  Phone
                </label>
                <Controller 
                  name='phone'
                  control={control}
                  rules={{ required: "Phone is required", pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type='tel'
                      id='phone'
                      placeholder='Type here'
                      className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.phone ? 'border-red-500' : 'border-gray-600/50'
                      }`}
                    />
                  )}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-white text-sm font-medium mb-3'>
                  Email
                </label>
                <Controller 
                  name='email'
                  control={control}
                  rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type='email'
                      id='email'
                      placeholder='Valid Email only'
                      className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-600/50'
                      }`}
                    />
                  )}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor='address' className='block text-white text-sm font-medium mb-3'>
                Address
              </label>
              <Controller 
                name='address'
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id='address'
                    placeholder='Type here'
                    rows={4}
                    className="w-full bg-gray-800/60 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  />
                )}
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <span>Continue to Next Step</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </>
      )}

      {/* Step 1 - Company Information */}
      {step === 1 && (
        <>
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              Company Information
            </h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Tell us about your company and project requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Company Name and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label htmlFor='companyname' className='block text-white text-sm font-medium mb-3'>
                  Company Name
                </label>
                <Controller 
                  name='companyname'
                  control={control}
                  rules={{ required: "Company name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type='text'
                      id='companyname'
                      placeholder='Type here'
                      className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.companyname ? 'border-red-500' : 'border-gray-600/50'
                      }`}
                    />
                  )}
                />
                {errors.companyname && <p className="text-red-500 text-sm mt-1">{errors.companyname.message}</p>}
              </div>

              {/* Company Type */}
              <div>
                <label htmlFor='companytype' className='block text-white text-sm font-medium mb-3'>
                  Company Type
                </label>
                <Controller 
                  name='companytype'
                  control={control}
                  rules={{ required: "Company type is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      id='companytype'
                      className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        errors.companytype ? 'border-red-500' : 'border-gray-600/50'
                      }`}
                    >
                      <option value="" className="bg-gray-800 text-gray-400">Select company type</option>
                      {COMPANY_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-gray-800 text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.companytype && <p className="text-red-500 text-sm mt-1">{errors.companytype.message}</p>}
              </div>
            </div>

            {/* Consultation Interest */}
          <div>
  <label htmlFor='consultationintrest' className='block text-white text-sm font-medium mb-3'>
    Consultation Interest
  </label>
  <Controller 
    name='consultationintrest'
    control={control}
    rules={{ required: "Please select a consultation interest" }}
    render={({ field }) => (
      <select
        {...field}
        id='consultationintrest'
        className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          errors.consultationintrest ? 'border-red-500' : 'border-gray-600/50'
        }`}
      >
        <option value="" className="bg-gray-800 text-gray-400 px-4">Select consultation interest</option>
        {CONSULTATION_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-gray-800 text-white">
            {option}
          </option>
        ))}
      </select>
    )}
  />
  {errors.consultationintrest && <p className="text-red-500 text-sm mt-1">{errors.consultationintrest.message}</p>}
</div>


            {/* Message Field */}
            <div>
              <label htmlFor='message' className='block text-white text-sm font-medium mb-3'>
                Message
              </label>
              <Controller 
                name='message'
                control={control}
                rules={{ required: "Message is required", minLength: { value: 5, message: "Message too short" } }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id='message'
                    placeholder='Type here'
                    rows={4}
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-600/50'
                    }`}
                  />
                )}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* Where did you hear about us */}
            <div>
              <label htmlFor='wheredidyouhearaboutus' className='block text-white text-sm font-medium mb-3'>
                How did you hear about us?
              </label>
              <Controller 
                name='wheredidyouhearaboutus'
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id='wheredidyouhearaboutus'
                    className="w-full bg-gray-800/60 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800 text-gray-400">Please select</option>
                    {REFERRAL_SOURCES.map((source) => (
                      <option key={source} value={source} className="bg-gray-800 text-white">
                        {source}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {/* Back Button */}
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-all duration-200 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
