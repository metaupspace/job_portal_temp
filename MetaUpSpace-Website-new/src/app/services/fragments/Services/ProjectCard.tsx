'use client';
import React, { JSX } from 'react';
import { useRouter } from 'next/navigation';

// Type definitions
interface Modal {
  active: boolean;
  index: number;
}

interface ProjectCardProps {
  index: number;
  title: string;
  description: string;
  setModal: (modal: Modal) => void;
  onClick?: () => void; // ✅ Added onClick prop
}

export default function ProjectCard({ index, title, description, setModal, onClick }: ProjectCardProps): JSX.Element {
  const router = useRouter();
  


  // ✅ Slugify function for clean URLs
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // ✅ Handle click navigation
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const slug = slugify(title);
      router.push(`/services/${slug}`);
    }
  };

  return (
    <div
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
      onClick={handleClick} // ✅ Added click handler
      className="
        flex flex-col sm:flex-row w-full justify-between items-start sm:items-center
        sm:px-8 md:px-16 
        py-6 sm:py-8 md:py-[50px] 
        border-b border-[#c9c9c9] 
        cursor-pointer transition-all duration-200 
        hover:opacity-50 hover:bg-white/5 group
        last:border-b gap-4 sm:gap-6
        active:scale-[0.98] // ✅ Added click feedback
      "
    >
      <h2
        className="
          text-xl sm:text-2xl md:text-3xl sf 
          text-white m-0 font-normal 
          transition-all duration-400 
          group-hover:-translate-x-[10px]
          leading-tight
        "
      >
        {title}
      </h2>
      <p
        className="
          transition-all text-white/60 duration-400 font-light 
          group-hover:translate-x-[10px]
          text-sm sm:text-base md:text-lg
          max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
          text-left sm:text-right
          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
}
