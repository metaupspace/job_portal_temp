"use client";
import Image from 'next/image';
import React from 'react';
import Button from '@/components/button/Button';

export default function IRDPHero() {
  return (
    <section id="irdp-hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/irdp/Hero_Image.jpg"
        alt="IRDP Hero"
        fill
        priority
        className="object-cover object-center z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0  z-10" />

      {/* Responsive content container: mobile = column (content2, content1+button), desktop = row (content1 left, content2 right) */}
      <div className="relative z-20 w-full px-4 md:px-8 h-full flex flex-col md:flex-row items-center md:items-end justify-center md:justify-end md:pb-24">
        {/* Content 1: first on mobile, first on desktop (left) */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl leading-tight max-w-2xl mr-10">
            The Industry-Ready Developer Program <span className="playfair italic">(IRDP)</span>
          </h1>
          <div className="mt-4 self-start hidden md:inline-flex">
            <Button
              variant="primary"
              link="#EnrollNow"
              className="irdp-hero-cta text-[18px] px-10"
            >
              Register Now
            </Button>
          </div>
        </div>

        {/* Content 2: second on mobile, second on desktop (right) */}
        <div className="w-full md:w-1/2 flex flex-col items-start md:items-end justify-center mt-10">
          <h2 className="text-white text-md md:text-xl lg:text-2xl leading-tight max-w-md md:max-w-xl md:text-end">
            Prepares students to think, build, and work like real engineers through live product development and industry-simulated learning.
          </h2>
        </div>

        {/* Mobile-only button placed after content2 on small screens */}
        <div className="w-full md:hidden flex justify-start mt-10 md:mt-4 px-0 md:px-0">
          <Button variant="primary" link="#EnrollNow" className="irdp-hero-cta text-[18px] md:px-8 w-full">
            Register Now
          </Button>
        </div>
      </div>
    </section>
  );
}
