"use client"
import React from 'react'
// import { motion } from 'framer-motion'
import ParticleField from './bg'
import HeroText from './hero'
import Image from 'next/image'
import ToolsCircle from '@/components/hero/ToolsCircle'

export default function HeroSection() {
  return (
    <div className="w-full min-h-[650px] max-h-[85vh] lg:max-h-screen lg:min-h-[730px] relative overflow-hidden">
      {/* Particle Field - Furthest back */}
      <ParticleField />

      {/* Background Image - Behind everything */}
      <div
        className="absolute inset-0 w-full h-full bg-cover opacity-50 md:opacity-100 bg-center bg-no-repeat z-[1]"
        style={{
          backgroundImage: "url('/hero/rays.png')",
        }}
      />

      {/* Tools Circle - Background layer with infinite rotation */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[34%] md:-bottom-[65%] lg:-bottom-[65%] w-[46rem] md:w-[70rem] lg:w-[80rem] max-w-[100rem] aspect-square z-[2]">
        <ToolsCircle />
      </div>

      {/* Center Image - Static */}
      <Image
        width={100}
        height={210}
        src="/hero/center.svg"
        alt="Center decorative circle"
        className="object-contain absolute left-1/2 -translate-x-1/2 -bottom-[30%] md:-bottom-[40%] max-w-[100rem] w-[28rem] md:w-[40rem] z-[3]"
      />

      {/* Content/Text - Foreground layer */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-[45%] md:pt-[13%]">
        <HeroText />
      </div>
    </div>
  )
}