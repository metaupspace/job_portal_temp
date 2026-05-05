"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const tools = [
  { name: 'Figma', icon: '/hero/toolicons/figma.svg' },
  { name: 'Flutter', icon: '/hero/toolicons/flutter.png' },
  { name: 'Tailwind', icon: '/hero/toolicons/tailwind.svg' },
  { name: 'Snowflake', icon: '/hero/toolicons/snowflake.png' },
  { name: 'Google Meet', icon: '/hero/toolicons/gmeet.png' },
  { name: 'Postman', icon: '/hero/toolicons/postman.webp' },
  { name: 'Docker', icon: '/hero/toolicons/docker.png' },
  { name: 'Sheets', icon: '/hero/toolicons/sheet.png' },
  { name: 'Docs', icon: '/hero/toolicons/docs.png' },
  { name: 'Notion', icon: '/hero/toolicons/notion.png' },
  { name: 'GitHub', icon: '/hero/toolicons/github.webp' },
  { name: 'Photoshop', icon: '/hero/toolicons/ps.png' },
  { name: 'React', icon: '/hero/toolicons/react.png' },
  { name: 'TypeScript', icon: '/hero/toolicons/ts.png' },
  { name: 'Claude', icon: '/hero/toolicons/claude.svg' },
]

export default function ToolsCircle() {
  const orbitDuration = 50
  const ringInsetPercent = 2
  const orbitRadiusPercent = 50 - ringInsetPercent
  const orbitPoints = tools.map((_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / tools.length
    return {
      x: 50 + orbitRadiusPercent * Math.cos(angle),
      y: 50 - orbitRadiusPercent * Math.sin(angle),
    }
  })

  return (
    <div className="relative w-full h-full flex items-center justify-center pb-[15%] sm:pb-[10%] md:pb-0 sm:pt-[40%] md:pt-[35%]">
      {/* Perfect semicircle orbit */}
      <div
        className="relative rounded-full aspect-square w-[100%] sm:w-[100%] md:w-[95%]"
      >
        {/* Dark circle background */}
        <div className="absolute inset-[4%] rounded-full " />

        {/* One continuous circular orbit line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r={orbitRadiusPercent}
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="0.16"
          />
        </svg>

        {/* Only icons rotate along the orbit; circle/lines remain static */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: orbitDuration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {tools.map((tool, index) => {
            const point = orbitPoints[index]
            const needsExtraPadding = tool.name === 'Figma' || tool.name === 'Docs' || tool.name === 'Sheets'

            return (
              <div
                key={tool.name}
                className="absolute z-10"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: orbitDuration,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <div
                    className="rounded-full bg-black border border-white/35 flex items-center justify-center shadow-lg shadow-black/50 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                  >
                    <Image
                      src={tool.icon}
                      alt={tool.name}
                      width={28}
                      height={28}
                      className={`object-contain bg-black/0 w-5 h-5 sm:w-5 sm:h-5 md:w-7 md:h-7 ${needsExtraPadding ? 'p-1' : 'p-0.5'}`}
                    />
                  </div>
                </motion.div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}