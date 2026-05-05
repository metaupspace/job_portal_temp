import Headers from '@/components/header'
import React from 'react'
import Card from './Card'
import { AboutUsWhyUs } from '@/lib/staticData'

export default function Whyus() {
  return (
    <div className='py-8 flex flex-col gap-5 items-center justify-center px-4'>
      <Headers
        label='Why Us'
        heading="The Edge You’ve Been Looking For"
        subheading="We don’t just work on projects, we build momentum. Every decision, every design, every line of code is driven by principles that keep us fast, fearless, and laser‑focused on results."
      />

      <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-5">
        {/* {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} />
        ))} */}

        {AboutUsWhyUs.map((reson, index) => (
          <Card
            key={index}
            {...reson} />
        ))}
      </div>
    </div>
  )
}
