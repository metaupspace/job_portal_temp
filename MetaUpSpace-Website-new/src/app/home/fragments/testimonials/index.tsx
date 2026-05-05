'use client'
import React, { useState } from 'react';
import TestimonialCard from './testimonialCard';
import Headers from '../../../../components/header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonialsData = [
  // --- New External Testimonials (Added to top) ---
  {
    id: 101,
    name: "Harsh Kothari",
    title: "Founder, Wanderly.club", // Shortened from "Building frim..."
    company: "Ex-Unacademy, Airlearn",
    quote: "I highly recommend MetaUpSpace for their exceptional work in community building and Web3. Their team offers top-notch services in web development, smart contracts, and AI solutions. A reliable tech partner that delivers exceptional results."
  },
  {
    id: 102,
    name: "Ashutosh Pratap Singh",
    title: "Founder, Technical Sapien",
    company: "Content Creator (1.2M+)",
    quote: "MetaUpSpace has been instrumental in managing our community of 500,000+ members. Their expertise in Web 3.0 and AI products helped us scale efficiently. I highly recommend them to anyone wanting to build and manage a thriving tech community."
  },
  // --- Existing Internal Testimonials ---

]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonialsData.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialsData.length - 1 : prev - 1
    );
  };

  return (
    <div id='testimonials' className='relative w-full flex flex-col items-center justify-center mt-6 py-5 md:py-16 overflow-hidden px-4'>
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('/hero/testbg.svg')`,
            backgroundPosition: 'center, 0 0, 0 0',
            backgroundRepeat: 'no-repeat, repeat, repeat'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {/* CHANGED: Added Subheading for Clients vs Team if needed, or kept generic */}
        <Headers
          label='TESTIMONIALS'
          heading="What do our clients say about us?"
          subheading="Hear from our valued clients have to say about our team."
        />

        <div className="relative mt-8 w-full max-w-6xl flex flex-col items-center justify-center">
          {/* Desktop Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center transition-colors duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextTestimonial}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center transition-colors duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Mobile Navigation Arrows */}
          <div className="md:hidden">
            <button
              onClick={prevTestimonial}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Testimonial Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8 w-full">
            {/* Current testimonial */}
            <div className="relative transform transition-all duration-500 ease-in-out h-full">
              <TestimonialCard {...testimonialsData[currentIndex]} />
            </div>

            {/* Next testimonial (hidden on mobile) */}
            <div className="hidden md:block transform transition-all duration-500 ease-in-out h-full">
              <TestimonialCard
                {...testimonialsData[(currentIndex + 1) % testimonialsData.length]}
              />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentIndex
                  ? 'bg-white shadow-lg shadow-white/20'
                  : 'bg-white/30 hover:bg-white/50'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
