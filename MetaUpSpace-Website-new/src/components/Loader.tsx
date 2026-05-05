import React from 'react'

interface LoaderProps {
  text?: string
}

export default function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Simple Spinner */}
      <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
      
      {/* Loading Text */}
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  )
}
