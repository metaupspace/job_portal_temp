import Button from '@/components/button/Button'
import TagForProjectandBlogCard from '@/components/Cards/TagForProjectandBlogCard'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface ProjectCardProps {
  reverse?: boolean;
  title?: string;
  description?: string;
  tags?: string[];
  image?: string;
  buttonText?: string;
}

export default function ProjectCard({ 
  reverse = false,
  title = "Attendance Management System",
  description = "A comprehensive digital platform that transforms traditional attendance into workforce optimisation. It features real-time attendance tracking with GPS verification, daily agenda management, and specialised tools for remote work optimisation, including screen capture and activity monitoring with privacy controls.",
  tags = ["Workforce", "Productivity"],
  image = "/labs/1.png",
  buttonText = "Get a Demo Now"
}: ProjectCardProps) {
  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16'>
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}>
        
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative rounded-2xl overflow-hidden">
            <Image 
              width={500} 
              height={300} 
              src={image} 
              className='w-full h-full object-cover'
              alt={title}
              priority
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left">
          
          {/* Tags */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {tags.map((tag, index) => (
              <TagForProjectandBlogCard key={index} className='text-[14px] font-bold px-3 py-1'>
                {tag}
              </TagForProjectandBlogCard>
            ))}
          </div>
          
          {/* Title and Description */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {title}
            </h3>
            <p className='text-base lg:text-lg text-white/70 leading-relaxed'>
              {description}
            </p>
          </div>
          
          {/* Button */}
          <Button 
            variant='primary' 
            icon={<ArrowRight />}
            className="w-full md:w-[200px]"
          >
            {buttonText}
          </Button>
        </div>
        
      </div>
    </div>
  )
}
