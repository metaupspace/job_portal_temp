'use client'
import Headers from '@/components/header'
import React, { useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import TeamMemberCard from './Card'
import { IRDP_TEACHERS as team } from '@/lib/staticData'

export default function MeetTheTeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const isHovered = useRef(false)

  const cardWidth = 200
  const gap = 0
  // Calculate exact width of one set of cards
  const setWidth = team.length * (cardWidth + gap)

  // Speed of auto-scroll (pixels per frame approx)
  const baseSpeed = 0.35

  useAnimationFrame(() => {
    // Only auto-scroll if not dragging and not hovering
    if (!isDragging.current && !isHovered.current) {
      const currentX = x.get()
      // Move left
      let newX = currentX - baseSpeed

      // Infinite Loop Logic:
      // If we've scrolled past the first set, reset position seamlessly
      if (newX <= -setWidth) {
        newX += setWidth
      }
      x.set(newX)
    }
  })

  // Duplicate list 4 times to ensure no gaps on large screens
  const duplicatedTeam = [...team, ...team, ...team, ...team]

  return (
    <div className='px-2 md:px-4 flex flex-col gap-2 max-w-full mt-3 md:mt-5'>
      <Headers
        heading={
           <>Meet your <span className="italic playfair font-normal">Mentors</span></>
        }
        subheading='AI solutions across industries, making innovation practical, efficient, and results-driven.'
      />

      {/* Overflow container */}
      <div
        ref={containerRef}
        className="w-full mt-4 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={() => isHovered.current = true}
        onMouseLeave={() => isHovered.current = false}
        onTouchStart={() => isHovered.current = true}
        onTouchEnd={() => isHovered.current = false}
      >
        <motion.div
          className="flex items-center md:gap-4"
          style={{ x, width: setWidth * 4 }} // Apply the MotionValue directly
          drag="x"
          dragConstraints={{
            left: -setWidth * 2, // Allow dragging freely within safe bounds
            right: 0
          }}
          onDragStart={() => isDragging.current = true}
          onDragEnd={() => isDragging.current = false}
        >
          {duplicatedTeam.map((member, index) => (
            <div
              key={`${index}-${member.name}`}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
            >
              <TeamMemberCard
                name={member.name}
                designation={member.designation}
                imageUrl={member.imageUrl}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
