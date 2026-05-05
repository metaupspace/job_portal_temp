import React from 'react';
import Button from '@/components/button/Button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  features,
  imageUrl,
  className = "" 
}) => {
  return (
    <div className={`w-full max-w-[1480px] mx-auto h-auto p-4 md:p-8 lg:p-6 flex flex-col lg:flex-row items-center gap-6 md:gap-12 ${className}`}>
      
      {/* Left side - Just the Image */}
      <div className="w-full lg:flex-1 flex justify-center items-center">
        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-none max-h-[40vh] md:max-h-[50vh] lg:max-h-[70vh] aspect-[4/3] rounded-md overflow-hidden shadow-2xl">
          <Image
            src={imageUrl}
            alt={`${title} mockup`}
            fill 
            className="object-cover"
            // CHANGED: Updated 33vw to 50vw (or 60vw to be safe) for desktop
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 60vw"
            quality={90} // Added quality bump (default is 75)
            priority={true} // Optional: Helps if these are "above the fold" or critical
          />
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:flex-1 text-white space-y-4 md:space-y-6 lg:space-y-8 flex flex-col justify-center">
        {/* Title and Description */}
        <div className="space-y-2 md:space-y-4">
          <h2 className="text-xl md:text-2xl lg:text-2xl xl:text-3xl sf font-bold leading-tight text-white">
            {title}
          </h2>
          <p className="text-white/70 text-sm md:text-[14px] lg:text-[16px] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features list with bullet points */}
        <ul className="space-y-2 md:space-y-3 lg:space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 md:gap-4">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full flex-shrink-0 mt-2"></div>
              <span className="text-white text-sm md:text-[14px] lg:text-[16px]">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="pt-2 md:pt-4">
          <Button variant='primary' icon={<ArrowRight/>} link='/contact'>Book a Call</Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
