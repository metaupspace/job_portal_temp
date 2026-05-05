'use client'
import Headers from '@/components/header'
import SelectionCard from './Card'
import React, { useRef } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import Button from '@/components/button/Button'
import { ArrowRight } from 'lucide-react'

const cardData = [
  {
    stepNumber: "01",
    title: "Resume screening",
    description: "The process begins by getting out what's in your head, out of your head. We give you 100% clarity after taking short interviews, researching your ICP, building a brand story and other assets.",
    imageUrl: "/hero/s1.png",
    proTip: "Pro Tip: Make sure to provide Live links of your projects"
  },
  {
    stepNumber: "02",
    title: "Interview Process",
    description: "Conducting detailed technical and cultural interviews to assess candidate compatibility with your team and project requirements.",
    imageUrl: "/hero/s2.png",
    proTip: "Pro Tip: Prepare behavioral questions in advance"
  },
  {
    stepNumber: "03",
    title: "Skills Assessment",
    description: "Evaluating technical competencies through practical tests and portfolio reviews to ensure quality matches expectations.",
    imageUrl: "/hero/s3.png",
    proTip: "Pro Tip: Include real-world scenarios in assessments"
  },
  {
    stepNumber: "04",
    title: "Final Selection",
    description: "Making the final decision based on comprehensive evaluation of technical skills, cultural fit, and long-term potential.",
    imageUrl: "/hero/s4.png",
    proTip: "Pro Tip: Get input from multiple team members"
  },
  {
    stepNumber: "05",
    title: "Onboarding",
    description: "Seamless integration of selected candidates into your team with proper orientation and initial project assignments.",
    imageUrl: "/hero/s5.png",
    proTip: "Pro Tip: Have a structured onboarding checklist"
  }
];

export default function SelectionProcess() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-342%"]);

  return (
    <div className='px-4 pt-4 flex flex-col gap-4 items-center justify-center'>

      {/* Mobile Version - Simple Stack */}
      <div className="block xl:hidden">
        <Headers
          label='JOIN US'
          heading="Ready to Jump In? Here’s How"
          subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
        />

        <div className="space-y-8 mt-8">
          {cardData.map((card, index) => (
            <SelectionCard
              key={index}
              stepNumber={card.stepNumber}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              proTip={card.proTip}
            />
          ))}
        </div>
      </div>

      {/* Desktop Version - Horizontal Scroll */}
      <div ref={targetRef} className="hidden xl:block relative h-[500vh] w-full">
        <div className="sticky top-0 h-screen flex flex-col">

          {/* Fixed Header - Takes up portion of screen */}
          <div className="flex-shrink-0 py-8">
            <Headers
              label='JOIN US'
              heading="How can you join us?"
              subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
            />
          </div>

          {/* Scrolling Cards - Takes remaining screen space */}
          <div className="flex-1 overflow-hidden">
            <motion.div
              style={{ x }}
              className="h-full flex items-center min-h-0"
            >
              {cardData.map((card, index) => (
                <SelectionCard
                  key={index}
                  stepNumber={card.stepNumber}
                  title={card.title}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  proTip={card.proTip}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      <Button variant='primary' link='/join-us' icon={<ArrowRight />}>Join Now</Button>
    </div>
  )
}
