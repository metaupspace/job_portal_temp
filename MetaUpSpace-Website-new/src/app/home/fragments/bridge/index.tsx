"use client";

import React from 'react';
import Image from 'next/image';
import { OrbitSystem, ideaIcons, realityIcons } from './Circles'; // Adjust path if needed

export default function Bridge() {
  return (
    // CHANGED: Increased px-4 to px-6 for better mobile padding, md:px-8 for tablet/desktop
    <div className='flex flex-col md:flex-row w-full px-6 md:px-8 gap-6 items-center justify-center mt-4 py-8'>

      {/* Left Text Section */}
      <div className="text max-w-4xl flex flex-col gap-3 w-full md:w-[40%]">
        <h3 className='sf font-bold text-[24px] text-center md:text-left lg:text-[35px]'>
          Bridging what you imagine and what you launch
        </h3>
        <p className='sf-display opacity-70 text-[16px] md:text-[18px] text-center md:text-left max-4xl font-normal'>
          At MetaUpSpace, we work alongside you, blending strategy, design, development, and AI to turn ideas into fast, scalable, future‑ready solutions. Every step is a shared journey where your insight shapes the path and our innovation brings it to life.
        </p>
      </div>

      {/* Right Visualization Section */}
      <div className="w-[80%] md:w-[50%] flex items-center justify-center scale-[0.5] sm:scale-75 md:scale-[0.65] lg:scale-90 xl:scale-100 origin-center md:origin-left">
        <div className="relative flex items-center justify-center">

          {/* 1. Left System (#Idea) */}
          <div className="relative z-10 -mr-4"> {/* Negative margin to pull them closer */}
            <OrbitSystem
              label="# idea"
              colorClass="bg-emerald-500"
              icons={ideaIcons}
            />
          </div>

          {/* 2. Center Connector Logo */}
          <div className="absolute z-30 flex items-center justify-center w-20 h-20 bg-[#0A0A0A] rounded-full shadow-xl border-2 border-white/50">
            <Image
              src="/bridgelogo.png" // Ensure this file exists in public/
              alt="Bridge Logo"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>

          {/* 3. Right System (#Reality) */}
          <div className="relative z-10 -ml-4"> {/* Negative margin to pull them closer */}
            <OrbitSystem
              label="# reality"
              colorClass="bg-purple-600"
              icons={realityIcons}
              reverse // Spins opposite direction for visual balance
            />
          </div>

        </div>
      </div>
    </div>
  );
}
