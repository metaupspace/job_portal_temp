"use client"
import Headers from '@/components/header'
import React from 'react'
import { motion } from 'framer-motion'
import Card from './Cards'
import Button from '@/components/button/Button'
import { ArrowUpRight } from 'lucide-react'

export default function Services() {
  return (
    <div className='px-4 flex flex-col items-center justify-center overflow-hidden max-w-7xl mt-6'>
      <Headers
        label='Services'
        heading='Bringing Your Vision to Life with Complete Digital Solutions'
        subheading="We design, build, and support websites, apps, AI solutions, and e‑commerce platforms that keep your digital presence thriving."
      />

      <div className="w-full flex flex-col lg:flex-row gap-2 mt-7 h-auto lg:h-[70vh]">
        {/* Left side (70%) */}
        <div className="w-full lg:w-[70%] flex flex-col gap-2 h-auto lg:h-full">

          {/* Top row - slides in from top */}
          <motion.div
            className="flex flex-col sm:flex-row gap-2 flex-1 top"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card
              showImage={false}
              widthsize="flex-1"
              number="01"
              title="UX/UI Design"
              description="We design intuitive, engaging experiences that feel natural and purposeful. Every interaction is crafted for clarity, flow, and user satisfaction."
            />
            <Card
              showImage={false}
              widthsize="flex-1"
              number="02"
              title="AI Development"
              description="We build smart AI solutions that automate tasks, simplify workflows, and deliver insights. This gives your business a sharper edge in performance and decision-making."
            />
          </motion.div>

          {/* Bottom row - slides in from bottom */}
          <motion.div
            className="flex gap-2 flex-1 bottom"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Card
              showImage={true}
              widthsize="flex-1"
              number="03"
              title="Web Design"
              description="We craft visually striking, user-friendly websites that reflect your brand with clarity and impact. Each design is built from scratch to perform seamlessly across devices and leave a lasting impression."
            />
          </motion.div>
        </div>

        {/* Right side - slides in from right */}
        <motion.div
          className="w-full lg:w-[30%] lg:flex-1  right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <Card
            showImage={true}
            widthsize="w-full h-full hidden lg:flex"
            number="04"
            title="E‑commerce Solutions"
            description="We create secure, scalable online stores optimized for smooth shopping and repeat sales. From browsing to checkout, everything is built for ease and conversion."
          />

          <Card
            showImage={false}
            widthsize="w-full h-full flex lg:hidden"
            number="04"
            title="Mobile App Development"
            description="We develop high-performance mobile apps for Android and iOS that deliver a consistent and reliable experience anywhere, anytime."
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      >
        <Button variant='primary' icon={<ArrowUpRight />} className='mt-5' link='/book-a-consultancy-call'>
          Book a Consultancy Call
        </Button>
      </motion.div>
    </div>
  )
}
