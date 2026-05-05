import { Sparkle } from 'lucide-react'
import React from 'react'

interface CardProps{
  title:string,
  description:string
}

export default function Card(CardProps:CardProps) {
  return (
    <div className='flex flex-col gap-4 border border-white/60 rounded-md p-6 sm:p-7 bg-[#1a1a1a]/50'>
      <Sparkle size={32}/> 
      <div className="flex flex-col gap-2">
        <h4 className='text-[16px] sm:text-[18px] sf font-bold'>{CardProps.title}</h4>
        <p className='text-[14px] sm:text-[16px] opacity-70'>
         {CardProps.description}
        </p>
      </div>
    </div>
  )
}
