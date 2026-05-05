"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

interface FullScreenPopupProps {
  open: boolean
  variant: 'success' | 'error'
  message: string
  onClose: () => void
  redirectTo?: string
}

export default function FullScreenPopup({ 
  open, 
  variant, 
  message, 
  onClose,
  redirectTo
}: FullScreenPopupProps) {
  const router = useRouter()
  
  if (!open) return null;

  const handleClose = () => {
    onClose()
    if (variant === 'success' && redirectTo) {
      router.push(redirectTo)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md mx-4 p-8 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl text-center animate-scaleIn">
        {/* Icon */}
        <div className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ${
          variant === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {variant === 'success' ? (
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-semibold mb-3 ${
          variant === 'success' ? 'text-green-400' : 'text-red-400'
        }`}>
          {variant === 'success' ? 'Successfully Submitted!' : 'Submission Failed'}
        </h2>

        {/* Message */}
        <p className="text-neutral-300 mb-8">{message}</p>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            variant === 'success' 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {variant === 'success' ? 'Continue' : 'Try Again'}
        </button>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
