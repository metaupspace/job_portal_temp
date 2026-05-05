'use client'
import React, { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import axios from 'axios'

interface ApplicationFormData {
  applyingFor: string
  applyingDomain: string
  applicationDate: string

  fullName: string
  email: string
  contactNumber: string
  currentLocation: string

  linkedIn: string
  github?: string
  portfolio?: string

  domainApplied: string
  technologies: string

  previousExperience: string
  lastStipendOrSalary: number
  expectedStipendRange: number

  hardestProblem: string

  resume: string
  referredBy?: string
  wheredidyouhearaboutus: string
}



const APPLYING_FOR = [
  "Internship",
  "Job"
]

const APPLYING_DOMAIN = [
  "Technical",
  "Non Technical"
]

const JOBS: string[] = [
  "AI Engineer",
  "Full-stack Developer",
  "Front-end Developer",
  "Back-end Developer",
  "Application Developer (Kotlin)",
  "Application Developer (Flutter)",
  "Application Developer (IOS)",
  "Application Developer (Hybrid)",
  "Cloud Development (AWS, Azure, GCP)",
  "IoT Development",
  "UI-UX Development",
  "Graphic Designing",
  "Project Manager",
  "Social Media Management (Ads & Content Creation)",
  "Marketing (Market Researcher, Marketing PR, etc)",
  "Business Operations & Management",
  "HR & Talent Acquisition",
  "Business Development Manager (BDM)",
  "Blockchain Development",
  "Cyber security",
  "QA - Tester",
  "DevOps",
  "Software Tester"
];

const INTERNSHIPS: string[] = JOBS.map(job => {
  // If already contains "Intern" (like AI Developer Intern), keep it as is
  if (job.toLowerCase().includes("intern")) return job;
  return job + " Intern";
});

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

const SHEETDB_URL = "https://sheetdb.io/api/v1/cihq9cklkplvw"

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0)
  
  const getTodaysDate = () => {
    const today = new Date();
    return today.toJSON().slice(0, 10);
  }

  const { control, handleSubmit, getValues, reset, formState: { errors }, trigger } = useForm<ApplicationFormData>({
    defaultValues: {
      applyingFor: '',
      applyingDomain: '',
      applicationDate: getTodaysDate(),
      fullName: '',
      email: '',
      contactNumber: '',
      currentLocation: '',
      linkedIn: '',
      github: '',
      portfolio: '',
      domainApplied: '',
      technologies: '',
      previousExperience: '',
      lastStipendOrSalary: 0,
      expectedStipendRange: 0,
      hardestProblem: '',
      resume: '',
      referredBy: '',
      wheredidyouhearaboutus: '',
    }
  })

  // Handle next step with validation
  const handleNext = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = []

    if (step === 0) {
      fieldsToValidate = ['applyingFor', 'applyingDomain']
    } else if (step === 1) {
      fieldsToValidate = ['fullName', 'email', 'contactNumber', 'currentLocation']
    } else if (step === 2) {
      fieldsToValidate = ["linkedIn", "github", "portfolio"]
    } else if (step === 3) {
      fieldsToValidate = ["domainApplied", "technologies"]
    } else if (step === 4) {
      fieldsToValidate = ["previousExperience", "lastStipendOrSalary", "expectedStipendRange"]
    } else if (step === 5) {
      fieldsToValidate = ["hardestProblem"]
    } else if (step == 6) {
      fieldsToValidate = ["resume", "referredBy", "wheredidyouhearaboutus"]
    }

    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid) {
      console.log(getValues())
      setStep(step + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    setStep(step - 1)
  }

  const saveData=async (Application:ApplicationFormData)=>{
 const response= await axios.post(SHEETDB_URL,Application)
    console.log(response)
        setIsLoading(false)
        reset()
        setStep(0)
    return true

  }

  // Handle final form submission
  const onSubmit: SubmitHandler<ApplicationFormData> = (data) => {
    setIsLoading(true)
    console.log(data)
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
            {/* Applying Domain */}
            <div>
              <label htmlFor='applyingDomain' className='block text-white text-sm font-medium mb-5'>
                Select Your Domain?
              </label>
              <Controller
                name='applyingDomain'
                control={control}
                rules={{ required: "Please select your domain" }}
                render={({ field }) => (
                  <select
                    {...field}
                    id='applyingDomain'
                    className="w-full bg-gray-800/60 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800 text-gray-400">Please select</option>
                    {APPLYING_DOMAIN.map((source) => (
                      <option key={source} value={source} className="bg-gray-800 text-white">
                        {source}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.applyingDomain && <p className="text-red-500 text-sm mt-1">{errors.applyingDomain.message}</p>}
            </div>

            {/* Applying For */}
            <div>
              <label htmlFor='applyingFor' className='block text-white text-sm font-medium mb-5'>
                What are you Applying for?
              </label>
              <Controller
                name='applyingFor'
                control={control}
                rules={{ required: "Please select what you're applying for" }}
                render={({ field }) => (
                  <select
                    {...field}
                    id='applyingFor'
                    className="w-full bg-gray-800/60 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800 text-gray-400">Please select</option>
                    {APPLYING_FOR.map((source) => (
                      <option key={source} value={source} className="bg-gray-800 text-white">
                        {source}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.applyingFor && <p className="text-red-500 text-sm mt-1">{errors.applyingFor.message}</p>}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 mt-6 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <span>Continue to Next Step</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </>
      )}

      {/* Step 1 - Personal Information */}
      {step === 1 && (
        <>
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              Personal Information
            </h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Tell us about yourself.
            </p>
          </div>

          <div className='space-y-6'>
            {/* Full Name */}
            <div>
              <label htmlFor='fullName' className='block text-white text-sm font-medium mb-3'>
                Your Name
              </label>
              <Controller
                name='fullName'
                control={control}
                rules={{ 
                  required: "Full name is required", 
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  pattern: { value: /^[A-Za-z\s.]+$/, message: "Name can only contain letters and spaces" }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    id='fullName'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.fullName ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className='block text-white text-sm font-medium mb-3'>
                Email Here
              </label>
              <Controller
                name='email'
                control={control}
                rules={{ 
                  required: "Email address is required",
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: "Please enter a valid email address" 
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='email'
                    id='email'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor='contactNumber' className='block text-white text-sm font-medium mb-3'>
                Phone Number Here (Should be available on WhatsApp)
              </label>
              <Controller
                name='contactNumber'
                control={control}
                rules={{ 
                  required: "Phone number is required",
                  pattern: { 
                    value: /^[6-9]\d{9}$/, 
                    message: "Please enter a valid 10-digit Indian mobile number" 
                  },
                  minLength: { value: 10, message: "Phone number must be 10 digits" },
                  maxLength: { value: 10, message: "Phone number must be 10 digits" }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='tel'
                    id='contactNumber'
                    placeholder='Type here'
                    maxLength={10}
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.contactNumber ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>}
            </div>

            {/* Current Location */}
            <div>
              <label htmlFor='currentLocation' className='block text-white text-sm font-medium mb-3'>
                Current Residency
              </label>
              <Controller
                name='currentLocation'
                control={control}
                rules={{ 
                  required: "Current location is required", 
                  minLength: { value: 2, message: "Location must be at least 2 characters" } 
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    id='currentLocation'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.currentLocation ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.currentLocation && <p className="text-red-500 text-sm mt-1">{errors.currentLocation.message}</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700  text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <span>Continue to Next Step</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 2 - Professional Information */}
      {step === 2 && (
        <>
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              Professional Information
            </h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Tell us about your professional network.
            </p>
          </div>

          <div className='space-y-6'>
            {/* LinkedIn */}
            <div>
              <label htmlFor='linkedIn' className='block text-white text-sm font-medium mb-3'>
                Your LinkedIn URL
              </label>
              <Controller
                name='linkedIn'
                control={control}
              rules={{ 
  required: "LinkedIn profile is required"
}}

                render={({ field }) => (
                  <input
                    {...field}
                    type='url'
                    id='linkedIn'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.linkedIn ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.linkedIn && <p className="text-red-500 text-sm mt-1">{errors.linkedIn.message}</p>}
            </div>

            {/* GitHub */}
            {getValues().applyingDomain == "Technical" && (
              <div>
                <label htmlFor='github' className='block text-white text-sm font-medium mb-3'>
                  Your GitHub URL
                </label>
                <Controller
                  name='github'
                  control={control}
                  rules={{ 
                    required: "GitHub profile is required for technical roles",
                    pattern: { 
                      value: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/, 
                      message: "Please enter a valid GitHub profile URL" 
                    }
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type='url'
                      id='github'
                      placeholder='Type here'
                      className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.github ? 'border-red-500' : 'border-gray-600/50'}`}
                    />
                  )}
                />
                {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github.message}</p>}
              </div>
            )}

            {/* Portfolio */}
            <div>
              <label htmlFor='portfolio' className='block text-white text-sm font-medium mb-3'>
                Your Portfolio URL (Website or Drive Preferred)
              </label>
              <Controller
                name='portfolio'
                control={control}
                rules={{ 
                  required: "Portfolio URL is required",
                  pattern: { 
                    value: /^https?:\/\/.+/, 
                    message: "Please enter a valid URL starting with http:// or https://" 
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='url'
                    id='portfolio'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.portfolio ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.portfolio && <p className="text-red-500 text-sm mt-1">{errors.portfolio.message}</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700  text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <span>Continue to Next Step</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 3 - Interest Information */}
      {step === 3 && (
        <>
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              {getValues().applyingFor === "Job" ? "Job" : "Internship"} Information
            </h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Tell us who you are and how we can reach you.
            </p>
          </div>

          <div className='space-y-6'>
            {/* Domain Applied */}
            <div>
              <label htmlFor='domainApplied' className='block text-white text-sm font-medium mb-5'>
                Select the {getValues().applyingFor === "Job" ? "Job" : "Internship"} role you are Applying For?
              </label>
              <Controller
                name='domainApplied'
                control={control}
                rules={{ required: "Please select the job you're applying for" }}
                render={({ field }) => (
                  <select
                    {...field}
                    id='domainApplied'
                    className="w-full bg-gray-800/60 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800 text-gray-400">Please select</option>
                      {(getValues().applyingFor === "Job" ? JOBS : INTERNSHIPS).map((source) => (
    <option key={source} value={source} className="bg-gray-800 text-white">
      {source}
    </option>
  ))}
                  </select>
                )}
              />
              {errors.domainApplied && <p className="text-red-500 text-sm mt-1">{errors.domainApplied.message}</p>}
            </div>

            {/* Technologies */}
            <div>
              <label htmlFor='technologies' className='block text-white text-sm font-medium mb-3'>
              {getValues().applyingFor === "Technical" ? "Technologies" : "Tools"} that you know (Example: {getValues().applyingFor === "Technical" ? "Java, Python, C++, Next JS" : "Figma, Jira, Canva, Graphic Design"} etc roles in which you want to apply for job )
              </label>
              <Controller
                name='technologies'
                control={control}
                rules={{ 
                  required: "Technologies field is required", 
                  minLength: { value: 5, message: "Please provide at least 5 characters" } 
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    id='technologies'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.technologies ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.technologies && <p className="text-red-500 text-sm mt-1">{errors.technologies.message}</p>}
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700  text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <span>Continue to Next Step</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 4 - Experience and Salary Information */}
      {step === 4 && (
        <>
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              Experience and Salary Information
            </h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Tell us about your professional network.
            </p>
          </div>

          <div className='space-y-6'>
            {/* Previous Experience */}
            <div>
              <label htmlFor='previousExperience' className='block text-white text-sm font-medium mb-3'>
                Your Previous Experience
              </label>
              <Controller
                name='previousExperience'
                control={control}
                rules={{ 
                  required: "Previous experience is required", 
                  minLength: { value: 10, message: "Please provide at least 10 characters describing your experience" } 
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    id='previousExperience'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.previousExperience ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.previousExperience && <p className="text-red-500 text-sm mt-1">{errors.previousExperience.message}</p>}
            </div>

            {/* Last Stipend/Salary - NUMBER INPUT */}
            <div>
              <label htmlFor='lastStipendOrSalary' className='block text-white text-sm font-medium mb-3'>
                Your Last Stipend or Salary (₹)
              </label>
              <Controller
                name='lastStipendOrSalary'
                control={control}
                rules={{ 
                  required: "Previous salary/stipend is required",
                  min: { value: 0, message: "Salary cannot be negative" },
                  validate: (value) => !isNaN(value) || "Please enter a valid number"
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='number'
                    id='lastStipendOrSalary'
                    placeholder='Enter amount in rupees'
                    min="0"
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.lastStipendOrSalary ? 'border-red-500' : 'border-gray-600/50'}`}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.lastStipendOrSalary && <p className="text-red-500 text-sm mt-1">{errors.lastStipendOrSalary.message}</p>}
            </div>

            {/* Expected Stipend/Salary - NUMBER INPUT */}
            <div>
              <label htmlFor='expectedStipendRange' className='block text-white text-sm font-medium mb-3'>
                Your Expected Stipend or Salary (₹)
              </label>
              <Controller
                name='expectedStipendRange'
                control={control}
                rules={{ 
                  required: "Expected salary/stipend is required",
                  min: { value: 1000, message: "Expected salary should be at least ₹1,000" },
                  validate: (value) => !isNaN(value) || "Please enter a valid number"
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='number'
                    id='expectedStipendRange'
                    placeholder='Enter expected amount in rupees'
                    min="1000"
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.expectedStipendRange ? 'border-red-500' : 'border-gray-600/50'}`}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.expectedStipendRange && <p className="text-red-500 text-sm mt-1">{errors.expectedStipendRange.message}</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700  text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <span>Continue to Next Step</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 5 - Final Information */}
      {step === 5 && (
        <>
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              Last Step, Your Resume
            </h3>
            <p className="text-gray-400 text-sm lg:text-base">
              Tell us about your professional network.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Hardest Problem */}
            <div>
              <label htmlFor='hardestProblem' className='block text-white text-sm font-medium mb-3'>
                Hardest problem you worked on and wish to tell us about
              </label>
              <Controller 
                name='hardestProblem'
                control={control}
                rules={{ 
                  required: "Please describe the hardest problem you worked on", 
                  minLength: { value: 50, message: "Please provide at least 50 characters" } 
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id='hardestProblem'
                    placeholder='Type here'
                    rows={2}
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${errors.hardestProblem ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.hardestProblem && <p className="text-red-500 text-sm mt-1">{errors.hardestProblem.message}</p>}
            </div>

            {/* Resume Link */}
            <div>
              <label htmlFor='resume' className='block text-white text-sm font-medium mb-3'>
                Your Resume Link
              </label>
              <Controller
                name='resume'
                control={control}
                rules={{ 
                  required: "Resume link is required",
                  pattern: { 
                    value: /^https?:\/\/.+/, 
                    message: "Please enter a valid URL" 
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='url'
                    id='resume'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.resume ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>}
            </div>

            {/* Referred By */}
            <div>
              <label htmlFor='referredBy' className='block text-white text-sm font-medium mb-3'>
                Did anyone refer you?
              </label>
              <Controller
                name='referredBy'
                control={control}
                rules={{ maxLength: { value: 100, message: "Name cannot exceed 100 characters" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    id='referredBy'
                    placeholder='Type here'
                    className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.referredBy ? 'border-red-500' : 'border-gray-600/50'}`}
                  />
                )}
              />
              {errors.referredBy && <p className="text-red-500 text-sm mt-1">{errors.referredBy.message}</p>}
            </div>

            {/* How did you hear about us */}
            <div>
              <label htmlFor='wheredidyouhearaboutus' className='block text-white text-sm font-medium mb-3'>
                How did you hear about us?
              </label>
              <Controller
                name='wheredidyouhearaboutus'
                control={control}
                rules={{ required: "Please tell us how you heard about us" }}
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
              {errors.wheredidyouhearaboutus && <p className="text-red-500 text-sm mt-1">{errors.wheredidyouhearaboutus.message}</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back
              </button>

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
