"use client"
import React, { Suspense, lazy } from 'react'
import Loader from '@/components/Loader'

const IRDPHero = lazy(() => import('./fragments/Hero'))
const WhatIsIRDP = lazy(() => import('./fragments/WhatIsIRDP'))
const TechCareerGrid = lazy(() => import('./fragments/TechCareerGrid'))
const ApplicationForm = lazy(() => import('./fragments/ApplicationForm'))
const Team = lazy(() => import('./fragments/team'))

export default function IRDPPage() {
  return (
    <main className="min-h-screen w-full irdp-bg">
        <IRDPHero />

      <Suspense fallback={<Loader />}>
        <TechCareerGrid />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <WhatIsIRDP />
      </Suspense>

      

    

      <Suspense fallback={<Loader />}>
        <Team />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <ApplicationForm />
      </Suspense>
    </main>
  )
}
