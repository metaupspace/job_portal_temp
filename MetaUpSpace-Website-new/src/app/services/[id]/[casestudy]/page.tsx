import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Import your real data
// Ensure caseStudyForProjects is exported from '@/lib/staticData'
import { caseStudyForProjects } from '@/lib/staticData';

interface PageProps {
  params: {
    casestudy: string; // This catches 'tnent-delivery-platform'
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  // 1. Find the project matching the slug
  const project = caseStudyForProjects.find((p) => p.id === params.casestudy);

  // 2. Handle 404 if not found
  if (!project) {
    return notFound();
  }

  // 3. Map the flat project object to the section format your UI expects
  const sections = [
    {
      heading: "The Challenge",
      section: project.challenge,
      image: null // Add specific images if your data has them per section
    },
    {
      heading: "Implemented Solution",
      section: project.solution,
      image: null
    },
    {
      heading: "Our Design Process",
      section: project.designProcess,
      image: null
    },
    {
      heading: "Our Development Process",
      section: project.developmentProcess,
      image: null
    },
    {
      heading: "Results and Takeaways",
      section: project.results,
      image: null
    }
  ];

  return (
    <div className='w-full pt-[100px]'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        
        {/* Header Section */}
        <header className="mb-16">
          {/* Title */}
          <h1 className='text-3xl md:text-4xl lg:text-5xl text-center font-bold text-white mb-6 leading-tight'>
            {project.title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-md md:text-xl text-gray-400 mb-8 text-center leading-relaxed max-w-3xl mx-auto">
            {project.subtitle}
          </p>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {project.author.charAt(0)}
              </div>
              <span className="text-gray-300">{project.author}</span>
            </div>
            <span>•</span>
            <span>{project.publishDate}</span>
          </div>
          
          {/* Hero Image */}
          <div className="mb-12 relative w-full h-[400px] md:h-[600px]">
            <Image 
              src={project.image} 
              fill
              className='object-cover rounded-lg shadow-2xl' 
              alt={`${project.title} Hero Image`}
              priority
            />
          </div>
        </header>

        {/* Content Sections */}
        <article className="prose prose-lg prose-invert max-w-none">
          {sections.map((section, index) => (
            <section key={index} className="mb-12">
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                {section.heading}
              </h2>
              
              <div className="space-y-4">
                {section.section.split('\n').map((paragraph, pIndex) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('•')) {
                    return (
                      <div key={pIndex} className="flex gap-3 text-lg text-gray-300 leading-relaxed pl-4">
                        <span className="text-blue-400">•</span>
                        <span>{trimmed.substring(1).trim()}</span>
                      </div>
                    );
                  }
                  
                  return (
                     <p key={pIndex} className='text-lg text-gray-300 leading-relaxed'>
                       {trimmed}
                     </p>
                  );
                })}
              </div>
              
              {/* Optional per-section image logic could go here if your data supports it */}
            </section>
          ))}
        </article>

      </div>
    </div>
  )
}
