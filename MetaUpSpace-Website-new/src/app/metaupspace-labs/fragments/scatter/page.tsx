'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from '@studio-freight/lenis'
import './scatter.css' // Import the custom CSS file
import Image from 'next/image'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

// Sample images - replace with your actual image paths
const images = [
  '/hero/1.jpg',
  '/hero/2.jpg',
  '/hero/3.jpg',
  '/hero/4.jpg',
  '/hero/5.jpg',
  '/hero/6.jpg',
  '/hero/7.jpg',
  '/hero/8.jpg',
  '/hero/9.jpg',
  '/hero/10.jpg',
  '/hero/11.jpg',
  '/hero/12.jpg',
]

export default function Scatter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Connect Lenis with ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  const { contextSafe } = useGSAP(() => {
    if (!containerRef.current) return

    initSpotlightAnimations()
  }, { scope: containerRef })

  const initSpotlightAnimations = contextSafe(() => {
    // Get DOM elements
    const spotlightImages = gsap.utils.toArray('.spotlight-image') as HTMLElement[]
    const coverImage = document.querySelector('.spotlight-cover-image') as HTMLElement
    const introHeader = document.querySelector('.intro-header h1') as HTMLElement
    const outroHeader = document.querySelector('.outro-header h1') as HTMLElement

    if (!spotlightImages.length || !coverImage || !introHeader || !outroHeader) return

    // Split text for word-by-word animation
    const introWords = introHeader.textContent?.split(' ') || []
    const outroWords = outroHeader.textContent?.split(' ') || []

    // Create word spans for intro
    introHeader.innerHTML = introWords
      .map(word => `<span class="intro-word">${word}</span>`)
      .join(' ')

    // Create word spans for outro  
    outroHeader.innerHTML = outroWords
      .map(word => `<span class="outro-word">${word}</span>`)
      .join(' ')

    const introWordElements = gsap.utils.toArray('.intro-word') as HTMLElement[]
    const outroWordElements = gsap.utils.toArray('.outro-word') as HTMLElement[]

    // Direction vectors for scatter effect
    const directions = [
      { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
      { x: -1, y: 0 }, { x: 1, y: 0 },
      { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
      { x: -0.5, y: -0.8 }, { x: 0.5, y: -0.8 },
      { x: -0.8, y: 0.5 }, { x: 0.8, y: 0.5 }
    ]

    // Get screen dimensions
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const isMobile = screenWidth < 1000
    const scatterMultiplier = isMobile ? 1.5 : 1.0

    // Set initial positions for images
    spotlightImages.forEach((img) => {
      gsap.set(img, {
        x: screenWidth / 2 - img.offsetWidth / 2,
        y: screenHeight / 2 - img.offsetHeight / 2,
        z: -2000,
        scale: 0,
        transformOrigin: 'center center'
      })
    })

    // Set initial position for cover image
    gsap.set(coverImage, {
      x: screenWidth / 2 - coverImage.offsetWidth / 2,
      y: screenHeight / 2 - coverImage.offsetHeight / 2,
      z: -2000,
      scale: 0,
      transformOrigin: 'center center'
    })

    // Create scroll trigger
    ScrollTrigger.create({
      trigger: '.spotlight-section',
      start: 'top top',
      end: () => `+=${screenHeight * 15}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress

        // Animate images with scatter effect
        spotlightImages.forEach((img, index) => {
          const staggerDelay = index * 0.02
          const scaleMult = isMobile ? 2.5 : 2.0
          const imgProgress = Math.max(0, (progress - staggerDelay) * scaleMult)

          if (imgProgress > 0) {
            const direction = directions[index % directions.length]
            const endX = screenWidth / 2 + (direction.x * screenWidth * scatterMultiplier)
            const endY = screenHeight / 2 + (direction.y * screenHeight * scatterMultiplier)
            const endZ = 500
            const endScale = 1

            // Interpolate values
            const currentX = gsap.utils.interpolate(
              screenWidth / 2 - img.offsetWidth / 2,
              endX - img.offsetWidth / 2,
              Math.min(1, imgProgress)
            )
            const currentY = gsap.utils.interpolate(
              screenHeight / 2 - img.offsetHeight / 2,
              endY - img.offsetHeight / 2,
              Math.min(1, imgProgress)
            )
            const currentZ = gsap.utils.interpolate(-2000, endZ, Math.min(1, imgProgress))
            const currentScale = gsap.utils.interpolate(0, endScale, Math.min(1, imgProgress))

            gsap.set(img, {
              x: currentX,
              y: currentY,
              z: currentZ,
              scale: currentScale
            })
          }
        })

        // Animate cover image (appears later in scroll)
        if (progress > 0.7) {
          const coverProgress = (progress - 0.7) / 0.3
          const coverZ = gsap.utils.interpolate(-2000, 0, coverProgress)
          const coverScale = gsap.utils.interpolate(0, 1, coverProgress)

          gsap.set(coverImage, {
            z: coverZ,
            scale: coverScale
          })
        }

        // Animate intro text fade out (60% - 75%)
        if (progress >= 0.6 && progress <= 0.75) {
          const fadeProgress = (progress - 0.6) / 0.15
          
          introWordElements.forEach((word, index) => {
            const wordProgress = fadeProgress * introWordElements.length - index
            const opacity = wordProgress <= 0 ? 1 : 
                           wordProgress >= 1 ? 0 : 
                           1 - wordProgress
            
            gsap.set(word, { opacity })
          })
        } else if (progress < 0.6) {
          gsap.set(introWordElements, { opacity: 1 })
        } else if (progress > 0.75) {
          gsap.set(introWordElements, { opacity: 0 })
        }

        // Animate outro text fade in (80% - 95%)
        if (progress >= 0.8 && progress <= 0.95) {
          const fadeProgress = (progress - 0.8) / 0.15
          
          outroWordElements.forEach((word, index) => {
            const wordProgress = fadeProgress * outroWordElements.length - index
            const opacity = wordProgress <= 0 ? 0 : 
                           wordProgress >= 1 ? 1 : 
                           wordProgress
            
            gsap.set(word, { opacity })
          })
        } else if (progress < 0.8) {
          gsap.set(outroWordElements, { opacity: 0 })
        } else if (progress > 0.95) {
          gsap.set(outroWordElements, { opacity: 1 })
        }
      }
    })

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  })

  return (
    <div ref={containerRef} className="scroll-explosion  text-white overflow-x-hidden ">

      {/* Spotlight Section */}
      <section className="spotlight-section relative w-screen h-screen  text-white overflow-hidden">
        {/* Gallery Images */}
        <div className="spotlight-images absolute inset-0 w-full h-full transform-3d perspective-1000">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="spotlight-image absolute w-72 h-48 lg:w-80 lg:h-52 will-change-transform"
            >
              <Image 
              width={200}
              height={210}
                src={src} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-full object-cover rounded-lg shadow-2xl border border-gray-700"
              />
            </div>
          ))}
        </div>

        {/* Cover Image */}
        <div className="spotlight-cover-image absolute inset-0 w-full h-full z-10 transform-3d perspective-1000">
          <Image
          width={200}
          height={210} 
            src="/hero/13.png" 
            alt="Hero Cover" 
            className="w-full h-full object-cover will-change-transform"
          />
        </div>

        {/* Text Headers */}
        <div className="intro-header absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl text-center z-20 px-6">
          <h1 className="text-3xl sm:text-5xl sf lg:text-6xl font-bold leading-tight sf tracking-tight text-gray-100">
            Rebuilding Experiences  <span className="text-purple-400 playfair">Unique and refined Creations</span>
          </h1>
        </div>

        <div className="outro-header absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl text-center z-30 px-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold sf leading-tight tracking-tight text-gray-100">
            <span className="text-transparent playfair italic sg bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Limitless
            </span> complete immersion
          </h1>
        </div>
      </section>

    </div>
  )
}
