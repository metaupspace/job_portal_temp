// components/RelatedBlogCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface RelatedBlogCardProps {
  title: string
  date: string
  image: string
  href: string
  className?: string
}

export default function RelatedBlogCard({ 
  title, 
  date, 
  image, 
  href,
  className = '' 
}: RelatedBlogCardProps) {
  return (
    <Link href={href} className={`block group ${className}`}>
      <div className="flex items-center justify-center gap-4 mb-2 rounded-2xl hover:bg-gray-800/50 transition-colors duration-300">
        
        {/* Image */}
        <div className="w-25 h-25 flex-shrink-0 rounded-md overflow-hidden">
          <Image 
            src={image}
            width={96}
            height={64}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            alt={title}
          />
        </div>
        
        {/* Content */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-sm text-gray-400">{date}</span>
          <h3 className="text-white font-medium leading-tight text-[16px] group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
        </div>
        
      </div>
    </Link>
  )
}
