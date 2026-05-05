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
       Your&nbsp;
        <LinkPreview url="https://neuralmindatlas.ai/" className='playfair italic underline underline-offset-[10px] decoration-white decoration-1'>
          backstage pass
        </LinkPreview> 
        &nbsp; <br/> 
       to the next <LinkPreview url="https://neuralmindatlas.ai/" className='playfair italic underline underline-offset-[10px] decoration-white decoration-1'>
          digital Revolution
        </LinkPreview> 
      </h1>

      <p className='md:text-[16px] text-[14px] text-center opacity-70 max-w-sm md:max-w-2xl relative z-10'>
        This is where your wildest idea gets a dev team, a deadline, and a demo before your competitors even wake up.
      </p>
      </div>
      {/* Content - Above background with higher z-index */}
     

      <div className="flex gap-5 mt-2.5 relative z-10">
        <Button variant='primary' className='text-[14px]' icon={<ArrowRight />}>Get a Demo Now</Button>
      </div>
    </div>
  )
}
