import Button from '@/components/button/Button'
import { LinkPreview } from '@/components/ui/link-preview'
import { ArrowUpRight } from 'lucide-react'
// import Image from 'next/image'
import React from 'react'
import Tag from './Tag'

export default function HeroText() {
  return (
    <div className='flex relative flex-col gap-4 items-center justify-center px-4'>
      {/* Background SVG - Perfectly centered behind content */}
     
      
      <div className="flex flex-col items-center justify-center gap-3 ">

         {/* <div className="absolute top-26  left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-100 pointer-events-none">
        <Image
        width={200}
        height={100} 
          src="/hero/bg.svg" 
          alt="Background decorative element" 
          
          className="object-contain w-full"
          
        />
      </div>   */}
      <div className="-mt-10 sm:-mt-10 md:-mt-5 lg:-mt-16 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        <Tag/>
      </div>
        
         <h1 className='text-[35px] lg:text-[60px] text-center font-medium font-sf-display relative z-10'>
        We build&nbsp;
        <LinkPreview url="https://metaupspace.com/services" className='playfair italic underline underline-offset-[10px] decoration-white decoration-1'>
          Brands
        </LinkPreview> 
        &nbsp;We Engineer&nbsp; and <br/> 
      
        <LinkPreview url="https://metaupspace.com/metaupspace-labs" className='playfair italic underline underline-offset-[10px] decoration-white decoration-1'>
          Accelerate Growth with AI.
        </LinkPreview>
      </h1>

      <p className='md:text-[16px] text-[14px] text-center opacity-70 max-w-sm md:max-w-2xl relative z-10'>
        From strategy to execution, we deliver intelligent solutions that help brands stand out, scale faster, and lead in a digital‑first world.
      </p>
      </div>
      {/* Content - Above background with higher z-index */}
     

      <div className="flex gap-5 mt-2.5 relative z-10">
        <Button variant='primary' className='text-[14px]' icon={<ArrowUpRight />} link='/book-a-consultancy-call'>Contact Us</Button>
        <Button
          variant='ghost'
          link='/services'
          className=' bg-white/12 backdrop-blur-sm shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:bg-white/15 hover:border-white/40'
        >
          See Projects
        </Button>
      </div>
    </div>
  )
}
