'use client'
import Headers from '@/components/header'
import React, { useRef, useState } from 'react'
import ProjectCard from './Cards'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { caseStudies } from '@/lib/staticData' // Ensure you import the data

export default function HorizontalProjects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Convert continuous scroll progress into discrete card steps.
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const maxIndex = Math.max(caseStudies.length - 1, 0);
    const nextIndex = Math.min(
      Math.floor(latest * caseStudies.length),
      maxIndex
    );

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  });

  return (
    <section className="relative max-w-[1512px] mx-auto">
      {/* Header section */}
      <div className="w-full px-4 py-6 md:py-8">
        <Headers
          label='Projects'
          heading="Where Ideas Become Impact"
          subheading="From concept to launch, we craft intelligent solutions that help brands stand out, scale faster, and lead their markets."
        />
      </div>

      {/* Mobile & Tablet: Vertical scroll */}
      <div className="block xl:hidden">
        <div className="space-y-6 md:space-y-8 px-4 md:px-6 pb-8">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {caseStudies.map((study, index) => (
              <ProjectCard
                key={index}
                title={study.name}
                description={study.description}
                features={study.features}
                imageUrl={study.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Large Desktop: Horizontal scroll (one full card visible at a time) */}
      <div
        ref={targetRef}
        className="hidden xl:block relative"
        style={{ height: `${caseStudies.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            animate={{ x: `-${activeIndex * 100}vw` }}
            transition={{ duration: 1.5, ease: [0.32, 1, 0.3, 1] }}
            className="h-screen flex items-center"
          >
            {caseStudies.map((study, index) => (
              <div key={index} className="w-screen flex-shrink-0 px-8 2xl:px-16">
                <ProjectCard
                  title={study.name}
                  description={study.description}
                  features={study.features}
                  imageUrl={study.imageUrl}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
