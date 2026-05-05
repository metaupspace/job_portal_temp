'use client'
import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'

interface ContactFormProps {
 className?: string
}

interface FormData {
 name: string
 phone: string
 email: string
 message: string
}

const SHEETDB_URL = "https://sheetdb.io/api/v1/crhwt44b8p4tz"

export default function ContactForm({ className = '' }: ContactFormProps) {
 const [isLoading, setIsLoading] = useState(false)

 const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
  defaultValues: {
   name: '',
   phone: '',
   email: '',
   message: ''
  }
 })
 

 const saveData = async (data: FormData) => {
  try {
   await axios.post(SHEETDB_URL, { data: [data] })
   alert("Form Submitted")
  
  } catch (error) {
   console.error(error)
   alert("Something Went Wrong")
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
  <div className={`bg-gray-900/20 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-gray-500/50 ${className}`}>
   
   {/* Form Header */}
   <div className="mb-8">
    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
     Personal Information
    </h3>
    <p className="text-gray-400 text-sm lg:text-base">
     Tell us who you are and how we can reach you.
    </p>
   </div>

   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

    {/* Name Field */}
    <div>
     <label htmlFor="name" className="block text-white text-sm font-medium mb-3">
      Name
     </label>
     <Controller
      name="name"
      control={control}
      rules={{ required: "Name is required", minLength: { value: 2, message: "Name too short" } }}
      render={({ field }) => (
       <input
        {...field}
        type="text"
        id="name"
        placeholder="Type your Name"
        className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-gray-600/50'}`}
       />
      )}
     />
     {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
    </div>

    {/* Phone and Email Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

     {/* Phone Field */}
     <div>
      <label htmlFor="phone" className="block text-white text-sm font-medium mb-3">
       Phone
      </label>
      <Controller
       name="phone"
       control={control}
       rules={{ required: "Phone is required", pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" } }}
       render={({ field }) => (
        <input
         {...field}
         type="tel"
         id="phone"
         placeholder="Type here"
         className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-600/50'}`}
        />
       )}
      />
      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
     </div>

     {/* Email Field */}
     <div>
      <label htmlFor="email" className="block text-white text-sm font-medium mb-3">
       Email
      </label>
      <Controller
       name="email"
       control={control}
       rules={{
        required: "Email is required",
        pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
       }}
       render={({ field }) => (
        <input
         {...field}
         type="email"
         id="email"
         placeholder="Valid Email only"
         className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-600/50'}`}
        />
       )}
      />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
     </div>
    </div>

    {/* Message Field */}
    <div>
     <label htmlFor="message" className="block text-white text-sm font-medium mb-3">
      Message
     </label>
     <Controller
      name="message"
      control={control}
      rules={{ required: "Message is required", minLength: { value: 5, message: "Message too short" } }}
      render={({ field }) => (
       <textarea
        {...field}
        id="message"
        placeholder="Type here"
        rows={4}
        className={`w-full bg-gray-800/60 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${errors.message ? 'border-red-500' : 'border-gray-600/50'}`}
       />
      )}
     />
     {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
    </div>

    {/* Submit Button */}
    <button
     type="submit"
     disabled={isLoading}
     className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group"
    >
     {isLoading ? (
      <>
       <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
       <span>Submitting...</span>
      </>
     ) : (
      <>
       <span>Continue to Next Step</span>
       <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
      </>
     )}
    </button>
   </form>
  </div>
 )
}