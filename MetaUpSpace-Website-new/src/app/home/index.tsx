'use client'
import React, { Suspense, lazy } from 'react'
import Loader from '@/components/Loader'

// Immediate Components
import HeroSection from './fragments/hero'
import LogoTicker from './fragments/logoTicker'
import Certificate from './fragments/certificates/page'

// Lazy Load Components
const Gallery = lazy(() => import('./fragments/gallery'))
const Bridge = lazy(() => import('./fragments/bridge'))
const MeetTheTeam = lazy(() => import('./fragments/team'))
const HorizontalProjects = lazy(() => import('./fragments/horizontaProjects'))
const FilterProjects = lazy(() => import('./fragments/filterProject'))
const HowWeHelp = lazy(() => import('./fragments/How-we-help'))
const Testimonials = lazy(() => import("./fragments/testimonials"))
const Services = lazy(() => import("./fragments/services"))

export default function HomePage() {
  return (
    <div className='flex flex-col w-full items-center justify-center'>
      
      {/* Critical Content - Load Immediately */}
      <HeroSection />
      <LogoTicker />
      
      {/* Lazy Loaded Sections */}
      <Suspense fallback={<Loader />}>
        <HorizontalProjects />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <Gallery />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <Bridge />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <Services />
      </Suspense>

       <Suspense fallback={<Loader />}>
        <Certificate/>
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <MeetTheTeam />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <FilterProjects />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <HowWeHelp />
      </Suspense>
      
      <Suspense fallback={<Loader />}>
        <Testimonials />
      </Suspense>
      
    </div>
  )
}
