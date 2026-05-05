// components/PageTransition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading state immediately
    setIsLoading(true)
    
    // Hide content initially, then show after animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Very short delay to ensure overlay renders first

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={pathname}>
          
          {/* EXIT Animation - White Circle Expanding from Bottom Center */}
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ clipPath: "circle(0% at 50% 100%)" }}
            animate={{ clipPath: "circle(0% at 50% 100%)" }}
            exit={{ 
              clipPath: [
                "circle(0% at 50% 100%)",
                "circle(50% at 50% 100%)",
                "circle(150% at 50% 100%)"
              ]
            }}
            transition={{
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1],
              times: [0, 0.4, 1]
            }}
            style={{
              background: 'radial-gradient(circle at 50% 100%, #ffffff 0%, #f8f9fa 40%, #ffffff 100%)',
            }}
          />

          {/* Secondary Exit Wave from Bottom Center */}
          <motion.div
            className="fixed inset-0 z-45"
            initial={{ clipPath: "circle(0% at 50% 100%)" }}
            animate={{ clipPath: "circle(0% at 50% 100%)" }}
            exit={{ clipPath: "circle(120% at 50% 100%)" }}
            transition={{
              duration: 1.0,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.1
            }}
            style={{
              background: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.8) 0%, rgba(248,249,250,0.6) 60%, transparent 100%)',
            }}
          />

          {/* ENTRANCE Animation - White Circle Contracting to Bottom Center */}
          <motion.div
            initial={{ clipPath: "circle(150% at 50% 100%)" }}
            animate={{ 
              clipPath: [
                "circle(150% at 50% 100%)",
                "circle(80% at 50% 100%)",
                "circle(0% at 50% 100%)"
              ]
            }}
            transition={{
              duration: 1.4,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.2,
              times: [0, 0.3, 1]
            }}
            className="fixed inset-0 z-40"
            style={{
              background: 'radial-gradient(circle at 50% 100%, #ffffff 0%, #f1f3f4 30%, #ffffff 70%)',
            }}
          />

          {/* Subtle Inner Circle from Bottom Center */}
          <motion.div
            initial={{ clipPath: "circle(100% at 50% 100%)", opacity: 0.6 }}
            animate={{ clipPath: "circle(0% at 50% 100%)", opacity: 0 }}
            transition={{
              duration: 1.0,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.4
            }}
            className="fixed inset-0 z-35"
            style={{
              background: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.4) 0%, transparent 60%)',
            }}
          />

          {/* Page Content - Hidden initially */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ 
              opacity: isLoading ? 0 : 1, 
              y: isLoading ? 30 : 0, 
              scale: isLoading ? 0.98 : 1 
            }}
            exit={{ 
              opacity: 0, 
              y: -30, 
              scale: 1.02,
              filter: "blur(4px)"
            }}
            transition={{
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
              delay: isLoading ? 0 : 0.6,
            }}
            className="relative z-10 w-full"
            style={{
              visibility: isLoading ? 'hidden' : 'visible'
            }}
          >
            {children}
          </motion.div>

        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default PageTransition
