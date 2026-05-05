import Image from 'next/image'
import React from 'react'

interface TagsProps{
    label:string
}

export default function Tags(props:TagsProps) {
  return (
    <div className="flex gap-4 items-center">
      <Image 
        src={"/hero/star.svg"} 
        width={22} 
        height={22} 
        alt="star icon" 
      />
      <p
        className={`text-[14px] uppercase sf font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent`}
      >
        {props.label}
      </p>
    </div>
  )
}
