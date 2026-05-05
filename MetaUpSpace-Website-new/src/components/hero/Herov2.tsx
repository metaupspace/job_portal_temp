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
   height={210} 
  src="/hero/center.svg" 
  alt="Center decorative circle" 
  className="object-contain absolute left-1/2 -translate-x-1/2 -top-[32%] md:-top-[40%] max-w-[100rem] w-[28rem] md:w-[34rem] -z-10"
/>


{/* <div 
           className="absolute inset-0  w-full h-full bg-cover opacity-25 md:opacity-100 bg-center bg-no-repeat z-1"
         >



  <Hyperspeed
  effectOptions={{
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xFFFFFF,
      brokenLines: 0xFFFFFF,
      leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
      rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
      sticks: 0x03B3C3,
    }
  }}
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
