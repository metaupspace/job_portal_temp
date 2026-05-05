'use client'
import Headers from '@/components/header'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import TeamMemberCard from './Card'
import { team } from '@/lib/staticData'

export default function MeetTheTeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const singleSetRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const isHovered = useRef(false)
  const offsetRef = useRef(0)
  const [setWidth, setSetWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  const cardWidth = 200
  const scrollSpeed = 60

  useEffect(() => {
    const measureWidths = () => {
      if (singleSetRef.current) {
        setSetWidth(singleSetRef.current.getBoundingClientRect().width)
      }
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width)
      }
    }

    measureWidths()

    const resizeObserver = new ResizeObserver(measureWidths)
    if (singleSetRef.current) {
      resizeObserver.observe(singleSetRef.current)
    }
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', measureWidths)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measureWidths)
    }
  }, [])

  const duplicateCount = useMemo(() => {
    if (!setWidth || !containerWidth) return 3
    return Math.max(3, Math.ceil(containerWidth / setWidth) + 2)
  }, [containerWidth, setWidth])

  const wrapOffset = useCallback((rawOffset: number) => {
    if (!setWidth) return 0
    return ((rawOffset % setWidth) + setWidth) % setWidth
  }, [setWidth])

  const normalizePosition = useCallback(() => {
    if (!setWidth) return
    const wrapped = wrapOffset(-x.get())
    offsetRef.current = wrapped
    x.set(-wrapped)
  }, [setWidth, wrapOffset, x])

  useEffect(() => {
    normalizePosition()
    // Re-align whenever measured loop width changes.
  }, [normalizePosition])

  useAnimationFrame((_, delta) => {
    if (!setWidth || isDragging.current || isHovered.current) return

    const distance = (scrollSpeed * delta) / 1000
    const wrapped = wrapOffset(offsetRef.current + distance)
    offsetRef.current = wrapped
    x.set(-wrapped)
  })

  return (
    <div className='flex flex-col max-w-full gap-2 px-2 mt-3 md:px-4 md:mt-5'>
      <Headers
        label='TEAM'
        heading='Meet our Team'
        subheading='People who care about the details, the process, and the impact committed to making your vision a reality.'
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
          className="flex items-center gap-4 w-max"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: -setWidth,
            right: 0
          }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => isDragging.current = true}
          onDragEnd={() => {
            isDragging.current = false
            normalizePosition()
          }}
        >
          {Array.from({ length: duplicateCount }).map((_, setIndex) => (
            <div
              key={`team-set-${setIndex}`}
              ref={setIndex === 0 ? singleSetRef : undefined}
              className="flex items-center flex-shrink-0 gap-4"
              aria-hidden={setIndex > 0}
            >
              {team.map((member, index) => (
                <div
                  key={`${index}-${member.name}-set-${setIndex}`}
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
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
