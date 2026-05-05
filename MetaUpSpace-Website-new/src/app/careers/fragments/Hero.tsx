import React from "react";
import ParticleField from "@/app/home/fragments/hero/bg";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
const CareerHero = () => {
  return (
    <main>
      <ParticleField />

      <Image
        width={200}
        height={210}
        src="/hero/center.svg"
        alt="Center decorative circle"
        className="object-contain absolute left-1/2 -translate-x-1/2 -top-[32%] md:-top-[40%] max-w-[100rem] w-[28rem] md:w-[34rem] -z-10"
      />
      <div
        className="absolute inset-0 w-full h-full bg-cover opacity-25 md:opacity-100 bg-center bg-no-repeat z-1"
        style={{
          backgroundImage: "url('/hero/rays.png')",
        }}
      />
      <div className="w-full h-100 flex flex-col items-center justify-center gap-4 mt-15 z-20 relative">
        <span className="sf text-2xl text-white/70">Join our Team</span>
        <h1 className="sf text-4xl font-semibold">Careers at MetaUpSpace</h1>
        <p className="text-center text-white/60 max-w-2xl">
          At MetaUpSpace, we are always on the lookout for talented and
          passionate individuals to join our team.
        </p>
        <button className="bg-[#2563EB] text-white font-bold py-2 px-4 rounded-full flex items-center">
          See all Open Roles
          <FaArrowRight className="inline-block ml-2" />
        </button>
      </div>
    </main>
  );
};

export default CareerHero;
