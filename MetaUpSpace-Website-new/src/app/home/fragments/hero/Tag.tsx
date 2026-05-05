import React from 'react'
import Image from 'next/image'

export default function Tag() {
  return (
    <div className='flex gap-3 items-center justify-center py-2 px-5 rounded-full border-2 border-white/50 bg-white/5 backdrop-blur-sm'>
      {/* Blinking Green Dot */}
      <div className="relative">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-40"></div>
      </div>
      
      {/* Startup India Logo */}
      <div className="flex items-center gap-2">
        <span className='text-sm text-white font-medium'>Recognized by</span>
        <div className="pt-[3px]">
 <Image 
          src="/startup.svg" 
          alt="Startup India"
          width={80}
          height={25}
          className="h-5 w-auto"
        />
        </div>
       
      </div>
    </div>
  )
}
