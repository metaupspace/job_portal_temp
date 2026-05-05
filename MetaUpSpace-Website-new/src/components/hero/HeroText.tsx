import Button from '@/components/button/Button'
import { LinkPreview } from '@/components/ui/link-preview'
import { ArrowRight } from 'lucide-react'
import React from 'react'

export default function HeroText() {
  return (
    <div className='flex relative  flex-col gap-4 items-center justify-center px-4'>
      {/* Background SVG - Perfectly centered behind content */}
     
      
      <div className="flex flex-col items-center justify-center gap-3 w-full ">

         <h1 className='text-[32px] lg:text-[60px] text-center font-medium font-sf-display relative z-10'>
        Your Vision&nbsp;
        <LinkPreview url="https://metaupspace.com/services" className='playfair italic underline underline-offset-[10px] decoration-white decoration-1'>
          Our Canvas
        </LinkPreview> 
        &nbsp; <br/> 
       for&nbsp; 
        <LinkPreview url="https://metaupspace.com/metaupspace-labs" className='playfair italic underline underline-offset-[10px] decoration-white decoration-1'>
          Innovation.
        </LinkPreview>
      </h1>

      <p className='md:text-[16px] text-[14px] text-center opacity-70 max-w-sm md:max-w-2xl relative z-10'>
       We help brands stand out with digital products that are bold in design, smart in function, and proven in results.
      </p>
      </div>
      {/* Content - Above background with higher z-index */}
     

      <div className="flex gap-5 mt-2.5 relative z-10">
        <Button variant='primary' className='text-[14px]' icon={<ArrowRight />} link='/contact'>Contact Us</Button>
        <Button variant='ghost' link='/services/works'>See Projects</Button>
      </div>
    </div>
  )
}
