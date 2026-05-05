"use client"
import React, { useEffect } from 'react'

type Props = {
  open: boolean
  variant?: 'success' | 'error'
  message: string
  onClose?: () => void
}

export default function Toast({ open, variant = 'success', message, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => onClose && onClose(), 4000)
    return () => clearTimeout(t)
  }, [open, onClose])

  return (
    <div
      aria-live="assertive"
      className={`fixed right-4 top-4 z-[99999] pointer-events-none`}
    >
      <div
        className={`max-w-sm w-full transform transition-all duration-300 ${open ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'}`}
      >
        <div className={`bg-black/60 backdrop-blur-sm outline-1 outline-offset-[-1px] outline-white/25 rounded-lg p-4 shadow-xl border border-white/10 flex items-start gap-3`}>
          <div className={`flex-shrink-0 mt-0.5 ${variant === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {variant === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="#8EE29A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="#FF8A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm text-white font-medium">{variant === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-sm text-neutral-300 mt-1">{message}</p>
          </div>

          <button
            onClick={() => onClose && onClose()}
            className="text-neutral-400 hover:text-neutral-200 ml-2"
            aria-label="Close notification"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
