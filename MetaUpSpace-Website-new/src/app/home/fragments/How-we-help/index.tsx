'use client'
import Button from '@/components/button/Button'
import Headers from '@/components/header'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

// Steps data array
const steps = [
  {
    img: "/hero/p1.png",
    title: "Beginning the Journey",
    desc: "Every partnership starts with a Discovery Call to understand challenges, align expertise, and enable a “fail-fast” approach. Once validated, we move to actionable plans with clear scope, timelines, and budgets.",
  },
  {
    img: "/hero/p2.png",
    title: "Agile Development & QA",
    desc: "Our team develops features in rapid sprints using User Stories. Every feature undergoes rigorous security checks, system testing, and User Acceptance Testing (UAT) to ensure top quality before launch.",
  },
  {
    img: "/hero/p3.png",
    title: "Deployment & Handover",
    desc: "We ensure a smooth go-live process with seamless deployment, comprehensive client training, and detailed knowledge transfer, turning your vision into a production-ready reality.",
  },
  {
    img: "/hero/p4.png",
    title: "Growth & Support",
    desc: "Beyond launch, we provide Service Level Agreement (SLA) backed support, self-service solutions, and Agile Retrospectives to ensure your platform scales and improves continuously.",
  },
]


export default function HowWeHelp() {
  return (
    <div className='px-4 flex flex-col gap-5 items-center justify-center'>
      <Headers
        label='PROCESS'
        heading="Here’s How We Make It Happen, the MetaUpSpace Way"
        subheading="Our proven process blends strategy, creativity, and execution to deliver results that last."
      />

      <div className="flex flex-col lg:flex-row w-full items-center justify-center lg:justify-evenly mt-8 gap-8 lg:gap-15 px-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center w-full max-w-[300px] lg:max-w-[250px] gap-3"
          >
            <Image
              src={step.img}
              height={150}
              width={150}
              alt={step.title}
            />
            <div className="flex flex-col gap-2">
              <h4 className='text-[18px] lg:text-[20px] sf font-bold text-center'>
                {step.title}
              </h4>
              <p className='text-[14px] lg:text-[16px] sf-display text-center opacity-70'>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button variant='primary' className='mt-8' icon={<ArrowRight />} link='/book-a-consultancy-call'>
        Book a Consultation Call
      </Button>
    </div>
  )
}
