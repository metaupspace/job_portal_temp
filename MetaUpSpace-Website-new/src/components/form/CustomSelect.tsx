"use client"
import React, { useState, useRef, useEffect } from 'react'

type Option = { label: string; value: string }

type Props = {
  name: string
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  placeholder?: string
}

export default function CustomSelect({ name, value, onValueChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left bg-gray-800/10 outline-1 outline-offset-[-1px] outline-white/25 backdrop-blur-sm rounded px-4 py-3 flex items-center justify-between text-white"
      >
        <span className={selected ? '' : 'text-neutral-400'}>{selected ? selected.label : placeholder || 'Select'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={name}
          className="absolute z-50 mt-2 w-full bg-[#0b0b0bfa] rounded shadow-lg divide-y divide-white/5 border border-white/5 overflow-hidden"
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onValueChange(o.value)
                  setOpen(false)
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/5 text-white"
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
