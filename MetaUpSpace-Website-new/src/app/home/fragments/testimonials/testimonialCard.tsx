// components/TestimonialCard.tsx
import Image from 'next/image';
import React from 'react';

interface TestimonialCardProps {
  name: string;
  title: string;
  company: string;
  quote: string;
  avatar?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  title,
  company,
  quote,
  avatar
}) => {
  return (
    <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg max-w-md mx-auto h-full flex flex-col justify-between min-h-[300px]">
      {/* Quote */}
      <div className="mb-6">
        <p className="text-gray-800 text-sm md:text-base leading-relaxed font-normal">
          &quot;{quote}&quot;
        </p>
      </div>
      
      {/* Author Info */}
      <div className="flex items-center gap-4">
        {avatar && (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image
            width={12}
            height={12} 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-sm md:text-base">
            {name}
          </h4>
          <p className="text-gray-600 text-xs md:text-sm">
            {title} • {company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
