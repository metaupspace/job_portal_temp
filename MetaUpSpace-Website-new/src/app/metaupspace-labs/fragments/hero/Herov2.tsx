'use client'
import React from 'react'
import HeroText from './HeroText'
import ParticleField from '@/app/home/fragments/hero/bg'
import LogoTicker from '@/app/home/fragments/logoTicker'
import Image from 'next/image'


export default function Herov2() {
  return (
      <div className='w-full relative  min-h-[600px] max-h-[85vh] lg:max-h-screen lg:min-h-[730px]   overflow-hidden '>
         
         <ParticleField/>
         
    
         <div 
           className="absolute inset-0 w-full h-full bg-cover opacity-25 md:opacity-100 bg-center bg-no-repeat z-1"
           style={{ 
             backgroundImage: "url('/hero/rays.png')",
           
           }}
         />
         

   
   
   <Image 
   width={200}
   height={100}
  src="/hero/center.svg" 
  alt="Center decorative circle" 
  className="object-contain absolute left-1/2 -translate-x-1/2 -top-[32%] md:-top-[40%] max-w-[100rem] w-[28rem] md:w-[34rem] -z-10"
/>


{/* <div 
           className="absolute inset-0  w-full h-full bg-cover opacity-25 md:opacity-40 bg-center bg-no-repeat z-1"
         >



  <Prism
    animationType="rotate"
    timeScale={0.5}
    height={3.5}
    baseWidth={5.5}
    scale={3.6}
    hueShift={0}
    colorFrequency={1}
    noise={0.5}
    glow={1}
  />
</div> */}

          
         
         {/* Content/Text - Foreground layer */}
         <div className='relative z-10 flex flex-col items-center justify-center pt-[45%] md:pt-[18%] lg:pt-[12%]'>
           <HeroText/>
           <div className="pt-[60px]"></div>
           <LogoTicker/>
         </div>
   
   
      
       </div>
  )
}
