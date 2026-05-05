'use client'

import { motion } from "motion/react"
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity"
import Button from '@/components/button/Button'
import { ArrowRight } from 'lucide-react'

const tags = [
  { id: 1, text: "Web Development", color: "emerald" },
  { id: 2, text: "React", color: "purple" },
  { id: 3, text: "Next.js", color: "indigo" },
  { id: 4, text: "Laravel", color: "red" },
  { id: 5, text: "UI/UX", color: "cyan" },
  { id: 6, text: "JavaScript", color: "yellow" },
  { id: 7, text: "TypeScript", color: "blue" },
  { id: 8, text: "Node.js", color: "green" },
  { id: 9, text: "Express", color: "orange" },
  { id: 10, text: "MongoDB", color: "lime" },
  { id: 11, text: "SQL", color: "teal" },
  { id: 12, text: "TailwindCSS", color: "sky" },
];

// Color mapping function to handle all Tailwind colors
const getColorClasses = (color: string) => {
  const colorMap = {
    emerald: 'bg-emerald-400 text-black border-emerald-500',
    purple: 'bg-purple-500 text-white border-purple-600',
    indigo: 'bg-indigo-500 text-white border-indigo-600',
    red: 'bg-red-500 text-white border-red-600',
    cyan: 'bg-cyan-400 text-black border-cyan-500',
    yellow: 'bg-yellow-400 text-black border-yellow-500',
    blue: 'bg-blue-500 text-white border-blue-600',
    green: 'bg-green-500 text-white border-green-600',
    orange: 'bg-orange-500 text-white border-orange-600',
    lime: 'bg-lime-400 text-black border-lime-500',
    teal: 'bg-teal-500 text-white border-teal-600',
    sky: 'bg-sky-400 text-black border-sky-500',
    pink: 'bg-pink-500 text-white border-pink-600',
    rose: 'bg-rose-500 text-white border-rose-600',
    fuchsia: 'bg-fuchsia-500 text-white border-fuchsia-600',
    violet: 'bg-violet-500 text-white border-violet-600',
    amber: 'bg-amber-400 text-black border-amber-500',
    slate: 'bg-slate-500 text-white border-slate-600',
  };
  
  return colorMap[color as keyof typeof colorMap] || 'bg-gray-500 text-white border-gray-600';
};

export default function Explosion() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Fixed Content - Same styling as your original */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div className="text-center max-w-4xl px-6">
          <h3 className="text-4xl md:text-5xl sf font-bold mb-6 leading-tight">
            We do a ton of cool stuffs,
            rather than listing play with it
          </h3>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl sf mx-auto">
            Ready to bring your vision to life? Book a call or send an email, 
            and let&apos;s make it happen!
          </p>
          <Button variant='primary' icon={<ArrowRight/>}>Contact Us</Button>
        </div>
      </div>

      {/* Physics Container with Matter.js Gravity */}
      <Gravity 
        gravity={{ x: 0, y: 1 }} 
        className="absolute inset-0" 
        debug={false}
        grabCursor={true}
        autoStart={true}
      >
        {/* Physics Tags - Dynamic colors based on tag.color */}
        {tags.map((tag, index) => (
          <MatterBody
            key={tag.id}
            matterBodyOptions={{ 
              friction: 0.5, 
              restitution: 0.7, 
              density: 0.001,
              isStatic: false 
            }}
            x={`${Math.random() * 60 + 20}%`}
            y={`${Math.random() * 20 + 10}%`}
            angle={Math.random() * 45 - 22.5}
            isDraggable={true}
            bodyType="rectangle"
          >
            <motion.div
              className={`
                sf pointer-events-auto cursor-grab active:cursor-grabbing 
                select-none font-semibold rounded-full border
                text-xl sm:text-2xl md:text-3xl px-6 py-3 md:px-8 md:py-4
                ${getColorClasses(tag.color)}
                hover:shadow-xl transition-all duration-200
                hover:scale-105 active:scale-95
              `}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: index * 0.05 // Reduced delay for more tags
              }}
            >
              {tag.text}
            </motion.div>
          </MatterBody>
        ))}

        {/* Optional: Add some larger decorative physics elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <MatterBody
            key={`decoration-${i}`}
            matterBodyOptions={{ 
              friction: 0.3, 
              restitution: 0.8,
              density: 0.001 
            }}
            x={`${Math.random() * 80 + 10}%`}
            y={`${Math.random() * 15 + 5}%`}
            angle={Math.random() * 360}
            isDraggable={true}
            bodyType="circle"
          >
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-700 rounded-lg opacity-60"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ 
                type: "spring", 
                duration: 0.8,
                delay: i * 0.15 + 0.8
              }}
            />
          </MatterBody>
        ))}
      </Gravity>
    </div>
  )
}
