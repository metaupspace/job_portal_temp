import React from 'react'
import Headers from '@/components/header'
import Button from '@/components/button/Button'
import DonutChart from '@/components/charts/DonutChart'

export default function WhatIsIRDP() {
  return (
    <section className="w-full">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-20">
        <Headers
          heading={<>What is <span className="italic playfair font-normal">IRDP</span>?</>}
          subheading="Industry simulated program where students learn by working on real products in real teams."
        />

        <div className=" mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xs md:max-w-sm">
              <DonutChart />
            </div>
          </div>

          <div className="flex flex-col justify-center max-w-xl">
            <h3 className="text-white text-3xl font-semibold tracking-wide">Learning Through Real Products</h3>
              <p className="text-neutral-400 text-md md:text-xl mt-4 tracking-wide leading-relaxed">
                IRDP bridges the gap between academic education and industry expectations by placing students inside a professional product environment, where learning happens through execution, collaboration, and continuous improvement.
              </p>

            <div className="mt-6">
              <Button variant="primary" link="#EnrollNow">
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
