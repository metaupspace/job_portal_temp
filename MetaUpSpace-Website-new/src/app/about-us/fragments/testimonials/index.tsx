'use client'
import React, { useState } from 'react';
import TestimonialCard from './testimonialCard';
import Headers from '../../../../components/header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: "Shruti Kabra",
    title: "Business and Operations Manager",
    company: "MetaUpSpace",
    quote: "Working at MetaUpSpace has been a very interesting and challenging journey for me. I have learned a lot and handled many new responsibilities and tasks. The support I have received from everyone has been amazing, especially from Sahil and Priyanshu."
  },
  {
    id: 2,
    name: "Riddhi Yadav",
    title: "Associate Designer",
    company: "MetaUpSpace",
    quote: "Working at MetaUpSpace has been a very positive experience. The work culture is friendly, supportive, and full of learning. Everyone is open to sharing ideas, and I always feel encouraged to do my best. The team is very helpful, and there is a strong sense of respect and teamwork."
  },

  {
    id: 4,
    name: "Khushi Saini",
    title: "Content Writer Intern",
    company: "MetaUpSpace",
    quote: "Working at MetaUpSpace has been a really positive experience. As a content writer, I get to understand our projects closely and contribute to work that creates real impact. The team is supportive, open to ideas, and encourages continuous learning."
  },
  {
    id: 5,
    name: "Anurag Kumar Rai",
    title: "Associate Designer",
    company: "MetaUpSpace",
    quote: "One of the best organisations I’ve worked with. Priyanshu and Sahil Sir have played a major role in my growth, and members like Nakshatra have been incredibly supportive. The environment here is truly built for learning and evolving. A complete 10/10 experience."
  },
  {
    id: 6,
    name: "Pratham Khanna",
    title: "Associate AI Engineer",
    company: "MetaUpSpace",
    quote: "MetaUpSpace appears to be a dynamic hub where innovation meets purpose. I see it as a place that empowers people to think bigger, experiment freely, and craft solutions that push the boundaries of what’s possible."
  },
  {
    id: 7,
    name: "Shubh Agarwal",
    title: "Associate Software Engineer",
    company: "MetaUpSpace",
    quote: "Working at MetaUpSpace is not just about building systems, it’s about collaborating with people who make even the toughest problems feel manageable. We solve, we learn, we break things sometimes… but we always build back better together."
  },
  {
    id: 8,
    name: "Saksham Jain",
    title: "Associate Software Engineer",
    company: "MetaUpSpace",
    quote: "MetaUpSpace is honestly such a chill and nice place to work. The seniors are super sweet and always ready to help, so you never feel lost. The projects are fun, not boring, and you actually learn a lot without stressing out."
  },
  {
    id: 9,
    name: "Mohammed Shanawaz",
    title: "Associate AI Engineer",
    company: "MetaUpSpace",
    quote: "MetaUpSpace is a place where innovation, creativity, and collaboration come together in a way that feels both inspiring and grounded. From my first day, I felt encouraged to share my ideas, and what stood out immediately was how genuinely those ideas were heard."
  },
  {
    id: 10,
    name: "Nakshatra Manglik",
    title: "Interim CTO",
    company: "MetaUpSpace",
    quote: "Working at MetaUpSpace is a great opportunity; it has a very supportive culture and a strong learning environment. Growth, collaboration, and innovation are all encouraged in the team, making the space fit for anyone who would want to build on their skills."
  },
  {
    id: 11,
    name: "Priyanshu Mishra",
    title: "Interim COO",
    company: "MetaUpSpace",
    quote: "MetaUpSpace is a place where ideas don’t just stay ideas, we turn into real impact. With AI at the core of our solutions, the environment here feels energetic and future-focused. What I love the most is the constant learning and the creative freedom we get."
  }
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
    <div className='relative w-full flex flex-col items-center justify-center mt-6 py-5 md:py-16 overflow-hidden px-4'>
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
      url('/hero/testbg.svg')
    `,
            backgroundPosition: 'center, 0 0, 0 0',
            backgroundRepeat: 'no-repeat, repeat, repeat'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <Headers
          label='TESTIMONIALS'
          heading="What our Team thinks about MetaUpSpace?"
          subheading="AI solutions across industries, making innovation practical, efficient, and results-driven."
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

          {/* Mobile Navigation Arrows - Side positioned with BLACK arrows */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8">
            {/* Current testimonial */}
            <div className="relative transform transition-all duration-500 ease-in-out">
              <TestimonialCard {...testimonialsData[currentIndex]} />
            </div>

            {/* Next testimonial (hidden on mobile) */}
            <div className="hidden md:block transform transition-all duration-500 ease-in-out">
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
