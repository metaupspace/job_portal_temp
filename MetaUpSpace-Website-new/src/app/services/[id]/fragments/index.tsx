'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Tags from '@/components/header/fragments/Tags'

interface HeaderProps {
  label: string
  headingPrefix?: string
  subheading: string
  currentMode: 'Industry' | 'Services' // ADD THIS PROP
  onToggle: (mode: string) => void
}

export default function Headers({
  label,
  headingPrefix = "Browse Via",
  subheading,
  currentMode, // Destructure it
  onToggle
}: HeaderProps) {
  
  // Initialize state with prop to ensure sync
  const [activeMode, setActiveMode] = useState(currentMode);

  // Update local state whenever prop changes
  useEffect(() => {
    setActiveMode(currentMode);
  }, [currentMode]);

  const handleToggle = () => {
    const newMode = activeMode === 'Industry' ? 'Services' : 'Industry';
    setActiveMode(newMode);
    if (onToggle) onToggle(newMode);
  };

  return (
    <div className='flex flex-col gap-3 items-center justify-center pt-6'>
      <Tags label={label} />
      
      <div className="text max-w-4xl flex flex-col gap-1 w-full relative">
        <div className="relative inline-block text-center">
          
          <h3 className='sf font-bold text-[21px] text-center lg:text-[35px]'>
            {headingPrefix}{' '}
            <span 
              onClick={handleToggle}
              className="cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 select-none"
            >
              {activeMode}
            </span>
          </h3>

          <div className="absolute -top-10 right-0 md:-top-14 md:right-40 pointer-events-none w-20 md:w-28 h-auto">
             <Image 
               src="/click-arrow.png" 
               alt="Click here"
               width={120}
               height={80}
               className="object-contain"
             />
          </div>

        </div>

        <p className='sf-display opacity-70 text-[14px] md:text-[18px] text-center max-4xl font-normal'>
          {subheading}
        </p>
      </div>
    </div>
  )
}
