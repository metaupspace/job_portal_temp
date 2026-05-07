import React from "react";
import ParticleField from "@/app/home/fragments/hero/bg";
import Image from "next/image";
import Button from '@/components/button/Button';
import { ArrowRight } from 'lucide-react'

import { FaArrowRight } from "react-icons/fa";
const CareerHero = () => {
  return (
    <main className="relative overflow-hidden">
      <ParticleField />

      <Image
        width={200}
        height={210}
        src="/hero/center.svg"
        alt="Center decorative circle"
        className="object-contain absolute left-1/2 -translate-x-1/2 -top-[20%] sm:-top-[28%] md:-top-[40%] max-w-[100rem] w-[18rem] sm:w-[24rem] md:w-[34rem] -z-10"
      />
      <div
        className="absolute inset-0 w-full h-full bg-cover opacity-25 md:opacity-100 bg-center bg-no-repeat z-1"
        style={{
          backgroundImage: "url('/hero/rays.png')",
        }}
      />
      <div className="w-full min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 pt-24 sm:pt-28 md:pt-15 pb-12 z-20 relative">
        <span className="sf text-base sm:text-xl md:text-3xl text-white/70">
          Join our Team
        </span>
        <h1 className="sf text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold text-center leading-tight">
          Careers at MetaUpSpace
        </h1>
        <p className="sf text-center text-sm sm:text-base text-white/60 max-w-2xl">
          At MetaUpSpace, we are always on the lookout for talented and
          passionate individuals to join our team.
        </p>
        <Button
                    variant="primary"
                    icon={<ArrowRight />}
                    className="justify-center rounded-full items-center"
                  >
                    View Open Positions
                  </Button>
        </div>
    </main> 
  );
};

export default CareerHero;
