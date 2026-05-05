'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TeamMemberCardProps {
  name: string;
  designation: string;
  imageUrl?: string;
  className?: string;
}

const Card: React.FC<TeamMemberCardProps> = ({ 
  name = "Anurag", 
  designation = "UI UX Designer", 
  imageUrl = "/1.jpg",
  className = "" 
}) => {

  return (
    <>
      {/* Card */}
      <motion.div
        className={`relative rounded-md overflow-hidden
          w-full max-w-[160px] md:max-w-[240px]
          transition-all duration-300 ease-out
          hover:scale-[1.02] hover:shadow-xl
          ${className}`}
       
      >
        <div className="aspect-square bg-gray-300 rounded-lg md:rounded-2xl mb-2 md:mb-4 overflow-hidden">
          <Image
            width={200}
            height={210}
            src={imageUrl}
            alt={name}
            draggable={false}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>
        <div className="px-2 md:px-4 pb-3 md:pb-6">
          <h3 className="text-white text-sm md:text-lg font-semibold mb-1 leading-tight truncate">{name}</h3>
          <p className="text-gray-400 text-xs md:text-sm truncate">{designation}</p>
        </div>
      </motion.div>

     
    </>
  );
};

export default Card;
