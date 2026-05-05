import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function FormButton({ children, className = '', disabled, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={
        `w-full rounded-sm py-3 px-6 font-semibold text-white bg-gradient-to-r from-[#2F80ED] to-[#2AC1FF] shadow-md border border-white/10 backdrop-blur-sm hover:opacity-95 disabled:opacity-60 transition-all ${className}`
      }
    >
      {children}
    </button>
  )
}
