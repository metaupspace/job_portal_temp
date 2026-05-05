// components/Tag.tsx
'use client'
import React from 'react'

interface TagProps {
  children: React.ReactNode
  className?: string
}

const TagForProjectandBlogCard: React.FC<TagProps> = ({ children, className = '' }) => {
  // Array of 7 colors for random selection
  const colors = [
    'bg-purple-600', // Purple
    'bg-blue-600',   // Blue
    'bg-green-600',  // Green
    'bg-red-600',    // Red
    'bg-yellow-600', // Yellow
    'bg-pink-600',   // Pink
    'bg-indigo-600', // Indigo
  ]

  // Get random color
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <span 
      className={`inline-block px-3 py-1 rounded-full text-white font-medium ${randomColor} ${className}`}
      style={{ fontSize: '10px' }}
    >
      {children}
    </span>
  )
}

export default TagForProjectandBlogCard
